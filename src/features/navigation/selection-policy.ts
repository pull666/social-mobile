export function toggleSelection(current: string[], id: string, mode: 'single' | 'multiple'): string[] {
  if (mode === 'single') return [id];
  return current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
}
