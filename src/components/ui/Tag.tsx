import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

interface TagProps {
  label: string;
  onRemove?: () => void;
  color?: string;
  small?: boolean;
}

export function Tag({ label, onRemove, color, small = false }: TagProps) {
  return (
    <View style={[
      styles.tag,
      small && styles.tagSmall,
      color && { borderColor: color + '55', backgroundColor: color + '18' },
    ]}>
      <Text style={[styles.label, small && styles.labelSmall, color && { color }]}>
        {label}
      </Text>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} hitSlop={8} style={styles.remove}>
          <Text style={styles.removeText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    backgroundColor: Colors.dark.surfaceRaised,
    gap: 4,
  },
  tagSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  label: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.sm,
    color: Colors.dark.textSecondary,
  },
  labelSmall: { fontSize: Theme.fontSize.xs },
  remove: { marginLeft: 2 },
  removeText: {
    color: Colors.dark.textMuted,
    fontSize: Theme.fontSize.md,
    lineHeight: 16,
  },
});