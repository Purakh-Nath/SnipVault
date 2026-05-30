import { create } from 'zustand';
import { snippetQueries } from '../db/snippets';
import { parseSnippet } from '../utils/format';
import type { SnippetParsed, CreateSnippetInput } from '../db/types';

interface SnippetStore {
  snippets: SnippetParsed[];
  favorites: SnippetParsed[];
  searchQuery: string;
  load: () => void;
  search: (query: string) => void;
  create: (input: CreateSnippetInput) => number;
  update: (id: number, input: Partial<CreateSnippetInput>) => void;
  toggleFavorite: (id: number) => void;
  delete: (id: number) => void;
}

export const useSnippetStore = create<SnippetStore>((set, get) => ({
  snippets: [],
  favorites: [],
  searchQuery: '',

  load: () => {
    const { searchQuery } = get();
    const raw = searchQuery
      ? snippetQueries.search(searchQuery)
      : snippetQueries.getAll();
    const favRaw = snippetQueries.getFavorites();
    set({
      snippets: raw.map(parseSnippet),
      favorites: favRaw.map(parseSnippet),
    });
  },

  search: (query: string) => {
    set({ searchQuery: query });
    const raw = query ? snippetQueries.search(query) : snippetQueries.getAll();
    set({ snippets: raw.map(parseSnippet) });
  },

  create: (input) => {
    const id = snippetQueries.create(input);
    get().load();
    return id;
  },

  update: (id, input) => {
    snippetQueries.update(id, input);
    get().load();
  },

  toggleFavorite: (id) => {
    snippetQueries.toggleFavorite(id);
    get().load();
  },

  delete: (id) => {
    snippetQueries.delete(id);
    get().load();
  },
}));