import React, { useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { FileItem } from './FileItem';
import { EmptyState } from '../ui/EmptyState';
import { useFileSystem } from '../../hooks/useFileSystem';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

export function FileBrowser() {
  const { files, loading, error, refresh, removeFile, share } = useFileSystem();

  useEffect(() => { refresh(); }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  if (files.length === 0) {
    return (
      <EmptyState
        icon="📂"
        title="No files yet"
        subtitle="Import files from your device or export snippets here."
      />
    );
  }

  return (
    <FlatList
      data={files}
      keyExtractor={f => f.path}
      renderItem={({ item }) => (
        <FileItem
          file={item}
          onShare={() => share(item.path)}
          onDelete={() => removeFile(item.path)}
        />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list:   { padding: Theme.spacing.md },
});