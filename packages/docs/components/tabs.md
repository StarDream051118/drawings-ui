# Tabs 标签栏

标签栏用于在同一区域的不同视图之间切换，采用 Minecraft Java 风格的标签设计。标签本体复用 Button 的皮肤，描边、立体阴影、配色与按钮完全一致。

## 基础用法

`DwTabs` 只负责「选中哪一项」和布局，标签由你在模板里自己写 `DwTabButton`，数量不受任何 prop 限制。

<tabs-demos-basic />

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const active = ref('home')
</script>

<template>
  <DwTabs v-model="active">
    <DwTabButton value="home">首页</DwTabButton>
    <DwTabButton value="settings">设置</DwTabButton>
    <DwTabButton value="status">状态</DwTabButton>
    <DwTabButton value="about">关于</DwTabButton>
  </DwTabs>
</template>
```

::: tip
`v-model` 绑定的是标签的 **`value`**，`value` 在一条栏内必须唯一；它还可以是数字。没写 `value` 的标签会自动用**自己的顺序索引**作为 key，所以 `v-model="0"` 这种老写法依然可用。

`DwTabButton` 自己不持有选中状态，也没有 `active` prop —— 这与 `DwButton` 的 `active`（按下态）不是同一个概念。
:::

## 交互状态

### `active-effect`

`active-effect` 决定选中标签长什么样，共两个取值。

在 Minecraft Java 中标签本身没有「选中态」，这里借用按钮的两种视觉来表达：

| 值 | 表现 |
|----|------|
| `border`（默认） | 只把描边高亮成 `--dw-color-border-active`，与 hover 同色；点击时同样只变描边、不改变背景色 |
| `pressed` | 借用禁用态的深色底并去掉立体投影，像被按住不放；文字仍为白色 |

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

::: tip
`pressed` 取的是各类型对应的深色底（`--dw-color-bg-active`、`--dw-color-bg-primary-active`、`--dw-color-bg-danger-active`）。相比 `border` 式多了一层「凹陷」的语义，适合标签和页面背景色接近、只靠描边看不出区别的场景。
:::

### `disabled`

禁用态只做两件事：**换背景色**（走 `--dw-color-bg-disabled` 及类型对应的 `-disabled` token）和**去掉立体投影**。文字颜色、文字压印、描边都保持不变，所以 hover 时描边依然会高亮成白边；光标变成 `not-allowed`，点击不会触发选中，也不会播放音效。

<tabs-demos-disabled />

```vue
<template>
  <DwTabs v-model="mixed">
    <DwTabButton>正常</DwTabButton>
    <DwTabButton disabled>禁用</DwTabButton>
    <DwTabButton>正常</DwTabButton>
  </DwTabs>

  <DwTabs v-model="allDisabled" disabled>
    <DwTabButton>整条禁用</DwTabButton>
    <DwTabButton>无法点击</DwTabButton>
  </DwTabs>
</template>
```

`DwTabs` 的 `disabled` 作用于全部标签，单个 `DwTabButton` 的 `disabled` 只作用于自己，两者取「或」。禁用项仍可用键盘聚焦，但方向键与 `Home` / `End` 会跳过它们。

::: tip
默认主题下禁用底色和 `pressed` 选中底色是同一个值（`#2C2C2C`，primary / danger 同理）。想让禁用更暗、和选中态区分得更明显，覆盖这几组变量即可：

```css
:root {
  --dw-color-bg-disabled: #1A1A1A;
  --dw-color-bg-primary-disabled: #001A00;
  --dw-color-bg-danger-disabled: #1A0000;
}
```
:::

## 标签尺寸

`size` 只在 `DwTabs` 上设置，作用于整条标签栏里的每个标签，`DwTabButton` 不提供 `size`。取值与 Button 一致：字符串走已有的尺寸 token，数字表示**每个标签的宽度多少 px**。

<tabs-demos-size />

| 属性 | 值 | 尺寸（仅 `width`） |
|--------|--------|------|
| `size` | `default` | `auto` |
| `size` | `medium` | `150px` |
| `size` | `large` | `300px` |
| `size` | `number` | 该数值 `px`，例如 `:size="120"` |

```vue
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

整条栏的宽度 = 标签数 × 单标签宽度 + 标签之间的间距（`--dw-spacing-base`）。

::: tip
不同栏要各自用一个 `ref`。几条栏共用同一个 `ref` 时，点在任意一条上另外几条也会跟着变 —— 那是数据源相同，不是组件联动。
:::

## 宽度模式

### `width-mode`

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
`equal` 依赖测量：挂载、标签增删、窗口缩放、字体加载完成后都会重新量一次，容器从不可见变为可见时也会补测。如果标签一开始渲染在 `display: none` 的容器里，量到的宽度是 0，会先按 `auto` 显示。`size` 为 `medium` / `large` / 数字时不生效（已经是固定宽度）。
:::

### `fill`

默认 `.dw-tabs` 是块级 flex 容器，本身就会占满父容器宽度，只是标签按内容宽度从左侧排列、右侧留白。加 `fill` 之后每个标签变成 `flex: 1`，均分整条栏的宽度：

<tabs-demos-fill />

```vue
<template>
  <DwTabs v-model="autoActive">
    <DwTabButton>默认</DwTabButton>
    <DwTabButton>按内容宽</DwTabButton>
    <DwTabButton>右侧留白</DwTabButton>
  </DwTabs>

  <DwTabs v-model="fillActive" fill>
    <DwTabButton>铺满</DwTabButton>
    <DwTabButton>均分</DwTabButton>
    <DwTabButton>宽度</DwTabButton>
  </DwTabs>
