import { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FileBrowser } from '../../components/files/FileBrowser';
import { useFileSystem } from '../../hooks/useFileSystem';
import { useColors } from '../../hooks/useColors';
import { Theme } from '../../constants/theme';

export default function FilesScreen() {
  const { refresh, pickFile } = useFileSystem();
  const { c, Colors } = useColors();

  useFocusEffect(
    useCallback(() => { refresh(); }, [])
  );

  const handleImport = async () => {
    await pickFile();
    refresh();
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* toolbar */}
      <View style={[styles.toolbar, { borderBottomColor: c.border }]}>
        <Text style={[styles.toolbarTitle, { color: c.textPrimary }]}>Local Files</Text>
        <TouchableOpacity
          onPress={handleImport}
          style={[styles.importBtn, { backgroundColor: Colors.primary }]}
          activeOpacity={0.8}
        >
          <Text style={styles.importText}>+ Import</Text>
        </TouchableOpacity>
      </View>

      <FileBrowser />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  toolbar: {
    flexDirection:   'row',
    justifyContent:  'space-between',
    alignItems:      'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical:   Theme.spacing.md,
    borderBottomWidth: 1,
  },
  toolbarTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Theme.fontSize.lg,
  },
  importBtn: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical:   Theme.spacing.xs + 2,
    borderRadius:      Theme.radius.md,
  },
  importText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Theme.fontSize.sm,
    color:      '#000',
  },
});