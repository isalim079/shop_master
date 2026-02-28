import 'package:flutter/material.dart';
import '../../core/theme/index.dart';

class AppSnackbar {
  static void show(
    BuildContext context, {
    required String message,
    SnackbarType type = SnackbarType.info,
    Duration duration = const Duration(seconds: 3),
  }) {
    final color = switch (type) {
      SnackbarType.success => AppColors.success,
      SnackbarType.error   => AppColors.error,
      SnackbarType.warning => AppColors.warning,
      SnackbarType.info    => AppColors.primary500,
    };

    final icon = switch (type) {
      SnackbarType.success => Icons.check_circle_rounded,
      SnackbarType.error   => Icons.error_rounded,
      SnackbarType.warning => Icons.warning_rounded,
      SnackbarType.info    => Icons.info_rounded,
    };

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        duration: duration,
        backgroundColor: AppColors.transparent,
        elevation: 0,
        behavior: SnackBarBehavior.floating,
        margin: const EdgeInsets.all(AppDecorations.spacingMD),
        content: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: AppDecorations.spacingMD,
            vertical: AppDecorations.spacingSM + 4,
          ),
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            borderRadius: BorderRadius.circular(AppDecorations.radiusSM),
            border: Border.all(
              color: color.withOpacity(0.4),
              width: 1.5,
            ),
          ),
          child: Row(
            children: [
              Icon(icon, color: color, size: 20),
              const SizedBox(width: AppDecorations.spacingSM),
              Expanded(
                child: Text(
                  message,
                  style: AppTypography.bodyMedium.copyWith(
                    color: AppColors.white,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

enum SnackbarType { success, error, warning, info }