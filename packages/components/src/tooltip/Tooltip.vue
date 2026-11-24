<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { nextTooltipId } from './uid'

defineOptions({ name: 'DwTooltip', inheritAttrs: false })

type TooltipPlacement = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
type VerticalSide = 'top' | 'bottom'
type HorizontalSide = 'left' | 'right'

interface Props {
  /** 提示文字，支持 \n 换行；有 content 插槽时以插槽为准 */
  content?: string
  /** 优先方位，越界时按轴翻转 */
  placement?: TooltipPlacement
  /** 显示延迟（ms） */
  showDelay?: number
  /** 隐藏延迟（ms） */
  hideDelay?: number
  /** 最大宽度，数字按 px 处理 */
  maxWidth?: number | string
  /** 是否禁用提示 */
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  placement: 'bottom-right',
  showDelay: 0,
  hideDelay: 0,
  maxWidth: 240,
  disabled: false,
})

const slots = useSlots()

const triggerEl = ref<HTMLElement | null>(null)
const tooltipEl = ref<HTMLElement | null>(null)
const visible = ref(false)
const positioned = ref(false)
const position = ref({ left: 0, top: 0 })

const tooltipId = nextTooltipId()
const cursor = { x: 0, y: 0 }
const useElementAnchor = ref(false)
const anchorRect = ref<DOMRect | null>(null)

let showTimer = 0
let hideTimer = 0
let frame = 0
let describedEl: HTMLElement | null = null
let previousDescribedBy: string | null = null
let resizeObserver: ResizeObserver | null = null

const tooltipStyle = computed(() => ({
  left: `${position.value.left}px`,
  top: `${position.value.top}px`,
  maxWidth: typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth,
  visibility: positioned.value ? 'visible' : 'hidden',
}))

function hasContent() {
  return Boolean(props.content) || Boolean(slots.content)
}

function getTriggerChild() {
  return (triggerEl.value?.firstElementChild as HTMLElement | null) ?? null
}

function readGap() {
  const tip = tooltipEl.value
  if (!tip) return 12
  const gap = Number.parseFloat(getComputedStyle(tip).getPropertyValue('--dw-tooltip-gap'))
  return Number.isFinite(gap) ? gap : 12
}

function place() {
  const tip = tooltipEl.value
  if (!tip) return

  const rect = tip.getBoundingClientRect()
  const width = rect.width
  const height = rect.height
  const gap = readGap()
  const vw = window.innerWidth
  const vh = window.innerHeight

  // 鼠标触发以光标为锚点；键盘聚焦时以元素的对应角为锚点
  const anchor = useElementAnchor.value && anchorRect.value
    ? {
        x: props.placement.endsWith('right') ? anchorRect.value.right : anchorRect.value.left,
        y: props.placement.startsWith('bottom') ? anchorRect.value.bottom : anchorRect.value.top,
      }
    : cursor

  let [vertical, horizontal] = props.placement.split('-') as [VerticalSide, HorizontalSide]

  const calc = () => ({
    left: horizontal === 'right' ? anchor.x + gap : anchor.x - gap - width,
    top: vertical === 'bottom' ? anchor.y + gap : anchor.y - gap - height,
  })

  // 分轴翻转：只翻转越界的那一根轴，另一轴保持配置方向
  let next = calc()
  if (vertical === 'bottom' && next.top + height > vh) vertical = 'top'
  else if (vertical === 'top' && next.top < 0) vertical = 'bottom'

  next = calc()
  if (horizontal === 'right' && next.left + width > vw) horizontal = 'left'
  else if (horizontal === 'left' && next.left < 0) horizontal = 'right'

  next = calc()
  position.value = {
    left: Math.min(Math.max(next.left, 0), Math.max(vw - width, 0)),
    top: Math.min(Math.max(next.top, 0), Math.max(vh - height, 0)),
  }
  positioned.value = true
}

