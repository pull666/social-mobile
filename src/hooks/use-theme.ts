import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { accents, useAppearance } from '@/features/theme/store';

export function useTheme() {
  const system = useColorScheme();
  const { mode, accent } = useAppearance();
  const scheme = mode === 'system' ? (system === 'dark' ? 'dark' : 'light') : mode;
  return {
    ...Colors[scheme],
    primary: accents[accent][scheme],
    onPrimary: scheme === 'dark' ? '#101828' : '#FFFFFF',
    border: scheme === 'dark' ? '#303B4B' : '#E2E8F0',
    scheme,
  };
}
