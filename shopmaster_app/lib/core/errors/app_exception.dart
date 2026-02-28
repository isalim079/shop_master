class AppException implements Exception {
  final String message;
  final int? statusCode;
  final Map<String, dynamic>? errors;

  const AppException({
    required this.message,
    this.statusCode,
    this.errors,
  });

  @override
  String toString() => message;
}

class NetworkException extends AppException {
  const NetworkException({super.message = 'No internet connection'});
}

class ServerException extends AppException {
  const ServerException({
    super.message = 'Server error. Please try again',
    super.statusCode,
    super.errors,
  });
}

class UnauthorizedException extends AppException {
  const UnauthorizedException({
    super.message = 'Session expired. Please login again',
    super.statusCode = 401,
  });
}

class NotFoundException extends AppException {
  const NotFoundException({
    super.message = 'Resource not found',
    super.statusCode = 404,
  });
}

class ValidationException extends AppException {
  const ValidationException({
    super.message = 'Validation failed',
    super.statusCode = 400,
    super.errors,
  });
}