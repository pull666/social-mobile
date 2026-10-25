import { preferencesStorage } from '@/lib/preferences-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const accents = {
  blue: { name: '蓝色', light: '#1762D5', dark: '#8BB8FF' },
  purple: { name: '紫色', light: '#7344CA', dark: '#C4A8FF' },
  green: { name: '绿色', light: '#16734D', dark: '#75D8AA' },
  orange: { name: '橙色', light: '#A94B09', dark: '#FFBA84' },
  pink: { name: '粉色', light: '#B32D69', dark: '#FF9CC8' },
  cyan: { name: '青色', light: '#087181', dark: '#77D7E5' },
} as const;

export type Mode = 'system' | 'light' | 'dark';

export type Accent = keyof typeof accents;

export const useAppearance = create(
  persist<
    { mode: Mode; accent: Accent; setMode: (mode: Mode) => void; setAccent: (accent: Accent) => void },
    [],
    [],
    { mode: Mode; accent: Accent }
  >(
    (set) => ({
      mode: 'system',
      accent: 'blue',
      setMode: (mode) => set({ mode }),
      setAccent: (accent) => set({ accent }),
    }),
    {
      name: 'social-appearance',
      storage: createJSONStorage(() => preferencesStorage),
      partialize: (state) => ({ mode: state.mode, accent: state.accent }),
    },
  ),
);