</template>
```

::: tip
`fill` 与 `size` 同时使用时以 `fill` 为准（标签均分，不再走 150 / 300px 或数值宽度）；与 `width-mode="equal"` 同时使用时 `equal` 不生效，因为 `fill` 本身就是均分。
:::

## 键盘操作

标签栏遵循 WAI-ARIA 的 tablist 模式：

- `←` / `→` 在可选标签间循环移动，`Home` / `End` 跳到首尾，**禁用项会被跳过**
- 只有选中项 `tabindex="0"`，其余为 `-1`（roving tabindex）
- 禁用项使用 `aria-disabled="true"` 而不是原生 `disabled`，保证键盘用户仍能聚焦到它
- `v-model` 指向一个已不存在的 key 时不会报错、也不会自动改值，此时没有标签被选中，但第一个可选标签保持 `tabindex="0"`，键盘仍能进入

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

与 Button 相同，按下标签时默认播放音效，可通过 `sound` prop 关闭：

<tabs-demos-sound />

```vue
<template>
  <DwTabs v-model="active">
    <DwTabButton>有音效</DwTabButton>
    <DwTabButton>切换试试</DwTabButton>
  </DwTabs>

  <DwTabs v-model="silent" :sound="false">
    <DwTabButton>无音效</DwTabButton>
    <DwTabButton>切换试试</DwTabButton>
  </DwTabs>
</template>
```

需要全局关闭时：

```ts
import { useSound } from '@star-dream051118/drawings-ui'

useSound().setEnabled(false)
```

## API

### DwTabs Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` | 当前选中标签的 `value`（未写 value 时是索引），支持 `v-model` | `string \| number` | — |
| `active-effect` | 选中视觉 | `'border' \| 'pressed'` | `'border'` |
| `type` | 整条标签栏的类型默认值 | `'default' \| 'primary' \| 'danger'` | `'default'` |
| `size` | 整条标签栏的尺寸默认值 | `'default' \| 'medium' \| 'large' \| number` | `'default'` |
| `disabled` | 是否整体禁用 | `boolean` | `false` |
| `sound` | 是否播放音效 | `boolean` | `true` |
| `icon` | 图标名称或 URL | `string` | — |
| `icon-color` | 图标颜色 | `string` | — |
| `bg-color` | 背景颜色 | `string` | — |
| `color` | 文字颜色 | `string` | — |
| `width-mode` | 自适应宽度下的定宽方式 | `'auto' \| 'equal'` | `'auto'` |
| `fill` | 标签均分整条栏宽度，铺满父容器 | `boolean` | `false` |

### DwTabs Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `update:modelValue` | 选中项变化 | `key: string \| number`（该标签的 value，未写 value 时为索引） |
| `change` | 选中项变化（语义化别名） | `key: string \| number` |

### DwTabs Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 只能放 `DwTabButton` |

### DwTabButton Props

以下属性不传时回退到 `DwTabs` 上的同名值：

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `value` | 唯一标识，和 `v-model` 比对；不传时回退成顺序索引 | `string \| number` | — |
| `type` | 标签类型 | `'default' \| 'primary' \| 'danger'` | 跟随 `DwTabs` |
| `disabled` | 是否禁用（与 `DwTabs` 的 `disabled` 取或） | `boolean` | `false` |
| `sound` | 是否播放音效（与 `DwTabs` 的 `sound` 取与，只能单方面关闭） | `boolean` | `true` |
| `icon` | 图标名称或 URL | `string` | 跟随 `DwTabs` |
| `icon-color` | 图标颜色 | `string` | 跟随 `DwTabs` |
| `bg-color` | 背景颜色 | `string` | 跟随 `DwTabs` |
| `color` | 文字颜色 | `string` | 跟随 `DwTabs` |
| `active-effect` | 选中视觉 | `'border' \| 'pressed'` | 跟随 `DwTabs` |

::: tip
`DwTabButton` 没有 `active` prop：它是否选中完全由 `DwTabs` 的 `v-model` 决定，单独放在 `DwTabs` 外面只会渲染成一个不可选中的标签。尺寸也只由 `DwTabs` 统一控制。

同一条栏里 `value` 必须唯一，重复时只有第一个能被选中，控制台会给出警告。`v-model` 指向一个已经不存在的值时不会报错、也不会自动改值，只是没有标签处于选中态（第一个可选标签仍保持可聚焦）。
:::

## 设计 Token

标签使用以下 CSS 自定义属性，可通过覆盖变量自定义样式：

| Token | 说明 |
|-------|------|
| `--dw-color-border` | 描边色 |
| `--dw-color-border-active` | hover / 选中描边色（原 `--dw-color-hover-border`，旧名保留为别名） |
| `--dw-color-bg` | 默认背景色 |
| `--dw-color-bg-active` | 按压式选中的深色底 |
| `--dw-color-bg-primary` | primary 背景色 |
| `--dw-color-bg-primary-active` | primary 按压式选中的深色底 |
| `--dw-color-bg-primary-disabled` | primary 禁用背景色 |
| `--dw-color-bg-danger` | danger 背景色 |
| `--dw-color-bg-danger-active` | danger 按压式选中的深色底 |
| `--dw-color-bg-danger-disabled` | danger 禁用背景色 |
| `--dw-color-bg-disabled` | 禁用背景色 |
| `--dw-color-text` | 文字颜色 |
| `--dw-color-text-diabled` | 禁用文字颜色 |
| `--dw-shadow-base` | 立体阴影 |
| `--dw-width-md` | `medium` 标签宽度 |
| `--dw-width-xl` | `large` 标签宽度 |
| `--dw-spacing-base` | 标签之间的间距 |
| `--dw-spacing-xs` | 图标与文字的间距 |
