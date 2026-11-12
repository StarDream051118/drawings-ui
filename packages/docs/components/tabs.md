# Tabs 标签栏

横向排列的标签栏，用于在同一区域的不同视图之间切换。标签本体复用 Button 的 Minecraft 皮肤（[skin.scss](https://github.com/StarDream051118/drawings-ui/blob/main/packages/components/src/styles/skin.scss)），因此配色、描边、立体阴影与按钮完全一致。

## 基础用法

通过 `labels` 传入每个标签的文字，`v-model` 绑定当前选中项索引：

<tabs-demos-basic />

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs } from '@star-dream051118/drawings-ui'

const active = ref(0)
</script>

<template>
  <DwTabs v-model="active" :labels="['首页', '设置', '状态', '关于']" />
</template>
```

## 选中效果

`active-effect` 决定选中标签长什么样，两个取值：

| 值 | 表现 |
|----|------|
| `border`（默认） | 只把描边高亮成 `--dw-color-border-active`，和 hover 完全一致，靠「当前项没有 `--active` 按下反馈」区分 |
| `pressed` | 借用 Button 禁用态的深色底 + 去掉立体投影，像被按住不放，文字仍为白色 |

<tabs-demos-active-effect />

```vue
<template>
  <DwTabs v-model="borderActive" :labels="['描边式', '默认效果']" active-effect="border" />
  <DwTabs v-model="pressedActive" :labels="['按压式', '深底效果']" active-effect="pressed" />
</template>
```

::: tip
`pressed` 取的是各类型对应的深色底（`--dw-color-bg-active`、`--dw-color-bg-primary-active`、`--dw-color-bg-danger-active`），与 `border` 式相比多了一层「凹陷」的语义，适合和页面背景色接近、只靠描边看不出区别的场景。
:::

## 数量与内容

三种方式决定 Tab 的数量与文字，优先级从高到低：

1. `#tab` 插槽（作用域参数 `index`、`active`）
2. `labels` 数组
3. `count` 数字（没有文字时用来占位）

```vue
<template>
  <!-- 3 个标签，内容由插槽决定 -->
  <DwTabs v-model="active" :count="3">
    <template #tab="{ index }">标签 {{ index + 1 }}</template>
  </DwTabs>

  <!-- 文字由数组决定，count 被忽略 -->
  <DwTabs v-model="active" :labels="['甲', '乙']" :count="9" />
</template>
```

## 尺寸

`size` 与 Button 保持一致的字符串档位，另外支持直接传数字，表示**宽度多少 px**：

| `size` | 宽度 |
|--------|------|
| `'default'`（默认） | 由内容撑开 |
| `'medium'` | `150px` |
| `'large'` | `300px` |
| `number` | 该数值 px，例如 `:size="120"` |

<tabs-demos-size />

```vue
<template>
  <DwTabs v-model="active" :labels="['默认', '中号', '大号']" />
  <DwTabs v-model="active" :labels="['120px', '160px', '200px']" :size="120" />
  <DwTabs v-model="active" :labels="['禁用', '全部不可点']" disabled />
</template>
```

## 键盘操作

标签栏遵循 WAI-ARIA 的 tablist 模式：

- `←` / `→` 在标签间循环移动，`Home` / `End` 跳到首尾
- 只有选中项 `tabindex="0"`，其余为 `-1`（roving tabindex）
- 禁用项使用 `aria-disabled="true"` 而不是原生 `disabled`，保证键盘用户仍能聚焦到它

## 音效

与 Button 相同，`sound` 默认开启，`disabled` 时不会发声。全局关闭：

```ts
import { useSound } from '@star-dream051118/drawings-ui'

useSound().setEnabled(false)
```

## API

### DwTabs Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` | 当前选中项索引，支持 `v-model` | `number` | `0` |
| `count` | 标签数量，`labels` 存在时以 `labels` 为准 | `number` | `1` |
| `labels` | 标签文字 | `string[]` | — |
| `type` | 标签类型 | `'default' \| 'primary' \| 'danger'` | `'default'` |
| `size` | 标签尺寸 | `'default' \| 'medium' \| 'large' \| number` | `'default'` |
| `disabled` | 是否整体禁用 | `boolean` | `false` |
| `sound` | 是否播放音效 | `boolean` | `true` |
| `icon` | 图标名称或 URL | `string` | — |
| `icon-color` | 图标颜色 | `string` | — |
| `bg-color` | 背景颜色 | `string` | — |
| `color` | 文字颜色 | `string` | — |
| `active-effect` | 选中视觉 | `'border' \| 'pressed'` | `'border'` |

### DwTabs Slots

| 插槽名 | 说明 | 作用域 |
|--------|------|--------|
| `tab` | 自定义每个标签的内容 | `{ index: number, active: boolean }` |

### DwTabs Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `update:modelValue` | 选中项变化 | `index: number` |
| `change` | 选中项变化（语义化别名） | `index: number` |

### DwTabButton Props

单独使用（不放在 `DwTabs` 里）时，需要自己维护 `active`：

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `active` | 是否选中。**与 `DwButton` 的 `active`（按下态）不是同一个概念** | `boolean` | `false` |
| `active-effect` | 选中视觉 | `'border' \| 'pressed'` | `'border'` |
| `index` | 在标签栏中的序号，由 `DwTabs` 注入 | `number` | `0` |

其余 `type`、`size`、`disabled`、`sound`、`icon`、`icon-color`、`bg-color`、`color` 与 `DwTabs` 一致。

## 设计 Token

| Token | 说明 |
|-------|------|
| `--dw-color-border-active` | hover / 选中描边色（原 `--dw-color-hover-border`，旧名保留为别名） |
| `--dw-color-bg-active` | 按压式选中的深色底 |
| `--dw-color-bg-primary-active` | primary 按压式选中的深色底 |
| `--dw-color-bg-danger-active` | danger 按压式选中的深色底 |
| `--dw-spacing-xs` | 标签之间的间距 |
