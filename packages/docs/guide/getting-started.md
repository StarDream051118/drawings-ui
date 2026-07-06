# 快速开始

## 安装

```bash
npm install @drawings-ui/components
```

需要 Vue `^3.4`（peerDependency）。

## 全量注册（插件方式）

```ts
import { createApp } from 'vue'
import App from './App.vue'
import DrawingsUI from '@drawings-ui/components'
import '@drawings-ui/components/dist/style.css'

createApp(App).use(DrawingsUI).mount('#app')
```

**导入一次，全局可用** —— `.use(DrawingsUI)` 后所有组件已全局注册，模板里直接写 `<DwButton>` 即可，无需再单独 import。

## 按需引入

```vue
<script setup lang="ts">
import { DwButton } from '@drawings-ui/components'
import '@drawings-ui/components/dist/style.css'
</script>

<template>
  <DwButton type="primary">提交</DwButton>
</template>
```

::: tip
样式文件 `style.css` 必须引入一次，包含所有组件的样式。
:::

## 组件命名

所有组件统一使用 `Ui` 前缀，避免与项目中已有组件重名：

| 组件 | 标签名 |
|------|--------|
| Button | `<DwButton>` |
| Input | `<UiInput>` |
| Dialog | `<UiDialog>` |

## 自定义主题

组件库使用 CSS 自定义属性实现主题，覆盖变量即可换肤：

```css
:root {
  --ui-color-primary: #4A90D9;
  --ui-color-success: #52C41A;
  --ui-color-danger: #FF4D4F;
  --ui-radius-base: 6px;
}
```

详见 [设计 Token](/guide/design-tokens)。
