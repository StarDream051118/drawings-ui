<script setup lang="ts">
import { computed, inject, onUnmounted } from 'vue'
import { useSound } from '../composables/useSound'
import { useIcon } from '../composables/useIcon'
import { SOUNDS } from '../utils/sounds'
import { TABS_CONTEXT } from './context'

defineOptions({ name: 'DwTabButton' })

interface Props {
  type?: 'default' | 'primary' | 'danger'
  disabled?: boolean
  sound?: boolean
  icon?: string
  iconColor?: string
  bgColor?: string
  color?: string
  /** 选中时的视觉；不传时跟随 DwTabs 的 active-effect */
  activeEffect?: 'border' | 'pressed'
}

const props = withDefaults(defineProps<Props>(), {
  // boolean 必须显式给默认值，否则「未传」会被 Vue 解析成 false，
  // 导致 DwTabs 上的 sound / disabled 永远无法下发到子组件
  disabled: false,
  sound: true,
})

const tabs = inject(TABS_CONTEXT, null)
const self: object = {}

if (tabs) {
  tabs.register(self)
  onUnmounted(() => tabs.unregister(self))
}

// 选中状态完全由 DwTabs 决定，TabButton 自己不持有
const index = computed(() => tabs ? tabs.order.value.indexOf(self) : -1)
const isActive = computed(() => tabs ? tabs.activeIndex.value === index.value : false)

const resolvedType = computed(() => props.type ?? tabs?.defaults.type ?? 'default')
// 尺寸只由 DwTabs 控制：整条标签栏统一宽度，子标签不单独设置
const resolvedSize = computed(() => tabs?.defaults.size ?? 'default')
const resolvedDisabled = computed(() => props.disabled || (tabs?.defaults.disabled ?? false))
const resolvedSound = computed(() => props.sound && (tabs?.defaults.sound ?? true))
const resolvedEffect = computed(() => props.activeEffect ?? tabs?.defaults.activeEffect ?? 'border')
const resolvedIcon = computed(() => props.icon ?? tabs?.defaults.icon)
const resolvedIconColor = computed(() => props.iconColor ?? tabs?.defaults.iconColor)
const resolvedBgColor = computed(() => props.bgColor ?? tabs?.defaults.bgColor)
const resolvedColor = computed(() => props.color ?? tabs?.defaults.color)

const { play } = useSound()
const { getIconSvg } = useIcon()

const isUrl = computed(() => {
  const icon = resolvedIcon.value
  if (!icon) return false
  return icon.startsWith('http') || icon.startsWith('/') || icon.includes('.')
})
const iconSvg = computed(() => resolvedIcon.value ? getIconSvg(resolvedIcon.value) : null)

const sizeClass = computed(() => {
  const size = resolvedSize.value
  if (typeof size !== 'string' || size === 'default') return ''
  return `dw-tab-button--${size}`
})

const tabStyle = computed(() => {
  const style: Record<string, string> = {}
  if (resolvedBgColor.value) style.background = resolvedBgColor.value
  if (resolvedColor.value) style.color = resolvedColor.value
  if (typeof resolvedSize.value === 'number') style.width = `${resolvedSize.value}px`
  return Object.keys(style).length > 0 ? style : undefined
})

function onPointerDown() {
  if (resolvedDisabled.value || !resolvedSound.value) return
  play(SOUNDS.click)
}

function onClick() {
  if (resolvedDisabled.value) return
  tabs?.select(index.value)
}
</script>

<template>
  <button
    type="button"
    role="tab"
    class="dw-tab-button"
    :class="[
      `dw-tab-button--${resolvedType}`,
      sizeClass,
      resolvedEffect === 'pressed' && 'dw-tab-button--active-pressed',
    ]"
    :style="tabStyle"
    :aria-selected="isActive ? 'true' : 'false'"
    :aria-disabled="resolvedDisabled ? 'true' : undefined"
    :tabindex="tabs ? (isActive ? 0 : -1) : 0"
    @pointerdown="onPointerDown"
    @click="onClick"
  >
    <img v-if="isUrl" :src="resolvedIcon" class="dw-tab-button__icon" :style="resolvedIconColor ? { color: resolvedIconColor } : undefined" />
    <span v-else-if="iconSvg" class="dw-tab-button__icon" :style="resolvedIconColor ? { color: resolvedIconColor } : undefined" v-html="iconSvg" />
    <slot />
  </button>
</template>

<style src="./tab-button.scss" />
