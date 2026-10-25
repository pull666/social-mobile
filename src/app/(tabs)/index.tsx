import { useState } from 'react';
import { router } from 'expo-router';
import { View, Pressable, Text } from 'react-native';
import { Empty, Field } from '@/components/social/ui';
import { ListScreen } from '@/components/social/list-screen';
import { tabs } from '@/features/navigation/tree';
import { useTheme } from '@/hooks/use-theme';

export default function Messages() {
  const c = useTheme();
  const [category, setCategory] = useState('全部');
  const [search, setSearch] = useState('');
  return (
    <ListScreen
      title="信息"
      subtitle="连接朋友，记录每一次交流"
      entries={tabs[0].children
        .filter((node) => !['聊天分类', '搜索'].includes(node.title))
        .map((node) => ({ id: node.id, title: node.title }))}
      onSelect={(node) => router.push({ pathname: '/page/[id]', params: { id: node.id } })}
      header={
        <>
          <Field label="搜索消息或联系人" value={search} onChange={setSearch} />
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {['全部', '未读', '单聊', '群聊', '频道'].map((title) => (
              <Pressable
                key={title}
                accessibilityRole="button"
                onPress={() => setCategory(title)}
                style={{
                  padding: 10,
                  borderRadius: 14,
                  backgroundColor: category === title ? c.primary : c.backgroundElement,
                }}
              >
                <Text style={{ color: category === title ? c.onPrimary : c.text }}>{title}</Text>
              </Pressable>
            ))}
          </View>
          <Empty
            title={search ? '没有匹配的消息' : `暂无${category === '全部' ? '' : category}消息`}
            detail="聊天将在 OpenIM 接入后启用。"
          />
        </>
      }
    />
  );
}
