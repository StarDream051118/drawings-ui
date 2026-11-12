# Tabs 标签栏

横向排列的标签栏，用于在同一区域的不同视图之间切换。标签本体复用 Button 的 Minecraft 皮肤（`skin.scss`），因此配色、描边、立体阴影与按钮完全一致。

`DwTabs` 只负责「选中哪一项」和布局，标签由你在模板里自己写 `DwTabButton`，数量不受任何 prop 限制。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const active = ref(0)
</script>

<template>
  <DwTabs v-model="active">
    <DwTabButton>首页</DwTabButton>
    <DwTabButton>设置</DwTabButton>
    <DwTabButton>状态</DwTabButton>
    <DwTabButton>关于</DwTabButton>
  </DwTabs>
</template>
```

<tabs-demos-basic />

`v-model` 绑定的是标签在 `DwTabs` 中的顺序索引，`DwTabButton` 自己不持有选中状态，也不提供 `active` prop。

## 选中效果

`active-effect` 决定选中标签长什么样，两个取值：

| 值 | 表现 |
|----|------|
| `border`（默认） | 只把描边高亮成 `--dw-color-border-active`，与 hover 同色；点击时同样只变描边、**不改变背景色** |
| `pressed` | 借用 Button 禁用态的深色底 + 去掉立体投影，像被按住不放，文字仍为白色 |

<tabs-demos-active-effect />

```vue
<template>
  <DwTabs v-model="borderActive" active-effect="border">
    <DwTabButton>描边式</DwTabButton>
    <DwTabButton>默认效果</DwTabButton>
  </DwTabs>
  <DwTabs v-model="pressedActive" active-effect="pressed">
    <DwTabButton>按压式</DwTabButton>
    <DwTabButton>深底效果</DwTabButton>
  </DwTabs>
</template>
```

## 尺寸

`size` 只在 `DwTabs` 上设置，作用于整条标签栏里的每个标签；`DwTabButton` 不提供 `size`。取值与 Button 一致：字符串走 token，数字表示**每个标签的宽度多少 px**。

<tabs-demos-size />

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const defaultActive = ref(0)
const mediumActive = ref(0)
const largeActive = ref(0)
</script>

<template>
  <DwTabs v-model="defaultActive">
    <DwTabButton>默认</DwTabButton>
    <DwTabButton>自适应宽度</DwTabButton>
    <DwTabButton>按钮</DwTabButton>
  </DwTabs>

  <DwTabs v-model="mediumActive" size="medium">
    <DwTabButton>中号</DwTabButton>
    <DwTabButton>150px</DwTabButton>
  </DwTabs>

  <DwTabs v-model="largeActive" size="large">
    <DwTabButton>大号</DwTabButton>
    <DwTabButton>300px</DwTabButton>
  </DwTabs>
</template>
```

| `size` | 每个标签宽度 |
|--------|------|
| `'default'`（默认） | 由内容撑开 |
| `'medium'` | `150px` |
| `'large'` | `300px` |
| `number` | 该数值 px，例如 `:size="120"` |

整条栏的宽度 = 标签数 × 单标签宽度 + 标签之间的间距（`--dw-spacing-xs`）。

## 等宽

`width-mode` 控制自适应宽度（`size="default"`）下每个标签怎么定宽：

| 值 | 表现 |
|----|------|
| `'auto'`（默认） | 每个标签按自己的文字宽度撑开，长短不一 |
| `'equal'` | 先量出最宽的那个标签，所有标签都取这个宽度 |

<tabs-demos-width-mode />

```vue
<template>
  <DwTabs v-model="autoActive" width-mode="auto">
    <DwTabButton>首页</DwTabButton>
    <DwTabButton>个人设置</DwTabButton>
    <DwTabButton>关于我们团队</DwTabButton>
  </DwTabs>

  <DwTabs v-model="equalActive" width-mode="equal">
    <DwTabButton>首页</DwTabButton>
    <DwTabButton>个人设置</DwTabButton>
    <DwTabButton>关于我们团队</DwTabButton>
  </DwTabs>
</template>
```

::: tip
`equal` 依赖测量：挂载、标签增删、窗口缩放、像素字体加载完成后都会重新量一次。如果标签一开始渲染在 `display: none` 的容器里，量到的宽度是 0，会先按 `auto` 显示，等容器可见并触发上述任一事件后才变成等宽。`size` 为 `medium` / `large` / 数字时不生效（已经是固定宽度）。
:::

## 禁用

