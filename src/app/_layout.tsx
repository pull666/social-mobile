import { SessionSync } from '@/features/navigation/session-sync';
import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { queryClient } from '@/lib/query';
import { useSession } from '@/stores/session';
import { useTheme } from '@/hooks/use-theme';
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const c = useTheme();
  useEffect(() => {
    void useSession
      .getState()
      .restore()
      .finally(() => SplashScreen.hideAsync());
  }, []);
  const base = c.scheme === 'dark' ? DarkTheme : DefaultTheme;
  return (
    <QueryClientProvider client={queryClient}>
      <SessionSync />
      <ThemeProvider
        value={{
          ...base,
          colors: {
            ...base.colors,
            primary: c.primary,
            background: c.background,
            card: c.backgroundElement,
            text: c.text,
            border: c.border,
          },
        }}
      >
        <StatusBar style={c.scheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: c.background },
            headerTintColor: c.text,
            contentStyle: { backgroundColor: c.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="page/[id]" options={{ title: '', headerBackTitle: '返回' }} />
          <Stack.Screen name="login" options={{ title: '账号' }} />
          <Stack.Screen name="feed" options={{ title: '动态' }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
