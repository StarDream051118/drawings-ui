import type { InjectionKey, Ref, ShallowRef } from 'vue'

export type TabType = 'default' | 'primary' | 'danger'
export type TabSize = 'default' | 'medium' | 'large' | number
export type TabActiveEffect = 'border' | 'pressed'
/** 自适应宽度下：auto = 各自按内容撑开，equal = 以最宽的标签为准 */
export type TabWidthMode = 'auto' | 'equal'

/** DwTabs 上的默认值，DwTabButton 未显式传入时回退到这里 */
export interface TabsDefaults {
  type: TabType
  size: TabSize
  disabled: boolean
  sound: boolean
  icon?: string
  iconColor?: string
  bgColor?: string
  color?: string
  activeEffect: TabActiveEffect
  widthMode: TabWidthMode
}

export type TabInstance = object

export interface TabsContext {
  activeIndex: Ref<number>
  order: ShallowRef<TabInstance[]>
  defaults: TabsDefaults
  register(tab: TabInstance): void
  unregister(tab: TabInstance): void
  select(index: number): void
}

export const TABS_CONTEXT: InjectionKey<TabsContext> = Symbol('dw-tabs')
