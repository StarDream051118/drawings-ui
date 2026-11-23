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
}

const props = withDefaults(defineProps<Props>(), {
  size: 'default',
  sound: true,
  bgImage: '',
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
    icon: props.icon,
    color: props.color,
    bgColor: props.bgColor,
    bgSelectedColor: props.bgSelectedColor,
  })),
  select,
})
</script>

<template>
  <div class="dw-tab-strip">
    <div
      v-if="bgImage"
      class="dw-tabstrip-background"
      :style="{ backgroundImage: `url(${bgImage})` }"
      aria-hidden="true"
    />
    <slot />
  </div>
</template>

<style src="./tab-strip.scss" />
