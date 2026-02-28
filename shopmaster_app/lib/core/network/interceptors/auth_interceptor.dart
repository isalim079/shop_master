import 'package:dio/dio.dart';
import '../../storage/local_storage.dart';
import '../../constants/app_constants.dart';

class AuthInterceptor extends Interceptor {
  final Dio dio;

  AuthInterceptor(this.dio);

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await LocalStorage.instance.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      // Try refresh token
      try {
        final refreshToken = await LocalStorage.instance.getRefreshToken();
        if (refreshToken == null) {
          handler.next(err);
          return;
        }

        final response = await dio.post(
          '${AppConstants.baseUrl}/auth/refresh',
          data: {'refreshToken': refreshToken},
        );

        final newAccessToken = response.data['data']['accessToken'];
        await LocalStorage.instance.saveAccessToken(newAccessToken);

        // Retry original request
        final opts = err.requestOptions;
        opts.headers['Authorization'] = 'Bearer $newAccessToken';

        final retryResponse = await dio.fetch(opts);
        handler.resolve(retryResponse);
        return;
      } catch (_) {
        await LocalStorage.instance.clearAll();
      }
    }
    handler.next(err);
  }
}