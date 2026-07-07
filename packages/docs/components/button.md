# Button 按钮

按钮用于触发一个即时操作，采用 Minecraft Java 风格设计的一套定制按钮，经过取色还原色彩。

## 基础用法

类型：一种原生 + 两种定制

<button-demos-basic />

```vue
<template>
  <DwButton>默认</DwButton>
  <DwButton type="danger">危险</DwButton>
  <DwButton type="primary">主要</DwButton>
</template>
```

## 交互状态

### `active`

`active` 按钮被按下但未触发的状态

在 Minecraft Java 中按钮本身不具备 `active` 属性，但为了方便广大开发者应用于Web应用开发，添加了 `active` prop，可设置 `true/false` 值（默认为 `false`）来 `启用/关闭` 按钮的 `active` 背景颜色。

<button-demos-active />

```vue
<template>
  <DwButton :active="true">默认</DwButton>
  <DwButton :active="true" type="danger">危险</DwButton>
  <DwButton :active="true" type="primary">主要</DwButton>
</template>
```

### `disabled`

`disabled` 按钮被禁用的状态

<button-demos-disabled />

```vue
<template>
  <DwButton :active="true" disabled>默认</DwButton>
  <DwButton :active="true" type="danger" disabled>危险</DwButton>
  <DwButton :active="true" type="primary" disabled>主要</DwButton>
</template>
```

## 按钮尺寸
上述类型演示均使用默认尺寸，默认尺寸仅设置了基础的 `padding`，可根据需求调整 `width` 与 `height`，也可使用 `size` prop来设置已有的尺寸。

为了保留 Minecraft Java 按钮风格不建议调整 `height`，如有需要可自行更改。
<button-demos-size /> 

| 属性 | 值 | 尺寸（仅 `width`） |
|--------|--------|------|
| `size` | `default` | `auto` |
| `size` | `medium` | `150px` |
| `size` | `large` | `300px` |

```vue
<template>
  <DwButton>默认</DwButton>
  <DwButton size="medium">中号</DwButton>
  <DwButton size="large">大号</DwButton>
</template>
```

## 图标

在 Minecraft Java 中按钮本身不具备 `icon`，此特性仅在 Bedrock 中具有，同样为了方便开发，添加了 `icon` prop。

### 内置图标

此组件库内置了 `12 种` 基于 Minecraft 风格设计的 图标，可通过对元素添加并设置 `icon` 的值来使用 `内置` 或者 `自定义URL`的图标。

<button-demos-icon /> 

```vue
<template>
  <DwButton icon="card">卡片</DwButton>
  <DwButton icon="list">列表</DwButton>
  <DwButton icon="download">下载</DwButton>
  <DwButton icon="upload">上传</DwButton>
  <DwButton icon="update">更新</DwButton>
  <DwButton icon="right">确认</DwButton>
  <DwButton icon="close">关闭</DwButton>
  <DwButton icon="settings">设置</DwButton>
  <DwButton icon="state">状态</DwButton>
  <DwButton icon="search">搜索</DwButton>
  <DwButton icon="chest">箱子</DwButton>
  <DwButton icon="heart">收藏</DwButton>
</template>
```

### 图标颜色

为了让图标更贴合项目内容，添加了 `icon-color` prop，通过修改此属性值来实现修改 `内置图标` 颜色。 

<button-demos-icon-color />

```vue
<template>
  <DwButton icon="right" icon-color="#00AA00">确认</DwButton>
  <DwButton icon="close" icon-color="#AA0000">关闭</DwButton>
  <DwButton icon="heart" icon-color="#AA00AA">收藏</DwButton>
</template>
```

::: tip
注意：`icon-color` 只对 `内置图标` 和自定义 URL 的 SVG 文件生效。PNG、JPG 等光栅图像素已固定，CSS `color` 无法修改。若要让自定义 SVG 支持 `icon-color`，需将 SVG 内的 `fill` 值改为 `currentColor`。
:::

### 自定义图标 URL

通过设置 `icon` prop，实现 `自定义图标`。

<button-demos-custom />

```vue
<template>
  <DwButton icon="./icons/right.svg">确认</DwButton>
  <DwButton icon="./icons/close.svg">关闭</DwButton>
  <DwButton icon="./icons/heart.svg">收藏</DwButton>
</template>
```

## 自定义颜色

