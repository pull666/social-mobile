import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../src/features/navigation/selection-policy.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { toggleSelection } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const tree = JSON.parse(readFileSync(new URL('../src/features/navigation/page-tree.json', import.meta.url)));
const config = JSON.parse(readFileSync(new URL('../src/features/navigation/page-config.json', import.meta.url)));
test('every PDF node has explicit configuration; privacy choices are single-select', () => {
  let count = 0;
  const visit = (node) => {
    count++;
    assert.ok(config[node.id], node.id);
    if (['语音通话', '群组和频道', '展示范围'].includes(node.title))
      assert.equal(config[node.id].selectionMode, 'single');
    if (node.title === '添加好友' && node.children.some((child) => child.title === '搜索账号/手机号'))
      assert.equal(config[node.id].kind, 'form');
    node.children.forEach(visit);
  };
  tree.forEach(visit);
  assert.equal(count, 336);
});
test('single selections replace previous values; multiple selections toggle independently', () => {
  assert.deepEqual(toggleSelection(['everyone'], 'friends', 'single'), ['friends']);
  assert.deepEqual(toggleSelection(['a'], 'b', 'multiple'), ['a', 'b']);
  assert.deepEqual(toggleSelection(['a', 'b'], 'a', 'multiple'), ['b']);
});
