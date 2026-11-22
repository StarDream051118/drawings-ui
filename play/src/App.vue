<script setup lang="ts">
import { computed, ref } from 'vue'
import { DwButton, DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'
import '@star-dream051118/drawings-ui/styles/index.scss'
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
const activeNewTab = ref('world')
/** 当前选中的下标，供 Tab 栏线元素计算开窗位置 */
const activeNewTabIndex = computed(() =>
  newTabs.findIndex((item) => item.value === activeNewTab.value),
)
</script>

<template>
  <div class="demo">
    <h1>DrawingsUI 组件预览</h1>
    <div
      class="dw-tabstrip-background"
      :style="{
        '--dw-tabstrip-tab-width': `${newTabWidth}px`,
        '--dw-tabstrip-tab-count': newTabs.length,
        '--dw-tabstrip-active-index': activeNewTabIndex,
      }"
    >
      <div class="dw-tabstrip-group">
        <button
          v-for="item in newTabs"
          :key="item.value"
          type="button"
          :class="activeNewTab === item.value ? 'dw-tabstrip-button-selected' : 'dw-tabstrip-button'"
          @click="activeNewTab = item.value"
        >
          <span :class="activeNewTab === item.value ? 'dw-tabstrip-button-selected-text' : 'dw-tabstrip-button-text'">
            {{ item.label }}
          </span>
        </button>
      </div>
      <div class="dw-tabstrip-header-line"></div>
      <div class="dw-tabstrip-group-content-footer"></div>
    </div>

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
.dw-tabstrip-background {
  position: relative;
  width: 100%;
  height: 500px;
  background-image: url('/images/star.png');
  background-size: cover;
  --dw-tabstrip-tab-width: 300px;
  --dw-tabstrip-tab-gap: 3px;
  --dw-tabstrip-tab-height: 40px;
  --dw-tabstrip-tab-height-selected: calc(var(--dw-tabstrip-tab-height) + 15px);
  --dw-tabstrip-line-height: 6px;
  --dw-tabstrip-content-footer-height: calc(100% - 2 * var(--dw-tabstrip-tab-height-selected) - 3px);

  --dw-tabstrip-content-background: rgba(0, 0, 0, 0.3);
  --dw-tabstrip-content-background-blur: 3px;
  --dw-tabstrip-tab-background-color: rgba(0, 0, 0, 0.9);
  --dw-tabstrip-highlight: rgba(255, 255, 255, 0.2);
}
.dw-tabstrip-background::before {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  backdrop-filter: blur(var(--dw-tabstrip-content-background-blur));
}

.dw-tabstrip-group {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: var(--dw-tabstrip-tab-gap);
  height: fit-content;
  transform: translateY(3px);
}

.dw-tabstrip-button {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: none;
  position: relative;
  width: var(--dw-tabstrip-tab-width);
  height: var(--dw-tabstrip-tab-height);
  transform: translateY(-3px);
  background-color: var(--dw-tabstrip-tab-background-color);
  background-clip: padding-box;
  font-size: 16px;
  color: #ffffff;
  border: 3px solid var(--dw-tabstrip-highlight);
  /* 底边交给统一的 Tab 栏线元素绘制，避免双层高光 */
  border-bottom-color: transparent;
  box-shadow: 
            3px -3px 0px var(--dw-tabstrip-tab-background-color), -3px -3px 0px var(--dw-tabstrip-tab-background-color),
            3px 0 0px var(--dw-tabstrip-tab-background-color), -3px 0 0px var(--dw-tabstrip-tab-background-color);
  .dw-tabstrip-button-text {
    position: relative;
    display: flex;
    justify-content: center;
    transform: translateY(3px);
  }
}
/* 占位元素：让button的outline可被点击或者hover */
.dw-tabstrip-button::before {
  content: '';
  position: absolute;
  inset: -6px -6px -3px;
}
/* 底部黑色bg */
.dw-tabstrip-button::after{
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: 0 3px 0px var(--dw-tabstrip-tab-background-color);
}
/* shadow模拟border变色 */
.dw-tabstrip-button:hover::after{
  box-shadow: 3px -3px 0px #ffffff, -3px 3px 0px #ffffff,
              3px 3px 0px #ffffff, -3px -3px 0px #ffffff;
}

