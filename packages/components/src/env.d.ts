declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}

declare module '*?url' {
  const url: string
  export default url
}

declare module '*?raw' {
  const raw: string
  export default raw
}

declare module '*.svg' {
  const content: string;
  export default content;
}
