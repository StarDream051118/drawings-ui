<script setup lang="ts">
import { computed } from 'vue'
import { useTabStripContext } from './context'

defineOptions({ name: 'DwTabStripFooter' })

interface Props {
  /** 页脚高度；数字按 px 处理，默认与页签组等高 */
  height?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  height: 'auto',
})

const strip = useTabStripContext('DwTabStripFooter')

const footerStyle = computed(() => {
  const style: Record<string, string> = {}
  const height = props.height
  if (height !== undefined && height !== '' && height !== 'auto') {
    style.height = typeof height === 'number' ? `${height}px` : height
  }
  return style
})
</script>

<template>
  <div v-if="strip" class="dw-tabstrip-footer" :style="footerStyle">
    <slot />
  </div>
</template>

<style src="./tab-strip-footer.scss" />
