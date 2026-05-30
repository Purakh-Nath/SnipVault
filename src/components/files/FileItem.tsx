import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { formatDate } from '../../utils/format';
import type { ManagedFile } from '../../services/fileManager';

interface FileItemProps {
  file:      ManagedFile;
  onShare:   () => void;
  onDelete:  () => void;
}

function getFileIcon(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    js: '📜', ts: '📘', json: '📋', txt: '📄',
    png: '🖼️', jpg: '🖼️', jpeg: '🖼️',
    pdf: '📑', md: '📝',
  };
  return map[ext ?? ''] ?? '📁';
}

export function FileItem({ file, onShare, onDelete }: FileItemProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{getFileIcon(file.name)}</Text>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{file.name}</Text>
        <Text style={styles.meta}>{file.size} · {formatDate(file.modifiedAt)}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onShare} hitSlop={8} style={styles.actionBtn}>
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} hitSlop={8} style={styles.actionBtn}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    backgroundColor: Colors.dark.surface,
    borderRadius:   Theme.radius.md,
    padding:        Theme.spacing.md,
    marginBottom:   Theme.spacing.sm,
    borderWidth:    1,
    borderColor:    Colors.dark.border,
    gap:            Theme.spacing.sm,
  },
  icon:  { fontSize: 24 },
  info:  { flex: 1, gap: 2 },
  name: {
    fontFamily: Theme.fontFamily.semibold,
    fontSize:   Theme.fontSize.sm,
    color:      Colors.dark.textPrimary,
  },
  meta: {
    fontFamily: Theme.fontFamily.regular,
    fontSize:   Theme.fontSize.xs,
    color:      Colors.dark.textMuted,
  },
  actions:   { flexDirection: 'row', gap: Theme.spacing.sm },
  actionBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  shareText:  { fontFamily: Theme.fontFamily.semibold, fontSize: Theme.fontSize.xs, color: Colors.primary },
  deleteText: { fontFamily: Theme.fontFamily.semibold, fontSize: Theme.fontSize.xs, color: Colors.danger },
});