# 快速开始

## 安装

```bash
npm install drawings-ui
```

需要 Vue `^3.4`（peerDependency）。

## 全量注册（插件方式）

```ts
import { createApp } from 'vue'
import App from './App.vue'
import DrawingsUI from 'drawings-ui'
import 'drawings-ui/dist/style.css'

createApp(App).use(DrawingsUI).mount('#app')
```

**导入一次，全局可用** —— `.use(DrawingsUI)` 后所有组件已全局注册，模板里直接写 `<DwButton>` 即可，无需再单独 import。

## 按需引入

```vue
<script setup lang="ts">
import { DwButton } from 'drawings-ui'
import 'drawings-ui/dist/style.css'
</script>

<template>
  <DwButton type="primary">提交</DwButton>
</template>
```

::: tip
样式文件 `style.css` 必须引入一次，包含所有组件的样式。
:::

## 组件命名

所有组件统一使用 `Dw` 前缀，避免与项目中已有组件重名：

| 组件 | 标签名 |
|------|--------|
| Button | `<DwButton>` |

## 音效

按钮按下时自动播放音效，全局关闭：

```ts
import { useSound } from 'drawings-ui'

const { setEnabled } = useSound()
setEnabled(false) // 关闭所有按钮音效
```

单个按钮关闭：

```vue
<DwButton :sound="false">无音效</DwButton>
```

## 自定义主题

组件库使用 CSS 自定义属性实现主题，覆盖变量即可换肤：

```css
:root {
  --dw-color-bg: #6F6F6F;
  --dw-color-text: #FFFFFF;
  --dw-color-border: #000000;
}
```

详见 [设计 Token](/guide/design-tokens)。