.dw-tabstrip-button-selected{
  display: flex;
  justify-content: center;
  align-items: center;
  flex: none;
  position: relative;
  width: var(--dw-tabstrip-tab-width);
  height: var(--dw-tabstrip-tab-height-selected);
  background-color: var(--dw-tabstrip-content-background);
  color: #ffffff;
  font-size: 16px;
  text-shadow: 1px 1px #3F3F3F;
  border: 3px solid transparent;
  box-shadow: 
            3px -3px 0px var(--dw-tabstrip-tab-background-color), -3px -3px 0px var(--dw-tabstrip-tab-background-color);
  .dw-tabstrip-button-selected-text {
    display: flex;
    justify-content: center;
    transform: translateY(0px);
    text-decoration: underline #ffffff solid 3px;
    text-underline-offset: 18.5px;
  }
}
/* 占位元素让button的outline可被点击或者hover */
.dw-tabstrip-button-selected::before {
  content: '';
  position: absolute;
  inset: -6px -6px -3px;
}
/* 白色box-shadow模拟的border */
.dw-tabstrip-button-selected::after{
  content: '';
  position: absolute;
  height: calc(100% + 3px);
  inset: 0;
  box-shadow: 3px -3px 0px #ffffff, -3px -3px 0px #ffffff,
              3px 0px 0px #ffffff, -3px 0px 0px #ffffff;
}

.dw-tabstrip-group-content-footer {
  position: relative;
  width: 100%;
  transform: translateY(3px);
  height: var(--dw-tabstrip-content-footer-height);
  background-color: var(--dw-tabstrip-content-background);
  border-bottom: 3px solid rgba(0, 0, 0, 1);
  box-shadow: 0 -3px 0px var(--dw-tabstrip-content-background), 0 3px 0px var(--dw-tabstrip-highlight);
}

.dw-tabstrip-header-line {
  position: relative;
  width: 100%;
  height: var(--dw-tabstrip-line-height);
  /* 上移半个线高，让高光带与未选中 tab 的底边重合 */
  margin-top: calc(var(--dw-tabstrip-line-height) * -0.5);
  pointer-events: none;

  /* tab 组总宽：n * 单宽 + (n - 1) * 间距 */
  --dw-tabstrip-tabs-width: calc(
    var(--dw-tabstrip-tab-count) * var(--dw-tabstrip-tab-width) +
      (var(--dw-tabstrip-tab-count) - 1) * var(--dw-tabstrip-tab-gap)
  );
  /* 居中时 tab 组的左偏移 = (容器宽 - tab 组宽) / 2 */
  --dw-tabstrip-tabs-offset: calc((100% - var(--dw-tabstrip-tabs-width)) / 2);
  /* 窗口左右边界：前 i 个 tab 的累计宽度，并各外扩 3px 盖住选中 tab 的外描边 */
  --dw-tabstrip-window-left: calc(
    var(--dw-tabstrip-tabs-offset) +
      var(--dw-tabstrip-active-index) * (var(--dw-tabstrip-tab-width) + var(--dw-tabstrip-tab-gap)) -
      3px
  );
  --dw-tabstrip-window-right: calc(
    var(--dw-tabstrip-window-left) + var(--dw-tabstrip-tab-width) + 6px
  );

  /* 上 3px 高光、下 3px 实色；选中 tab 所在区间整段挖空 */
  background:
    linear-gradient(
        to right,
        var(--dw-tabstrip-highlight) 0 var(--dw-tabstrip-window-left),
        transparent var(--dw-tabstrip-window-left) var(--dw-tabstrip-window-right),
        var(--dw-tabstrip-highlight) var(--dw-tabstrip-window-right) 100%
      )
      left top / 100% 3px no-repeat,
    linear-gradient(
        to right,
        var(--dw-tabstrip-tab-background-color) 0 var(--dw-tabstrip-window-left),
        transparent var(--dw-tabstrip-window-left) var(--dw-tabstrip-window-right),
        var(--dw-tabstrip-tab-background-color) var(--dw-tabstrip-window-right) 100%
      )
      left bottom / 100% 3px no-repeat;
}
.dw-tab-footer-separator {
  position: relative;
  flex: 1;
  height: 6px;
  background-color: var(--dw-tabstrip-tab-background-color);;
  background-clip: padding-box;
  border: none;
  border-bottom: 3px solid var(--dw-tabstrip-highlight);
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
