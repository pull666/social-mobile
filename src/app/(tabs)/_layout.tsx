import { Tabs } from 'expo-router';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '@/hooks/use-theme';
const items = [
  { name: 'index', title: '信息', icon: 'chatbubbles-outline' },
  { name: 'contacts', title: '联系人', icon: 'people-outline' },
  { name: 'circles', title: '圈子', icon: 'planet-outline' },
  { name: 'discover', title: '发现', icon: 'compass-outline' },
  { name: 'profile', title: '我的', icon: 'person-outline' },
] as const;

export default function TabLayout() {
  const c = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.textSecondary,
        tabBarStyle: { backgroundColor: c.background, borderTopColor: c.border },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      {items.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={item.icon} color={typeof color === 'string' ? color : c.primary} size={size} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
