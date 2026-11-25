# 常见问题

## 组件样式或字体没有生效？

- 组件样式需要引入一次：`import '@star-dream051118/drawings-ui/style.css'`
- 像素字体是可选资源：`import '@star-dream051118/drawings-ui/fonts.css'`，不引入会回退到系统字体
- 只引入 `tokens.css` 时只有 CSS 变量，不包含组件样式

## Tooltip 不显示？

- 默认插槽需要**单一元素根节点**；多根节点或纯文本会回退为包裹层，并在控制台给出一次警告
- 原生 `disabled` 的按钮不派发指针事件，提示不会显示
- 触屏设备默认不触发，需要开启 `touch` 后长按
- `content` 为空且没有 `content` 插槽时不会显示

## Tooltip 位置偏移？

提示框通过 Teleport 挂到 `body` 并使用 `position: fixed`：鼠标触发按 `clientX/clientY` 定位，键盘触发用触发元素的右下角。只有 `body` 自身设置了 `transform` / `filter` / `perspective` 时，才会改变 `fixed` 的参照系并导致偏移。

## Input 的自绘光标位置偏了？

自绘光标按「从左到右（LTR）+ 左对齐」计算。给输入框设置 `text-align: center` / `text-align: right` 或 `direction: rtl` 时位置会偏。

## TabStrip / Tabs 被裁切或宽度不一致？

- TabStrip 的页签是固定宽度（`size`；`'default'` 会量出最宽值后统一等长），页签总宽超过容器时会被 `overflow: hidden` 裁切，不收缩也不横向滚动，窄屏请减小 `size` 或减少页签数量
- Tabs 同样不会换行；可以减小 `size`、使用 `fill` 让标签均分，或自己在外面套一个可横向滚动的容器

## 如何关闭按钮音效？

单个按钮传 `:sound="false"`；需要全局关闭时：

```ts
import { useSound } from '@star-dream051118/drawings-ui'

useSound().setEnabled(false)
```

## TabStrip 内容区底色和选中页签不一致？

`bg-selected-color` 会同时应用到选中页签、页签与内容区之间的 3px，以及 `DwTabStripContent` 的内容区。不要单独覆盖内容区背景，否则衔接处会露出色差。