除了可以修改 `内置图标` 的颜色，还添加了 `color` 和 `bg-color` prop，可以分别设置 `按钮内文字` 和 `按钮背景` 的颜色。

<button-demos-bg-color />

```vue
<template>
  <DwButton icon="right" icon-color="#00AA00" color="#00AA00" bg-color="#443A3B">确认</DwButton>
  <DwButton icon="close" icon-color="#AA0000" color="#AA0000" bg-color="#8CB3FF">关闭</DwButton>
  <DwButton icon="heart" icon-color="#DEB12D" color="#DDD605" bg-color="#EB7114">收藏</DwButton>
</template>
```

颜色不仅仅可以使用 `十六进制` ，还可以使用 `颜色关键字` 和 `RGB/RGBA` 以及 `HSL/HSLA`。

<button-demos-bg-color-change />

```vue
<template>
  <DwButton icon="right" color="green">确认</DwButton>
  <DwButton icon="close" color="hsl(0, 100%, 50%)">关闭</DwButton>
  <DwButton icon="heart" color="rgb(225, 225 ,0)">收藏</DwButton>
</template>
```

::: tip
注意：在 `icon-color` 未设置值的时候会跟随 `color` 的值，如果 `color` 也未设置则使用 `default` 默认值 `#FFFFFF`，并且 `bg-color` 属性值会覆盖 `type` 中的 `颜色`。
:::

## 音效

按钮按下时自动播放音效，可通过 `sound` prop 关闭：

<button-demos-sound />

```vue
<template>
  <DwButton>有音效</DwButton>
  <DwButton :sound="false">无音效</DwButton>
</template>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `type` | 按钮类型 | `'default' \| 'primary' \| 'danger'` | `'default'` |
| `size` | 按钮尺寸 | `'default' \| 'medium' \| 'large'` | `'default'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `active` | 是否激活状态 | `boolean` | `false` |
| `sound` | 是否播放音效 | `boolean` | `true` |
| `icon` | 图标名称或 URL | `string` | — |
| `icon-color` | 图标颜色 | `string` | — |
| `bg-color` | 背景颜色 | `string` | — |
| `color` | 文字颜色 | `string` | — |

### 内置图标列表

| 名称 | 说明 |
|------|------|
| `card` | 卡片 |
| `settings` | 设置 |
| `search` | 搜索 |
| `state` | 状态 |
| `upload` | 上传 |
| `right` | 右箭头 |
| `chest` | 箱子 |
| `close` | 关闭 |
| `update` | 更新 |
| `heart` | 心形 |
| `download` | 下载 |
| `list` | 列表 |

### Slots

| 插槽名 | 说明 |
|--------|------|
| `default` | 按钮内容 |

### Events

无自定义事件。组件基于原生 `<button>` 元素，支持所有原生 DOM 事件：

```vue
<template>
  <DwButton @click="onClick">点击</DwButton>
  <DwButton @mouseenter="onEnter">悬浮</DwButton>
</template>
```

## 设计 Token

按钮使用以下 CSS 自定义属性，可通过覆盖变量自定义样式：

| Token | 说明 |
|-------|------|
| `--dw-color-bg` | 默认背景色 |
| `--dw-color-bg-active` | 默认按下背景色 |
| `--dw-color-bg-disabled` | 禁用背景色 |
| `--dw-color-text` | 文字颜色 |
| `--dw-color-text-diabled` | 禁用文字颜色 |
| `--dw-color-border` | 边框色 |
| `--dw-color-hover-border` | 悬浮边框色 |
| `--dw-color-bg-primary` | primary 背景色 |
| `--dw-color-bg-primary-active` | primary 按下背景色 |
| `--dw-color-bg-primary-disabled` | primary 禁用背景色 |
| `--dw-color-bg-danger` | danger 背景色 |
| `--dw-color-bg-danger-active` | danger 按下背景色 |
| `--dw-color-bg-danger-disabled` | danger 禁用背景色 |
| `--dw-text-color-shadow` | 文字阴影色 |
| `--dw-text-disabled-color-shadow` | 禁用阴影色 |
| `--dw-shadow-base` | 基础阴影 |
| `--dw-font-size-sm` | 小号字号 |
| `--dw-font-size-base` | 基础字号 |
| `--dw-font-size-lg` | 大号字号 |
