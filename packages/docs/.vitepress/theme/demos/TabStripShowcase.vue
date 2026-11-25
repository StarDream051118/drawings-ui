<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  DwButton,
  DwInput,
  DwTooltip,
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

interface GameMode {
  mode: string
  tooltip: string
}

interface Difficulty {
  difficulty: string
  tooltip: string
}

const tabs: ShowcaseTab[] = [
  { value: 'game', label: '游戏' },
  { value: 'world', label: '世界' },
  { value: 'more', label: '更多' },
]

const gameModes: GameMode[] = [
  { mode: '生存', tooltip: `探索未知的世界，尽情建造、收集合成
并与怪物战斗。` },
  { mode: '极限', tooltip: `难度锁定为“困难”的生存模式，且死亡后
无法重生。` },
  { mode: '创造', tooltip: `无拘无束地探索创造。可以飞行，材料取
之不尽，且不受怪物伤害。` },
]

const difficulties: Difficulty[] = [
  { difficulty: '普通', tooltip: `敌对生物会生成，且伤害适中。生命值在
饥饿值耗尽后最终会降至半颗心。` },
  { difficulty: '困难', tooltip: `敌对生物会生成，且伤害较高。饥饿值耗
尽后最终会饿死。` },
  { difficulty: '和平', tooltip: `不会生成绝大多数敌对生物。饥饿值不会
消耗，且生命值会自然恢复。` },
  { difficulty: '简单', tooltip: `敌对生物会生成，但伤害较低。生命值在
饥饿值耗尽后最终会降至5颗心。` },
]

const tabWidth = 300
const active = ref('game')
const worldName = ref('新的世界')
const tabStripBg = starBg

const gameModeIndex = ref(0)
const gameMode = computed(() => gameModes[gameModeIndex.value])
const isHardcore = computed(() => gameMode.value.mode === '极限')

const difficultyIndex = ref(0)
// 极限模式难度锁定为「困难」
const difficulty = computed(() => (isHardcore.value ? difficulties[1] : difficulties[difficultyIndex.value]))

// 允许指令按模式记录：生存/极限默认关，创造默认开，各模式都可以切换
const commandDefaults: Record<string, boolean> = { 生存: false, 极限: false, 创造: true }
const commandsByMode = ref<Record<string, boolean>>({ ...commandDefaults })
const allowCommands = computed(() => commandsByMode.value[gameMode.value.mode] ?? false)
const commandText = computed(() => (allowCommands.value ? '开' : '关'))

function toggleGameMode() {
  gameModeIndex.value = (gameModeIndex.value + 1) % gameModes.length
}

function toggleDifficulty() {
  difficultyIndex.value = (difficultyIndex.value + 1) % difficulties.length
}

function toggleCommands() {
  commandsByMode.value[gameMode.value.mode] = !allowCommands.value
}

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
        <DwTabStripContent :content-height="500">
          <div class="tabstrip-showcase-frame">
            <div class="tabstrip-showcase-content">
              <div class="showcase-world-title">世界名称</div>
              <DwTooltip>
                <template #content>
                  存档文件夹：<span style="font-style: italic;">{{ worldName }}</span>
                </template>
                <DwInput v-model="worldName" :blink-duration="0.6" class="showcase-input" />
              </DwTooltip>
              <DwTooltip :content="gameMode.tooltip">
                <DwButton class="showcase-button" @click="toggleGameMode">
                  游戏模式：{{ gameMode.mode }}
                </DwButton>
              </DwTooltip>
              <DwTooltip :content="difficulty.tooltip">
                <DwButton class="showcase-button" :disabled="isHardcore" @click="toggleDifficulty">
                  难度：{{ difficulty.difficulty }}
                </DwButton>
              </DwTooltip>
              <DwTooltip content="例如/gamemode、/experience等命令">
                <DwButton class="showcase-button" :disabled="isHardcore" @click="toggleCommands">
                  允许指令：{{ commandText }}
                </DwButton>
              </DwTooltip>
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
