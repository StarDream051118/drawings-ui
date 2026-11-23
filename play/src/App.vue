<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
  DwButton,
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
const inputEl = ref<HTMLInputElement | null>(null)
const mirrorEl = ref<HTMLElement | null>(null)
const caretX = ref(0)
const inputFocused = ref(false)
let caretRaf = 0

function measureCaret() {
  const el = inputEl.value
  const mirror = mirrorEl.value
  if (!el || !mirror) return

  // 字体必须和输入框完全一致，直接复制计算样式，避免两边字体设置漂移
  const style = getComputedStyle(el)
  mirror.style.fontFamily = style.fontFamily
  mirror.style.fontSize = style.fontSize
  mirror.style.fontWeight = style.fontWeight
  mirror.style.fontStyle = style.fontStyle
  mirror.style.letterSpacing = style.letterSpacing

  // 有选区时按焦点端定位：向后选中（往左拖）时焦点在左端
  const start = el.selectionStart ?? el.value.length
  const end = el.selectionEnd ?? start
  const caretIndex = el.selectionDirection === 'backward' ? start : end

  mirror.textContent = el.value.slice(0, caretIndex)
  // 内容超宽时 input 会横向滚动，光标的屏幕位置要减去 scrollLeft
  caretX.value = mirror.getBoundingClientRect().width - el.scrollLeft
}

function scheduleCaret() {
  if (caretRaf) return
  caretRaf = requestAnimationFrame(() => {
    caretRaf = 0
    measureCaret()
  })
}

function onInputFocus() {
  inputFocused.value = true
  scheduleCaret()
}

function onInputBlur() {
  inputFocused.value = false
}

onMounted(() => {
  // 像素字体加载完之前量到的是回退字体宽度，加载完再量一次
  document.fonts?.ready.then(scheduleCaret).catch(() => {})
})

onBeforeUnmount(() => {
  if (caretRaf) cancelAnimationFrame(caretRaf)
})
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
              <span class="demo-input-wrap" :class="{ 'demo-input-wrap--focused': inputFocused }">
                <input
                  ref="inputEl"
                  v-model="worldName"
                  type="text"
                  class="demo-input dw-input"
                  @focus="onInputFocus"
                  @blur="onInputBlur"
                  @input="scheduleCaret"
                  @keyup="scheduleCaret"
                  @click="scheduleCaret"
                  @select="scheduleCaret"
                  @scroll="scheduleCaret"
                  @compositionupdate="scheduleCaret"
                >
                <!-- 只用来量文字宽度，不可见也不参与交互 -->
                <span ref="mirrorEl" class="demo-input-mirror" aria-hidden="true" />
                <!-- 自绘下划线光标 -->
                <span
                  class="demo-input-caret"
                  :style="{ transform: `translateX(${caretX}px)` }"
                  aria-hidden="true"
                />
              </span>
              <DwButton class="demo-button">游戏模式：生存</DwButton>
              <DwButton class="demo-button">难度：普通</DwButton>
              <DwButton class="demo-button">允许指令：关</DwButton>
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
.demo-input-wrap {
  position: relative;
  display: block;
  width: 100%;
}

.demo-input {
  display: block;
  width: 100%;
  height: 46px;
  margin-bottom: 20px;
  font-size: 18px;
}

// 隐藏原生竖线光标，选区高亮保持不变
.demo-input.dw-input {
  caret-color: transparent;
}

// 与 input 的文字起点（border-left 3px + padding-left 5px）对齐
.demo-input-mirror {
  position: absolute;
  top: 0;
  left: 8px;
  visibility: hidden;
  white-space: pre;
  pointer-events: none;
  user-select: none;
}

.demo-input-caret {
  position: absolute;
  left: 8px;
  top: 30px;
  width: 0.55em;
  height: 3px;
  background: var(--dw-color-text);
  pointer-events: none;
  opacity: 0;

  .demo-input-wrap--focused & {
    opacity: 1;
    animation: demo-caret-blink 1s steps(1) infinite;
  }
}

@keyframes demo-caret-blink {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
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


.dw-input {
  border-radius: 0;
  color: var(--dw-color-text);
  text-shadow: var(--dw-text-color-shadow);
  background-color: #000000;
  border: 3px solid #A0A0A0;
  font-size: 16px;
  padding: 5px 5px;

  &:hover:not(:focus) {
    border-color: #ffffff;
  }

  &:focus {
    outline: none;
    border-color: #ffffff;
  }

  &::selection {
    background-color: #ffffff;
    color: #201FFF;
    text-shadow: 1px 1px #C7C7FF;
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
