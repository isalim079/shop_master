import 'package:flutter/material.dart';
import '../../core/theme/index.dart';
import 'glass_card.dart';

class AppLoader extends StatelessWidget {
  final double size;
  final Color? color;

  const AppLoader({
    super.key,
    this.size = 24,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CircularProgressIndicator(
        color: color ?? AppColors.primary400,
        strokeWidth: 2.5,
      ),
    );
  }
}

class AppFullScreenLoader extends StatelessWidget {
  final String? message;

  const AppFullScreenLoader({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.black.withOpacity(0.5),
      child: Center(
        child: GlassCard(
          padding: const EdgeInsets.all(AppDecorations.spacingXL),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const AppLoader(size: 40),
              if (message != null) ...[
                const SizedBox(height: AppDecorations.spacingMD),
                Text(message!, style: AppTypography.bodyMedium),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
