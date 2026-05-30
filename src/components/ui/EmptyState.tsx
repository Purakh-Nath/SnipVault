import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="primary"
          size="md"
          style={styles.btn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Theme.spacing.xl,
    gap: Theme.spacing.sm,
  },
  icon: { fontSize: 48, marginBottom: Theme.spacing.sm },
  title: {
    fontFamily: Theme.fontFamily.semibold,
    fontSize: Theme.fontSize.lg,
    color: Colors.dark.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.md,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  btn: { marginTop: Theme.spacing.md },
});