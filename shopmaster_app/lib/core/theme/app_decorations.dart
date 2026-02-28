import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppDecorations {
  AppDecorations._();

  // ─── Border Radius ────────────────────────────────────────────────────────
  static const double radiusXS = 8;
  static const double radiusSM = 12;
  static const double radiusMD = 16;
  static const double radiusLG = 20;
  static const double radiusXL = 24;
  static const double radiusXXL = 32;
  static const double radiusFull = 100;

  // ─── Spacing ──────────────────────────────────────────────────────────────
  static const double spacingXS = 4;
  static const double spacingSM = 8;
  static const double spacingMD = 16;
  static const double spacingLG = 24;
  static const double spacingXL = 32;
  static const double spacingXXL = 48;

  // ─── Glass Card ───────────────────────────────────────────────────────────
  static BoxDecoration glassCard({
    double borderRadius = radiusMD,
    Color? color,
    double borderOpacity = 0.2,
  }) {
    return BoxDecoration(
      color: color ?? AppColors.glassWhite,
      borderRadius: BorderRadius.circular(borderRadius),
      border: Border.all(
        color: AppColors.white.withOpacity(borderOpacity),
        width: 1.5,
      ),
      boxShadow: [
        BoxShadow(
          color: AppColors.black.withOpacity(0.1),
          blurRadius: 20,
          spreadRadius: 0,
          offset: const Offset(0, 4),
        ),
      ],
    );
  }

  // ─── Glass Card Strong ────────────────────────────────────────────────────
  static BoxDecoration glassCardStrong({
    double borderRadius = radiusMD,
  }) {
    return BoxDecoration(
      color: AppColors.glassStrong,
      borderRadius: BorderRadius.circular(borderRadius),
      border: Border.all(
        color: AppColors.white.withOpacity(0.3),
        width: 1.5,
      ),
      boxShadow: [
        BoxShadow(
          color: AppColors.primary700.withOpacity(0.2),
          blurRadius: 30,
          spreadRadius: 0,
          offset: const Offset(0, 8),
        ),
      ],
    );
  }

  // ─── Input Decoration ─────────────────────────────────────────────────────
  static InputDecoration glassInput({
    required String hint,
    Widget? prefixIcon,
    Widget? suffixIcon,
    String? label,
  }) {
    return InputDecoration(
      hintText: hint,
      labelText: label,
      prefixIcon: prefixIcon,
      suffixIcon: suffixIcon,
      hintStyle: const TextStyle(
        color: AppColors.textHint,
        fontSize: 14,
      ),
      labelStyle: const TextStyle(
        color: AppColors.textSecondary,
        fontSize: 14,
      ),
      filled: true,
      fillColor: AppColors.glassWhite,
      contentPadding: const EdgeInsets.symmetric(
        horizontal: spacingMD,
        vertical: spacingMD,
      ),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusSM),
        borderSide: BorderSide(
          color: AppColors.white.withOpacity(0.2),
          width: 1.5,
        ),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusSM),
        borderSide: BorderSide(
          color: AppColors.white.withOpacity(0.2),
          width: 1.5,
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusSM),
        borderSide: const BorderSide(
          color: AppColors.primary400,
          width: 2,
        ),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusSM),
        borderSide: const BorderSide(
          color: AppColors.error,
          width: 1.5,
        ),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusSM),
        borderSide: const BorderSide(
          color: AppColors.error,
          width: 2,
        ),
      ),
    );
  }

  // ─── Gradient Button ──────────────────────────────────────────────────────
  static BoxDecoration gradientButton({
    double borderRadius = radiusFull,
    LinearGradient? gradient,
  }) {
    return BoxDecoration(
      gradient: gradient ?? AppColors.primaryGradient,
      borderRadius: BorderRadius.circular(borderRadius),
      boxShadow: [
        BoxShadow(
          color: AppColors.primary600.withOpacity(0.4),
          blurRadius: 20,
          spreadRadius: 0,
          offset: const Offset(0, 6),
        ),
      ],
    );
  }

  // ─── Stat Card ────────────────────────────────────────────────────────────
  static BoxDecoration statCard({required Color color}) {
    return BoxDecoration(
      color: color.withOpacity(0.15),
      borderRadius: BorderRadius.circular(radiusMD),
      border: Border.all(
        color: color.withOpacity(0.3),
        width: 1.5,
      ),
    );
  }
}