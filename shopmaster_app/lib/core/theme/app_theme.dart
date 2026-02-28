import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'app_colors.dart';
import 'app_typography.dart';
import 'app_decorations.dart';

class AppTheme {
  AppTheme._();

  static ThemeData get theme {
    return ThemeData(
      useMaterial3: true,
      fontFamily: 'SF Pro Display',
      colorScheme: ColorScheme.dark(
        primary: AppColors.primary500,
        secondary: AppColors.primary400,
        surface: AppColors.gradientStart,
        background: AppColors.gradientEnd,
        error: AppColors.error,
        onPrimary: AppColors.white,
        onSecondary: AppColors.white,
        onSurface: AppColors.textPrimary,
        onBackground: AppColors.textPrimary,
        onError: AppColors.white,
      ),

      // ─── Scaffold ───────────────────────────────────────────────────────
      scaffoldBackgroundColor: AppColors.gradientEnd,

      // ─── AppBar ──────────────────────────────────────────────────────────
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        titleTextStyle: AppTypography.headlineSmall,
        iconTheme: IconThemeData(color: AppColors.white),
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: AppColors.transparent,
          statusBarIconBrightness: Brightness.light,
        ),
      ),

      // ─── Bottom Nav ───────────────────────────────────────────────────────
      bottomNavigationBarTheme: BottomNavigationBarThemeData(
        backgroundColor: AppColors.transparent,
        selectedItemColor: AppColors.primary400,
        unselectedItemColor: AppColors.textHint,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: AppTypography.labelSmall.copyWith(
          color: AppColors.primary400,
        ),
        unselectedLabelStyle: AppTypography.labelSmall,
      ),

      // ─── Text ─────────────────────────────────────────────────────────────
      textTheme: const TextTheme(
        displayLarge:  AppTypography.displayLarge,
        displayMedium: AppTypography.displayMedium,
        displaySmall:  AppTypography.displaySmall,
        headlineLarge: AppTypography.headlineLarge,
        headlineMedium: AppTypography.headlineMedium,
        headlineSmall: AppTypography.headlineSmall,
        bodyLarge:     AppTypography.bodyLarge,
        bodyMedium:    AppTypography.bodyMedium,
        bodySmall:     AppTypography.bodySmall,
        labelLarge:    AppTypography.labelLarge,
        labelMedium:   AppTypography.labelMedium,
        labelSmall:    AppTypography.labelSmall,
      ),

      // ─── Input ────────────────────────────────────────────────────────────
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.glassWhite,
        hintStyle: const TextStyle(color: AppColors.textHint),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDecorations.radiusSM),
          borderSide: BorderSide(
            color: AppColors.white.withOpacity(0.2),
          ),
        ),
      ),

      // ─── Divider ──────────────────────────────────────────────────────────
      dividerTheme: DividerThemeData(
        color: AppColors.white.withOpacity(0.1),
        thickness: 1,
      ),

      // ─── Card ─────────────────────────────────────────────────────────────
      cardTheme: CardThemeData(
        color: AppColors.glassWhite,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppDecorations.radiusMD),
          side: BorderSide(
            color: AppColors.white.withOpacity(0.2),
          ),
        ),
      ),

      // ─── Chip ─────────────────────────────────────────────────────────────
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.glassWhite,
        labelStyle: AppTypography.labelMedium,
        side: BorderSide(color: AppColors.white.withOpacity(0.2)),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppDecorations.radiusFull),
        ),
      ),
    );
  }
}