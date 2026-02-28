import 'package:dio/dio.dart';
import '../../errors/app_exception.dart';

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    AppException exception;

    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.sendTimeout:
        exception = const NetworkException(
          message: 'Connection timed out. Please try again.',
        );
        break;

      case DioExceptionType.connectionError:
        exception = const NetworkException();
        break;

      case DioExceptionType.badResponse:
        final statusCode = err.response?.statusCode;
        final data = err.response?.data;
        final message = data?['message'] ?? 'Something went wrong';
        final errors = data?['errors'];

        exception = switch (statusCode) {
          400 => ValidationException(message: message, errors: errors),
          401 => UnauthorizedException(message: message),
          404 => NotFoundException(message: message),
          _ => ServerException(
              message: message,
              statusCode: statusCode,
              errors: errors,
            ),
        };
        break;

      default:
        exception = const ServerException();
    }

    handler.reject(
      DioException(
        requestOptions: err.requestOptions,
        error: exception,
        response: err.response,
        type: err.type,
      ),
    );
  }
}