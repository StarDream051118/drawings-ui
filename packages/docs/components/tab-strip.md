# TabStrip 页签栏

`TabStrip` 是 Minecraft 风格的页签栏：未选中的页签像贴在内容区上的标签，选中页签向下延伸，与内容区**无缝衔接**。整条描边由一个线元素统一绘制，选中页签所在区间用渐变硬停点挖空。

组件分四层，和 `DwTabs` / `DwTabButton` 的组织方式一致：

| 组件 | 职责 | 可放位置 |
|------|------|----------|
| `DwTabStrip` | 持有 `v-model` 与整条栏的默认值，向下提供 context | 任意 |
| `DwTabStripGroup` | 页签行 + 描边线，管理页签顺序 | 一般放在 `DwTabStrip` 内；也可独立使用 |
| `DwTabStripButton` | 单个页签 | 只能放在 `DwTabStripGroup` 内 |
| `DwTabStripContent` | 内容区，负责内容高度与底色 | 只能放在 `DwTabStrip` 内 |
| `DwTabStripFooter` | 页脚，默认与页签组等高，只负责留高与内容承载 | 只能放在 `DwTabStrip` 内 |

## 基础用法

<tab-strip-demos-basic />

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  DwTabStrip,
  DwTabStripGroup,
  DwTabStripButton,
  DwTabStripContent,
} from '@star-dream051118/drawings-ui'

const active = ref('world')
</script>

<template>
  <DwTabStrip v-model="active">
    <DwTabStripGroup>
      <DwTabStripButton value="game">游戏</DwTabStripButton>
      <DwTabStripButton value="world">世界</DwTabStripButton>
      <DwTabStripButton value="more">更多</DwTabStripButton>
    </DwTabStripGroup>
    <DwTabStripContent :content-height="200">
      内容区域
    </DwTabStripContent>
  </DwTabStrip>
</template>
```

::: tip
`v-model` 绑定的是页签的 `value`，同一条栏内必须唯一；不写 `value` 时自动用**自己的顺序索引**作为 key（与 `DwTabButton` 一致）。不传 `v-model` 时默认选中第一项。
:::

## 页签宽度

`size` 与 `DwTabs` 一致：

| 值 | 宽度 |
|----|------|
| `'default'`（默认） | 按内容撑开，再量出最宽的那个页签，全部统一成这个宽度 |
| `'medium'` | `--dw-width-md`（150px） |
| `'large'` | `--dw-width-xl`（300px） |
| `number` | 该数值 px，例如 `:size="180"` |

<tab-strip-demos-group />

```vue
<template>
  <DwTabStripGroup v-model="active" :size="180">
    <DwTabStripButton value="game">游戏</DwTabStripButton>
    <DwTabStripButton value="world">世界</DwTabStripButton>
    <DwTabStripButton value="more">更多</DwTabStripButton>
  </DwTabStripGroup>
</template>
```

::: warning
`'default'` 不能是「每个页签各按自己的文字宽度」。描边线的挖洞位置是由「等宽 + 索引」推出来的，宽度不一致断口会对不上，所以这里量出最宽值后统一等长。页签始终保持固定宽度（`flex: none`），窗口变窄时不会收缩。

页签带 `min-width: max-content` 且文字 `white-space: nowrap`：`size` 小于文字实际宽度时按文字宽度显示，不会被压缩或换行。此时各页签宽度可能不一致，描边线的断口按**实际渲染位置**测量（不是按「索引 × 等宽」推算），所以依然对齐。

`'default'` 的测量时机：挂载、页签增删、页签文字变化、选中项变化、`size` 变化、窗口缩放、字体加载完成。测量结果没变化时会直接跳过，不会反复触发重排。
:::

## 底色

- `bg-color`：未选中页签的底色，默认 `rgba(0, 0, 0, 0.9)`
- `bg-selected-color`：选中页签的底色，默认 `rgba(0, 0, 0, 0.3)`

```vue
<template>
  <DwTabStrip v-model="active" bg-color="rgba(0, 0, 0, 0.9)" bg-selected-color="rgba(0, 0, 0, 0.3)">
    ...
  </DwTabStrip>
