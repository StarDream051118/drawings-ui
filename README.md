<p align="center">
  <img src="title.png" alt="DrawingsUI" />
</p>

<p align="center">
  <em>Minecraft Java 风格的 Vue 3 组件库</em>
</p>

---

## 介绍

DrawingsUI 是一套基于 Vue 3 + TypeScript + SCSS 的 UI 组件库，采用 Minecraft Java 版按钮风格设计，经过取色还原色彩，为 Web 应用开发提供独特的像素风交互体验。

### 特性

- **Minecraft 风格** — 像素质感、立体按钮、按键音效，开箱即用
- **Vue 3 + TypeScript** — 全部 `<script setup>`，类型完整
- **SCSS 主题系统** — CSS 自定义属性实现运行时换肤
- **内置图标** — 12 种 Minecraft 风格 SVG 图标
- **按需引入** — Tree-shakable，只打包使用的组件

## 快速开始

### 安装

```bash
npm install @star-dream051118/drawings-ui
```

需要 Vue `^3.4`（peerDependency）。

### 全量注册（插件方式）

```ts
import { createApp } from 'vue'
import App from './App.vue'
import DrawingsUI from '@star-dream051118/drawings-ui'
import '@star-dream051118/drawings-ui/style.css'

createApp(App).use(DrawingsUI).mount('#app')
```

**导入一次，全局可用** —— `.use(DrawingsUI)` 后所有组件已全局注册，模板里直接写 `<DwButton>` 即可，无需再单独 import。

### 按需引入

```vue
<script setup lang="ts">
import { DwButton } from '@star-dream051118/drawings-ui'
import '@star-dream051118/drawings-ui/style.css'
</script>

<template>
  <DwButton type="primary">提交</DwButton>
</template>
```

> 样式文件 `style.css` 必须引入一次，包含所有组件的样式。

### 字体

组件库使用 Minecraft 像素字体，如需使用请额外引入：

```ts
import '@star-dream051118/drawings-ui/fonts.css'
```

不引入则使用系统默认字体。

### 组件命名

所有组件统一使用 `Dw` 前缀，避免与项目中已有组件重名：

| 组件 | 标签名 |
|------|--------|
| Button | `<DwButton>` |

### 音效

按钮按下时自动播放音效，全局关闭：

```ts
import { useSound } from '@star-dream051118/drawings-ui'

const { setEnabled } = useSound()
setEnabled(false) // 关闭所有按钮音效
```

单个按钮关闭：

```vue
<DwButton :sound="false">无音效</DwButton>
```

### 自定义主题

组件库使用 CSS 自定义属性实现主题，覆盖变量即可换肤：

```css
:root {
  --dw-color-bg: #6F6F6F;
  --dw-color-text: #FFFFFF;
  --dw-color-border: #000000;
}
```

详见 [设计 Token](https://stardream051118.github.io/drawings-ui/guide/design-tokens.html)。

## 许可

MIT
