<script setup lang="ts">
import { computed } from 'vue'
import { useSound } from '../composables/useSound'
import { useIcon, type BuiltInIcon } from '../composables/useIcon'
import { SOUNDS } from '../utils/sounds'

defineOptions({ name: 'DwButton' })

type IconProp = BuiltInIcon | (string & {})

interface Props {
  type?: 'default' | 'primary' | 'danger'
  size?: 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  sound?: boolean
  icon?: IconProp
  bgColor?: string
  iconColor?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  disabled: false,
  loading: false,
  sound: true,
})

const { play } = useSound()
const { getIconSvg } = useIcon()

const isUrl = computed(() => {
  if (!props.icon) return false
  return props.icon.startsWith('http') || props.icon.startsWith('/') || props.icon.includes('.')
})
const iconSvg = computed(() => props.icon ? getIconSvg(props.icon) : null)

const buttonStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.bgColor) style.background = props.bgColor
  if (props.color) style.color = props.color
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
    :class="[`dw-button--${type}`, `dw-button--${size}`]"
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
