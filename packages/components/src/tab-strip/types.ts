/** 标签的唯一标识：和 DwTabStripGroup 的 v-model 比对 */
export type TabStripKey = string | number

export interface TabStripItem {
  /** 唯一标识，同一条栏内必须唯一；重名时只有第一个能被选中 */
  value: TabStripKey
  /** 标签文字 */
  label: string
  /** 单个标签的图标：内置图标名或图片 URL；不传时回退到整条栏的 icon */
  icon?: string
}