</template>
```

::: warning
`bg-selected-color` 会同时应用到**选中页签**、**选中页签与内容区之间那 3px**、以及 `DwTabStripContent` 的**内容区**。三者必须完全一致（包括透明度），否则衔接处会露出色差 —— 这也是 `DwTabStripContent` 不提供独立底色 prop 的原因。

那 3px 缝隙由描边线（`.dw-tab-strip-group__line`）自己在挖洞区间内画上这个颜色，不是由内容区的 `box-shadow` 覆盖上去的，所以改色不会污染描边线本身的深浅。
:::

## 背景图与模糊

背景图与模糊都属于整条页签栏，模糊的是整张背景图。

- `bg-image`：背景图片地址，作用在 `DwTabStrip` 内的 `.dw-tabstrip-background` 元素上，铺满整条栏
- `bg-blur`：背景模糊程度（px），默认 `3`

<tab-strip-demos-background />

```vue
<template>
  <DwTabStrip v-model="active" :bg-image="bgImage" :bg-blur="3">
    <DwTabStripGroup>
      <DwTabStripButton value="game">游戏</DwTabStripButton>
      <DwTabStripButton value="world">世界</DwTabStripButton>
      <DwTabStripButton value="more">更多</DwTabStripButton>
    </DwTabStripGroup>
    <DwTabStripContent :content-height="200">
      内容区域
    </DwTabStripContent>
  </DwTabStrip>
</template>
```

::: tip
模糊用的是 `filter: blur()`，直接作用在背景图自己身上，所以整张图是同一套模糊 —— 页签区、内容区、页脚露出的部分不会有清晰/模糊的差异。

背景层会先比容器外扩一个模糊半径再被裁掉，否则 `filter: blur` 会在四边采样到透明像素，出现发虚的白边。
:::

## 内容高度

`content-height` 是**最小高度**，默认 `'auto'`：

- 插槽内容比它高时，按内容实际高度显示，不会被截断；
- 内容为空且设为 `0` 时，内容区就缩到 0；
- 数字按 px 处理，字符串原样透传（如 `'40vh'`）。

```vue
<template>
  <DwTabStripContent :content-height="240">...</DwTabStripContent>
  <DwTabStripContent content-height="40vh">...</DwTabStripContent>
  <DwTabStripContent>...</DwTabStripContent>
</template>
```

## 页脚

`DwTabStripFooter` 放在内容区之后，默认高度与页签组等高（`--dw-tabstrip-tab-height-selected` + `--dw-tabstrip-line-height`）。它本身不画底色、描边和阴影，只负责底部留高，露出来的就是背景图。

<tab-strip-demos-footer />

```vue
<template>
  <DwTabStrip v-model="active">
    <DwTabStripGroup>
      <DwTabStripButton value="game">游戏</DwTabStripButton>
      <DwTabStripButton value="world">世界</DwTabStripButton>
      <DwTabStripButton value="more">更多</DwTabStripButton>
    </DwTabStripGroup>
    <DwTabStripContent :content-height="200">
      内容区域
    </DwTabStripContent>
    <DwTabStripFooter>
      页脚区域
    </DwTabStripFooter>
  </DwTabStrip>
</template>
```

`height` 不传时等于页签组高度；传数字按 px 处理，传字符串原样透传。

::: tip
背景图铺满整条栏，所以页签区、内容区、页脚三块露出的都是同一张图。内容区底部的 3px 边线就是内容与页脚的分界。
:::

## 禁用

`disabled` 作用于**整条栏**：禁用后点击与键盘导航都失效、不播放音效，所有页签按未选中样式显示，描边线也不再挖洞。

<tab-strip-demos-disabled />

```vue
<template>
  <DwTabStrip v-model="active" disabled>
    <DwTabStripGroup>
      <DwTabStripButton value="game">游戏</DwTabStripButton>
      <DwTabStripButton value="world">世界</DwTabStripButton>
      <DwTabStripButton value="more">更多</DwTabStripButton>
    </DwTabStripGroup>
    <DwTabStripContent :content-height="200">内容区域</DwTabStripContent>
  </DwTabStrip>
</template>
```

::: tip
禁用只去掉选中态，不改变页签本身的配色。想让禁用整体变灰，覆盖 `--dw-color-tabstrip-bg` 和 `--dw-color-text` 即可。

`DwTabStripGroup` 独立使用时也接受 `disabled`；放在 `DwTabStrip` 内则不传即继承父级。

单个页签也可以禁用：给 `DwTabStripButton` 加 `disabled`，它不响应点击与 hover、不参与键盘导航，也不会成为选中项。
:::

## 单独使用 DwTabStripGroup

只需要页签条、内容区自己接管时，直接用 `DwTabStripGroup` 并给它自己的 `v-model`：

```vue
<template>
  <DwTabStripGroup v-model="active" :size="180">
    <DwTabStripButton value="game">游戏</DwTabStripButton>
    <DwTabStripButton value="world">世界</DwTabStripButton>
  </DwTabStripGroup>
