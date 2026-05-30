import { create } from 'zustand';
import { getStorageItem, setStorageItem, StorageKeys } from '../utils/storage';

type ThemeMode = 'dark' | 'light';

interface ThemeStore {
  mode: ThemeMode;
  initialized: boolean;
  init: () => Promise<void>;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: 'dark',
  initialized: false,

  init: async () => {
    const saved = await getStorageItem(StorageKeys.THEME);
    set({ mode: (saved as ThemeMode) ?? 'dark', initialized: true });
  },

  toggle: () => {
    const next = get().mode === 'dark' ? 'light' : 'dark';
    set({ mode: next });
    setStorageItem(StorageKeys.THEME, next);
  },
}));