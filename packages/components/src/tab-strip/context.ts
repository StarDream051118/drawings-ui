import { inject, type ComputedRef, type InjectionKey, type Ref, type ShallowRef } from 'vue'

export type TabStripSize = 'default' | 'medium' | 'large' | number
/** 页签的唯一标识：优先用 value，未传时回退成顺序索引 */
export type TabStripKey = string | number

/** DwTabStrip 上的默认值，DwTabStripGroup / DwTabStripButton 未显式传入时回退到这里 */
export interface TabStripDefaults {
  size: TabStripSize
  sound: boolean
  disabled: boolean
  icon?: string
  color?: string
  bgColor?: string
  bgSelectedColor?: string
}

/** DwTabStrip 提供：选中值与默认视觉，给 Group 和 Content 消费 */
export interface TabStripContext {
  activeKey: ComputedRef<TabStripKey | undefined>
  defaults: ComputedRef<TabStripDefaults>
  select(key: TabStripKey): void
}

export const TAB_STRIP_CONTEXT: InjectionKey<TabStripContext> = Symbol('dw-tab-strip')

/** 只允许在 DwTabStrip 内使用的子组件取 context，越界时统一警告 */
export function useTabStripContext(component: string): TabStripContext | null {
  const context = inject(TAB_STRIP_CONTEXT, null)
  if (!context) {
    console.warn(`[DrawingsUI] ${component} 只能用在 DwTabStrip 内，已停止渲染。`)
  }
  return context
}

export interface TabStripTabInstance {
  /** 唯一标识 = value ?? 顺序索引 */
  key: ComputedRef<TabStripKey>
  /** 根元素，键盘导航后用来聚焦 */
  el: Ref<HTMLElement | null>
}

/** DwTabStripGroup 提供：页签顺序与选中状态，给 DwTabStripButton 消费 */
export interface TabStripGroupContext {
  activeKey: ComputedRef<TabStripKey | undefined>
  hasSelection: ComputedRef<boolean>
  order: ShallowRef<TabStripTabInstance[]>
  defaults: ComputedRef<TabStripDefaults>
  register(tab: TabStripTabInstance): void
  unregister(tab: TabStripTabInstance): void
  select(key: TabStripKey): void
}

export const TAB_STRIP_GROUP_CONTEXT: InjectionKey<TabStripGroupContext> = Symbol('dw-tab-strip-group')

/** 只允许在 DwTabStripGroup 内使用的子组件取 context，越界时统一警告 */
export function useTabStripGroupContext(component: string): TabStripGroupContext | null {
  const context = inject(TAB_STRIP_GROUP_CONTEXT, null)
  if (!context) {
    console.warn(`[DrawingsUI] ${component} 只能用在 DwTabStripGroup 内，已停止渲染。`)
  }
  return context
}
