import { useLocalSearchParams } from 'expo-router';
import { findPage } from '@/features/navigation/tree';
import { PageScreen } from '@/features/navigation/page-screen';
import { Screen, Empty } from '@/components/social/ui';

export default function DetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const node = findPage(id);
  return node ? (
    <PageScreen key={id} node={node} />
  ) : (
    <Screen title="页面不存在">
      <Empty detail="请返回上一页重新选择。" />
    </Screen>
  );
}
