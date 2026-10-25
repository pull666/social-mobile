import { useSelections } from './selections';
import { toggleSelection } from './selection-policy';
import { useState } from 'react';
import { router } from 'expo-router';
import { View, Switch, Pressable } from 'react-native';
import type { PageNode } from './tree';
import { getPageSpec, pageConfiguration, isAction, isField, isMedia, isToggle } from './page-specs';
import { Screen, Card, Row, Label, Empty, Field, Action } from '@/components/social/ui';
import { ListScreen } from '@/components/social/list-screen';
import { accents, useAppearance, type Accent, type Mode } from '@/features/theme/store';
import { useTheme } from '@/hooks/use-theme';
import { useSession } from '@/stores/session';
import { api } from '@/lib/api';
import { queryClient } from '@/lib/query';
import { roots } from './tree';

const navigate = (item: PageNode) => router.push({ pathname: '/page/[id]', params: { id: item.id } });

export function AppearanceScreen() {
  const { mode, accent, setMode, setAccent } = useAppearance();
  const c = useTheme();
  return (
    <Screen title="外观设置" subtitle="选择外观与主题色，独立组合，即时生效">
      <Card>
        <Label>外观模式</Label>
        {(
          [
            ['system', '跟随系统'],
            ['light', '浅色'],
            ['dark', '深色'],
          ] as [Mode, string][]
        ).map(([value, name]) => (
          <Row key={value} title={`${mode === value ? '✓  ' : ''}${name}`} onPress={() => setMode(value)} />
        ))}
      </Card>
      <Card>
        <Label>主题色</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
          {Object.entries(accents).map(([key, value]) => (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={value.name}
              accessibilityState={{ selected: accent === key }}
              onPress={() => setAccent(key as Accent)}
              style={{
                width: 80,
                alignItems: 'center',
                gap: 8,
                padding: 8,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: accent === key ? c.primary : 'transparent',
              }}
            >
              <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: value[c.scheme] }} />
              <Label>{value.name}</Label>
            </Pressable>
          ))}
        </View>
      </Card>
      <Card>
        <Label>主题预览</Label>
        <Label muted>页面、导航、图标与按钮同步适配。</Label>
        <Action
          title="恢复默认"
          onPress={() => {
            setMode('system');
            setAccent('blue');
          }}
        />
      </Card>
    </Screen>
  );
}

