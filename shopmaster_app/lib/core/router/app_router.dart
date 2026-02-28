import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/auth/presentation/screens/splash_screen.dart';
import '../../features/auth/presentation/screens/login_screen.dart';
import '../../features/auth/presentation/screens/register_screen.dart';
import '../../features/auth/presentation/screens/otp_screen.dart';
import '../../features/shop/presentation/screens/create_shop_screen.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/inventory/presentation/screens/inventory_screen.dart';
import '../../features/purchases/presentation/screens/purchases_screen.dart';
import '../../features/purchases/presentation/screens/add_purchase_screen.dart';
import '../../features/sales/presentation/screens/sales_screen.dart';
import '../../features/sales/presentation/screens/new_sale_screen.dart';
import '../../features/expenses/presentation/screens/expenses_screen.dart';
import '../../features/reports/presentation/screens/reports_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../shared/widgets/main_shell.dart';
import '../storage/local_storage.dart';

// ─── Route Names ──────────────────────────────────────────────────────────────
class AppRoutes {
  AppRoutes._();

  static const String splash      = '/';
  static const String login       = '/login';
  static const String register    = '/register';
  static const String otp         = '/otp';
  static const String createShop  = '/create-shop';
  static const String dashboard   = '/dashboard';
  static const String inventory   = '/inventory';
  static const String purchases   = '/purchases';
  static const String addPurchase = '/purchases/add';
  static const String sales       = '/sales';
  static const String newSale     = '/sales/new';
  static const String expenses    = '/expenses';
  static const String reports     = '/reports';
  static const String profile     = '/profile';
}

// ─── Router Provider ─────────────────────────────────────────────────────────
final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: AppRoutes.splash,
    debugLogDiagnostics: true,
    redirect: (context, state) async {
      final token = await LocalStorage.instance.getAccessToken();
      final isAuth = token != null;
      final isAuthRoute = state.matchedLocation == AppRoutes.login ||
          state.matchedLocation == AppRoutes.register ||
          state.matchedLocation == AppRoutes.otp ||
          state.matchedLocation == AppRoutes.splash;

      if (!isAuth && !isAuthRoute) return AppRoutes.login;
      return null;
    },
    routes: [
      // ─── Auth ───────────────────────────────────────────────────────────
      GoRoute(
        path: AppRoutes.splash,
        builder: (context, state) => const SplashScreen(),
      ),
      GoRoute(
        path: AppRoutes.login,
        pageBuilder: (context, state) => _fadeTransition(
          state: state,
          child: const LoginScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.register,
        pageBuilder: (context, state) => _slideTransition(
          state: state,
          child: const RegisterScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.otp,
        pageBuilder: (context, state) => _slideTransition(
          state: state,
          child: OtpScreen(
            email: state.extra as String,
          ),
        ),
      ),
      GoRoute(
        path: AppRoutes.createShop,
        pageBuilder: (context, state) => _slideTransition(
          state: state,
          child: const CreateShopScreen(),
        ),
      ),

      // ─── Main Shell (Bottom Nav) ─────────────────────────────────────────
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          GoRoute(
            path: AppRoutes.dashboard,
            pageBuilder: (context, state) => _fadeTransition(
              state: state,
              child: const DashboardScreen(),
            ),
          ),
          GoRoute(
            path: AppRoutes.inventory,
            pageBuilder: (context, state) => _fadeTransition(
              state: state,
              child: const InventoryScreen(),
            ),
          ),
          GoRoute(
            path: AppRoutes.expenses,
            pageBuilder: (context, state) => _fadeTransition(
              state: state,
              child: const ExpensesScreen(),
            ),
          ),
          GoRoute(
            path: AppRoutes.reports,
            pageBuilder: (context, state) => _fadeTransition(
              state: state,
              child: const ReportsScreen(),
            ),
          ),
          GoRoute(
            path: AppRoutes.profile,
            pageBuilder: (context, state) => _fadeTransition(
              state: state,
              child: const ProfileScreen(),
            ),
          ),
        ],
      ),

      // ─── Full Screen Routes ──────────────────────────────────────────────
      GoRoute(
        path: AppRoutes.purchases,
        pageBuilder: (context, state) => _slideTransition(
          state: state,
          child: const PurchasesScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.addPurchase,
        pageBuilder: (context, state) => _slideTransition(
          state: state,
          child: const AddPurchaseScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.sales,
        pageBuilder: (context, state) => _slideTransition(
          state: state,
          child: const SalesScreen(),
        ),
      ),
      GoRoute(
        path: AppRoutes.newSale,
        pageBuilder: (context, state) => _slideTransition(
          state: state,
          child: const NewSaleScreen(),
        ),
      ),
    ],
  );
});

// ─── Page Transitions ─────────────────────────────────────────────────────────

CustomTransitionPage _fadeTransition({
  required GoRouterState state,
  required Widget child,
}) {
  return CustomTransitionPage(
    key: state.pageKey,
    child: child,
    transitionDuration: const Duration(milliseconds: 300),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      return FadeTransition(opacity: animation, child: child);
    },
  );
}

CustomTransitionPage _slideTransition({
  required GoRouterState state,
  required Widget child,
}) {
  return CustomTransitionPage(
    key: state.pageKey,
    child: child,
    transitionDuration: const Duration(milliseconds: 350),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      final tween = Tween(
        begin: const Offset(1.0, 0.0),
        end: Offset.zero,
      ).chain(CurveTween(curve: Curves.easeOutCubic));
      return SlideTransition(
        position: animation.drive(tween),
        child: child,
      );
    },
  );
}