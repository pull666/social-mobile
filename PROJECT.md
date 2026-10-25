# Social Mobile

官方 Expo Router 模板。`npm ci`，`npm start`，`npx tsc --noEmit`。真机 API 地址改为电脑局域网 IP。后续接入 IM、支付与推送需要 Development Build，不能仅依赖 Expo Go。当前 SDK 接入与原生构建未验证。EXPO_PUBLIC 变量会暴露到客户端，不得包含密钥。

移动端依赖遵循最新 Expo 官方模板，不单独升级 TypeScript、React 或原生库，沿用 Expo 配套 ESLint，并由 Prettier 负责格式化。当前模板 TypeScript 为 ~6.0.3。

## React 官方规范

所有组件和自定义 Hook 必须遵循 [React 官方规则](https://zh-hans.react.dev/reference/rules)。以下为项目执行摘要，具体语义以官方文档为准。

### 组件与 Hook 必须保持纯粹

- 渲染应具有幂等性：相同的 props、state 和 context 应产生相同结果。不要在渲染中调用影响结果的 `Date.now()`、`Math.random()`，或修改外部共享状态。
- 副作用放在事件处理函数或 Effect 中，不在渲染期间发请求、写存储、操作订阅或更新其他组件状态。Effect 应处理依赖、清理与重复执行。
- Props 和 state 是不可变快照，通过状态更新函数产生新值，不直接修改对象或数组。
- Hook 的参数和返回值不可直接修改；值传入 JSX 后，不再修改用于该次渲染的值。

### React 调用组件与 Hook

- 通过 JSX 使用组件，不把组件函数当作普通函数调用。
- 不把 Hook 作为普通值动态传递、替换或注入。组件和自定义 Hook 保持静态、清晰的调用结构。
- 组件定义放在模块作用域，避免在其他组件的渲染函数内定义组件，导致身份变化和状态重置。

### Hooks 规则

- 普通 Hook 只能在函数组件或自定义 Hook 的顶层调用，不能在条件、循环、事件回调、嵌套函数或提前返回之后调用。
- 自定义 Hook 使用 `use` 前缀；普通工具函数不得通过调用 Hook 隐藏 React 生命周期依赖。
- `useEffect`、`useMemo`、`useCallback` 等依赖列表包含所引用的响应式值，不通过禁用规则隐藏缺失依赖。
- React 的 `use` API 有特定例外：可在条件与循环中调用，但必须位于组件或 Hook 内，不能放进 `try/catch`。其他 Hook 不能套用这一例外。

### 自动检查与代码审查

Expo ESLint 已启用 `eslint-plugin-react-hooks` 的推荐规则，包括 Hooks 调用、依赖、纯粹性、不可变性、refs、渲染时状态更新和静态组件等检查。React Compiler 已启用；编译器可能跳过不符合条件的代码，不能将成功构建视为所有组件已优化。

优先编写清晰的组件和 Hook，不为每个函数或值机械添加 `useMemo`、`useCallback`；保留确有用途的手动记忆化。不要用关闭 lint 或关闭 Compiler 的方式掩盖规则违规；特殊情况必须写明原因并审查。

完成修改后运行 `npm run check`。依赖警告也应检查并解决。静态检查不能证明所有 React 规则成立，仍需审查副作用、异步竞态、清理、引用共享和运行行为。

## 本地偏好存储

主题偏好使用 react-native-mmkv V4 与 Nitro Modules，Zustand persist 通过同步适配器读写。不迁移旧版主题记录，未保存 MMKV 偏好的安装使用默认主题；登录 Token 继续使用 SecureStore。Web 使用 MMKV 官方 Web 实现。

MMKV 不包含在 Expo Go 中。原生调试需要重新构建 Development Build，例如 `npx expo run:ios` 或 `npx expo run:android`；原生工程通过 Expo 生成，不手工维护。当前原生兼容性与迁移尚待设备验证。

## 图标

采用 Expo 推荐的 `@react-native-vector-icons/ionicons` 独立图标包，使用默认入口动态加载字体，沿用现有 `expo-font`。不使用 `@expo/vector-icons` 或旧的 `react-native-vector-icons`。动态字体已通过 Metro 作为资源打包，排除 Ionicons 原生自动链接，避免同一字体重复打包；不向 expo-font 插件手动添加该字体。

参考：https://expo.dev/blog/moving-away-from-expo-vector-icons
