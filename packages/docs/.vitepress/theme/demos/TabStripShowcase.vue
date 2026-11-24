<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
  DwButton,
  DwInput,
  DwTabStrip,
  DwTabStripGroup,
  DwTabStripButton,
  DwTabStripContent,
  DwTabStripFooter,
} from '@star-dream051118/drawings-ui'
// 走模块导入，构建时自动带上部署 base 与 hash，GitHub Pages 子路径下也不会失效
import starBg from './assets/star.png'

interface ShowcaseTab {
  value: string
  label: string
}

const tabs: ShowcaseTab[] = [
  { value: 'game', label: '游戏' },
  { value: 'world', label: '世界' },
  { value: 'more', label: '更多' },
]
const tabWidth = 200
const active = ref('game')
const worldName = ref('新的世界')
const tabStripBg = starBg

// 舞台原始宽度：页签数 × 单宽 + 页签间距（--dw-tabstrip-gap: 6px）
const TAB_GAP = 6
const STAGE_WIDTH = tabs.length * tabWidth + (tabs.length - 1) * TAB_GAP
const scale = ref(1)
const viewportEl = ref<HTMLElement | null>(null)
const stageEl = ref<HTMLElement | null>(null)
let observer: ResizeObserver | null = null
let fitFrame = 0

// transform: scale 不改变布局占位，需要同步把外层高度压到缩放后的高度。
// 放到 rAF 里执行，避免在 ResizeObserver 回调中改尺寸触发 loop 警告
function fitStage() {
  if (fitFrame) return
  fitFrame = requestAnimationFrame(() => {
    fitFrame = 0
    const viewport = viewportEl.value
    const stage = stageEl.value
    if (!viewport || !stage) return

    const next = Math.min(1, viewport.clientWidth / STAGE_WIDTH)
    scale.value = next
    viewport.style.height = `${stage.offsetHeight * next}px`
  })
}

onMounted(() => {
  fitStage()
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(fitStage)
    if (viewportEl.value) observer.observe(viewportEl.value)
    if (stageEl.value) observer.observe(stageEl.value)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (fitFrame) cancelAnimationFrame(fitFrame)
})
</script>

<template>
  <div ref="viewportEl" class="tabstrip-showcase">
    <div ref="stageEl" class="tabstrip-showcase-stage" :style="{ transform: `scale(${scale})` }">
      <DwTabStrip v-model="active" :size="tabWidth" :bg-image="tabStripBg" :bg-blur="3">
        <DwTabStripGroup>
          <DwTabStripButton
            v-for="item in tabs"
            :key="item.value"
            :value="item.value"
            style="font-size: 18px;"
          >
            {{ item.label }}
          </DwTabStripButton>
        </DwTabStripGroup>
        <DwTabStripContent :content-height="300">
          <div class="tabstrip-showcase-frame">
            <div class="tabstrip-showcase-content">
              <div class="showcase-world-title">世界名称</div>
              <DwInput v-model="worldName" :blink-duration="0.6" class="showcase-input" />
              <DwButton class="showcase-button">游戏模式：生存</DwButton>
              <DwButton class="showcase-button">难度：普通</DwButton>
              <DwButton class="showcase-button">允许指令：关</DwButton>
            </div>
          </div>
        </DwTabStripContent>
        <DwTabStripFooter>
          <div class="tabstrip-showcase-footer">
            <div class="showcase-button-group">
              <DwButton class="showcase-footer-button">创建新的世界</DwButton>
              <DwButton class="showcase-footer-button">取消</DwButton>
            </div>
          </div>
        </DwTabStripFooter>
      </DwTabStrip>
    </div>
  </div>
</template>

<style>
.tabstrip-showcase {
  display: flex;
  justify-content: center;
  /* 不能拉伸舞台，否则外层高度会反过来影响舞台高度并循环缩小 */
  align-items: flex-start;
  margin: 20px 0;
  overflow: hidden;
}

.tabstrip-showcase-stage {
  flex: none;
  width: 912px;
  transform-origin: top center;
}

.tabstrip-showcase-frame {
  width: 550px;
  max-width: 100%;
  margin: 20px auto;
}

.tabstrip-showcase-content {
  width: 100%;
  height: 100%;
}

.showcase-world-title {
  margin-top: 30px;
  margin-bottom: 10px;
  font-size: 18px;
}

.showcase-input {
  display: block;
  width: 100%;
  height: 46px;
  margin-bottom: 20px;
  padding: 5px;
  border: 3px solid #a0a0a0;
  border-radius: 0;
  background: #000000;
  color: var(--dw-color-text);
  font-size: 16px;
  text-shadow: var(--dw-text-color-shadow);
}

.showcase-input:hover:not(:focus) {
  border-color: #ffffff;
}

.showcase-input:focus {
  outline: none;
  border-color: #ffffff;
}

.showcase-button {
  width: 100%;
  margin-bottom: 20px;
}

.tabstrip-showcase-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.showcase-button-group {
  display: flex;
  gap: 20px;
  width: 60%;
}

.showcase-footer-button {
  width: 100%;
}
</style>
