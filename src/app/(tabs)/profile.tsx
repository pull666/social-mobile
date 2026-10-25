import { router } from 'expo-router';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Card, Row, Label, Action } from '@/components/social/ui';
import { ListScreen } from '@/components/social/list-screen';
import { tabs } from '@/features/navigation/tree';
import { useSession } from '@/stores/session';
import { useTheme } from '@/hooks/use-theme';

export default function Profile() {
  const { user, token, ready } = useSession();
  const c = useTheme();
  return (
    <ListScreen
      title="我的"
      subtitle="你的资料、内容与个性化设置"
      entries={tabs[4].children.map((node) => ({ id: node.id, title: node.title }))}
      onSelect={(node) => router.push({ pathname: '/page/[id]', params: { id: node.id } })}
      header={
        <>
          <Card>
            <Ionicons name="person-circle-outline" size={56} color={c.primary} />
            <Label>{user?.nickname ?? (!ready ? '正在恢复登录…' : token ? '正在读取账号…' : '欢迎来到 Social')}</Label>
            <Label muted>{user?.username ?? '登录后管理你的账号与内容'}</Label>
            <Action title={token ? '账号与退出登录' : '登录 / 注册'} onPress={() => router.push('/login')} />
          </Card>
          <Card>
            <Row title="公开动态" subtitle="查看已审核动态，发布文字内容" onPress={() => router.push('/feed')} />
          </Card>
        </>
      }
    />
  );
}
