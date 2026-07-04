# 设计 Token

DrawingsUI 通过 CSS 自定义属性实现主题系统，你可以在运行时动态切换。

## 颜色

### 主色调

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--ui-color-primary` | `#4A90D9` | 主色 |
| `--ui-color-primary-hover` | `#357ABD` | 主色悬浮 |
| `--ui-color-primary-active` | `#2A5F9E` | 主色按下 |

### 功能色

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--ui-color-success` | `#52C41A` | 成功 |
| `--ui-color-success-hover` | `#3DA012` | 成功悬浮 |
| `--ui-color-danger` | `#FF4D4F` | 危险 |
| `--ui-color-danger-hover` | `#D9363E` | 危险悬浮 |

### 中性色

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--ui-color-text` | `#333333` | 正文颜色 |
| `--ui-color-text-secondary` | `#666666` | 次要文字 |
| `--ui-color-border` | `#D9D9D9` | 边框色 |
| `--ui-color-bg` | `#FFFFFF` | 背景色 |
| `--ui-color-bg-disabled` | `#F5F5F5` | 禁用背景 |

## 尺寸

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--ui-radius-base` | `6px` | 基础圆角 |
| `--ui-radius-small` | `4px` | 小圆角 |

## 间距

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--ui-spacing-xs` | `4px` | 超小间距 |
| `--ui-spacing-sm` | `8px` | 小间距 |
| `--ui-spacing-md` | `12px` | 中间距 |
| `--ui-spacing-lg` | `16px` | 大间距 |
| `--ui-spacing-xl` | `24px` | 超大间距 |

## 字号

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--ui-font-size-sm` | `12px` | 小号 |
| `--ui-font-size-base` | `14px` | 基础 |
| `--ui-font-size-lg` | `16px` | 大号 |

## 阴影

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--ui-shadow-base` | `0 2px 8px rgba(0,0,0,0.08)` | 基础阴影 |

## 使用示例

### 全局覆盖

```css
/* 在项目入口覆盖默认值 */
:root {
  --ui-color-primary: #ff6b35;
  --ui-radius-base: 8px;
}
```

### 局部覆盖

```css
/* 暗色模式 */
.dark {
  --ui-color-bg: #1a1a1a;
  --ui-color-text: #e0e0e0;
  --ui-color-border: #333333;
}
```

### 动态切换

```ts
// 运行时切换主题
document.documentElement.style.setProperty('--ui-color-primary', '#ff6b35')
```
