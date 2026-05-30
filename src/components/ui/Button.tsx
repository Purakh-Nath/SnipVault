import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  type TouchableOpacityProps,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'ghost' ? Colors.primary : '#000'}
        />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`]]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: { width: '100%' },
  disabled:  { opacity: 0.45 },

  // variants
  primary:   { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.dark.surface, borderWidth: 1, borderColor: Colors.dark.border },
  danger:    { backgroundColor: Colors.danger },
  ghost:     { backgroundColor: 'transparent' },

  // sizes
  size_sm: { paddingHorizontal: Theme.spacing.md, paddingVertical: Theme.spacing.xs },
  size_md: { paddingHorizontal: Theme.spacing.lg, paddingVertical: Theme.spacing.sm + 2 },
  size_lg: { paddingHorizontal: Theme.spacing.xl, paddingVertical: Theme.spacing.md },

  // labels
  label: { fontFamily: Theme.fontFamily.semibold },
  label_primary:   { color: '#000' },
  label_secondary: { color: Colors.dark.textPrimary },
  label_danger:    { color: '#fff' },
  label_ghost:     { color: Colors.primary },

  labelSize_sm: { fontSize: Theme.fontSize.sm },
  labelSize_md: { fontSize: Theme.fontSize.md },
  labelSize_lg: { fontSize: Theme.fontSize.lg },
});