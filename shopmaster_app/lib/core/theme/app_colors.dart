import 'package:flutter/material.dart';

class AppColors {
  AppColors._();

  // ─── Primary Purple Palette ───────────────────────────────────────────────
  static const Color primary50  = Color(0xFFF5F3FF);
  static const Color primary100 = Color(0xFFEDE9FE);
  static const Color primary200 = Color(0xFFDDD6FE);
  static const Color primary300 = Color(0xFFC4B5FD);
  static const Color primary400 = Color(0xFFA78BFA);
  static const Color primary500 = Color(0xFF8B5CF6);
  static const Color primary600 = Color(0xFF7C3AED);
  static const Color primary700 = Color(0xFF6D28D9);
  static const Color primary800 = Color(0xFF5B21B6);
  static const Color primary900 = Color(0xFF4C1D95);

  // ─── Gradient Colors ──────────────────────────────────────────────────────
  static const Color gradientStart  = Color(0xFF2D1B69);
  static const Color gradientMid    = Color(0xFF4A1D96);
  static const Color gradientEnd    = Color(0xFF1E1035);

  // ─── Glass Colors ─────────────────────────────────────────────────────────
  static const Color glassWhite     = Color(0x1AFFFFFF);  // 10% white
  static const Color glassBorder    = Color(0x33FFFFFF);  // 20% white
  static const Color glassLight     = Color(0x26FFFFFF);  // 15% white
  static const Color glassStrong    = Color(0x33FFFFFF);  // 20% white

  // ─── Semantic Colors ──────────────────────────────────────────────────────
  static const Color success        = Color(0xFF10B981);
  static const Color successLight   = Color(0x1A10B981);
  static const Color warning        = Color(0xFFF59E0B);
  static const Color warningLight   = Color(0x1AF59E0B);
  static const Color error          = Color(0xFFEF4444);
  static const Color errorLight     = Color(0x1AEF4444);
  static const Color info           = Color(0xFF3B82F6);
  static const Color infoLight      = Color(0x1A3B82F6);

  // ─── Neutral ──────────────────────────────────────────────────────────────
  static const Color white          = Color(0xFFFFFFFF);
  static const Color black          = Color(0xFF000000);
  static const Color transparent    = Color(0x00000000);

  // ─── Text Colors ──────────────────────────────────────────────────────────
  static const Color textPrimary    = Color(0xFFFFFFFF);
  static const Color textSecondary  = Color(0xB3FFFFFF);  // 70% white
  static const Color textHint       = Color(0x66FFFFFF);  // 40% white
  static const Color textDark       = Color(0xFF1F1235);

  // ─── Chart Colors ─────────────────────────────────────────────────────────
  static const List<Color> chartColors = [
    Color(0xFF8B5CF6),
    Color(0xFF10B981),
    Color(0xFFF59E0B),
    Color(0xFF3B82F6),
    Color(0xFFEF4444),
    Color(0xFFEC4899),
  ];

  // ─── Gradients ────────────────────────────────────────────────────────────
  static const LinearGradient backgroundGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [gradientStart, gradientMid, gradientEnd],
    stops: [0.0, 0.5, 1.0],
  );

  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primary500, primary700],
  );

  static const LinearGradient successGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFF10B981), Color(0xFF059669)],
  );

  static const LinearGradient warningGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFF59E0B), Color(0xFFD97706)],
  );

  static const LinearGradient errorGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [Color(0xFFEF4444), Color(0xFFDC2626)],
  );
}