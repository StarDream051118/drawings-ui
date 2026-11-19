<script setup lang="ts">
import { computed, inject, onUnmounted, ref } from 'vue'
import { useSound } from '../composables/useSound'
import { useIcon } from '../composables/useIcon'
import { SOUNDS } from '../utils/sounds'
import { TABS_CONTEXT, type TabInstance, type TabKey } from './context'

defineOptions({ name: 'DwTabButton' })

interface Props {
  /** 唯一标识，和 DwTabs 的 v-model 比对；不传时回退成顺序索引 */
  value?: TabKey
  type?: 'default' | 'primary' | 'danger'
  disabled?: boolean
  sound?: boolean
  icon?: string
  iconColor?: string
  bgColor?: string
  color?: string
  /** 选中时的视觉；不传时跟随 DwTabs 的 active-effect */
  activeEffect?: 'border' | 'pressed'
  /** 选中时文字是否加下划线，与 DwTabs 的同名 prop 取「与」 */
  activeLine?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  // boolean 必须显式给默认值，否则「未传」会被 Vue 解析成 false，
  // 导致 DwTabs 上的 sound / disabled / activeLine 永远无法下发到子组件
  disabled: false,
  sound: true,
  activeLine: true,
})

const tabs = inject(TABS_CONTEXT, null)

const resolvedType = computed(() => props.type ?? tabs?.defaults.type ?? 'default')
// 尺寸只由 DwTabs 控制：整条标签栏统一宽度，子标签不单独设置
const resolvedSize = computed(() => tabs?.defaults.size ?? 'default')
const resolvedDisabled = computed(() => props.disabled || (tabs?.defaults.disabled ?? false))
const resolvedSound = computed(() => props.sound && (tabs?.defaults.sound ?? true))
const resolvedEffect = computed(() => props.activeEffect ?? tabs?.defaults.activeEffect ?? 'border')
const resolvedActiveLine = computed(() => props.activeLine && (tabs?.defaults.activeLine ?? true))
const resolvedIcon = computed(() => props.icon ?? tabs?.defaults.icon)
const resolvedIconColor = computed(() => props.iconColor ?? tabs?.defaults.iconColor)
const resolvedBgColor = computed(() => props.bgColor ?? tabs?.defaults.bgColor)
const resolvedColor = computed(() => props.color ?? tabs?.defaults.color)

// 注册给 DwTabs：唯一标识、禁用状态和元素都由容器统一管理
const elRef = ref<HTMLElement | null>(null)
const instance: TabInstance = {
  // key = value ?? 顺序索引（index 在下面声明，computed 是惰性的，首次读取时已初始化）
  key: computed<TabKey>(() => props.value ?? index.value),
  disabled: resolvedDisabled,
  el: elRef,
}

if (tabs) {
  tabs.register(instance)
  onUnmounted(() => tabs.unregister(instance))
}

const index = computed(() => tabs ? tabs.order.value.indexOf(instance) : -1)
const isActive = computed(() => {
  if (!tabs) return false
  const key = instance.key.value
  if (tabs.activeKey.value !== key) return false
  // 重复 key 时只让第一个匹配项生效
  return tabs.order.value.find(tab => tab.key.value === key) === instance
})

// 没有任何选中项时，让第一个可选标签保持可聚焦
const isFirstEnabled = computed(() => {
  if (!tabs) return true
  return tabs.order.value.findIndex(tab => !tab.disabled.value) === index.value
})
const isTabbable = computed(() => {
  if (!tabs) return true
  return isActive.value || (!tabs.hasSelection.value && isFirstEnabled.value)
})

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
  tabs?.select(instance.key.value)
}
</script>

<template>
  <button
    ref="elRef"
    type="button"
    role="tab"
    class="dw-tab-button"
    :class="[
      `dw-tab-button--${resolvedType}`,
      sizeClass,
      resolvedEffect === 'pressed' && 'dw-tab-button--active-pressed',
      isActive && resolvedActiveLine && 'dw-tab-button--active-line',
    ]"
    :style="tabStyle"
    :aria-selected="isActive ? 'true' : 'false'"
    :aria-disabled="resolvedDisabled ? 'true' : undefined"
    :tabindex="isTabbable ? 0 : -1"
    @pointerdown="onPointerDown"
    @click="onClick"
  >
    <img v-if="isUrl" :src="resolvedIcon" class="dw-tab-button__icon" :style="resolvedIconColor ? { color: resolvedIconColor } : undefined" />
    <span v-else-if="iconSvg" class="dw-tab-button__icon" :style="resolvedIconColor ? { color: resolvedIconColor } : undefined" v-html="iconSvg" />
    <span class="dw-tab-button__label"><slot /></span>
  </button>
</template>

<style src="./tab-button.scss" />
