<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import DwTabButton from './TabButton.vue'
import type { BuiltInIcon } from '../composables/useIcon'

defineOptions({ name: 'DwTabs' })

type IconProp = BuiltInIcon | (string & {})
type SizeProp = 'default' | 'medium' | 'large' | number

interface Props {
  /** 当前选中项索引，配合 v-model 使用 */
  modelValue?: number
  /** Tab 数量；传了 labels 时以 labels 长度为准 */
  count?: number
  /** 每个 Tab 的文字，优先级低于 tab 插槽 */
  labels?: string[]
  type?: 'default' | 'primary' | 'danger'
  size?: SizeProp
  disabled?: boolean
  sound?: boolean
  icon?: IconProp
  iconColor?: string
  bgColor?: string
  color?: string
  /** 选中时的视觉：border 只高亮描边（默认），pressed 借用禁用态的深底 + 去投影 */
  activeEffect?: 'border' | 'pressed'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  count: 1,
  type: 'default',
  size: 'default',
  disabled: false,
  sound: true,
  activeEffect: 'border',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const listRef = ref<HTMLElement | null>(null)
const innerActive = ref(props.modelValue)

const total = computed(() => {
  const length = props.labels?.length ?? 0
  const raw = length > 0 ? length : props.count
  return Math.max(Math.floor(Number(raw)) || 1, 1)
})

watch(() => props.modelValue, (value) => {
  innerActive.value = value
})

watch(total, (value) => {
  if (innerActive.value > value - 1) {
    innerActive.value = Math.max(value - 1, 0)
  }
})

function select(index: number) {
  if (props.disabled || index === innerActive.value) return
  innerActive.value = index
  emit('update:modelValue', index)
  emit('change', index)
}

function focusTab(index: number) {
  const tabs = listRef.value?.querySelectorAll<HTMLElement>('[role="tab"]')
  tabs?.[index]?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) return

  const last = total.value - 1
  let next = innerActive.value

  switch (event.key) {
    case 'ArrowRight':
      next = innerActive.value >= last ? 0 : innerActive.value + 1
      break
    case 'ArrowLeft':
      next = innerActive.value <= 0 ? last : innerActive.value - 1
      break
    case 'Home':
      next = 0
      break
    case 'End':
      next = last
      break
    default:
      return
  }

  event.preventDefault()
  select(next)
  focusTab(next)
}
</script>

<template>
  <div
    ref="listRef"
    class="dw-tabs"
    role="tablist"
    aria-orientation="horizontal"
    @keydown="onKeydown"
  >
    <DwTabButton
      v-for="i in total"
      :key="i - 1"
      :index="i - 1"
      :active="i - 1 === innerActive"
      :type="type"
      :size="size"
      :disabled="disabled"
      :sound="sound"
      :icon="icon"
      :icon-color="iconColor"
      :bg-color="bgColor"
      :color="color"
      :active-effect="activeEffect"
      @select="select"
    >
      <slot name="tab" :index="i - 1" :active="i - 1 === innerActive">{{ labels?.[i - 1] }}</slot>
    </DwTabButton>
  </div>
</template>

<style src="./tabs.scss" />
