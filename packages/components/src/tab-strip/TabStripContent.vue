<script setup lang="ts">
import { computed } from 'vue'
import { useTabStripContext } from './context'

defineOptions({ name: 'DwTabStripContent' })

interface Props {
  /** 内容区最小高度；内容更高时按内容高度显示，数字按 px 处理 */
  contentHeight?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  contentHeight: 'auto',
})

const strip = useTabStripContext('DwTabStripContent')

const contentStyle = computed(() => {
  const style: Record<string, string> = {}

  // 内容区底色必须与选中页签一致，无缝衔接靠这一个值
  const selected = strip?.defaults.value.bgSelectedColor
  if (selected) style['--dw-color-tabstrip-content'] = selected

  const height = props.contentHeight
  if (height !== undefined && height !== '' && height !== 'auto') {
    // 用 min-height 而不是 height：内容比它高时以内容为准，没内容时才允许缩到设定值
    style.minHeight = typeof height === 'number' ? `${height}px` : height
  }

  return style
})
</script>

<template>
  <div v-if="strip" class="dw-tabstrip-content" :style="contentStyle">
    <slot />
  </div>
</template>

<style src="./tab-strip-content.scss" />
