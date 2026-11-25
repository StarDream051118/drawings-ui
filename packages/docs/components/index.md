# 组件总览

DrawingsUI 目前包含 5 个组件族，全部以 `Dw` 为前缀。可以按需引入单个组件，也可以用插件方式一次性注册全部组件。

| 组件 | 说明 | 文档 |
|------|------|------|
| Button 按钮 | Minecraft 风格按钮：三种类型、尺寸、图标、自定义配色与点击音效 | [Button 按钮](/components/button) |
| Input 输入框 | 单行输入，内置自绘光标与占位符配色 | [Input 输入框](/components/input) |
| Tooltip 悬浮提示 | 跟随光标的提示框，支持鼠标悬停、键盘聚焦与触屏长按 | [Tooltip 悬浮提示](/components/tooltip) |
| Tabs 标签栏 | 同区域视图切换，支持选中效果、下划线、等宽与铺满 | [Tabs 标签栏](/components/tabs) |
| TabStrip 页签栏 | Minecraft 页签栏，含页签组、内容区与页脚 | [TabStrip 页签栏](/components/tab-strip) |

## 引入方式

```ts
// 全量注册
import DrawingsUI from '@star-dream051118/drawings-ui'
import '@star-dream051118/drawings-ui/style.css'

createApp(App).use(DrawingsUI).mount('#app')
```

```vue
<!-- 按需引入 -->
<script setup lang="ts">
import { DwButton, DwTooltip } from '@star-dream051118/drawings-ui'
import '@star-dream051118/drawings-ui/style.css'
</script>
```

## 配套工具

| 名称 | 说明 |
|------|------|
| `useSound()` | 全局开关按钮音效，`setEnabled(false)` 可一次性关闭 |
| `useIcon()` | 读取内置图标：`getIconSvg(name)` 返回 SVG 字符串，`isBuiltInIcon(name)` 判断是否为内置图标 |

设计 Token、字体与主题定制的说明见 [快速开始](/guide/getting-started) 与 [设计 Token](/guide/design-tokens)。
