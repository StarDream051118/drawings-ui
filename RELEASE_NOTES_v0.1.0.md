# v0.1.0 更新说明（对比 0.0.4）

> 2026-11-26 · `@star-dream051118/drawings-ui@0.1.0`

从「只有 Button」升级为包含 5 个组件族的完整组件库。

## 组件对比

| 组件 | 0.0.4 | 0.1.0 |
|------|:-----:|:-----:|
| Button | ✅ | ✅（`size` 新增数字宽度） |
| Input | — | ✅ 自绘光标、placeholder 配色 |
| Tabs / DwTabButton | — | ✅ 两种选中效果、等宽、铺满 |
| TabStrip 系列 | — | ✅ 背景图、页脚、禁用、键盘导航 |
| Tooltip | — | ✅ 跟随光标、键盘/触屏、`max-length` |

## 重点变化

- **Tooltip**：无包裹渲染、`max-length` 字符截断（`content` prop 与动态插槽都支持）、键盘 `Tab` 聚焦、触屏长按
- **样式**：新增 `tokens.css` 独立导出；字体由 `ttf` 改为 `woff2`
- **修复**：Tooltip 聚焦/窗口缩放/输入框内部滚动导致的漂移与隐藏；Tabs / TabStrip 溢出裁切；右键音效
- **工程**：补齐 `publishConfig`、`prepublishOnly`、`sideEffects` 等发布配置

## 升级

```bash
npm i @star-dream051118/drawings-ui@0.1.0
```

```ts
import '@star-dream051118/drawings-ui/style.css'
import '@star-dream051118/drawings-ui/fonts.css' // 可选：像素字体
```

原有 Button 用法不变。完整条目见 [CHANGELOG.md](./CHANGELOG.md)。
