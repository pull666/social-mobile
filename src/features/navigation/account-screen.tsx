import { useTheme } from '@/hooks/use-theme';
import { ThemedText as Text } from '@/components/themed-text';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, ScrollView, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, ApiError, type User } from '@/lib/api';
import { queryClient } from '@/lib/query';
import { useSession } from '@/stores/session';

export default function AccountScreen() {
  const c = useTheme();
  const { token, ready } = useSession();
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const me = useQuery({
    queryKey: ['me', token],
    enabled: ready && !!token,
    queryFn: ({ signal }) => api<User>('/auth/me', { signal }),
    retry: false,
  });
  const login = useMutation({
    mutationFn: async () => {
      const result = await api<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: { username, password },
      });
      await useSession.getState().set(result.token, result.user);
      setPassword('');
      queryClient.clear();
    },
  });
  const registration = useMutation({
    mutationFn: () => api('/auth/register', { method: 'POST', body: { username, password, nickname } }),
    onSuccess: () => {
      setRegister(false);
      login.mutate();
    },
  });
  const logout = useMutation({
    mutationFn: async () => {
      try {
        await api('/auth/logout', { method: 'POST' });
      } catch (error) {
        if (!(error instanceof ApiError && error.status === 401)) throw error;
      }
      await useSession.getState().clear();
      queryClient.clear();
    },
  });
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>我的</Text>
        {!ready ? (
          <Text>正在恢复登录…</Text>
        ) : token ? (
          <>
            <Text>{me.data?.nickname ?? '正在读取账号…'}</Text>
            {me.error ? <Text>{me.error.message}</Text> : null}
            <Button
              title="重新读取账号"
              onPress={() => {
                void me.refetch();
              }}
            />
            <Button title="退出登录" disabled={logout.isPending} onPress={() => logout.mutate()} />
            {logout.error ? <Text>{logout.error.message}</Text> : null}
          </>
        ) : (
          <>
            <Text>{register ? '创建账号' : '登录账号'}</Text>
            <TextInput
              style={[styles.input, { backgroundColor: c.backgroundElement, color: c.text }]}
              placeholderTextColor={c.textSecondary}
              accessibilityLabel="账号"
              placeholder="账号：字母、数字或下划线"
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={setUsername}
              maxLength={64}
            />
            {register ? (
              <TextInput
                style={[styles.input, { backgroundColor: c.backgroundElement, color: c.text }]}
                placeholderTextColor={c.textSecondary}
                accessibilityLabel="昵称"
                placeholder="昵称"
                value={nickname}
                onChangeText={setNickname}
                maxLength={64}
              />
            ) : null}
            <TextInput
              style={[styles.input, { backgroundColor: c.backgroundElement, color: c.text }]}
              placeholderTextColor={c.textSecondary}
              accessibilityLabel="密码"
              placeholder="密码，至少 10 个字符"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              maxLength={128}
            />
            <Button
              title={login.isPending || registration.isPending ? '处理中…' : register ? '注册并登录' : '登录'}
              disabled={
                login.isPending ||
                registration.isPending ||
                username.length < 3 ||
                password.length < 10 ||
                (register && !nickname.trim())
              }
              onPress={() => (register ? registration.mutate() : login.mutate())}
            />
            {login.error || registration.error ? (
              <Text accessibilityRole="alert">{(login.error ?? registration.error)?.message}</Text>
            ) : null}
            <Button
              title={register ? '已有账号，去登录' : '创建新账号'}
              onPress={() => {
                setRegister(!register);
                registration.reset();
                login.reset();
              }}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 24, paddingBottom: 100, gap: 16 },
  title: { fontSize: 28, fontWeight: '700' },
  input: { padding: 16, borderRadius: 12, backgroundColor: '#fff', color: '#172033' },
});
