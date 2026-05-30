import { useState, useEffect, useCallback, useRef } from 'react';
import { useSnippetStore } from '../store/useSnippetStore';

export function useSearch(debounceMs = 300) {
  const search       = useSnippetStore(s => s.search);
  const load         = useSnippetStore(s => s.load);
  const snippets     = useSnippetStore(s => s.snippets);

  const [query, setQuery]       = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query.trim()) {
      setIsSearching(false);
      load();
      return;
    }

    setIsSearching(true);
    timerRef.current = setTimeout(() => {
      search(query);
      setIsSearching(false);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const clear = useCallback(() => {
    setQuery('');
    load();
  }, []);

  return { query, setQuery, clear, isSearching, results: snippets };
}