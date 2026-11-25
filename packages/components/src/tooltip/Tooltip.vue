<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import type { CSSProperties } from 'vue'
import TooltipTrigger from './TooltipTrigger'
import { nextTooltipId } from './uid'

defineOptions({ name: 'DwTooltip', inheritAttrs: false })

type TooltipPlacement = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
type VerticalSide = 'top' | 'bottom'
type HorizontalSide = 'left' | 'right'

interface Props {
  /** 提示文字，支持 \n 换行；有 content 插槽时以插槽为准 */
  content?: string
  /** 优先方位，越界时按轴翻转到光标另一侧 */
  placement?: TooltipPlacement
  /** 显示延迟（ms） */
  showDelay?: number
  /** 隐藏延迟（ms） */
  hideDelay?: number
  /** 是否禁用提示 */
  disabled?: boolean
  /** 是否启用触屏长按显示 */
  touch?: boolean
  /** 触屏长按触发时长（ms） */
  touchDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  content: '',
  placement: 'bottom-right',
  showDelay: 0,
  hideDelay: 0,
  disabled: false,
  touch: false,
  touchDelay: 500,
})

const slots = useSlots()

const triggerEl = ref<HTMLElement | null>(null)
const tooltipEl = ref<HTMLElement | null>(null)
const visible = ref(false)
const positioned = ref(false)
const position = ref({ left: 0, top: 0 })

const tooltipId = nextTooltipId()
const cursor = { x: 0, y: 0 }

let showTimer = 0
let hideTimer = 0
let touchTimer = 0
let frame = 0
let touchShown = false
// 指针聚焦标记：鼠标/触摸按下紧随其后的 focusin 不应把锚点切到元素右下角
let pointerFocus = false
let pointerFocusTimer = 0
// 锚点来源：pointer 跟随光标，element 用键盘聚焦元素当前的右下角
let anchorMode: 'pointer' | 'element' = 'pointer'
const touchStart = { x: 0, y: 0 }
let resizeObserver: ResizeObserver | null = null

const tooltipStyle = computed<CSSProperties>(() => ({
  left: `${position.value.left}px`,
  top: `${position.value.top}px`,
  visibility: positioned.value ? 'visible' : 'hidden',
}))

function hasContent() {
  return Boolean(props.content) || Boolean(slots.content)
}

function readGap() {
  const tip = tooltipEl.value
  if (!tip) return 25
  const gap = Number.parseFloat(getComputedStyle(tip).getPropertyValue('--dw-tooltip-gap'))
  return Number.isFinite(gap) ? gap : 25
}

function place() {
  const tip = tooltipEl.value
  if (!tip) return

  const rect = tip.getBoundingClientRect()
  const width = rect.width
  const height = rect.height
  const gap = readGap()
  const vw = document.documentElement.clientWidth
  const vh = document.documentElement.clientHeight

  // 鼠标触发跟随光标；键盘聚焦按触发元素**当前**的右下角，窗口缩放后重新取
  let anchor = cursor
  if (anchorMode === 'element' && triggerEl.value) {
    const triggerRect = triggerEl.value.getBoundingClientRect()
    anchor = { x: triggerRect.right, y: triggerRect.bottom }
  }

  let [vertical, horizontal] = props.placement.split('-') as [VerticalSide, HorizontalSide]

  const calc = () => ({
    left: horizontal === 'right' ? anchor.x + gap : anchor.x - gap - width,
    top: vertical === 'bottom' ? anchor.y + gap : anchor.y - gap - height,
  })

  // 分轴翻转：碰到哪一侧就整体放到光标另一侧，另一轴保持配置方向
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
  })
}

function hide() {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  clearTouchTimer()
  if (frame) {
    cancelAnimationFrame(frame)
    frame = 0
  }
  showTimer = 0
  hideTimer = 0
  touchShown = false
  if (!visible.value) return

  visible.value = false
  positioned.value = false
  resizeObserver?.disconnect()
}

function clearTouchTimer() {
  if (!touchTimer) return
  clearTimeout(touchTimer)
  touchTimer = 0
}

