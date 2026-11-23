<script setup lang="ts">
import { computed } from 'vue'
import DwTabStripGroup from './TabStripGroup.vue'
import type { TabStripItem, TabStripKey } from './types'

defineOptions({ name: 'DwTabStrip' })

interface Props {
  /** 标签数据，数组顺序就是显示顺序 */
  items: TabStripItem[]
  /** 当前选中标签的 value，支持 v-model */
  modelValue?: TabStripKey
  /** 单个标签宽度（px），整条栏等长 */
  size?: number
  /** 标签文字颜色 */
  color?: string
  /** 整条栏的默认图标，可被单个 item 覆盖 */
  icon?: string
  /** 未选中标签的底色，转发给内部 DwTabStripGroup */
  tabBgColor?: string
  /** 内容区底色，同时作为选中标签的底色，两者一致才能无缝衔接 */
  contentColor?: string
  /** 是否播放点击音效 */
  sound?: boolean
  /** 背景图片地址；为空时不铺背景图 */
  bgImage?: string
  /** 背景蒙版色，支持 red / rgb() / rgba() / hsl() / #000000 等任意 CSS 颜色 */
  bgColor?: string
  /** 背景模糊程度（px） */
  bgBlur?: number
  /** 内容区高度；数字按 px 处理，字符串原样透传 */
  contentHeight?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 300,
  tabBgColor: undefined,
  contentColor: undefined,
  sound: true,
  bgImage: '',
  bgColor: '',
  bgBlur: 3,
  contentHeight: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: TabStripKey]
  change: [value: TabStripKey]
}>()

// 只有真的给了背景图或蒙版才铺这一层，避免默认状态下把页面背景也模糊掉
const hasBackdrop = computed(() => Boolean(props.bgImage || props.bgColor))

const rootStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.bgImage) style.backgroundImage = `url(${props.bgImage})`
  if (props.bgColor) style['--dw-tabstrip-mask-color'] = props.bgColor
  if (props.contentColor) style['--dw-color-tabstrip-content'] = props.contentColor
  style['--dw-tabstrip-blur'] = `${props.bgBlur}px`
  return style
})

const contentStyle = computed(() => {
  if (props.contentHeight === undefined || props.contentHeight === '') return undefined
  const height = typeof props.contentHeight === 'number' ? `${props.contentHeight}px` : props.contentHeight
  return { height }
})
</script>

<template>
  <div class="dw-tab-strip" :style="rootStyle">
    <div v-if="hasBackdrop" class="dw-tab-strip__backdrop" aria-hidden="true" />

    <DwTabStripGroup
      :items="items"
      :model-value="modelValue"
      :size="size"
      :color="color"
      :icon="icon"
      :bg-color="tabBgColor"
      :content-color="contentColor"
      :sound="sound"
      @update:model-value="(value) => emit('update:modelValue', value)"
      @change="(value) => emit('change', value)"
    />

    <div class="dw-tab-strip__content" :style="contentStyle">
      <slot />
    </div>
  </div>
</template>

<style src="./tab-strip.scss" />
