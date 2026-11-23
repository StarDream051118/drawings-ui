<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  provide,
  ref,
  shallowRef,
  watch,
} from 'vue'
import {
  TAB_STRIP_CONTEXT,
  TAB_STRIP_GROUP_CONTEXT,
  type TabStripDefaults,
  type TabStripKey,
  type TabStripSize,
  type TabStripTabInstance,
} from './context'

defineOptions({ name: 'DwTabStripGroup' })

interface Props {
  /** 独立使用时自己持有选中值；放在 DwTabStrip 内时以父组件的 v-model 为准 */
  modelValue?: TabStripKey
  /** 未传时继承 DwTabStrip 的 size */
  size?: TabStripSize
  /** 未传时继承 DwTabStrip 的 sound */
  sound?: boolean
  icon?: string
  color?: string
  bgColor?: string
  bgSelectedColor?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: TabStripKey]
  change: [value: TabStripKey]
}>()

const strip = inject(TAB_STRIP_CONTEXT, null)

const rootEl = ref<HTMLElement | null>(null)
const order = shallowRef<TabStripTabInstance[]>([])
const innerKey = ref<TabStripKey | undefined>(props.modelValue)
watch(() => props.modelValue, (value) => {
  innerKey.value = value
})

const keys = computed(() => order.value.map(tab => tab.key.value))
const hasSelection = computed(() => keys.value.includes(activeKey.value as TabStripKey))

const defaults = computed<TabStripDefaults>(() => {
  const base = strip?.defaults.value
  return {
    size: props.size ?? base?.size ?? 'default',
    sound: props.sound ?? base?.sound ?? true,
    icon: props.icon ?? base?.icon,
    color: props.color ?? base?.color,
    bgColor: props.bgColor ?? base?.bgColor,
    bgSelectedColor: props.bgSelectedColor ?? base?.bgSelectedColor,
  }
})

// 放在 DwTabStrip 内时选中值由父组件持有，独立使用时回退到第一个页签
const activeKey = computed<TabStripKey | undefined>(() => {
  if (strip) return strip.activeKey.value
  if (innerKey.value !== undefined && keys.value.includes(innerKey.value)) return innerKey.value
  return keys.value[0]
})

const activeIndex = computed(() => keys.value.indexOf(activeKey.value as TabStripKey))

function register(tab: TabStripTabInstance) {
  order.value = [...order.value, tab]
}

function unregister(tab: TabStripTabInstance) {
  order.value = order.value.filter(item => item !== tab)
}

function select(key: TabStripKey) {
  if (!order.value.some(tab => tab.key.value === key)) return
  if (key === activeKey.value) return

  if (strip) {
    strip.select(key)
    return
  }

  innerKey.value = key
  emit('update:modelValue', key)
  emit('change', key)
}

provide(TAB_STRIP_GROUP_CONTEXT, {
  activeKey,
  hasSelection,
  order,
  defaults,
  register,
  unregister,
  select,
})

// 'default' 时先按内容撑开，再量出最宽那个页签统一宽度，线元素的挖洞公式才有固定值可用
function syncAutoWidth() {
  const el = rootEl.value
  if (!el) return
  if (defaults.value.size !== 'default') return

  // 先退回 auto 才能量到各页签自己的内容宽度；不能直接 removeProperty，
  // 否则会继承 :root 里的 --dw-tabstrip-tab-width 默认值
  el.style.setProperty('--dw-tabstrip-tab-width', 'auto')

  let max = 0
  el.querySelectorAll<HTMLElement>('[role="tab"]').forEach((tab) => {
    max = Math.max(max, tab.getBoundingClientRect().width)
  })

  if (max > 0) el.style.setProperty('--dw-tabstrip-tab-width', `${Math.ceil(max)}px`)
}

onMounted(() => {
  syncAutoWidth()
  window.addEventListener('resize', syncAutoWidth)
  document.fonts?.ready.then(() => syncAutoWidth()).catch(() => {})
})

onUpdated(syncAutoWidth)

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncAutoWidth)
})

watch(() => defaults.value.size, () => {
  nextTick(syncAutoWidth)
})

function onKeydown(event: KeyboardEvent) {
  const total = order.value.length
  if (total === 0) return

  const current = activeIndex.value
  let next = current

  switch (event.key) {
    case 'ArrowRight':
      next = current === -1 ? 0 : (current + 1) % total
      break
    case 'ArrowLeft':
      next = current === -1 ? total - 1 : (current - 1 + total) % total
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
  const tab = order.value[next]
  if (!tab) return
  select(tab.key.value)
  tab.el.value?.focus()
}

const rootStyle = computed(() => {
  const style: Record<string, string> = {
    '--dw-tabstrip-tab-count': String(Math.max(order.value.length, 1)),
    '--dw-tabstrip-active-index': String(Math.max(activeIndex.value, 0)),
  }

  const size = defaults.value.size
  if (size === 'medium') style['--dw-tabstrip-tab-width'] = 'var(--dw-width-md)'
  else if (size === 'large') style['--dw-tabstrip-tab-width'] = 'var(--dw-width-xl)'
  else if (typeof size === 'number') style['--dw-tabstrip-tab-width'] = `${size}px`
  else style['--dw-tabstrip-tab-width'] = 'auto' // 'default'：先撑开，再由 syncAutoWidth 写入测量值

  if (defaults.value.bgColor) style['--dw-color-tabstrip-bg'] = defaults.value.bgColor
  if (defaults.value.bgSelectedColor) style['--dw-color-tabstrip-content'] = defaults.value.bgSelectedColor
  if (defaults.value.color) style['--dw-tabstrip-tab-color'] = defaults.value.color

  return style
})
</script>

<template>
  <div
    ref="rootEl"
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
      <slot />
    </div>

    <div class="dw-tab-strip-group__line" aria-hidden="true" />
  </div>
</template>

<style src="./tab-strip-group.scss" />
