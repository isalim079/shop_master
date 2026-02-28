import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

extension StringExtension on String {
  String get capitalize =>
      isNotEmpty ? '${this[0].toUpperCase()}${substring(1)}' : this;

  String get titleCase => split(' ')
      .map((word) => word.capitalize)
      .join(' ');
}

extension DoubleExtension on double {
  String toCurrency(String symbol) {
    final formatter = NumberFormat('#,##0.00');
    return '$symbol${formatter.format(this)}';
  }

  String toCompact(String symbol) {
    if (this >= 1000000) return '$symbol${(this / 1000000).toStringAsFixed(1)}M';
    if (this >= 1000) return '$symbol${(this / 1000).toStringAsFixed(1)}K';
    return toCurrency(symbol);
  }
}

extension DateTimeExtension on DateTime {
  String get toDisplayDate => DateFormat('dd MMM yyyy').format(this);
  String get toDisplayTime => DateFormat('hh:mm a').format(this);
  String get toDisplayDateTime => DateFormat('dd MMM yyyy • hh:mm a').format(this);
  String get toApiDate => DateFormat('yyyy-MM-dd').format(this);
  bool get isToday {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }
}

extension ContextExtension on BuildContext {
  double get screenWidth => MediaQuery.of(this).size.width;
  double get screenHeight => MediaQuery.of(this).size.height;
  bool get isMobile => screenWidth < 600;
  bool get isTablet => screenWidth >= 600 && screenWidth < 1200;
  ThemeData get theme => Theme.of(this);
  TextTheme get textTheme => Theme.of(this).textTheme;
}