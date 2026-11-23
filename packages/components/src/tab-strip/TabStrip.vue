<script setup lang="ts">
import { computed, provide, ref, watch } from 'vue'
import {
  TAB_STRIP_CONTEXT,
  type TabStripDefaults,
  type TabStripKey,
  type TabStripSize,
} from './context'

defineOptions({ name: 'DwTabStrip' })

interface Props {
  /** 当前选中页签的 value，支持 v-model */
  modelValue?: TabStripKey
  /** 单个页签宽度；'default' 按最宽标签测量后等长 */
  size?: TabStripSize
  /** 是否播放点击音效 */
  sound?: boolean
  /** 是否整体禁用：禁用后不可点击，所有页签按未选中样式显示 */
  disabled?: boolean
  /** 整条栏的默认图标，可被单个 DwTabStripButton 覆盖 */
  icon?: string
  /** 页签文字颜色 */
  color?: string
  /** 未选中页签的底色 */
  bgColor?: string
  /** 选中页签的底色；DwTabStripContent 的内容区底色会跟随它，保证无缝衔接 */
  bgSelectedColor?: string
  /** 背景图片地址；铺满整条页签栏（含页签区），为空时不铺 */
  bgImage?: string
  /** 背景模糊程度（px） */
  bgBlur?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  sound: true,
  disabled: false,
  bgImage: '',
  bgBlur: 3,
})

const emit = defineEmits<{
  'update:modelValue': [value: TabStripKey]
  change: [value: TabStripKey]
}>()

const innerKey = ref<TabStripKey | undefined>(props.modelValue)
watch(() => props.modelValue, (value) => {
  innerKey.value = value
})

function select(key: TabStripKey) {
  if (innerKey.value === key) return
  innerKey.value = key
  emit('update:modelValue', key)
  emit('change', key)
}

provide(TAB_STRIP_CONTEXT, {
  activeKey: computed(() => innerKey.value),
  // props 本身就是响应式的，直接作为默认值来源下发
  defaults: computed<TabStripDefaults>(() => ({
    size: props.size,
    sound: props.sound,
    disabled: props.disabled,
    icon: props.icon,
    color: props.color,
    bgColor: props.bgColor,
    bgSelectedColor: props.bgSelectedColor,
  })),
  select,
})

const rootStyle = computed(() => {
  const style: Record<string, string> = {
    '--dw-tabstrip-blur': `${props.bgBlur}px`,
  }
  if (props.bgImage) style['--dw-tabstrip-bg-image'] = `url(${props.bgImage})`
  return style
})
</script>

<template>
  <div class="dw-tab-strip" :style="rootStyle">
    <div v-if="bgImage" class="dw-tabstrip-background" aria-hidden="true" />
    <slot />
  </div>
</template>

<style src="./tab-strip.scss" />
