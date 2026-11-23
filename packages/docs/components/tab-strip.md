# TabStrip 页签栏

`TabStrip` 是 Minecraft 风格的页签栏：未选中的页签像贴在内容区上的标签，选中页签向下延伸，与内容区**无缝衔接**。整条描边由一个线元素统一绘制，选中页签所在区间用渐变硬停点挖空。

这一族有两个组件：

- `DwTabStrip`：完整页签栏，内部直接使用 `DwTabStripGroup`，额外提供背景图、蒙版、模糊和内容区。
- `DwTabStripGroup`：只有页签和描边线，适合自己接管内容区，或嵌在别的容器里。

## 基础用法

`items` 决定页签的数量和顺序，`v-model` 绑定选中的 `value`。

<tab-strip-demos-basic />

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DwTabStrip } from '@star-dream051118/drawings-ui'

const tabs = [
  { value: 'game', label: '游戏' },
  { value: 'world', label: '世界' },
  { value: 'more', label: '更多' },
]
const active = ref('world')
</script>

<template>
  <DwTabStrip v-model="active" :items="tabs" :content-height="200">
    内容区域
  </DwTabStrip>
</template>
```

::: tip
`v-model` 绑定的是 `item.value`，同一条栏内必须唯一。不传 `v-model` 时默认选中第一项。
:::

## 页签宽度

`size` 是**单个页签的宽度**（px），整条栏等长排列。默认 `300`，与 `--dw-width-xl` 一致。

<tab-strip-demos-group />

```vue
<template>
  <DwTabStripGroup v-model="active" :items="tabs" :size="180" />
</template>
```

页签始终保持固定宽度（`flex: none`），窗口变窄时不会收缩 —— 线元素的挖洞位置依赖这个固定宽度，收缩会导致断口错位。

## 背景与蒙版

`bgImage` 铺背景图，`bgColor` 是压在图上的蒙版色，`bgBlur` 是背景模糊程度（px，默认 `3`）。

<tab-strip-demos-background />

```vue
<template>
  <DwTabStrip
    v-model="active"
    :items="tabs"
    :bg-image="bgImage"
    bg-color="rgba(0, 0, 0, 0.25)"
    :bg-blur="3"
    :content-height="200"
  >
    内容区域
  </DwTabStrip>
</template>
```

::: tip
只有传了 `bgImage` 或 `bgColor` 才会铺蒙版层。都不传时组件不创建这一层，避免默认状态下把页面背景也模糊掉。

`bgColor` 接受任意 CSS 颜色：`red`、`rgb(0 0 0 / 25%)`、`rgba(0, 0, 0, .25)`、`hsl(220 40% 20%)`、`#000000`。
:::

## 内容高度

`contentHeight` 控制内容区高度：数字按 px 处理，字符串原样透传（如 `'50vh'`）。不传时高度由插槽内容撑开。

```vue
<template>
  <DwTabStrip v-model="active" :items="tabs" :content-height="240">...</DwTabStrip>
  <DwTabStrip v-model="active" :items="tabs" content-height="40vh">...</DwTabStrip>
</template>
```

## 单独使用 DwTabStripGroup

如果内容区已经有自己的容器和背景，直接用 `DwTabStripGroup` 即可。

```vue
<template>
  <DwTabStripGroup v-model="active" :items="tabs" :size="180" />
</template>
```

::: warning
选中页签的底色由 `content-color` 决定，必须和它下方内容区的底色**完全一致**（包括透明度），否则衔接处会露出色差。`DwTabStrip` 会自动把 `content-color` 同时应用到内容区和选中页签；单独用 `DwTabStripGroup` 时需要自己保证两者一致。
:::

## 键盘操作

遵循 WAI-ARIA 的 tablist 模式：

- `←` / `→` 在页签间循环移动，`Home` / `End` 跳到首尾
- 只有选中项 `tabindex="0"`，其余为 `-1`（roving tabindex）

## API

### DwTabStrip Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `items` | 页签数据，顺序即显示顺序 | `TabStripItem[]` | — |
| `modelValue` | 当前选中页签的 `value`，支持 `v-model` | `string \| number` | — |
| `size` | 单个页签宽度（px） | `number` | `300` |
| `color` | 页签文字颜色 | `string` | `--dw-color-text` |
| `icon` | 整条栏的默认图标，可被 `item.icon` 覆盖 | `string` | — |
| `tab-bg-color` | 未选中页签的底色 | `string` | `--dw-color-tabstrip-bg` |
| `content-color` | 内容区底色，同时作为选中页签底色 | `string` | `--dw-color-tabstrip-content` |
| `sound` | 是否播放点击音效 | `boolean` | `true` |
| `bg-image` | 背景图片地址 | `string` | `''` |
| `bg-color` | 背景蒙版色，支持任意 CSS 颜色 | `string` | `''` |
| `bg-blur` | 背景模糊程度（px） | `number` | `3` |
| `content-height` | 内容区高度，数字按 px 处理 | `number \| string` | — |

### DwTabStrip Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `update:modelValue` | 选中项变化 | `value: string \| number` |
| `change` | 选中项变化（语义化别名） | `value: string \| number` |

### DwTabStrip Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 内容区 |

### DwTabStripGroup Props

`DwTabStrip` 的 `items` / `modelValue` / `size` / `color` / `icon` / `sound` / `content-color` 在这里含义相同，另外：

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `bg-color` | 未选中页签的底色 | `string` | `--dw-color-tabstrip-bg` |

### TabStripItem

| 字段 | 说明 | 类型 | 必填 |
|------|------|------|------|
| `value` | 唯一标识，与 `v-model` 比对 | `string \| number` | 是 |
| `label` | 页签文字 | `string` | 是 |
| `icon` | 单个页签的图标（内置图标名或图片 URL） | `string` | 否 |

## 设计 Token

页签使用以下 CSS 自定义属性，可通过覆盖变量自定义样式：

| Token | 默认值 | 说明 |
|-------|--------|------|
| `--dw-tabstrip-gap` | `6px` | 页签之间的缝隙 |
| `--dw-tabstrip-tab-width` | `300px` | 单个页签宽度（会被 `size` 覆盖） |
| `--dw-tabstrip-tab-height` | `40px` | 未选中页签高度 |
| `--dw-tabstrip-tab-height-selected` | `55px` | 选中页签高度 |
| `--dw-tabstrip-line-height` | `6px` | 描边线高度（3px 高光 + 3px 实色） |
| `--dw-tabstrip-blur` | `3px` | 背景模糊程度（会被 `bg-blur` 覆盖） |
| `--dw-color-tabstrip-bg` | `rgba(0, 0, 0, 0.9)` | 未选中页签底色 / 描边线实色 |
| `--dw-color-tabstrip-content` | `rgba(0, 0, 0, 0.3)` | 内容区与选中页签底色 |
| `--dw-color-tabstrip-highlight` | `rgba(255, 255, 255, 0.2)` | 高光描边色 |
| `--dw-color-border-active` | `#FFFFFF` | hover / 选中页签的白色描边 |
