# Tooltip 悬浮提示

替代原生 `title` 的悬浮提示：黑底、无边框、无圆角的素框，显示在鼠标光标的对角方向并持续跟随。只有鼠标光标进入包裹范围才会触发，这是唯一的触发条件。

## 基础用法

<tooltip-demos-basic />

```vue
<template>
  <DwTooltip content="点击创建一个新的世界">
    <DwButton>创建新的世界</DwButton>
  </DwTooltip>

  <DwTooltip content="世界名称：修改后回车确认">
    <DwInput v-model="name" />
  </DwTooltip>
</template>
```

## 方位与跟随

`placement` 是对角优先方位，默认 `bottom-right`：

| 值 | 位置 |
|----|------|
| `bottom-right`（默认） | 光标右下 |
| `bottom-left` | 光标左下 |
| `top-right` | 光标右上 |
| `top-left` | 光标左上 |

- 鼠标在包裹元素内移动时提示**持续跟随**，与光标保持 `--dw-tooltip-gap`（默认 12px）的距离，不遮挡光标。
- 越界时**按轴翻转**，另一轴保持配置方向：

| 配置 | 越界 | 结果 |
|------|------|------|
| `bottom-right` | 右侧 | `bottom-left` |
| `top-right` | 上侧 | `bottom-right` |
| `bottom-left` | 左侧 | `bottom-right` |
| `top-left` | 上侧 | `bottom-left` |

翻转后仍越界会夹紧到视口内；提示框 `pointer-events: none`，不会挡住鼠标操作。

提示框**不自动换行**：只有 `content` 里的 `\n` 会换行。碰到屏幕边缘时不会压缩或折行，而是整体放到光标另一侧（右侧 ↔ 左侧、下侧 ↔ 上侧）。

## 延迟

`show-delay` / `hide-delay` 单位为毫秒，默认都是 `0`（立即显示/隐藏）：

```vue
<DwTooltip content="200ms 后显示" :show-delay="200">
  <DwButton>延迟提示</DwButton>
</DwTooltip>
```

## 隐藏与禁用

- 鼠标离开包裹范围立即隐藏；`Escape` 也可立即隐藏。
- 窗口滚动、失焦时自动隐藏，避免提示停留在错误位置。
- `disabled` 可单独关闭某条提示。
- 触摸端不触发（与原生 `title` 一致）。

## API

### DwTooltip Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `content` | 提示文字，支持 `\n` 换行；有 `content` 插槽时以插槽为准 | `string` | `''` |
| `placement` | 优先方位 | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` |
| `show-delay` | 显示延迟（ms） | `number` | `0` |
| `hide-delay` | 隐藏延迟（ms） | `number` | `0` |
| `disabled` | 是否禁用提示 | `boolean` | `false` |

### DwTooltip Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 触发元素（按钮、输入框、图标等） |
| `content` | 富文本提示内容，优先于 `content` prop |

### DwTooltip Events

无。

## 设计 Token

| Token | 默认值 | 说明 |
|-------|--------|------|
| `--dw-color-tooltip-bg` | `#000000` | 提示框背景 |
| `--dw-color-tooltip-text` | `#FFFFFF` | 提示文字颜色 |
| `--dw-tooltip-gap` | `12px` | 与光标的间距 |
| `--dw-tooltip-z-index` | `9999` | 层级 |
