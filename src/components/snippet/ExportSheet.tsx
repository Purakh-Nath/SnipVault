import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';
import { exportSnippet, type ExportFormat } from '../../services/export';
import type { SnippetParsed } from '../../db/types';

interface ExportSheetProps {
  snippet:  SnippetParsed;
  visible:  boolean;
  onClose:  () => void;
}

const FORMATS: { label: string; value: ExportFormat; desc: string }[] = [
  { label: '.txt', value: 'txt',  desc: 'Plain text file' },
  { label: '.js',  value: 'js',   desc: 'JavaScript file with comments' },
  { label: '.json',value: 'json', desc: 'Structured JSON with metadata' },
];

export function ExportSheet({ snippet, visible, onClose }: ExportSheetProps) {
  const handleExport = async (format: ExportFormat) => {
    onClose();
    try {
      await exportSnippet(snippet, format);
    } catch (e) {
      console.error('Export failed:', e);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>Export Snippet</Text>
        <Text style={styles.subtitle}>Choose a format to export and share</Text>

        {FORMATS.map(f => (
          <TouchableOpacity
            key={f.value}
            style={styles.option}
            onPress={() => handleExport(f.value)}
          >
            <View style={styles.optionLeft}>
              <Text style={styles.optionLabel}>{f.label}</Text>
              <Text style={styles.optionDesc}>{f.desc}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.cancel} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: Colors.dark.surface,
    borderTopLeftRadius:  Theme.radius.xl,
    borderTopRightRadius: Theme.radius.xl,
    padding:    Theme.spacing.lg,
    gap:        Theme.spacing.sm,
    paddingBottom: 40,
  },
  handle: {
    width: 36, height: 4,
    backgroundColor: Colors.dark.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Theme.spacing.sm,
  },
  title: {
    fontFamily: Theme.fontFamily.semibold,
    fontSize:   Theme.fontSize.lg,
    color:      Colors.dark.textPrimary,
  },
  subtitle: {
    fontFamily: Theme.fontFamily.regular,
    fontSize:   Theme.fontSize.sm,
    color:      Colors.dark.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  option: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingVertical:   Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.borderSubtle,
  },
  optionLeft: { gap: 2 },
  optionLabel: {
    fontFamily: Theme.fontFamily.semibold,
    fontSize:   Theme.fontSize.md,
    color:      Colors.dark.textPrimary,
  },
  optionDesc: {
    fontFamily: Theme.fontFamily.regular,
    fontSize:   Theme.fontSize.sm,
    color:      Colors.dark.textSecondary,
  },
  arrow: { color: Colors.primary, fontSize: Theme.fontSize.lg },
  cancel: {
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    marginTop: Theme.spacing.xs,
  },
  cancelText: {
    fontFamily: Theme.fontFamily.semibold,
    fontSize:   Theme.fontSize.md,
    color:      Colors.danger,
  },
});