class AppConstants {
  AppConstants._();

  // ─── API ──────────────────────────────────────────────────────────────────
  static const String baseUrl = 'http://10.0.2.2:5000/api/v1'; // Android emulator
  // static const String baseUrl = 'http://localhost:5000/api/v1'; // iOS simulator
  // static const String baseUrl = 'https://api.yourserver.com/api/v1'; // Production

  static const int connectTimeout = 30000;
  static const int receiveTimeout = 30000;

  // ─── Storage Keys ─────────────────────────────────────────────────────────
  static const String accessTokenKey  = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userKey         = 'user_data';
  static const String shopKey         = 'shop_data';
  static const String currencyKey     = 'currency';
  static const String onboardingKey   = 'onboarding_done';

  // ─── Pagination ───────────────────────────────────────────────────────────
  static const int defaultPage  = 1;
  static const int defaultLimit = 20;

  // ─── OTP ──────────────────────────────────────────────────────────────────
  static const int otpLength          = 6;
  static const int otpResendSeconds   = 60;
}