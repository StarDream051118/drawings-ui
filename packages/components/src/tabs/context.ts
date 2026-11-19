import type { ComputedRef, InjectionKey, Ref, ShallowRef } from 'vue'

export type TabType = 'default' | 'primary' | 'danger'
export type TabSize = 'default' | 'medium' | 'large' | number
export type TabActiveEffect = 'border' | 'pressed'
/** 自适应宽度下：auto = 各自按内容撑开，equal = 以最宽的标签为准 */
export type TabWidthMode = 'auto' | 'equal'
/** 标签的唯一标识：优先用 value，未传时回退成顺序索引 */
export type TabKey = string | number

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
  activeLine: boolean
  widthMode: TabWidthMode
}

export interface TabInstance {
  /** 唯一标识 = value ?? 顺序索引 */
  key: ComputedRef<TabKey>
  /** 是否禁用：点击与键盘导航都会跳过 */
  disabled: Ref<boolean>
  /** 根元素，键盘导航后用来聚焦 */
  el: Ref<HTMLElement | null>
}

export interface TabsContext {
  /** 当前选中项的 key；一个标签都没有时是 undefined */
  activeKey: ComputedRef<TabKey | undefined>
  /** 是否存在能对上的选中项（没有时让第一个可选标签可聚焦） */
  hasSelection: ComputedRef<boolean>
  order: ShallowRef<TabInstance[]>
  defaults: TabsDefaults
  register(tab: TabInstance): void
  unregister(tab: TabInstance): void
  select(key: TabKey): void
}

export const TABS_CONTEXT: InjectionKey<TabsContext> = Symbol('dw-tabs')
