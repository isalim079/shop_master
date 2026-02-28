class ApiEndpoints {
  ApiEndpoints._();

  // ─── Auth ─────────────────────────────────────────────────────────────────
  static const String register   = '/auth/register';
  static const String verifyOtp  = '/auth/verify-otp';
  static const String login      = '/auth/login';
  static const String resendOtp  = '/auth/resend-otp';
  static const String refresh    = '/auth/refresh';
  static const String logout     = '/auth/logout';

  // ─── Profile ──────────────────────────────────────────────────────────────
  static const String profile         = '/profile';
  static const String profileAvatar   = '/profile/avatar';
  static const String profilePassword = '/profile/password';

  // ─── Shop ─────────────────────────────────────────────────────────────────
  static const String shop            = '/shop';
  static const String myShop          = '/shop/me';
  static const String shopCategories  = '/shop/me/categories';
  static const String shopUnits       = '/shop/me/units';
  static const String shopCurrencies  = '/shop/currencies';
  static const String shopTypes       = '/shop/types';

  static String shopCategory(String id)  => '/shop/me/categories/$id';
  static String shopUnit(String unit)    => '/shop/me/units/$unit';

  // ─── Products ─────────────────────────────────────────────────────────────
  static const String products        = '/products';
  static const String lowStock        = '/products/low-stock';

  static String product(String id)    => '/products/$id';
  static String productsByCategory(String id) => '/products/category/$id';

  // ─── Suppliers ────────────────────────────────────────────────────────────
  static const String suppliers       = '/suppliers';
  static String supplier(String id)   => '/suppliers/$id';

  // ─── Purchases ────────────────────────────────────────────────────────────
  static const String purchases       = '/purchases';
  static String purchase(String id)   => '/purchases/$id';

  // ─── Sales ────────────────────────────────────────────────────────────────
  static const String sales           = '/sales';
  static const String todaySummary    = '/sales/today';
  static String sale(String id)       => '/sales/$id';

  // ─── Expenses ─────────────────────────────────────────────────────────────
  static const String expenses        = '/expenses';
  static const String expenseSummary  = '/expenses/summary';
  static String expense(String id)    => '/expenses/$id';

  // ─── Reports ──────────────────────────────────────────────────────────────
  static const String reportDaily     = '/reports/daily';
  static const String reportWeekly    = '/reports/weekly';
  static const String reportMonthly   = '/reports/monthly';
  static const String reportYearly    = '/reports/yearly';
  static const String reportCustom    = '/reports/custom';
  static const String reportStock     = '/reports/stock';
}