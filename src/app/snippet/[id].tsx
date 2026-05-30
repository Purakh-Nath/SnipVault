// src/app/snippet/[id].tsx

import { useState, useLayoutEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Alert, StyleSheet,
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { snippetQueries } from '../../db/snippets';
import { parseSnippet } from '../../utils/format';
import { CodeBlock } from '../../components/ui/CodeBlock';
import { Tag } from '../../components/ui/Tag';
import { Button } from '../../components/ui/Button';
import { AIExplanationPanel } from '../../components/snippet/AIExplanationPanel';
import { ExportSheet } from '../../components/snippet/ExportSheet';
import { SnippetForm } from '../../components/snippet/SnippetForm';
import { useSnippetStore } from '../../store/useSnippetStore';
import { getLanguageColor, getLanguageLabel } from '../../constants/languages';
import { formatDate } from '../../utils/format';
import { useColors } from '../../hooks/useColors';
import { Theme } from '../../constants/theme';
import type { SnippetParsed } from '../../db/types';

type ViewMode = 'view' | 'edit';

export default function SnippetDetailScreen() {
  const { id }       = useLocalSearchParams<{ id: string }>();
  const navigation   = useNavigation();
  const updateSnip   = useSnippetStore(s => s.update);
  const deleteSnip   = useSnippetStore(s => s.delete);
  const toggleFav    = useSnippetStore(s => s.toggleFavorite);
  const { c, Colors } = useColors();

  const raw = snippetQueries.getById(Number(id));
  if (!raw) {
    return (
      <View style={[styles.notFound, { backgroundColor: c.background }]}>
        <Text style={[styles.notFoundText, { color: c.textSecondary }]}>Snippet not found.</Text>
      </View>
    );
  }

  const snippet: SnippetParsed = parseSnippet(raw);
  const [mode,        setMode]        = useState<ViewMode>('view');
  const [showExport,  setShowExport]  = useState(false);
  const langColor = getLanguageColor(snippet.language);

  // header right buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      title: mode === 'edit' ? 'Edit Snippet' : snippet.title,
      headerRight: () =>
        mode === 'view' ? (
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => toggleFav(snippet.id)} hitSlop={8}>
              <Text style={{ fontSize: 20, color: snippet.is_favorite ? Colors.warning : c.textMuted }}>
                {snippet.is_favorite ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('edit')} hitSlop={8} style={{ marginLeft: 16 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: Theme.fontSize.sm, color: Colors.primary }}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        ) : null,
    });
  }, [mode, snippet.is_favorite, snippet.title, snippet.id, c.textMuted]);

  const handleUpdate = (input: Parameters<typeof updateSnip>[1]) => {
    updateSnip(snippet.id, input);
    setMode('view');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Snippet',
      `Delete "${snippet.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteSnip(snippet.id);
            router.back();
          },
        },
      ]
    );
  };

  if (mode === 'edit') {
    return (
      <SnippetForm
        initial={snippet}
        onSubmit={handleUpdate}
        onCancel={() => setMode('view')}
        submitLabel="Update Snippet"
      />
    );
  }

  // ---- VIEW MODE ----
  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + language */}
        <View style={styles.titleRow}>
          <View style={[styles.langDot, { backgroundColor: langColor }]} />
          <Text style={[styles.title, { color: c.textPrimary }]}>{snippet.title}</Text>
        </View>

        {/* Meta */}
        <View style={styles.metaRow}>
          <Tag label={getLanguageLabel(snippet.language)} color={langColor} small />
          <Text style={[styles.date, { color: c.textMuted }]}>Updated {formatDate(snippet.updated_at)}</Text>
        </View>

        {/* Tags */}
        {snippet.tags.length > 0 && (
          <View style={styles.tagRow}>
            {snippet.tags.map(t => <Tag key={t} label={t} small />)}
          </View>
        )}

        {/* Code */}
        <CodeBlock code={snippet.code} language={snippet.language} />

        {/* Action row */}
        <View style={styles.actionRow}>
          <Button
            label="Export"
            onPress={() => setShowExport(true)}
            variant="secondary"
            size="sm"
            style={styles.actionBtn}
          />
          <Button
            label="Delete"
            onPress={handleDelete}
            variant="danger"
            size="sm"
            style={styles.actionBtn}
          />
        </View>

        {/* AI Panel */}
        <AIExplanationPanel
          code={snippet.code}
          language={snippet.language}
        />

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Export sheet */}
      <ExportSheet
        snippet={snippet}
        visible={showExport}
        onClose={() => setShowExport(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  content:      { padding: Theme.spacing.md, gap: Theme.spacing.md },

  titleRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
  },
  langDot: { width: 10, height: 10, borderRadius: 5 },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   Theme.fontSize.xl,
    flex:       1,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems:    'center',
    justifyContent: 'space-between',
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Theme.fontSize.xs,
  },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1 },

  headerActions: { flexDirection: 'row', alignItems: 'center', marginRight: 4 },

  notFound: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  notFoundText: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Theme.fontSize.md,
  },
});