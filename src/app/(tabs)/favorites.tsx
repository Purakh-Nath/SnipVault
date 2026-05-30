import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { router, useFocusEffect } from 'expo-router';
import { SnippetCard } from '../../components/snippet/SnippetCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useSnippetStore } from '../../store/useSnippetStore';
import { useColors } from '../../hooks/useColors';
import { Theme } from '../../constants/theme';

export default function FavoritesScreen() {
  const favorites     = useSnippetStore(s => s.favorites);
  const load          = useSnippetStore(s => s.load);
  const toggleFav     = useSnippetStore(s => s.toggleFavorite);
  const { c }         = useColors();

  useFocusEffect(
    useCallback(() => { load(); }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {favorites.length === 0 ? (
        <EmptyState
          icon="★"
          title="No favorites yet"
          subtitle="Star any snippet to quickly find it here."
          actionLabel="Browse snippets"
          onAction={() => router.push('/(tabs)')}
        />
      ) : (
        <FlashList
          data={favorites}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list:      { padding: Theme.spacing.md },
});