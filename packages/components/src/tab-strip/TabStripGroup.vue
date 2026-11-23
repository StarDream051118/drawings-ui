<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
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
  /** 未传时继承 DwTabStrip 的 disabled */
  disabled?: boolean
  icon?: string
  color?: string
  bgColor?: string
  bgSelectedColor?: string
}

// disabled / sound 必须显式给 undefined 默认值：否则 Vue 会把「未传」的 Boolean prop
// 转成 false，`props.x ?? 父级` 就永远拿不到父级的值
const props = withDefaults(defineProps<Props>(), {
  sound: undefined,
  disabled: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [value: TabStripKey]
  change: [value: TabStripKey]
}>()

// 独立使用时没有父级 context，静默回落到自己的 props
const strip = inject(TAB_STRIP_CONTEXT, null)

const rootEl = ref<HTMLElement | null>(null)
const lineEl = ref<HTMLElement | null>(null)
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
    disabled: props.disabled ?? base?.disabled ?? false,
    icon: props.icon ?? base?.icon,
    color: props.color ?? base?.color,
    bgColor: props.bgColor ?? base?.bgColor,
    bgSelectedColor: props.bgSelectedColor ?? base?.bgSelectedColor,
  }
})

const isDisabled = computed(() => defaults.value.disabled)

// 父级持有的 key 对不上（或没传）时回落到第一个页签，和 DwTabs 的行为一致
const activeKey = computed<TabStripKey | undefined>(() => {
  const candidate = strip ? strip.activeKey.value : innerKey.value
  if (candidate !== undefined && keys.value.includes(candidate)) return candidate
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
  if (isDisabled.value) return
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

// 重复 key 提醒：同名页签只有第一个能被选中
let duplicateWarned = false
watch(keys, (list) => {
  const seen = new Set<TabStripKey>()
  const duplicates: TabStripKey[] = []

  for (const key of list) {
    if (seen.has(key)) {
      if (!duplicates.includes(key)) duplicates.push(key)
    } else {
      seen.add(key)
    }
  }

  if (duplicates.length === 0) {
    duplicateWarned = false
    return
  }
  if (duplicateWarned) return

  duplicateWarned = true
  console.warn(`[DrawingsUI] DwTabStripGroup 检测到重复的 value：${duplicates.map(String).join('、')}，同名页签只有第一个能被选中。`)
}, { immediate: true })

// 描边宽度跟随 token，避免 3px 散落在各处
function resolveBorderWidth() {
  const el = rootEl.value
  if (!el) return 3
  const px = Number.parseFloat(getComputedStyle(el).getPropertyValue('--dw-tabstrip-border-width'))
  return Number.isFinite(px) ? px : 3
}

// 断口用「实际渲染位置」定位，而不是索引 × 等宽：
// size 小于文字宽度时页签会被 min-width 撑宽，靠公式推会错位
let lastSignature = ''

function syncMeasure(force = false) {
  const el = rootEl.value
  if (!el) return

  const line = lineEl.value
  const tabs = Array.from(el.querySelectorAll<HTMLElement>('[role="tab"]'))

  if (tabs.length === 0) {
    line?.style.removeProperty('--dw-tabstrip-window-left')
    line?.style.removeProperty('--dw-tabstrip-window-right')
    return
  }

  // 没变化就整段跳过，避免每次更新都强制回读布局
  const signature = [
    defaults.value.size,
    activeIndex.value,
    el.clientWidth,
    tabs.map(tab => tab.textContent ?? '').join('\u0000'),
  ].join('|')
  if (!force && signature === lastSignature) return
  lastSignature = signature

  // 'default' 没有固定宽度：先按内容撑开，量出最宽值后统一等宽
  if (defaults.value.size === 'default') {
    el.style.setProperty('--dw-tabstrip-tab-width', 'auto')

    let max = 0
    tabs.forEach((tab) => {
      max = Math.max(max, tab.getBoundingClientRect().width)
    })

    if (max > 0) el.style.setProperty('--dw-tabstrip-tab-width', `${Math.ceil(max)}px`)
  }

  if (!line) return

  const tab = isDisabled.value ? undefined : tabs[activeIndex.value]

  // 没有选中项或被禁用时撤掉测量值，交给 --no-selection 的整条线
  if (!tab) {
    line.style.removeProperty('--dw-tabstrip-window-left')
    line.style.removeProperty('--dw-tabstrip-window-right')
    return
  }

  const border = resolveBorderWidth()
  const left = tab.offsetLeft
  const right = left + tab.offsetWidth
  line.style.setProperty('--dw-tabstrip-window-left', `${left + border}px`)
  line.style.setProperty('--dw-tabstrip-window-right', `${right - border}px`)
}

let mutationObserver: MutationObserver | null = null

function onResize() {
  syncMeasure(true)
}

onMounted(() => {
  syncMeasure(true)
  window.addEventListener('resize', onResize)
  // 像素字体加载完之前量出来的是回退字体宽度，加载完再量一次
  document.fonts?.ready.then(() => syncMeasure(true)).catch(() => {})

  // 只监听页签的增删与文字变化，属性（class）变化不算
  const tabsEl = rootEl.value?.querySelector('.dw-tab-strip-group__tabs')
  if (tabsEl && typeof MutationObserver !== 'undefined') {
    mutationObserver = new MutationObserver(() => syncMeasure())
    mutationObserver.observe(tabsEl, { childList: true, characterData: true, subtree: true })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  mutationObserver?.disconnect()
})

watch([() => defaults.value.size, activeIndex, () => order.value.length], () => {
  nextTick(() => syncMeasure())
})

function onKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return

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
  else style['--dw-tabstrip-tab-width'] = 'auto' // 'default'：先撑开，再由 syncMeasure 写入测量值

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
    :class="{ 'dw-tab-strip-group--no-selection': !hasSelection || isDisabled }"
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

    <div ref="lineEl" class="dw-tab-strip-group__line" aria-hidden="true" />
  </div>
</template>

<style src="./tab-strip-group.scss" />
