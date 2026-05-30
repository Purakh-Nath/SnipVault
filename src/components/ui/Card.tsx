import React from 'react';
import { View, StyleSheet, type ViewProps } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
}

export function Card({ elevated = false, style, children, ...rest }: CardProps) {
  return (
    <View
      style={[styles.card, elevated && styles.elevated, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: Theme.spacing.md,
  },
  elevated: {
    backgroundColor: Colors.dark.surfaceRaised,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});