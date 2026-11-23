<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useSound } from '../composables/useSound'
import { useIcon } from '../composables/useIcon'
import { SOUNDS } from '../utils/sounds'
import type { TabStripItem, TabStripKey } from './types'

defineOptions({ name: 'DwTabStripGroup' })

interface Props {
  /** 标签数据，数组顺序就是显示顺序 */
  items: TabStripItem[]
  /** 当前选中标签的 value，支持 v-model */
  modelValue?: TabStripKey
  /** 单个标签宽度（px），整条栏等长 */
  size?: number
  /** 标签文字颜色 */
  color?: string
  /** 未选中标签的底色 */
  bgColor?: string
  /** 选中标签的底色；需要和内容区底色一致才能无缝衔接 */
  contentColor?: string
  /** 整条栏的默认图标，可被单个 item 覆盖 */
  icon?: string
  /** 是否播放点击音效 */
  sound?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 300,
  sound: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: TabStripKey]
  change: [value: TabStripKey]
}>()

const { play } = useSound()
const { getIconSvg } = useIcon()

const innerKey = ref<TabStripKey | undefined>(props.modelValue)
watch(() => props.modelValue, (value) => {
  innerKey.value = value
})

// 没传 v-model 时默认选中第一个标签
const activeKey = computed<TabStripKey | undefined>(() => innerKey.value ?? props.items[0]?.value)
const activeIndex = computed(() => props.items.findIndex(item => item.value === activeKey.value))
const hasSelection = computed(() => activeIndex.value >= 0)

const tabEls = ref<(HTMLElement | null)[]>([])

function setTabEl(el: unknown, index: number) {
  tabEls.value[index] = el instanceof HTMLElement ? el : null
}

function select(item: TabStripItem) {
  if (innerKey.value === item.value) return
  innerKey.value = item.value
  emit('update:modelValue', item.value)
  emit('change', item.value)
}

function onPointerDown() {
  if (!props.sound) return
  play(SOUNDS.click)
}

function iconOf(item: TabStripItem) {
  return item.icon ?? props.icon
}

function isUrl(icon?: string) {
  if (!icon) return false
  return icon.startsWith('http') || icon.startsWith('/') || icon.includes('.')
}

function iconSvgOf(icon?: string) {
  return icon ? getIconSvg(icon) : null
}

function onKeydown(event: KeyboardEvent) {
  const total = props.items.length
  if (total === 0) return

  const current = activeIndex.value
  let next = current

  switch (event.key) {
    case 'ArrowRight':
      next = (current + 1 + total) % total
      break
    case 'ArrowLeft':
      next = (current - 1 + total) % total
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = total - 1
      break
    default:
      return
  }

  event.preventDefault()
  const item = props.items[next]
  if (!item) return
  select(item)
  tabEls.value[next]?.focus()
}

// 线元素的挖洞位置全部由这几个变量推导
const rootStyle = computed(() => {
  const style: Record<string, string> = {
    '--dw-tabstrip-tab-width': `${props.size}px`,
    '--dw-tabstrip-tab-count': String(Math.max(props.items.length, 1)),
    '--dw-tabstrip-active-index': String(Math.max(activeIndex.value, 0)),
  }
  if (props.bgColor) style['--dw-color-tabstrip-bg'] = props.bgColor
  if (props.contentColor) style['--dw-color-tabstrip-content'] = props.contentColor
  if (props.color) style['--dw-tabstrip-tab-color'] = props.color
  return style
})
</script>

<template>
  <div
    class="dw-tab-strip-group"
    :class="{ 'dw-tab-strip-group--no-selection': !hasSelection }"
    :style="rootStyle"
  >
    <div
      class="dw-tab-strip-group__tabs"
      role="tablist"
      aria-orientation="horizontal"
      @keydown="onKeydown"
    >
      <button
        v-for="(item, index) in items"
        :key="item.value"
        :ref="(el) => setTabEl(el, index)"
        type="button"
        role="tab"
        class="dw-tab-strip-group__tab"
        :class="{ 'dw-tab-strip-group__tab--selected': index === activeIndex }"
        :aria-selected="index === activeIndex ? 'true' : 'false'"
        :tabindex="index === activeIndex ? 0 : -1"
        @pointerdown="onPointerDown"
        @click="select(item)"
      >
        <img
          v-if="isUrl(iconOf(item))"
          :src="iconOf(item)"
          class="dw-tab-strip-group__icon"
          alt=""
        />
        <span
          v-else-if="iconSvgOf(iconOf(item))"
          class="dw-tab-strip-group__icon"
          v-html="iconSvgOf(iconOf(item))"
        />
        <span class="dw-tab-strip-group__label">{{ item.label }}</span>
      </button>
    </div>

    <div class="dw-tab-strip-group__line" aria-hidden="true" />
  </div>
</template>

<style src="./tab-strip-group.scss" />