function open() {
  if (visible.value) {
    nextTick(place)
    return
  }

  visible.value = true
  positioned.value = false
  nextTick(() => {
    place()
    if (!visible.value) return
    observeSize()
    bindDescribedBy()
  })
}

function hide() {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  showTimer = 0
  hideTimer = 0
  if (!visible.value) return

  visible.value = false
  positioned.value = false
  resizeObserver?.disconnect()
  restoreDescribedBy()
}

function scheduleShow() {
  clearTimeout(hideTimer)
  hideTimer = 0
  if (props.disabled || !hasContent() || visible.value) return

  if (props.showDelay > 0) {
    if (!showTimer) {
      showTimer = window.setTimeout(() => {
        showTimer = 0
        open()
      }, props.showDelay)
    }
    return
  }

  open()
}

function scheduleHide() {
  clearTimeout(showTimer)
  showTimer = 0
  if (!visible.value) return

  if (props.hideDelay > 0) {
    if (!hideTimer) {
      hideTimer = window.setTimeout(() => {
        hideTimer = 0
        hide()
      }, props.hideDelay)
    }
    return
  }

  hide()
}

function onPointerEnter(event: PointerEvent) {
  if (event.pointerType === 'touch') return
  cursor.x = event.clientX
  cursor.y = event.clientY
  useElementAnchor.value = false
  scheduleShow()
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === 'touch') return
  cursor.x = event.clientX
  cursor.y = event.clientY
  useElementAnchor.value = false
  if (!visible.value || frame) return

  frame = requestAnimationFrame(() => {
    frame = 0
    place()
  })
}

function onPointerLeave(event: PointerEvent) {
  if (event.pointerType === 'touch') return
  scheduleHide()
}

function onFocusIn() {
  // 鼠标悬浮已经显示时不再跳到元素锚点
  if (visible.value) return

  const child = getTriggerChild() ?? triggerEl.value
  anchorRect.value = child ? child.getBoundingClientRect() : null
  useElementAnchor.value = true
  scheduleShow()
}

function onFocusOut() {
  scheduleHide()
}

function onScroll() {
  if (visible.value || showTimer) hide()
}

function onResize() {
  if (visible.value) place()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') hide()
}

function observeSize() {
  if (!tooltipEl.value || typeof ResizeObserver === 'undefined') return
  if (!resizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      if (visible.value) place()
    })
  }
  resizeObserver.disconnect()
  resizeObserver.observe(tooltipEl.value)
}

function bindDescribedBy() {
  const el = getTriggerChild()
  if (!el) return

  describedEl = el
  previousDescribedBy = el.getAttribute('aria-describedby')
  const ids = previousDescribedBy?.trim()
  el.setAttribute('aria-describedby', ids ? `${ids} ${tooltipId}` : tooltipId)
}

function restoreDescribedBy() {
  if (!describedEl) return

  if (previousDescribedBy === null) describedEl.removeAttribute('aria-describedby')
  else describedEl.setAttribute('aria-describedby', previousDescribedBy)

  describedEl = null
  previousDescribedBy = null
}

watch(() => props.content, () => {
  if (!visible.value) return
  if (!hasContent()) {
    hide()
    return
  }
  nextTick(place)
})

watch(() => props.placement, () => {
  if (visible.value) nextTick(place)
})

watch(() => props.disabled, (value) => {
  if (value) hide()
})

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', onResize)
  window.addEventListener('blur', hide)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('blur', hide)

  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  if (frame) cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
  restoreDescribedBy()
})
</script>

<template>
  <span
    ref="triggerEl"
    v-bind="$attrs"
    class="dw-tooltip-trigger"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <slot />
  </span>

  <Teleport to="body">
    <div
      v-if="visible"
      :id="tooltipId"
      ref="tooltipEl"
      class="dw-tooltip"
      role="tooltip"
      :style="tooltipStyle"
    >
      <slot name="content">{{ content }}</slot>
    </div>
  </Teleport>
</template>

<style src="./tooltip.scss" />