export function PageScreen({ node }: { node: PageNode }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const selectionFields = useSelections((state) => state.fields);
  const [selected, setSelected] = useState<string[]>(() => useSelections.getState().fields[node.id] ?? []);
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const c = useTheme();
  const spec = getPageSpec(node.id)!;
  const config = pageConfiguration[node.id];
  const registerNode = roots[1].children.find((item) => item.title === '注册');
  const forgotNode = roots[1].children
    .find((item) => item.title === '登录')
    ?.children.find((item) => item.title === '忘记密码');
  if (['深色模式', '外观设置'].includes(node.title)) return <AppearanceScreen />;
  const setValue = (key: string, value: string) => setValues((previous) => ({ ...previous, [key]: value }));
  const perform = async (title: string) => {
    if (title === '退出登录') {
      setBusy(true);
      try {
        await api('/auth/logout', { method: 'POST' });
        await useSession.getState().clear();
        queryClient.clear();
        setNotice('已退出登录');
      } catch {
        setNotice('退出失败，请检查网络后重试。');
      } finally {
        setBusy(false);
      }
    } else setNotice(`${title}尚未接入服务，未提交或更改任何数据。`);
  };
  const control = (item: PageNode) => {
    if (!item.children.length && isField(item))
      return (
        <Field
          key={item.id}
          label={item.title}
          value={values[item.id] ?? ''}
          onChange={(value) => setValue(item.id, value)}
          secure={/密码|答案/.test(item.title)}
          multiline={/文字|简介/.test(item.title)}
        />
      );
    if (isToggle(item))
      return (
        <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Label>{item.title}</Label>
          <Switch
            accessibilityLabel={item.title}
            value={values[item.id] === 'yes'}
            onValueChange={(value) => setValue(item.id, value ? 'yes' : 'no')}
            trackColor={{ true: c.primary }}
          />
        </View>
      );
    if (!item.children.length && isAction(item))
      return (
        <Action
          key={item.id}
          title={item.title}
          disabled={busy}
          onPress={() => {
            void perform(item.title);
          }}
        />
      );
    if (!item.children.length && isMedia(item))
      return (
        <Card key={item.id}>
          <Label>{item.title}</Label>
          <Action
            title={`选择${item.title}`}
            onPress={() => setNotice(`${item.title}能力尚未接入，未申请设备权限。`)}
          />
        </Card>
      );
    return (
      <Row
        key={item.id}
        title={item.title}
        subtitle={selectionFields[item.id]
          ?.map((id) => getPageSpec(id)?.node.title)
          .filter(Boolean)
          .join('、')}
        onPress={() => navigate(item)}
      />
    );
  };
  const breadcrumb = spec.path.slice(1, -1).join(' / ');
  const notices = <>{notice ? <Label muted>{notice}</Label> : null}</>;
  if (spec.kind === 'list') {
    const options = node.children;
    return (
      <ListScreen
        title={node.title}
        subtitle={breadcrumb}
        entries={[]}
        onSelect={(entry) => {
          const item = options.find((value) => value.id === entry.id);
          if (item) navigate(item);
        }}
        header={
          <>
            <Field label="搜索" value={search} onChange={setSearch} />
            <Label muted>业务记录尚未接入服务。</Label>
            <Card>{options.map(control)}</Card>
            {notices}
          </>
        }
        emptyDetail={search ? '业务搜索尚未接入。' : '暂无记录，服务接入后显示业务数据。'}
      />
    );
  }
  if (spec.kind === 'choice') {
    const options = node.children.filter((item) => !isAction(item));
    return (
      <Screen title={node.title} subtitle={breadcrumb}>
        <Field label="搜索选项" value={search} onChange={setSearch} />
        <Card>
          {options
            .filter((item) => item.title.includes(search))
            .map((item) => (
              <View key={item.id}>
                {item.children.length ? (
                  <Row title={item.title} onPress={() => navigate(item)} />
                ) : (
                  <Pressable
                    accessibilityRole={config.selectionMode === 'single' ? 'radio' : 'checkbox'}
                    accessibilityState={{ checked: selected.includes(item.id) }}
                    onPress={() => setSelected((previous) => toggleSelection(previous, item.id, config.selectionMode))}
                    style={{ paddingVertical: 14 }}
                  >
                    <Label>
                      {selected.includes(item.id) ? '☑' : '☐'} {item.title}
                    </Label>
                  </Pressable>
                )}
              </View>
            ))}
          {!options.length ? <Empty title="暂无可选数据" /> : null}
        </Card>
        {node.children.filter((item) => isAction(item)).map(control)}
        <Action
          title="确认选择"
          onPress={() => {
            useSelections.getState().save(node.id, selected);
            router.back();
          }}
        />
        {notices}
      </Screen>
    );
  }
  if (spec.kind === 'toggle')
    return (
      <Screen title={node.title} subtitle={breadcrumb}>
        <Card>
          {control(node)}
          <Label muted>可预览开关状态；账号通知与隐私策略尚未保存到服务端。</Label>
        </Card>
      </Screen>
    );
  if (spec.kind === 'media')
    return (
      <Screen title={node.title} subtitle={breadcrumb}>
        <Empty title={`${node.title}预览`} detail="设备权限、上传或名片数据尚未接入。" />
        {node.children.map(control)}
        <Action title={`选择${node.title}`} onPress={() => setNotice('设备能力尚未接入，未申请权限。')} />
        {notices}
      </Screen>
    );
  if (spec.kind === 'action')
    return (
      <Screen title={node.title} subtitle={breadcrumb}>
        <Card>
          <Label>
            {/删除|清空|注销/.test(node.title) ? '此操作可能影响账号或内容，请确认操作范围。' : '请确认本次操作。'}
          </Label>
          <Action
            title={busy ? '处理中…' : `确认${node.title}`}
            disabled={busy}
            onPress={() => {
              void perform(node.title);
            }}
          />
          {notices}
        </Card>
      </Screen>
    );
  return (
    <Screen title={node.title} subtitle={breadcrumb}>
      {spec.kind === 'form' ? <Label muted>填写页面字段。未接入的业务操作不会提交数据。</Label> : null}
      {node.children.length ? (
        <Card>{node.children.map(control)}</Card>
      ) : isField(node) ? (
        <Field label={node.title} value={values.value ?? ''} onChange={(value) => setValue('value', value)} />
      ) : (
        <Empty
          title={node.title}
          detail={node.title === '规则说明' ? '规则内容以服务端与产品最终定义为准。' : '详情数据尚未接入。'}
        />
      )}
      {spec.kind === 'form' && !node.children.some((item) => isAction(item)) ? (
        <Action
          title="保存"
          onPress={() => {
            void perform('保存');
          }}
        />
      ) : null}
      {node.title === '登录' ? (
        <Card>
          <Row title="使用当前后端账号登录" onPress={() => router.push('/login')} />
          {registerNode ? <Row title="注册" onPress={() => navigate(registerNode)} /> : null}
          {forgotNode ? <Row title="忘记密码" onPress={() => navigate(forgotNode)} /> : null}
        </Card>
      ) : null}
      {node.title === '注册' ? (
        <Row
          title="使用当前后端注册接口"
          subtitle="当前接口要求昵称，PDF 中的邀请码与密保流程尚未接入"
          onPress={() => router.push('/login')}
        />
      ) : null}
      {notices}
    </Screen>
  );
}