禁用态只做两件事：**换背景色**（走 `--dw-color-bg-disabled` 及类型对应的 `-disabled` token）和**去掉立体投影**。文字颜色、文字压印、描边都保持不变，所以 **hover 时描边依然会高亮成白边**；光标变成 `not-allowed`，点击不会触发选中，也不会播放音效。

```css
/* 想让禁用更暗一点，覆盖这几组变量即可 */
:root {
  --dw-color-bg-disabled: #1A1A1A;
  --dw-color-bg-primary-disabled: #001A00;
  --dw-color-bg-danger-disabled: #1A0000;
}
```

`DwTabs` 的 `disabled` 会作用于全部标签；单个 `DwTabButton` 的 `disabled` 只作用于自己，两者取「或」。

## 键盘操作

标签栏遵循 WAI-ARIA 的 tablist 模式：

- `←` / `→` 在可选标签间循环移动，`Home` / `End` 跳到首尾，**禁用项会被跳过**
- 只有选中项 `tabindex="0"`，其余为 `-1`（roving tabindex）
- 禁用项使用 `aria-disabled="true"` 而不是原生 `disabled`，保证键盘用户仍能聚焦到它
- `v-model` 传入越界索引时会自动夹到有效范围，不会出现"一个都没选中"

## 子元素校验

`DwTabs` 只接受 `DwTabButton`。如果默认插槽里混入了其它标签或组件，会：

1. 在控制台输出一条警告：`[DrawingsUI] DwTabs 的子元素只能是 DwTabButton…`
2. **整条标签栏都不渲染**，避免选中索引和 DOM 顺序错位

```vue
<!-- 不会渲染，控制台会有警告 -->
<DwTabs v-model="active">
  <DwTabButton>正常</DwTabButton>
  <div>不是 DwTabButton</div>
</DwTabs>
```

## 音效

与 Button 相同，`sound` 默认开启，禁用时不发声。全局关闭：

```ts
import { useSound } from '@star-dream051118/drawings-ui'

useSound().setEnabled(false)
```

## API

### DwTabs Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` | 当前选中项索引，支持 `v-model` | `number` | `0` |
| `active-effect` | 选中视觉 | `'border' \| 'pressed'` | `'border'` |
| `width-mode` | 自适应宽度下的定宽方式 | `'auto' \| 'equal'` | `'auto'` |
| `type` | 整条标签栏的类型默认值 | `'default' \| 'primary' \| 'danger'` | `'default'` |
| `size` | 整条标签栏的尺寸默认值 | `'default' \| 'medium' \| 'large' \| number` | `'default'` |
| `disabled` | 是否整体禁用 | `boolean` | `false` |
| `sound` | 是否播放音效 | `boolean` | `true` |
| `icon` | 图标名称或 URL | `string` | — |
| `icon-color` | 图标颜色 | `string` | — |
| `bg-color` | 背景颜色 | `string` | — |
| `color` | 文字颜色 | `string` | — |

### DwTabs Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `update:modelValue` | 选中项变化 | `index: number` |
| `change` | 选中项变化（语义化别名） | `index: number` |

### DwTabs Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 只能放 `DwTabButton` |

### DwTabButton Props

以下属性不传时回退到 `DwTabs` 上的同名值：

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `type` | 标签类型 | `'default' \| 'primary' \| 'danger'` | 跟随 `DwTabs` |
| `disabled` | 是否禁用（与 `DwTabs` 的 `disabled` 取或） | `boolean` | `false` |
| `sound` | 是否播放音效（与 `DwTabs` 的 `sound` 取与，只能单方面关闭） | `boolean` | `true` |
| `icon` | 图标名称或 URL | `string` | 跟随 `DwTabs` |
| `icon-color` | 图标颜色 | `string` | 跟随 `DwTabs` |
| `bg-color` | 背景颜色 | `string` | 跟随 `DwTabs` |
| `color` | 文字颜色 | `string` | 跟随 `DwTabs` |
| `active-effect` | 选中视觉 | `'border' \| 'pressed'` | 跟随 `DwTabs` |

::: tip
`DwTabButton` 没有 `active` prop：它是否选中完全由 `DwTabs` 的 `v-model` 决定，单独放在 `DwTabs` 外面只会渲染成一个不可选中的标签。
:::

## 设计 Token

| Token | 说明 |
|-------|------|
| `--dw-color-border-active` | hover / 选中描边色（原 `--dw-color-hover-border`，旧名保留为别名） |
| `--dw-color-bg-active` | 按压式选中的深色底 |
| `--dw-color-bg-primary-active` | primary 按压式选中的深色底 |
| `--dw-color-bg-danger-active` | danger 按压式选中的深色底 |
| `--dw-spacing-xs` | 标签之间的间距、图标与文字的间距 |
