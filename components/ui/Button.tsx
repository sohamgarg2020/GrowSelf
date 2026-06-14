import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../lib/constants';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = true,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFFFFF' : COLORS.accent} size="small" />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}`], styles[`textSize_${size}`], textStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  primary: { backgroundColor: COLORS.accent },
  secondary: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: COLORS.error },

  size_sm: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.md, borderRadius: RADIUS.sm },
  size_md: { paddingVertical: 14, paddingHorizontal: SPACING.lg },
  size_lg: { paddingVertical: 18, paddingHorizontal: SPACING.xl },

  text: { fontWeight: '700', letterSpacing: 0.3 },
  text_primary: { color: '#FFFFFF' },
  text_secondary: { color: COLORS.textPrimary },
  text_ghost: { color: COLORS.accent },
  text_danger: { color: '#FFFFFF' },

  textSize_sm: { fontSize: 13 },
  textSize_md: { fontSize: 16 },
  textSize_lg: { fontSize: 18 },
});
