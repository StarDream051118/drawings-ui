<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  DwButton,
  DwInput,
  DwTooltip,
  DwTabs,
  DwTabButton,
  DwTabStrip,
  DwTabStripGroup,
  DwTabStripButton,
  DwTabStripContent,
  DwTabStripFooter,
} from '@star-dream051118/drawings-ui'
import '@star-dream051118/drawings-ui/styles/base.scss'
import '@star-dream051118/drawings-ui/styles/font.scss'

const tab = ref(0)
const pressedTab = ref(0)
const sizeTab = ref(0)
const mediumTab = ref(0)
const largeTab = ref(0)
const equalTab = ref(0)
const fillTab = ref(0)
const valueTab = ref('a')

interface NewTabItem {
  value: string
  label: string
}

const newTabs: NewTabItem[] = [
  { value: 'game', label: '游戏' },
  { value: 'world', label: '世界' },
  { value: 'more', label: '更多' },
]
/** 新 Tab 栏所有标签共用同一个宽度（等长），对应已有 Tab 组件的自定义宽度 */
const newTabWidth = ref(300)
const activeTabStrip = ref('game')
const activeTabStripGroup = ref('game')
/** TabStrip 演示用背景图 */
const tabStripBg = '/images/star.png'

// 镜像测量：用隐藏元素量出光标前的文字宽度，再定位自绘的下划线光标
const worldName = ref('新的世界')
const tooltipName = ref('新的世界')


