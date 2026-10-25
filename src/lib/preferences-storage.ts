import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const preferences = createMMKV({ id: 'social-preferences' });

export const preferencesStorage: StateStorage = {
  getItem: (name) => preferences.getString(name) ?? null,
  setItem: (name, value) => {
    preferences.set(name, value);
  },
  removeItem: (name) => {
    preferences.remove(name);
  },
};
