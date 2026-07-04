# Button 按钮

按钮用于触发一个即时操作。

## 基础用法

<button-demos-basic />

::: details 查看代码
```vue
<script setup lang="ts">
import { UiButton } from '@drawings-ui/components'
</script>

<template>
  <UiButton>默认按钮</UiButton>
  <UiButton type="primary">主要按钮</UiButton>
  <UiButton type="success">成功按钮</UiButton>
  <UiButton type="danger">危险按钮</UiButton>
</template>
```
:::

## 按钮尺寸

<button-demos-size />

::: details 查看代码
```vue
<template>
  <UiButton size="small">小号</UiButton>
  <UiButton>中号</UiButton>
  <UiButton size="large">大号</UiButton>
</template>
```
:::

## 禁用状态

<button-demos-disabled />

::: details 查看代码
```vue
<template>
  <UiButton disabled>禁用</UiButton>
  <UiButton type="primary" disabled>禁用</UiButton>
</template>
```
:::

## 加载状态

<button-demos-loading />

::: details 查看代码
```vue
<template>
  <UiButton loading>加载中</UiButton>
  <UiButton type="primary" loading>加载中</UiButton>
</template>
```
:::

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `type` | 按钮类型 | `'default' \| 'primary' \| 'success' \| 'danger'` | `'default'` |
| `size` | 按钮尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `loading` | 是否加载中 | `boolean` | `false` |

### Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 按钮内容 |

### Events

暂无自定义事件。

## 设计 Token

按钮使用以下 CSS 自定义属性，可通过覆盖变量自定义样式：

| Token | 说明 |
|-------|------|
| `--ui-color-primary` | 主色（primary 按钮背景） |
| `--ui-color-success` | 成功色 |
| `--ui-color-danger` | 危险色 |
| `--ui-radius-base` | 按钮圆角 |
| `--ui-font-size-base` | 按钮字号 |
