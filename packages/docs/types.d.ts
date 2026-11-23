// 只声明「TS 无法理解、但 Vite 能处理」的资源模块。
// 组件库本身的类型不再在这里手写，否则会盖掉 dist / 源码里的真实导出
// （曾经就因为这里只写了 DwButton，导致 play 里 import DwTabs 报“没有导出成员”）。

declare module '*.svg' {
  const content: string
  export default content
}

declare module '@star-dream051118/drawings-ui/styles/base.scss' {
  const content: string
  export default content
}

declare module '@star-dream051118/drawings-ui/styles/font.scss' {
  const content: string
  export default content
}

declare module '@star-dream051118/drawings-ui/style.css' {
  const content: string
  export default content
}

declare module '@star-dream051118/drawings-ui/fonts.css' {
  const content: string
  export default content
}
