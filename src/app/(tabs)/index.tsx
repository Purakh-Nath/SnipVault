import {useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { router, useFocusEffect } from 'expo-router';
import { SnippetCard } from '../../components/snippet/SnippetCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useSnippetStore } from '../../store/useSnippetStore';
import { useSearch } from '../../hooks/useSearch';
import { useColors } from '../../hooks/useColors';
import { Theme } from '../../constants/theme';

export default function HomeScreen() {
  const load          = useSnippetStore(s => s.load);
  const toggleFav     = useSnippetStore(s => s.toggleFavorite);
  const { query, setQuery, clear, isSearching, results } = useSearch();
  const { c, Colors } = useColors();

  // reload whenever this tab comes into focus
  useFocusEffect(
    useCallback(() => { load(); }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <View style={[styles.searchBox, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Text style={[styles.searchIcon, { color: c.textMuted }]}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search snippets, tags, code..."
            placeholderTextColor={c.textMuted}
            style={[styles.searchInput, { color: c.textPrimary }]}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clear} hitSlop={8}>
              <Text style={[styles.clearBtn, { color: c.textMuted }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Count row */}
      <View style={styles.metaRow}>
        {isSearching ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Text style={[styles.metaText, { color: c.textMuted }]}>
            {results.length} {results.length === 1 ? 'snippet' : 'snippets'}
            {query ? ` for "${query}"` : ''}
          </Text>
        )}
      </View>

      {/* List */}
      {results.length === 0 ? (
        <EmptyState
          icon="⌨️"
          title={query ? 'No results found' : 'No snippets yet'}
          subtitle={
            query
              ? 'Try a different search term'
              : 'Tap + to save your first code snippet'
          }
          actionLabel={query ? undefined : 'Create snippet'}
          onAction={() => router.push('/snippet/create')}
        />
      ) : (
        <FlashList
          data={results}
          estimatedItemSize={140}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <SnippetCard
              snippet={item}
              onPress={() => router.push(`/snippet/${item.id}`)}
              onFavoriteToggle={() => toggleFav(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => router.push('/snippet/create')}
        style={[styles.fab, { backgroundColor: Colors.primary, shadowColor: Colors.primary }]}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  searchRow: {
    paddingHorizontal: Theme.spacing.md,
    paddingTop:        Theme.spacing.md,
    paddingBottom:     Theme.spacing.sm,
  },
  searchBox: {
    flexDirection:   'row',
    alignItems:      'center',
    borderRadius:    Theme.radius.md,
    borderWidth:     1,
    paddingHorizontal: Theme.spacing.md,
    gap:             8,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex:        1,
    paddingVertical: Theme.spacing.sm + 2,
    fontFamily:  'Inter_400Regular',
    fontSize:    Theme.fontSize.md,
  },
  clearBtn: {
    fontSize: Theme.fontSize.md,
  },

  metaRow: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom:     Theme.spacing.sm,
    flexDirection:     'row',
    alignItems:        'center',
    minHeight:         24,
  },
  metaText: {
    fontFamily: 'Inter_400Regular',
    fontSize:   Theme.fontSize.sm,
  },

  list: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom:     100,
  },

  fab: {
    position:        'absolute',
    bottom:          28,
    right:           24,
    width:           56,
    height:          56,
    borderRadius:    28,
    justifyContent:  'center',
    alignItems:      'center',
    shadowOpacity:   0.45,
    shadowRadius:    16,
    shadowOffset:    { width: 0, height: 4 },
    elevation:       8,
  },
  fabIcon: {
    fontSize:   28,
    color:      '#000',
    lineHeight: 32,
    fontFamily: 'Inter_400Regular',
  },
});