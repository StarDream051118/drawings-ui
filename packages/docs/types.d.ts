declare module '*.svg' {
  const content: string
  export default content
}

declare module '@stardream051118/drawings-ui' {
  import type { App, DefineComponent } from 'vue'

  export const DwButton: DefineComponent<any, any, any>
  export function useSound(): {
    play: (src: string) => void
    enabled: import('vue').Ref<boolean>
    setEnabled: (val: boolean) => void
  }
  export function useIcon(): {
    icons: Record<string, string>
    getIconSvg: (name: string) => string | null
    isBuiltInIcon: (name: string) => boolean
  }
  export function install(app: App): void
  export default { install: typeof install }
}

declare module '@stardream051118/drawings-ui/styles/index.scss' {
  const content: string
  export default content
}

declare module '@stardream051118/drawings-ui/style.css' {
  const content: string
  export default content
}
