# Tooltip 悬浮提示

替代原生 `title` 的悬浮提示：黑底、无边框、无圆角的素框，显示在鼠标光标的对角方向并持续跟随。

触发方式：

- **鼠标**：光标进入触发元素内显示，离开立即隐藏，提示持续跟随光标。
- **键盘**：`Tab` 聚焦触发元素时显示（仅 `:focus-visible`，鼠标点击导致的聚焦不弹出），没有光标时以元素右下角为锚点，失焦隐藏。
- **触屏**：默认不触发；开启 `touch` 后长按 `touch-delay` 毫秒显示，点击提示外区域关闭。

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

- 鼠标在触发元素内移动时提示**持续跟随**，与光标保持 `--dw-tooltip-gap`（默认 12px）的距离，不遮挡光标。
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

- 鼠标离开触发元素立即隐藏；`Escape` 也可立即隐藏。
- 窗口滚动、失焦时自动隐藏，避免提示停留在错误位置。
- `disabled` 可单独关闭某条提示。

## 无包裹渲染

默认插槽是**单一元素根节点**时，`DwTooltip` 不会额外生成包裹层，而是把事件监听与 `aria-describedby` 直接注入该元素：

```vue
<DwTooltip content="宽度按 100% 生效">
  <DwInput v-model="name" style="width: 100%" />
</DwTooltip>
```

因此 `width: 100%`、flex/grid 布局都按元素原本的规则生效；触发元素上始终带有 `aria-describedby`，指向常驻 DOM 的提示框（`v-show` 控制显隐）。

限制：

- **单一根节点**：多根节点或纯文本无法注入属性，会自动回退为 `<span class="dw-tooltip-trigger">` 包裹层，并在控制台打印一次提示。回退时传给 `DwTooltip` 的 `class` 落在这个包裹层上，内部元素需自行设置宽度。
- **disabled 触发器**：原生 `disabled` 的按钮不派发鼠标/指针事件，提示不会显示；可在外层再包一个元素或改用未被禁用的触发器。
- **祖先 transform**：提示框 `Teleport` 到 `body` 并使用 `position: fixed`；若祖先元素带 `transform` / `filter` / `perspective`，部分浏览器会改变 `fixed` 的参照系，导致定位偏移。
- **键盘 / 触屏**：键盘依赖 `:focus-visible`，触屏需显式开启 `touch`；两者都以元素边角而非光标为锚点。

## API

### DwTooltip Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `content` | 提示文字，支持 `\n` 换行；有 `content` 插槽时以插槽为准 | `string` | `''` |
| `placement` | 优先方位 | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` |
| `show-delay` | 显示延迟（ms） | `number` | `0` |
| `hide-delay` | 隐藏延迟（ms） | `number` | `0` |
| `disabled` | 是否禁用提示 | `boolean` | `false` |
| `touch` | 是否启用触屏长按显示 | `boolean` | `false` |
| `touch-delay` | 触屏长按触发时长（ms） | `number` | `500` |

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
