<script setup lang="ts">
import { computed, inject } from 'vue'
import { TAB_STRIP_CONTEXT } from './context'

defineOptions({ name: 'DwTabStripContent' })

interface Props {
  /** 背景模糊程度（px），模糊的是 DwTabStrip 铺的背景图 */
  bgBlur?: number
  /** 内容区高度；数字按 px 处理，默认 auto 由内容撑开 */
  contentHeight?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  bgBlur: 3,
  contentHeight: 'auto',
})

const strip = inject(TAB_STRIP_CONTEXT, null)
if (!strip) {
  console.warn('[DrawingsUI] DwTabStripContent 只能用在 DwTabStrip 内，已停止渲染。')
}

const contentStyle = computed(() => {
  const style: Record<string, string> = {
    '--dw-tabstrip-blur': `${props.bgBlur}px`,
  }

  // 内容区底色必须与选中页签一致，无缝衔接靠这一个值
  const selected = strip?.defaults.value.bgSelectedColor
  if (selected) style['--dw-color-tabstrip-content'] = selected

  const height = props.contentHeight
  if (height !== undefined && height !== '' && height !== 'auto') {
    style.height = typeof height === 'number' ? `${height}px` : height
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
