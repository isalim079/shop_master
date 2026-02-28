import 'dart:ui';
import 'package:flutter/material.dart';
import '../../core/theme/index.dart';

class GlassCard extends StatelessWidget {
  final Widget child;
  final double? width;
  final double? height;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final double blurStrength;
  final Color? color;
  final double borderOpacity;
  final VoidCallback? onTap;

  const GlassCard({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.padding,
    this.margin,
    this.borderRadius = AppDecorations.radiusMD,
    this.blurStrength = 10,
    this.color,
    this.borderOpacity = 0.2,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: width,
        height: height,
        margin: margin,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(borderRadius),
          child: BackdropFilter(
            filter: ImageFilter.blur(
              sigmaX: blurStrength,
              sigmaY: blurStrength,
            ),
            child: Container(
              padding: padding ?? const EdgeInsets.all(AppDecorations.spacingMD),
              decoration: AppDecorations.glassCard(
                borderRadius: borderRadius,
                color: color,
                borderOpacity: borderOpacity,
              ),
              child: child,
            ),
          ),
        ),
      ),
    );
  }
}