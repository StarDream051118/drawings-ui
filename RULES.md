# 开发规则

本文件是本仓库的协作约定，提交代码前请先读一遍。

## 提交规则

1. **每次修改都必须提交**：改完代码、样式或文档后立即 `git commit`，不允许把改动留在工作区跨轮次。
2. **提交描述一律用中文**，格式为 `<type>: <中文描述>`，例如：
   - `feat: 新增 DwTabs 与 DwTabButton 组件`
   - `fix: 修复 size 传数值时不生效的问题`
   - `docs: 补充 Tab 组件文档`
   - `refactor: 抽取按钮皮肤 mixin`
   `type` 取值：`feat` / `fix` / `docs` / `style` / `refactor` / `perf` / `test` / `build` / `chore`。
3. **一个提交只做一件事**，不要把无关改动混进来。
4. 提交前先 `git status` 看清楚，用 `git add <具体文件>` 只加本次相关文件；不要 `git add .`（工作区里可能有别人的临时文件或已删除的锁文件）。
5. 提交前必须保证 `pnpm build` 通过；改到文档站时再跑一次 `pnpm docs:build`。

## 组件开发约定

1. **目录结构**：`packages/components/src/<component>/`，内含 `<Name>.vue`、`<name>.scss`、`index.ts`（`index.ts` 只做具名导出）。
2. **样式复用**：视觉皮肤统一 `@use '../styles/skin.scss'` 取 mixin，禁止复制描边、立体阴影、文字压印、类型配色的声明；`skin.scss` 里不允许出现具体组件类名（只能写 `&`、CSS 变量）。
3. **状态选择器归组件**：`:disabled`、`:active`、`[aria-selected]` 这类选择器写在各自组件的 scss 里，由组件决定 `@include` 哪个状态 mixin。
4. **尺寸不进 base**：`size` 若只影响宽度，用 `dw-skin-size($size, $fixed)` 控制，避免要求自适应宽度的组件被写死宽度。
5. **注册三处**：新增组件必须同时更新 `src/index.ts`、`src/install.ts`（`components` 数组），否则包外拿不到或全局注册缺失。
6. **Token 优先**：新增颜色、间距、尺寸先加 CSS 变量到 `src/styles/css-vars.scss`，再在 `packages/docs/guide/design-tokens.md` 同步；重命名旧变量要保留别名，避免破坏已发布的主题定制。
7. **文档同步**：组件完成后在 `packages/docs/components/` 建页面、在 `.vitepress/theme/demos/` 加 demo 并在 `.vitepress/theme/index.ts` 注册、在 `.vitepress/config.ts` 侧边栏加入口。
8. **验证方式**：`pnpm build` 必须通过；纯样式重构可以用 `dist/style.css` 的 SHA256 前后比对，证明视觉零变化。
