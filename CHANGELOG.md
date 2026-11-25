# 更新日志

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## 0.1.0（2026-11-26）

相比 0.0.4（仅包含 Button），这一版补齐了 Input、Tabs、TabStrip、Tooltip 四个组件族，并完善了设计 Token、文档站与发布配置。

### 新增

- **DwInput 输入框**
  - 自绘光标：文字中间为竖线、末尾为下划线，闪烁周期可通过 `blink-duration` 配置
  - 选区高亮、横向滚动定位、`display: none` → 显示与字体加载完成后的自动重测
  - 默认黑底 + 3px 像素描边，hover / focus 白边
  - 占位符配色 Token：`--dw-color-input-placeholder-text`、`--dw-color-input-placeholder-shadow-text`
- **DwTabs / DwTabButton 标签栏**
  - `active-effect`：`border` / `pressed` 两种选中视觉
  - `active-line` 选中下划线、`size`、`width-mode`（`auto` / `equal`）、`fill` 均分
  - 整栏与单标签禁用、点击音效、方向键 / `Home` / `End` 键盘导航
  - 重复 `value` 警告、非 `DwTabButton` 子元素校验
- **DwTabStrip 页签栏**
  - 四层结构：`DwTabStrip` / `DwTabStripGroup` / `DwTabStripButton` / `DwTabStripContent` / `DwTabStripFooter`
  - 背景图与模糊（`bg-image` / `bg-blur`）、内容区高度、页脚留高
  - 整栏 / 单页签禁用、音效、键盘导航、独立使用 `DwTabStripGroup`
  - 等宽测量、按实际渲染位置挖空描边线、重复 `value` 警告
- **DwTooltip 悬浮提示**
  - 跟随鼠标光标显示，支持 `placement` 分轴翻转与视口夹紧、`show-delay` / `hide-delay`
  - 键盘 `Tab` 聚焦显示、触屏长按显示（`touch` / `touch-delay`）
  - 无包裹渲染：默认插槽为单根元素时直接注入事件与 `aria-describedby`，多根时回退包裹层
  - `max-length` 字符截断：支持 `content` prop 与动态 `content` 插槽，超长追加 `…`，读屏保留完整文本
- **设计 Token**
  - 新增 `tokens.css` 子路径，可只引入变量而不引入组件样式
  - 补充 Input placeholder、Tooltip 像素描边阴影、TabStrip 等变量
- **字体**
  - 字体资源改为 `mc_font.woff2`，新增 `mc_font.woff2` 子路径导出
- **文档站**
  - 新增 Button / Input / Tabs / TabStrip / Tooltip 文档页、组件总览与常见问题
  - 文档站全局启用 Minecraft 像素字体，组件示例覆盖交互状态与边界说明

### 修复

- Tooltip：定位改用 `documentElement.clientWidth/clientHeight`，右侧不再出现夹紧偏移
- Tooltip：鼠标点击输入框聚焦时不再把提示锚点切到元素右下角
- Tooltip：窗口缩放 / 恢复聚焦后不再停留在失效坐标
- Tooltip：输入框文字过长产生内部横向滚动时不再误隐藏提示
- Tooltip：`Escape`、页面滚动、窗口尺寸变化、失焦时正确隐藏
- Tabs / TabStrip：标签内容溢出与裁切问题修复
- 音效：点击音效只响应鼠标主键，右键 / 中键不再触发

### 变更

- 包配置：补充 `description`、`keywords`、`homepage`、`repository`、`sideEffects`
- 发布配置：新增 `publishConfig.access: "public"` 与 `prepublishOnly` 自动构建
- `exports` 扩展：新增 `./tokens.css`、`./fonts.css`、`./mc_font.woff2` 子路径
- README 与文档站同步补全组件列表、Token 与引入方式

### 升级提示

- 0.0.4 只导出 `DwButton`，升级到 0.1.0 不会破坏已有 Button 用法
- 样式仍需引入一次：`import '@star-dream051118/drawings-ui/style.css'`
- 像素字体为可选资源：`import '@star-dream051118/drawings-ui/fonts.css'`
