# Input 输入框

单行输入框，内置 Minecraft 风格的自绘光标。默认黑底、3px 像素描边，聚焦时描边变白。组件只提供 `v-model` 和 `blink-duration`：其余属性全部透传到内部 `<input>`。

## 基础用法

<input-demos-basic />

```vue
<script setup lang="ts">
import { ref } from 'vue'

const value = ref('新的世界')
</script>

<template>
  <DwInput v-model="value" class="my-input" />
</template>
```

::: tip
组件自带黑底、3px 像素描边与聚焦白边的默认样式；需要自定义时覆盖 `.dw-input__native` 或给它传 class。`class`、`placeholder`、`disabled`、原生事件仍通过 attrs 透传到内部 `<input>`。
:::

## 光标

- 光标在文字末尾：下划线，粗细 `2px`，默认 `0.6s` 硬切闪烁
- 光标在文字中间：`2px` 竖线，高度跟随一行文字
- 选中一段文字：隐藏自绘光标，使用系统选区高亮
- 位置通过对隐藏 mirror 元素量文字宽度得到，字体、字号、字距均取输入框的计算样式；输入框横向滚动时会扣除 `scrollLeft`
- 容器尺寸变化（含 `display: none` → 显示）和字体加载完成后会自动重新测量

::: warning
光标位置按「从左到右（LTR）+ 左对齐」计算。输入框使用 `text-align: center` / `text-align: right` 或 `direction: rtl` 时，位置会偏。
:::

## 闪烁速度

`blink-duration` 控制闪烁周期，单位是秒，默认 `0.6`；传 `0` 或负数则停止闪烁，光标常亮。上面的示例对比了默认 `0.6s` 和 `1.5s` 两种速度。

```vue
<template>
  <DwInput v-model="value" :blink-duration="1.5" />
</template>
```

## API

### DwInput Props

| 属性 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `modelValue` | 输入值，支持 `v-model` | `string` | `''` |
| `blink-duration` | 光标闪烁周期（秒）；传 `0` 或负数停止闪烁 | `number` | `0.6` |

组件没有其它 props。

### DwInput Events

`input` / `focus` / `blur` / `keyup` 等原生事件通过 attrs 透传到内部 `<input>`。

### DwInput Slots

无。

## 设计 Token

| Token | 默认值 | 说明 |
|-------|--------|------|
| `--dw-color-input-bg` | `#000000` | 输入框背景色 |
| `--dw-color-input-border` | `#A0A0A0` | 默认描边色（hover / focus 用 `--dw-color-border-active`） |
| `--dw-input-height` | `46px` | 输入框高度 |
| `--dw-color-selection-bg` | `#FFFFFF` | 选中文字的背景色 |
| `--dw-color-selection-text` | `#201FFF` | 选中文字的颜色 |
| `--dw-text-selection-shadow` | `1px 1px #C7C7FF` | 选中文字的压印阴影 |
