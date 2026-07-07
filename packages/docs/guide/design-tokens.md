# 设计 Token

DrawingsUI 通过 CSS 自定义属性实现主题系统，你可以在运行时动态切换。

## 按钮颜色

### 默认按钮

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--dw-color-bg` | `#6F6F6F` | 背景色 |
| `--dw-color-bg-active` | `#2C2C2C` | 按下背景色 |
| `--dw-color-bg-disabled` | `#2C2C2C` | 禁用背景色 |
| `--dw-color-text` | `#FFFFFF` | 文字颜色 |
| `--dw-color-text-diabled` | `#A0A0A0` | 禁用文字颜色 |
| `--dw-color-border` | `#000000` | 边框色 |
| `--dw-color-hover-border` | `#FFFFFF` | 悬浮边框色 |
| `--dw-text-color-shadow` | `#3F3F3F` | 文字阴影色 |
| `--dw-text-disabled-color-shadow` | `#282828` | 禁用阴影色 |

### Primary 按钮

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--dw-color-bg-primary` | `#00AA00` | 背景色 |
| `--dw-color-bg-primary-active` | `#002A00` | 按下背景色 |
| `--dw-color-bg-primary-disabled` | `#002A00` | 禁用背景色 |

### Danger 按钮

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--dw-color-bg-danger` | `#AA0000` | 背景色 |
| `--dw-color-bg-danger-active` | `#2A0000` | 按下背景色 |
| `--dw-color-bg-danger-disabled` | `#2A0000` | 禁用背景色 |

## 间距

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--dw-spacing-xs` | `4px` | 超小间距 |
| `--dw-spacing-sm` | `8px` | 小间距 |
| `--dw-spacing-md` | `12px` | 中间距 |
| `--dw-spacing-lg` | `16px` | 大间距 |

## 宽度

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--dw-width-md` | `150px` | medium 按钮宽度 |
| `--dw-width--xl` | `300px` | large 按钮宽度 |

## 字号

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--dw-font-size-sm` | `12px` | 小号 |
| `--dw-font-size-base` | `16px` | 基础 |
| `--dw-font-size-lg` | `18px` | 大号 |

## 字体

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--dw-font-family` | `'mc-font', -apple-system, ...` | 全局字体 |

## 使用示例

### 全局覆盖

```css
/* 在项目入口覆盖默认值 */
:root {
  --dw-color-bg: #333333;
  --dw-color-text: #FFFFFF;
}
```

### 暗色模式

```css
.dark {
  --dw-color-bg: #1a1a1a;
  --dw-color-text: #e0e0e0;
  --dw-color-border: #333333;
}
```

### 动态切换

```ts
// 运行时切换主题
document.documentElement.style.setProperty('--dw-color-bg', '#333333')
```
