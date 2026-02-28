import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class ScaleAnimation extends StatelessWidget {
  final Widget child;
  final Duration delay;
  final Duration duration;

  const ScaleAnimation({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.duration = const Duration(milliseconds: 300),
  });

  @override
  Widget build(BuildContext context) {
    return child
        .animate(delay: delay)
        .scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1, 1),
          duration: duration,
          curve: Curves.easeOutBack,
        )
        .fadeIn(duration: duration);
  }
}