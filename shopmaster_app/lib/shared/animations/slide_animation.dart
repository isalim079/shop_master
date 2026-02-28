import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class SlideAnimation extends StatelessWidget {
  final Widget child;
  final Duration delay;
  final Duration duration;
  final Offset begin;

  const SlideAnimation({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.duration = const Duration(milliseconds: 400),
    this.begin = const Offset(0, 0.1),
  });

  @override
  Widget build(BuildContext context) {
    return child
        .animate(delay: delay)
        .fadeIn(duration: duration)
        .slideY(
          begin: begin.dy,
          end: 0,
          duration: duration,
          curve: Curves.easeOutCubic,
        );
  }
}