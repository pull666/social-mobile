import { useTheme } from '@/hooks/use-theme';
import { ThemedText as Text } from '@/components/themed-text';
import { useState } from 'react';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { ActivityIndicator, Button, TextInput, View, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { api, type Page } from '@/lib/api';
import { useSession } from '@/stores/session';

export default function FeedScreen() {
  const c = useTheme();
  const token = useSession((state) => state.token);
  const [body, setBody] = useState('');
  const [notice, setNotice] = useState('');
  const feed = useInfiniteQuery({
    queryKey: ['feed'],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      api<Page>(`/feed?limit=20${pageParam ? `&cursor=${encodeURIComponent(pageParam)}` : ''}`, {
        signal,
      }),
    getNextPageParam: (page) => page.nextCursor ?? undefined,
  });
  const publish = useMutation({
    mutationFn: () => api('/posts', { method: 'POST', body: { body } }),
    onSuccess: () => {
      setBody('');
      setNotice('已提交，审核通过后公开');
    },
  });
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: c.background }]}>
      <FlashList
        data={feed.data?.pages.flatMap((page) => page.items) ?? []}
        keyExtractor={(item) => item.id}
        refreshing={feed.isRefetching}
        onRefresh={() => {
          void feed.refetch();
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>动态</Text>
            {token ? (
              <>
                <TextInput
                  accessibilityLabel="动态内容"
                  style={[styles.input, { backgroundColor: c.backgroundElement, color: c.text }]}
                  placeholderTextColor={c.textSecondary}
                  multiline
                  maxLength={2000}
                  placeholder="分享你的近况"
                  value={body}
                  onChangeText={(value) => {
                    setBody(value);
                    setNotice('');
                    publish.reset();
                  }}
                />
                <Button
                  title={publish.isPending ? '提交中…' : '发布'}
                  disabled={!body.trim() || publish.isPending}
                  onPress={() => publish.mutate()}
                />
              </>
            ) : (
              <Text>在「我的」中登录后即可发布动态</Text>
            )}
            {notice ? <Text>{notice}</Text> : null}
            {publish.error ? <Text accessibilityRole="alert">{publish.error.message}</Text> : null}
          </View>
        }
        ListEmptyComponent={
          feed.isPending ? <ActivityIndicator /> : <Text>{feed.error ? feed.error.message : '还没有公开动态'}</Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: c.backgroundElement }]}>
            <Text style={styles.author}>{item.nickname}</Text>
            <Text>{item.body}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            {feed.hasNextPage ? (
              <Button
                title="加载更多"
                disabled={feed.isFetchingNextPage}
                onPress={() => {
                  void feed.fetchNextPage();
                }}
              />
            ) : null}
            {feed.error && feed.data ? <Text>{feed.error.message}</Text> : null}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb', paddingHorizontal: 20 },
  header: { gap: 12, paddingVertical: 24 },
  title: { fontSize: 28, fontWeight: '700' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    minHeight: 100,
    padding: 16,
    color: '#172033',
  },
  card: { padding: 20, backgroundColor: '#fff', borderRadius: 12, marginBottom: 12, gap: 10 },
  author: { fontWeight: '600' },
  date: { color: '#64748b', fontSize: 12 },
  footer: { paddingBottom: 100 },
});
