import { create } from 'zustand';
import { hasApiKey, deleteApiKey } from '../services/ai';

interface SettingsStore {
  hasKey: boolean;
  checkKey: () => Promise<void>;
  clearKey: () => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  hasKey: false,

  checkKey: async () => {
    const has = await hasApiKey();
    set({ hasKey: has });
  },

  clearKey: async () => {
    await deleteApiKey();
    set({ hasKey: false });
  },
}));