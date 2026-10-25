import { type ReactNode } from 'react';
import { View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { Empty, Row } from './ui';

export interface ListEntry {
  id: string;
  title: string;
  subtitle?: string;
}

// A list owns its scroll container. Never wrap FlashList in a vertical ScrollView.
export function ListScreen({
  title,
  subtitle,
  entries,
  onSelect,
  header,
  emptyDetail,
}: {
  title: string;
  subtitle?: string;
  entries: ListEntry[];
  onSelect: (item: ListEntry) => void;
  header?: ReactNode;
  emptyDetail?: string;
}) {
  const c = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top', 'left', 'right']}>
      <FlashList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 24 }}>
            <Row title={item.title} subtitle={item.subtitle} onPress={() => onSelect(item)} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListHeaderComponent={
          <View style={{ padding: 24, gap: 16 }}>
            <Text style={{ fontSize: 30, fontWeight: '700', color: c.text }}>{title}</Text>
            {subtitle ? <Text style={{ color: c.textSecondary }}>{subtitle}</Text> : null}
            {header}
          </View>
        }
        ListEmptyComponent={<Empty detail={emptyDetail} />}
      />
    </SafeAreaView>
  );
}
