import { create } from 'zustand';

// Unsaved form selections belong to their parent field, never to a server-side privacy policy.
export const useSelections = create<{ fields: Record<string, string[]>; save: (id: string, values: string[]) => void }>(
  (set) => ({ fields: {}, save: (id, values) => set((state) => ({ fields: { ...state.fields, [id]: values } })) }),
);
