import React, { forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  type TextInputProps,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  mono?: boolean;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, mono = false, style, ...rest }, ref) => {
    return (
      <View style={styles.wrapper}>
        {label && <Text style={styles.label}>{label}</Text>}
        <TextInput
          ref={ref}
          placeholderTextColor={Colors.dark.textMuted}
          style={[
            styles.input,
            mono && styles.mono,
            error && styles.inputError,
            style,
          ]}
          {...rest}
        />
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: {
    fontFamily: Theme.fontFamily.semibold,
    fontSize: Theme.fontSize.sm,
    color: Colors.dark.textSecondary,
  },
  input: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: Theme.radius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm + 2,
    color: Colors.dark.textPrimary,
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
  },
  mono: {
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.sm,
  },
  inputError: { borderColor: Colors.danger },
  error: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.xs,
    color: Colors.danger,
  },
});