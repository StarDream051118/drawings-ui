<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useSound } from '../composables/useSound'
import { useIcon } from '../composables/useIcon'
import { SOUNDS } from '../utils/sounds'
import {
  useTabStripGroupContext,
  type TabStripKey,
  type TabStripTabInstance,
} from './context'

defineOptions({ name: 'DwTabStripButton' })

interface Props {
  /** 唯一标识，和 DwTabStrip 的 v-model 比对；不传时回退成顺序索引 */
  value?: TabStripKey
  /** 图标：内置图标名或图片 URL；不传时跟随整条栏的 icon */
  icon?: string
}

const props = defineProps<Props>()

const group = useTabStripGroupContext('DwTabStripButton')

const { play } = useSound()
const { getIconSvg } = useIcon()

const elRef = ref<HTMLElement | null>(null)
const instance: TabStripTabInstance = {
  // key = value ?? 顺序索引（index 在下面声明，computed 是惰性的，首次读取时已初始化）
  key: computed<TabStripKey>(() => props.value ?? index.value),
  el: elRef,
}

if (group) {
  group.register(instance)
  onUnmounted(() => group.unregister(instance))
}

const index = computed(() => (group ? group.order.value.indexOf(instance) : -1))
const isDisabled = computed(() => group?.defaults.value.disabled ?? false)
const isActive = computed(() => {
  if (!group || isDisabled.value) return false
  const key = instance.key.value
  if (group.activeKey.value !== key) return false
  // 重复 key 时只让第一个匹配项生效
  return group.order.value.find(tab => tab.key.value === key) === instance
})

// 只有选中项可聚焦；完全没有选中项时让第一个页签兜底，键盘才能进入 tablist
const isTabbable = computed(() => {
  if (!group || isDisabled.value) return false
  if (isActive.value) return true
  return !group.hasSelection.value && group.order.value[0] === instance
})

const resolvedIcon = computed(() => props.icon ?? group?.defaults.value.icon)
const isUrl = computed(() => {
  const icon = resolvedIcon.value
  if (!icon) return false
  return icon.startsWith('http') || icon.startsWith('/') || icon.includes('.')
})
const iconSvg = computed(() => (resolvedIcon.value ? getIconSvg(resolvedIcon.value) : null))

function onPointerDown() {
  if (!group || isDisabled.value) return
  if (!group.defaults.value.sound) return
  play(SOUNDS.click)
}

function onClick() {
  if (!group || isDisabled.value) return
  group.select(instance.key.value)
}
</script>

<template>
  <button
    v-if="group"
    ref="elRef"
    type="button"
    role="tab"
    class="dw-tab-strip-button"
    :class="{ 'dw-tab-strip-button--selected': isActive }"
    :aria-selected="isActive ? 'true' : 'false'"
    :tabindex="isTabbable ? 0 : -1"
    :disabled="isDisabled || undefined"
    @pointerdown="onPointerDown"
    @click="onClick"
  >
    <img
      v-if="isUrl"
      :src="resolvedIcon"
      class="dw-tab-strip-button__icon"
      alt=""
    />
    <span
      v-else-if="iconSvg"
      class="dw-tab-strip-button__icon"
      v-html="iconSvg"
    />
    <span class="dw-tab-strip-button__label"><slot /></span>
  </button>
</template>

<style src="./tab-strip-button.scss" />