interface GameMode {
  mode: string
  tooltip: string
}
interface Difficulty {
  difficulty: string
  tooltip: string
}
const gamemode: GameMode[] = [
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

const gameModeIndex = ref(0)
const gameMode = computed(() => gamemode[gameModeIndex.value])

const isHardcore = computed(() => gameMode.value.mode === '极限')

const difficultyIndex = ref(0)
const difficulty = computed(() => (isHardcore.value ? difficulties[1] : difficulties[difficultyIndex.value]))

const allowCommandsOverride = ref< boolean | null >(null)
const defaultAllowCommands = computed(() => gameMode.value.mode === '创造')
const allowCommands = computed(() =>  allowCommandsOverride.value ?? defaultAllowCommands.value)
const commandText = computed(() => allowCommands.value ? '开' : '关')

function toggleGameMode() {
  gameModeIndex.value = (gameModeIndex.value + 1) % gamemode.length
}

function toggleDifficulty() {
  difficultyIndex.value = (difficultyIndex.value + 1) % difficulties.length
}

function toggleCommands() {
  allowCommandsOverride.value = !allowCommands.value
}
</script>

<template>
  <div class="demo">
    <h1>DrawingsUI 组件预览</h1>
    <section>
      <h2>TabStrip组件预览</h2>
      <DwTabStrip v-model="activeTabStrip" :size="newTabWidth" :bg-image="tabStripBg" :bg-blur="3">
        <DwTabStripGroup>
          <DwTabStripButton
          style="font-size: 18px;"
            v-for="item in newTabs"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </DwTabStripButton>
        </DwTabStripGroup>
        <DwTabStripContent :content-height="500">
          <div class="tabstrip-demo-frame">
            <div class="tabstrip-demo-content">
              <div class="world-title">世界名称</div>
              <DwTooltip class="demo-tooltip">
                <template #content>
                  存档文件夹：<span style="font-style: italic;">{{ worldName }}</span>
                </template>
                <DwInput v-model="worldName" class="demo-input" />
              </DwTooltip>
              <DwTooltip :content=gameMode.tooltip>
                <DwButton class="demo-button" @click="toggleGameMode">游戏模式：{{ gameMode.mode }}</DwButton>
              </DwTooltip>
              <DwTooltip :content=difficulty.tooltip>
                <DwButton class="demo-button" :disabled="isHardcore" @click="toggleDifficulty">
                  难度：{{ difficulty.difficulty }}
                </DwButton>
              </DwTooltip>
              <DwTooltip content="例如/gamemode、/experience等命令">
                <DwButton class="demo-button" :disabled="isHardcore" @click="toggleCommands">
                  允许指令：{{ commandText }}
                </DwButton>
              </DwTooltip>
            </div>
          </div>
        </DwTabStripContent>
        <DwTabStripFooter>
          <div class="tabstrip-demo-footer-frame">
            <div class="demo-button-group">
              <DwButton class="demo-button-footer">创建新的世界</DwButton>
              <DwButton class="demo-button-footer">取消</DwButton>
            </div>
          </div>
        </DwTabStripFooter>
      </DwTabStrip>
    </section>
    <section>
      <h2>DwTabStripGroup组件预览</h2>
      <DwTabStripGroup :size="300" v-model="activeTabStripGroup">
        <DwTabStripButton
          v-for="item in newTabs"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </DwTabStripButton>
      </DwTabStripGroup>
    </section>
    <section>
      <h2>类型：一种原生 + 两种定制</h2>
      <div class="row2">
        <DwButton>默认</DwButton>
        <DwButton disabled>默认（禁用）</DwButton>
        <DwButton type="danger">危险</DwButton>
        <DwButton type="danger" disabled>危险（禁用）</DwButton>
        <DwButton type="primary">主要</DwButton>
        <DwButton type="primary" disabled>主要（禁用）</DwButton>
      </div>
    </section>

    <section>
      <h2>具有 active 的 Button</h2>
      <div class="row2">
        <DwButton :active="true">默认</DwButton>
        <DwButton disabled>默认（禁用）</DwButton>
        <DwButton :active="true" type="danger">危险</DwButton>
        <DwButton type="danger" disabled>危险（禁用）</DwButton>
        <DwButton :active="true" type="primary">主要</DwButton>
        <DwButton type="primary" disabled>主要（禁用）</DwButton>
      </div>
    </section>

    <section>
      <h2>尺寸</h2>
      <div class="row1">
        <DwButton>默认</DwButton>
        <DwButton size="medium">中号</DwButton>
        <DwButton size="large">大号</DwButton>
      </div>
    </section>

    <section>
      <h2>Icon</h2>
      <div class="row3">
        <DwButton icon="card">卡片</DwButton>
        <DwButton icon="list">列表</DwButton>
        <DwButton icon="download">下载</DwButton>
        <DwButton icon="upload">上传</DwButton>
        <DwButton icon="update">更新</DwButton>
        <DwButton icon="right">确认</DwButton>
        <DwButton icon="close">关闭</DwButton>
        <DwButton icon="settings">设置</DwButton>
        <DwButton icon="state">状态</DwButton>
        <DwButton icon="search">搜索</DwButton>
        <DwButton icon="chest">箱子</DwButton>
        <DwButton icon="heart">收藏</DwButton>
      </div>
    </section>

    <section>
      <h2>自定义 Icon 与 Button 颜色 与 Color 颜色</h2>
      <div class="row1">
        <DwButton style="width: 200px;" bgColor="#FF55FF" iconColor="#C700C7" color="#FFBEFF" icon="heart">收藏</DwButton>
      </div>
    </section>

    <section>
      <h2>Tabs</h2>
      <div class="row2">
        <DwTabs v-model="tab">
          <DwTabButton>标签一</DwTabButton>
          <DwTabButton>标签二</DwTabButton>
          <DwTabButton>标签三</DwTabButton>
        </DwTabs>
        <DwTabs v-model="tab" :activeLine="false ">
          <DwTabButton>文字不带</DwTabButton>
          <DwTabButton>下划线</DwTabButton>
          <DwTabButton>按钮</DwTabButton>
        </DwTabs>
        <DwTabs v-model="pressedTab" active-effect="pressed">
          <DwTabButton>按压式</DwTabButton>
          <DwTabButton>选中</DwTabButton>
          <DwTabButton>效果</DwTabButton>
        </DwTabs>
        <DwTabs v-model="sizeTab" :size="120">
          <DwTabButton>120px</DwTabButton>
          <DwTabButton>数值宽度</DwTabButton>
          <DwTabButton>测试</DwTabButton>
        </DwTabs>
        <DwTabs v-model="mediumTab" size="medium">
          <DwTabButton>中号</DwTabButton>
          <DwTabButton>150px</DwTabButton>
        </DwTabs>
        <DwTabs v-model="largeTab" size="large">
          <DwTabButton>大号</DwTabButton>
          <DwTabButton>300px</DwTabButton>
        </DwTabs>
        <DwTabs v-model="equalTab" width-mode="equal">
          <DwTabButton>首页</DwTabButton>
          <DwTabButton>个人设置</DwTabButton>
          <DwTabButton>关于我们团队</DwTabButton>
        </DwTabs>
        <DwTabs v-model="fillTab" fill>
          <DwTabButton>铺满</DwTabButton>
          <DwTabButton>均分宽度</DwTabButton>
          <DwTabButton>父容器</DwTabButton>
        </DwTabs>
        <DwTabs v-model="valueTab">
          <DwTabButton value="a">value 模式</DwTabButton>
          <DwTabButton value="b">字符串绑定</DwTabButton>
        </DwTabs>
      </div>
    </section>
    <section>
      <h2>Tooltip 悬浮提示</h2>
      <div class="row3">
        <DwTooltip content="点击创建一个新的世界">
          <DwButton>创建新的世界</DwButton>
        </DwTooltip>
        <DwTooltip content="优先显示在光标左下角" placement="bottom-left">
          <DwButton>左下方位</DwButton>
        </DwTooltip>
        <DwTooltip placement="top-right" :show-delay="200">
          <DwButton>右上（延迟 200ms）</DwButton>
          <template #content>
            支持<strong>富文本</strong>与换行
          </template>
        </DwTooltip>
        <DwTooltip content="世界名称" class="tooltip-input-wrap">
          <DwInput v-model="tooltipName" class="tooltip-input" />
        </DwTooltip>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.tabstrip-demo-frame {
  width: 550px;
  margin: 20px auto;
}
.tabstrip-demo-content {
  width: 100%;
  height: 100%;
}
.world-title {
  font-size: 18px;
  margin-top: 30px;
  margin-bottom: 10px;
}
.demo-tooltip {
  width: 100%;
}
.demo-input {
  width: 100%;
  margin-bottom: 20px;
}
.demo-button {
  width: 100%;
  margin-bottom: 20px;
}
.tabstrip-demo-footer-frame {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
.demo-button-group {
  display: flex;
  gap: 20px;
  width: 60%;
}
.demo-button-footer {
  width: 100%;
}

.tooltip-input-wrap {
  display: block;
  width: 100%;
}

.tooltip-input {
  width: 100%;
  height: 46px;
  padding: 5px;
  border: 3px solid #a0a0a0;
  background: #000000;
  color: var(--dw-color-text);
  font-size: 16px;

  &:hover:not(:focus) {
    border-color: #ffffff;
  }

  &:focus {
    outline: none;
    border-color: #ffffff;
  }
}


html {
  color: #ffffff;
  background-color: #202020;
}
.demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  h1 {
    font-size: 24px;
    margin-bottom: 32px;
  }

  h2 {
    font-size: 16px;
    margin-bottom: 12px;
    font-weight: 500;
  }

  section {
    margin-bottom: 32px;
  }

  .row1 {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 10px 10px;
    background-color: #48494A;
    flex-wrap: wrap;
    align-items: center;
  }

  .row2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 12px;
    padding: 10px 10px;
    background-color: #48494A;
    flex-wrap: wrap;
    align-items: center;
  }

  .row3 {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 12px;
    padding: 10px 10px;
    background-color: #48494A;
    flex-wrap: wrap;
    align-items: center;
  }
}
</style>
