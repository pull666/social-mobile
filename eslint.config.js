// Expo's SDK-compatible flat config; Prettier handles formatting separately.
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier/flat');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = defineConfig([
  { ignores: ['dist/**', 'coverage/**', '.expo/**', 'android/**', 'ios/**'] },
  expoConfig,
  prettier,
  {
    plugins: { '@stylistic': stylistic.default ?? stylistic },
    rules: {
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'function', next: '*' },
        { blankLine: 'always', prev: '*', next: 'export' },
        { blankLine: 'always', prev: 'export', next: '*' },
      ],
    },
  },
]);
