<script setup lang="ts">
import { computed } from 'vue'
import { useSound } from '../composables/useSound'
import { useIcon, type BuiltInIcon } from '../composables/useIcon'
import { SOUNDS } from '../utils/sounds'

defineOptions({ name: 'DwButton' })

type IconProp = BuiltInIcon | (string & {})
// 固定尺寸用字符串，自定义宽度直接传数字（单位 px）
type SizeProp = 'default' | 'medium' | 'large' | number

interface Props {
  type?: 'default' | 'primary' | 'danger'
  size?: SizeProp
  disabled?: boolean
  loading?: boolean
  sound?: boolean
  icon?: IconProp
  bgColor?: string
  iconColor?: string
  color?: string
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'default',
  disabled: false,
  loading: false,
  sound: true,
  active: false,
})

const { play } = useSound()
const { getIconSvg } = useIcon()

const isUrl = computed(() => {
  if (!props.icon) return false
  return props.icon.startsWith('http') || props.icon.startsWith('/') || props.icon.includes('.')
})
const iconSvg = computed(() => props.icon ? getIconSvg(props.icon) : null)

const sizeClass = computed(() => typeof props.size === 'string' ? `dw-button--${props.size}` : '')

const buttonStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.bgColor) style.background = props.bgColor
  if (props.color) style.color = props.color
  if (typeof props.size === 'number') style.width = `${props.size}px`
  return style
})

function onPointerDown() {
  if (props.disabled || props.loading || !props.sound) return
  play(SOUNDS.click)
}
</script>

<template>
  <button
    class="dw-button"
    :class="[`dw-button--${type}`, sizeClass, active && 'dw-button--active-bg']"
    :style="buttonStyle"
    :disabled="disabled || loading"
    @pointerdown="onPointerDown"
  >
    <span v-if="loading" class="dw-button__loading" />
    <img v-else-if="isUrl" :src="icon" class="dw-button__icon" :style="iconColor ? { color: iconColor } : undefined" />
    <span v-else-if="iconSvg" class="dw-button__icon" :style="iconColor ? { color: iconColor } : undefined" v-html="iconSvg" />
    <slot />
  </button>
</template>

<style src="./button.scss" />
