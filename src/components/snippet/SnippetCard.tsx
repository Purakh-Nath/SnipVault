import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { Tag } from '../ui/Tag';
import { getLanguageColor, getLanguageLabel } from '../../constants/languages';
import { formatDate } from '../../utils/format';
import type { SnippetParsed } from '../../db/types';

interface SnippetCardProps {
  snippet: SnippetParsed;
  onPress: () => void;
  onFavoriteToggle: () => void;
}

export function SnippetCard({ snippet, onPress, onFavoriteToggle }: SnippetCardProps) {
  const tags    = snippet.tags.slice(0, 3);
  const langColor = getLanguageColor(snippet.language);
  const preview = snippet.code.split('\n').slice(0, 2).join('\n');

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.card}>
      {/* top row */}
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <View style={[styles.langDot, { backgroundColor: langColor }]} />
          <Text style={styles.title} numberOfLines={1}>{snippet.title}</Text>
        </View>
        <TouchableOpacity onPress={onFavoriteToggle} hitSlop={10}>
          <Text style={snippet.is_favorite ? styles.favActive : styles.favInactive}>
            {snippet.is_favorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* code preview */}
      <Text style={styles.preview} numberOfLines={2}>{preview}</Text>

      {/* bottom row */}
      <View style={styles.bottomRow}>
        <View style={styles.tags}>
          <Tag label={getLanguageLabel(snippet.language)} color={langColor} small />
          {tags.map(t => <Tag key={t} label={t} small />)}
        </View>
        <Text style={styles.date}>{formatDate(snippet.updated_at)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  langDot: { width: 8, height: 8, borderRadius: 4 },
  title: {
    fontFamily: Theme.fontFamily.semibold,
    fontSize: Theme.fontSize.md,
    color: Colors.dark.textPrimary,
    flex: 1,
  },
  favActive:   { fontSize: 18, color: Colors.warning },
  favInactive: { fontSize: 18, color: Colors.dark.textMuted },
  preview: {
    fontFamily: Theme.fontFamily.mono,
    fontSize: Theme.fontSize.xs,
    color: Colors.dark.textSecondary,
    backgroundColor: Colors.dark.codeBg,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.sm,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', flex: 1 },
  date: {
    fontFamily: Theme.fontFamily.regular,
    fontSize: Theme.fontSize.xs,
    color: Colors.dark.textMuted,
  },
});