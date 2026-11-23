<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({ name: 'DwInput', inheritAttrs: false })

// 只有 v-model，没有其它可调 props；边框、底色、字体等全部由使用方的 class / CSS 决定
const model = defineModel<string>({ default: '' })

const rootEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const mirrorEl = ref<HTMLElement | null>(null)

const focused = ref(false)
// 光标是否折叠（没有选中一段文字）
const caretCollapsed = ref(true)
// 折叠光标是否停在文字末尾：末尾画下划线，其余位置画竖线
const caretAtEnd = ref(true)
let frame = 0

// 镜像测量：用隐藏元素量出光标前的文字宽度，再定位自绘光标
function measure() {
  const root = rootEl.value
  const input = inputEl.value
  const mirror = mirrorEl.value
  if (!root || !input || !mirror) return

  const style = getComputedStyle(input)

  // 字体必须和输入框完全一致，直接复制计算样式，避免两边字体设置漂移
  mirror.style.fontFamily = style.fontFamily
  mirror.style.fontSize = style.fontSize
  mirror.style.fontWeight = style.fontWeight
  mirror.style.fontStyle = style.fontStyle
  mirror.style.letterSpacing = style.letterSpacing

  // 有选区时按焦点端定位：向后选中（往左拖）时焦点在左端
  const start = input.selectionStart ?? input.value.length
  const end = input.selectionEnd ?? start
  const index = input.selectionDirection === 'backward' ? start : end

  mirror.textContent = input.value.slice(0, index)

  const borderLeft = Number.parseFloat(style.borderLeftWidth) || 0
  const borderTop = Number.parseFloat(style.borderTopWidth) || 0
  const paddingLeft = Number.parseFloat(style.paddingLeft) || 0
  const paddingTop = Number.parseFloat(style.paddingTop) || 0
  const paddingBottom = Number.parseFloat(style.paddingBottom) || 0
  const fontSize = Number.parseFloat(style.fontSize) || 16

  // clientHeight 含 padding 不含 border，减掉上下 padding 就是文字可用的内容高度
  const contentHeight = Math.max(input.clientHeight - paddingTop - paddingBottom, fontSize)
  // 竖线取一行文字高度，在内容区垂直居中；下划线贴在这行文字的底部
  const barHeight = Math.min(fontSize, contentHeight)
  const barTop = input.offsetTop + borderTop + paddingTop + (contentHeight - barHeight) / 2

  root.style.setProperty('--dw-input-caret-origin', `${input.offsetLeft + borderLeft + paddingLeft}px`)
  root.style.setProperty('--dw-input-caret-x', `${mirror.getBoundingClientRect().width - input.scrollLeft}px`)
  root.style.setProperty('--dw-input-caret-color', style.color)
  root.style.setProperty('--dw-input-caret-top', `${barTop}px`)
  root.style.setProperty('--dw-input-caret-height', `${barHeight}px`)
  root.style.setProperty('--dw-input-caret-underline-top', `${barTop + barHeight - 1}px`)
  root.style.setProperty('--dw-input-caret-underline-width', `${Math.round(fontSize * 0.625)}px`)

  caretCollapsed.value = start === end
  caretAtEnd.value = caretCollapsed.value && index === input.value.length
}

function schedule() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    measure()
  })
}

function onFocus() {
  focused.value = true
  schedule()
}

function onBlur() {
  focused.value = false
}

function onResize() {
  schedule()
}

watch(model, () => nextTick(schedule))

onMounted(() => {
  measure()
  window.addEventListener('resize', onResize)
  // 像素字体加载完之前量到的是回退字体宽度，加载完再量一次
  document.fonts?.ready.then(schedule).catch(() => {})
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  if (frame) cancelAnimationFrame(frame)
})
</script>

<template>
  <span
    ref="rootEl"
    class="dw-input"
    :class="{
      'dw-input--focused': focused,
      'dw-input--caret-end': caretAtEnd,
      'dw-input--selecting': !caretCollapsed,
    }"
  >
    <input
      ref="inputEl"
      v-model="model"
      type="text"
      class="dw-input__native"
      v-bind="$attrs"
      @focus="onFocus"
      @blur="onBlur"
      @input="schedule"
      @keyup="schedule"
      @click="schedule"
      @select="schedule"
      @scroll="schedule"
      @compositionupdate="schedule"
    >
    <!-- 只用来量文字宽度，不可见也不参与交互 -->
    <span ref="mirrorEl" class="dw-input__mirror" aria-hidden="true" />
    <!-- 自绘光标：末尾为下划线，文字中间为竖线 -->
    <span class="dw-input__caret" aria-hidden="true" />
  </span>
</template>

<style src="./input.scss" />
