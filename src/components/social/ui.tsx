import { type ReactNode } from 'react';
import { ScrollView, View, Text, Pressable, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useTheme } from '@/hooks/use-theme';

export function Screen({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  const c = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.background }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
        <View style={styles.heading}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: c.text }]}>{title}</Text>
            {subtitle ? <Text style={{ color: c.textSecondary, marginTop: 8 }}>{subtitle}</Text> : null}
          </View>
          {action}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children }: { children: ReactNode }) {
  const c = useTheme();
  return <View style={[styles.card, { backgroundColor: c.backgroundElement }]}>{children}</View>;
}

export function Label({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  const c = useTheme();
  return <Text style={{ color: muted ? c.textSecondary : c.text, fontSize: 15, lineHeight: 24 }}>{children}</Text>;
}

export function Action({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const c = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, { backgroundColor: c.primary, opacity: disabled ? 0.5 : 1 }]}
    >
      <Text style={{ color: c.onPrimary, fontWeight: '600' }}>{title}</Text>
    </Pressable>
  );
}

export function Row({ title, subtitle, onPress }: { title: string; subtitle?: string; onPress: () => void }) {
  const c = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.row, { borderBottomColor: c.border }]}>
      <View style={{ flex: 1 }}>
        <Label>{title}</Label>
        {subtitle ? <Label muted>{subtitle}</Label> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={c.textSecondary} />
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChange,
  secure = false,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  secure?: boolean;
  multiline?: boolean;
}) {
  const c = useTheme();
  return (
    <View style={{ gap: 8 }}>
      <Label>{label}</Label>
      <TextInput
        accessibilityLabel={label}
        placeholder={label}
        placeholderTextColor={c.textSecondary}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        multiline={multiline}
        autoCapitalize="none"
        style={[
          styles.field,
          {
            backgroundColor: c.backgroundElement,
            color: c.text,
            borderColor: c.border,
            minHeight: multiline ? 120 : 48,
          },
        ]}
      />
    </View>
  );
}

export function Empty({
  title = '暂无内容',
  detail = '此功能尚未接入服务，接入后将在这里显示数据。',
}: {
  title?: string;
  detail?: string;
}) {
  const c = useTheme();
  return (
    <View style={styles.empty}>
      <Ionicons name="albums-outline" size={36} color={c.primary} />
      <Label>{title}</Label>
      <Label muted>{detail}</Label>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 24, paddingBottom: 48, gap: 20, maxWidth: 720, width: '100%', alignSelf: 'center' },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 8 },
  title: { fontSize: 30, fontWeight: '700' },
  card: { padding: 18, borderRadius: 20, gap: 12 },
  button: { padding: 15, borderRadius: 14, alignItems: 'center' },
  row: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  field: { padding: 14, borderRadius: 14, borderWidth: 1 },
  empty: { padding: 32, alignItems: 'center', gap: 12 },
});
