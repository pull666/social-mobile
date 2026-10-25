import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import type { User } from '@/lib/api';
const key = 'social-session';

// Web keeps its bearer token in memory; native persists it in SecureStore.
export const useSession = create<{
  token: string | null;
  user: User | null;
  ready: boolean;
  set: (token: string, user: User) => Promise<void>;
  clear: () => Promise<void>;
  restore: () => Promise<void>;
}>((set) => ({
  token: null,
  user: null,
  ready: false,
  async set(token, user) {
    if (Platform.OS !== 'web') await SecureStore.setItemAsync(key, token);
    set({ token, user, ready: true });
  },
  async clear() {
    if (Platform.OS !== 'web') await SecureStore.deleteItemAsync(key);
    set({ token: null, user: null, ready: true });
  },
  async restore() {
    try {
      set({
        token: Platform.OS === 'web' ? null : await SecureStore.getItemAsync(key),
        ready: true,
      });
    } catch {
      set({ token: null, ready: true });
    }
  },
}));
