<script setup lang="ts">
import { computed } from 'vue'
import { useSound } from '../composables/useSound'
import { useIcon, type BuiltInIcon } from '../composables/useIcon'
import { SOUNDS } from '../utils/sounds'

defineOptions({ name: 'DwTabButton' })

type IconProp = BuiltInIcon | (string & {})
type SizeProp = 'default' | 'medium' | 'large' | number

interface Props {
  type?: 'default' | 'primary' | 'danger'
  size?: SizeProp
  disabled?: boolean
  sound?: boolean
  icon?: IconProp
  iconColor?: string
  bgColor?: string
  color?: string
  /** 是否选中。注意与 DwButton 的 active（按下态）不是一个概念 */
  active?: boolean
  /** 选中时的视觉：border 只高亮描边，pressed 借用禁用态的深底 + 去投影 */
  activeEffect?: 'border' | 'pressed'
  /** 在 DwTabs 中的序号，由容器传入 */
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'default',
  disabled: false,
  sound: true,
  active: false,
  activeEffect: 'border',
  index: 0,
})

const emit = defineEmits<{ (e: 'select', index: number): void }>()

const { play } = useSound()
const { getIconSvg } = useIcon()

const isUrl = computed(() => {
  if (!props.icon) return false
  return props.icon.startsWith('http') || props.icon.startsWith('/') || props.icon.includes('.')
})
const iconSvg = computed(() => props.icon ? getIconSvg(props.icon) : null)

const sizeClass = computed(() => typeof props.size === 'string' ? `dw-tab-button--${props.size}` : '')

const tabStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.bgColor) style.background = props.bgColor
  if (props.color) style.color = props.color
  if (typeof props.size === 'number') style.width = `${props.size}px`
  return style
})

function onPointerDown() {
  if (props.disabled || !props.sound) return
  play(SOUNDS.click)
}

function onClick() {
  if (props.disabled) return
  emit('select', props.index)
}
</script>

<template>
  <button
    type="button"
    role="tab"
    class="dw-tab-button"
    :class="[
      `dw-tab-button--${type}`,
      sizeClass,
      activeEffect === 'pressed' && 'dw-tab-button--active-pressed',
    ]"
    :style="tabStyle"
    :aria-selected="active ? 'true' : 'false'"
    :aria-disabled="disabled ? 'true' : undefined"
    :tabindex="active ? 0 : -1"
    @pointerdown="onPointerDown"
    @click="onClick"
  >
    <img v-if="isUrl" :src="icon" class="dw-tab-button__icon" :style="iconColor ? { color: iconColor } : undefined" />
    <span v-else-if="iconSvg" class="dw-tab-button__icon" :style="iconColor ? { color: iconColor } : undefined" v-html="iconSvg" />
    <slot />
  </button>
</template>

<style src="./tab-button.scss" />
