import { useEffect } from 'react';
import { useSnippetStore } from '../store/useSnippetStore';

export function useSnippets() {
  const store = useSnippetStore();

  useEffect(() => {
    store.load();
  }, []);

  return {
    snippets:      store.snippets,
    favorites:     store.favorites,
    searchQuery:   store.searchQuery,
    load:          store.load,
    createSnippet: store.create,
    updateSnippet: store.update,
    deleteSnippet: store.delete,
    toggleFavorite: store.toggleFavorite,
  };
}