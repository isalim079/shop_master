import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme/index.dart';

enum AppButtonType { primary, secondary, outline, text, danger }

class AppButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final AppButtonType type;
  final bool isLoading;
  final bool isFullWidth;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final double? width;
  final double height;
  final double borderRadius;

  const AppButton({
    super.key,
    required this.label,
    this.onPressed,
    this.type = AppButtonType.primary,
    this.isLoading = false,
    this.isFullWidth = true,
    this.prefixIcon,
    this.suffixIcon,
    this.width,
    this.height = 52,
    this.borderRadius = AppDecorations.radiusFull,
  });

  @override
  State<AppButton> createState() => _AppButtonState();
}

class _AppButtonState extends State<AppButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) => setState(() => _isPressed = false),
      onTapCancel: () => setState(() => _isPressed = false),
      onTap: widget.isLoading ? null : widget.onPressed,
      child: AnimatedScale(
        scale: _isPressed ? 0.97 : 1.0,
        duration: const Duration(milliseconds: 100),
        child: SizedBox(
          width: widget.isFullWidth ? double.infinity : widget.width,
          height: widget.height,
          child: _buildButton(),
        ),
      ),
    );
  }

  Widget _buildButton() {
    switch (widget.type) {
      case AppButtonType.primary:
        return _PrimaryButton(
          label: widget.label,
          isLoading: widget.isLoading,
          prefixIcon: widget.prefixIcon,
          suffixIcon: widget.suffixIcon,
          borderRadius: widget.borderRadius,
          onPressed: widget.onPressed,
        );

      case AppButtonType.secondary:
        return _SecondaryButton(
          label: widget.label,
          isLoading: widget.isLoading,
          prefixIcon: widget.prefixIcon,
          borderRadius: widget.borderRadius,
        );

      case AppButtonType.outline:
        return _OutlineButton(
          label: widget.label,
          isLoading: widget.isLoading,
          prefixIcon: widget.prefixIcon,
          borderRadius: widget.borderRadius,
        );

      case AppButtonType.danger:
        return _DangerButton(
          label: widget.label,
          isLoading: widget.isLoading,
          borderRadius: widget.borderRadius,
        );

      case AppButtonType.text:
        return _TextButton(
          label: widget.label,
        );
    }
  }
}

// ─── Primary Button ───────────────────────────────────────────────────────────
class _PrimaryButton extends StatelessWidget {
  final String label;
  final bool isLoading;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final double borderRadius;
  final VoidCallback? onPressed;

  const _PrimaryButton({
    required this.label,
    required this.isLoading,
    this.prefixIcon,
    this.suffixIcon,
    required this.borderRadius,
    this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: AppDecorations.gradientButton(borderRadius: borderRadius),
      child: Material(
        color: AppColors.transparent,
        borderRadius: BorderRadius.circular(borderRadius),
        child: InkWell(
          borderRadius: BorderRadius.circular(borderRadius),
          onTap: isLoading ? null : onPressed,
          splashColor: AppColors.white.withOpacity(0.1),
          child: Center(
            child: isLoading
                ? const SizedBox(
                    width: 22,
                    height: 22,
                    child: CircularProgressIndicator(
                      color: AppColors.white,
                      strokeWidth: 2.5,
                    ),
                  )
                : Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (prefixIcon != null) ...[
                        prefixIcon!,
                        const SizedBox(width: 8),
                      ],
                      Text(label, style: AppTypography.button),
                      if (suffixIcon != null) ...[
                        const SizedBox(width: 8),
                        suffixIcon!,
                      ],
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}

// ─── Secondary Button ─────────────────────────────────────────────────────────
class _SecondaryButton extends StatelessWidget {
  final String label;
  final bool isLoading;
  final Widget? prefixIcon;
  final double borderRadius;

  const _SecondaryButton({
    required this.label,
    required this.isLoading,
    this.prefixIcon,
    required this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.glassStrong,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(
          color: AppColors.white.withOpacity(0.2),
          width: 1.5,
        ),
      ),
      child: Center(
        child: isLoading
            ? const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                  color: AppColors.white,
                  strokeWidth: 2.5,
                ),
              )
            : Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (prefixIcon != null) ...[
                    prefixIcon!,
                    const SizedBox(width: 8),
                  ],
                  Text(label, style: AppTypography.button),
                ],
              ),
      ),
    );
  }
}

// ─── Outline Button ───────────────────────────────────────────────────────────
class _OutlineButton extends StatelessWidget {
  final String label;
  final bool isLoading;
  final Widget? prefixIcon;
  final double borderRadius;

  const _OutlineButton({
    required this.label,
    required this.isLoading,
    this.prefixIcon,
    required this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.transparent,
        borderRadius: BorderRadius.circular(borderRadius),
        border: Border.all(
          color: AppColors.primary400,
          width: 1.5,
        ),
      ),
      child: Center(
        child: Text(
          label,
          style: AppTypography.button.copyWith(color: AppColors.primary400),
        ),
      ),
    );
  }
}

// ─── Danger Button ────────────────────────────────────────────────────────────
class _DangerButton extends StatelessWidget {
  final String label;
  final bool isLoading;
  final double borderRadius;

  const _DangerButton({
    required this.label,
    required this.isLoading,
    required this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: AppDecorations.gradientButton(
        borderRadius: borderRadius,
        gradient: AppColors.errorGradient,
      ),
      child: Center(
        child: isLoading
            ? const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                  color: AppColors.white,
                  strokeWidth: 2.5,
                ),
              )
            : Text(label, style: AppTypography.button),
      ),
    );
  }
}

// ─── Text Button ──────────────────────────────────────────────────────────────
class _TextButton extends StatelessWidget {
  final String label;

  const _TextButton({required this.label});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        label,
        style: AppTypography.button.copyWith(
          color: AppColors.primary400,
          decoration: TextDecoration.underline,
          decorationColor: AppColors.primary400,
        ),
      ),
    );
  }
}