</template>
```

放在 `DwTabStrip` 内时，`size` / `sound` / `disabled` / `color` / `icon` / `bg-color` / `bg-selected-color` 都从父组件继承，Group 上再传一次会覆盖父组件的值。

::: warning
`DwTabStripContent` 只能用在 `DwTabStrip` 内，`DwTabStripButton` 只能用在 `DwTabStripGroup` 内。放错位置时组件会输出一条控制台警告并停止渲染，避免底色和选中值对不上。

独立使用时没有背景图，选中页签的默认底色 `rgba(0, 0, 0, 0.3)` 会直接叠在页面背景上；纯色页面通常需要自己传 `bg-selected-color`。
:::

## 键盘操作

遵循 WAI-ARIA 的 tablist 模式：

- `←` / `→` 在页签间循环移动，`Home` / `End` 跳到首尾
- 只有选中项 `tabindex="0"`，其余为 `-1`（roving tabindex）

## API

### DwTabStrip Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` | 当前选中页签的 `value`，支持 `v-model` | `string \| number` | — |
| `size` | 单个页签宽度 | `'default' \| 'medium' \| 'large' \| number` | `'default'` |
| `sound` | 是否播放点击音效 | `boolean` | `true` |
| `disabled` | 是否整体禁用；禁用后不可点击，所有页签按未选中样式显示 | `boolean` | `false` |
| `icon` | 整条栏的默认图标，可被单个 `DwTabStripButton` 覆盖 | `string` | — |
| `color` | 页签文字颜色 | `string` | `--dw-color-text` |
| `bg-color` | 未选中页签的底色 | `string` | `--dw-color-tabstrip-bg` |
| `bg-selected-color` | 选中页签底色，同时作为内容区底色 | `string` | `--dw-color-tabstrip-content` |
| `bg-image` | 背景图片地址，铺满整条页签栏 | `string` | `''` |
| `bg-blur` | 背景模糊程度（px），页签区与内容区共用 | `number` | `3` |

### DwTabStrip Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `update:modelValue` | 选中项变化 | `value: string \| number` |
| `change` | 选中项变化（语义化别名） | `value: string \| number` |

### DwTabStrip Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | `DwTabStripGroup`、`DwTabStripContent`、`DwTabStripFooter` |

### DwTabStripGroup Props

放在 `DwTabStrip` 内时，以下不传就继承父组件：

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` | 独立使用时的选中值；在 `DwTabStrip` 内以父组件为准 | `string \| number` | — |
| `size` | 单个页签宽度 | `'default' \| 'medium' \| 'large' \| number` | 继承 |
| `sound` | 是否播放点击音效 | `boolean` | 继承 |
| `disabled` | 是否整体禁用 | `boolean` | 继承 |
| `icon` / `color` / `bg-color` / `bg-selected-color` | 同上 | `string` | 继承 |

### DwTabStripGroup Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| `update:modelValue` | 独立使用时的选中项变化 | `value: string \| number` |
| `change` | 选中项变化（语义化别名） | `value: string \| number` |

### DwTabStripButton Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `value` | 唯一标识，和 `v-model` 比对；不传时回退成顺序索引 | `string \| number` | — |
| `icon` | 单个页签的图标：内置图标名（如 `heart`）或图片 URL | `string` | 跟随 `DwTabStrip` |
| `disabled` | 单独禁用该页签；不参与点击、键盘导航与选中 | `boolean` | `false` |

::: tip
图标颜色不由组件控制：内置图标统一用 `fill="currentColor"`，跟随页签文字颜色；传图片 URL 时按 `<img>` 渲染，保留图片自身颜色。组件目前只支持「内置图标名」和「图片 URL」两种，不支持直接传 SVG 字符串。
:::

### DwTabStripContent Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `content-height` | 内容区最小高度，内容更高时以内容为准 | `number \| string` | `'auto'` |

### DwTabStripFooter Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `height` | 页脚高度，数字按 px 处理 | `number \| string` | 与页签组等高 |

## 设计 Token

页签使用以下 CSS 自定义属性，可通过覆盖变量自定义样式：

| Token | 默认值 | 说明 |
|-------|--------|------|
| `--dw-tabstrip-gap` | `6px` | 页签之间的缝隙 |
| `--dw-tabstrip-tab-width` | `300px` | 单个页签宽度（会被 `size` 覆盖） |
| `--dw-tabstrip-tab-height` | `40px` | 未选中页签高度 |
| `--dw-tabstrip-tab-height-selected` | `55px` | 选中页签高度 |
| `--dw-tabstrip-line-height` | `6px` | 描边线高度（3px 高光 + 3px 实色） |
| `--dw-tabstrip-border-width` | `3px` | 像素描边宽度（页签边框、断口内缩、内容区底边共用） |
| `--dw-tabstrip-blur` | `3px` | 背景模糊程度（会被 `bg-blur` 覆盖） |
| `--dw-color-tabstrip-bg` | `rgba(0, 0, 0, 0.9)` | 未选中页签底色 / 描边线实色 |
| `--dw-color-tabstrip-content` | `rgba(0, 0, 0, 0.3)` | 内容区与选中页签底色 |
| `--dw-color-tabstrip-highlight` | `rgba(255, 255, 255, 0.2)` | 高光描边色 |
| `--dw-color-border-active` | `#FFFFFF` | hover / 选中页签的白色描边 |