function markPointerFocus() {
  pointerFocus = true
  clearTimeout(pointerFocusTimer)
  // focusin 在 pointerdown 的默认行为里同步派发，下一轮任务再复位
  pointerFocusTimer = window.setTimeout(() => {
    pointerFocus = false
    pointerFocusTimer = 0
  }, 0)
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
  rememberTrigger(event)
  anchorMode = 'pointer'
  cursor.x = event.clientX
  cursor.y = event.clientY
  scheduleShow()
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === 'touch') {
    onTouchMove(event)
    return
  }
  anchorMode = 'pointer'
  cursor.x = event.clientX
  cursor.y = event.clientY
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

function onFocusIn(event: FocusEvent) {
  if (props.disabled || !hasContent()) return

  const target = event.target as HTMLElement | null
  if (!target) return
  rememberTrigger(event)

  // 指针聚焦不切换锚点：文本输入框在 Chrome 中鼠标点击也会匹配 :focus-visible，
  // 不排除的话提示会从光标位置跳到元素右下角
  if (pointerFocus) return

  // 只响应键盘焦点：鼠标/触摸点击导致的聚焦不额外弹出提示
  let focusVisible = true
  try {
    focusVisible = target.matches(':focus-visible')
  } catch {
    // 不支持 :focus-visible 的浏览器按普通焦点处理
  }
  if (!focusVisible) return

  // 键盘聚焦：以触发元素右下角作为锚点
  anchorMode = 'element'
  const rect = target.getBoundingClientRect()
  cursor.x = rect.right
  cursor.y = rect.bottom
  scheduleShow()
}

function onFocusOut() {
  scheduleHide()
}

function onPointerDown(event: PointerEvent) {
  markPointerFocus()
  if (event.pointerType !== 'touch' || !props.touch) return
  if (props.disabled || !hasContent()) return
  rememberTrigger(event)

  touchStart.x = event.clientX
  touchStart.y = event.clientY
  clearTouchTimer()
  touchTimer = window.setTimeout(() => {
    touchTimer = 0
    anchorMode = 'pointer'
    cursor.x = touchStart.x
    cursor.y = touchStart.y
    open()
    touchShown = true
  }, Math.max(props.touchDelay, 0))
}

function onTouchMove(event: PointerEvent) {
  if (event.pointerType !== 'touch' || !touchTimer) return

  // 移动超过 10px 视为滚动/拖拽，取消长按
  const dx = event.clientX - touchStart.x
  const dy = event.clientY - touchStart.y
  if (Math.hypot(dx, dy) > 10) clearTouchTimer()
}

function onPointerUp(event: PointerEvent) {
  if (event.pointerType === 'touch') clearTouchTimer()
}

function onPointerCancel(event: PointerEvent) {
  if (event.pointerType !== 'touch') return
  clearTouchTimer()
  if (touchShown) hide()
}

// 触摸长按显示后，点击其它位置关闭
function onDocumentPointerDown(event: PointerEvent) {
  if (!touchShown) return
  const wrap = triggerEl.value
  if (wrap && event.target instanceof Node && wrap.contains(event.target)) return
  hide()
}

function onScroll() {
  if (visible.value || showTimer) hide()
}

function onResize() {
  if (!visible.value) return

  // 指针锚点：窗口尺寸变化会重排布局，光标可能已不在触发元素上。
  // 此时隐藏，避免提示停在旧坐标；鼠标再次移入会重新显示
  if (anchorMode === 'pointer') {
    const el = triggerEl.value
    const hit = el ? document.elementFromPoint(cursor.x, cursor.y) : null
    if (el && (!hit || !el.contains(hit))) {
      hide()
      return
    }
  }

  place()
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

function rememberTrigger(event: Event) {
  const el = event.currentTarget
  if (el instanceof HTMLElement) triggerEl.value = el
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
  document.addEventListener('pointerdown', onDocumentPointerDown, true)
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onScroll, true)
  window.addEventListener('resize', onResize)
  window.addEventListener('blur', hide)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onScroll, true)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('blur', hide)

  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  clearTimeout(pointerFocusTimer)
  clearTouchTimer()
  if (frame) cancelAnimationFrame(frame)
  resizeObserver?.disconnect()
})
</script>

<template>
  <TooltipTrigger
    v-bind="$attrs"
    :described-by="tooltipId"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
    @pointerdown="onPointerDown"
    @pointerup="onPointerUp"
    @pointercancel="onPointerCancel"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
  >
    <slot />
  </TooltipTrigger>

  <Teleport to="body">
    <div
      v-show="visible"
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
