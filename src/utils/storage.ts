import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  THEME: 'app_theme',
  LANGUAGE_FILTER: 'language_filter',
  ONBOARDING_DONE: 'onboarding_done',
  SORT_ORDER: 'sort_order',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

export async function setStorageItem(key: StorageKey, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(`[Storage] Failed to set ${key}:`, e);
  }
}

export async function getStorageItem(key: StorageKey): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.error(`[Storage] Failed to get ${key}:`, e);
    return null;
  }
}

export async function removeStorageItem(key: StorageKey): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`[Storage] Failed to remove ${key}:`, e);
  }
}