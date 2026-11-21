<script setup lang="ts">
import { ref } from 'vue'
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
</script>

<template>
  <div class="demo">
    <h1>DrawingsUI 组件预览</h1>
    <div style="width: 100%;height: 500px;background-image: url('/images/star.png');background-size: cover;">
      <div class="dw-tabs">
        <hr class="header-separator">
        <button class="dw-new-tab-button"><span class="dw-new-tab-button-text">游戏</span></button>
        <button class="dw-new-tab-button-selected"><span class="dw-new-tab-button-selected-text">世界</span></button>
        <button class="dw-new-tab-button"><span class="dw-new-tab-button-text">更多</span></button>
        <hr class="header-separator">
      </div>
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

.dw-tabs {
  display: flex;
  justify-content: center;
  height: fit-content;
}

.dw-new-tab-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 3px;
  position: relative;
  width: 300px;
  height: 40px;
  transform: translateY(12px);
  background-color: rgba(0, 0, 0, 0.9);
  background-clip: padding-box;
  font-size: 16px;
  color: #ffffff;
  border: 3px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
            3px -3px 0px rgba(0, 0, 0, 0.9), -3px -3px 0px rgba(0, 0, 0, 0.9),
            3px 0 0px rgba(0, 0, 0, 0.9), -3px 0 0px rgba(0, 0, 0, 0.9);
  .dw-new-tab-button-text {
    position: relative;
    display: flex;
    justify-content: center;
    transform: translateY(3px);
  }
  .dw-new-tab-button-text::after {
    content: '';
    position: absolute;
    width: 306px;
    height: 6px;
    transform: translateY(25.5px);
    background-color: rgba(0, 0, 0, 0.9);;
    background-clip: padding-box;
    border-top: 3px solid rgba(255, 255, 255, 0.2);
  }
}
.dw-new-tab-button:last-of-type {
  margin-right: 0px;
}
/* 占位元素让button的outline可被点击或者hover */
.dw-new-tab-button::before {
  content: '';
  position: absolute;
  inset: -6px -6px -3px;
}
/* 底部黑色bg */
.dw-new-tab-button::after{
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: 0 3px 0px rgba(0, 0, 0, 0.9);
}
/* shadow模拟border变色 */
.dw-new-tab-button:hover::after{
  box-shadow: 3px -3px 0px #ffffff, -3px 3px 0px #ffffff,
              3px 3px 0px #ffffff, -3px -3px 0px #ffffff;
}



.dw-new-tab-button-selected{
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 300px;
  height: calc(40px + 15px);
  background-color: transparent;
  background-clip: padding-box;
  color: #ffffff;
  font-size: 16px;
  text-shadow: 1px 1px #3F3F3F;
  border: 3px solid transparent;
  box-shadow: 
            3px -3px 0px rgba(0, 0, 0, 0.9), -3px -3px 0px rgba(0, 0, 0, 0.9);
  .dw-new-tab-button-selected-text {
    display: flex;
    justify-content: center;
    transform: translateY(0px);
    text-decoration: underline #ffffff solid 3px;
    text-underline-offset: 18.5px;
  }
  .dw-new-tab-button-selected-text::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    right: -136.5px;
    transform: translateY(33.5px);
    background-color: rgba(0, 0, 0, 0.9);;
    background-clip: padding-box;
    border-top: 3px solid rgba(255, 255, 255, 0.2);
  }
  .dw-new-tab-button-selected-text::before {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    left: -136.5px;
    transform: translateY(33.5px);
    background-color: rgba(0, 0, 0, 0.9);;
    background-clip: padding-box;
    border-top: 3px solid rgba(255, 255, 255, 0.2);
  }
}
/* 占位元素让button的outline可被点击或者hover */
.dw-new-tab-button-selected::before {
  content: '';
  position: absolute;
  inset: -6px -6px -3px;
}
/* 底部黑色bg */
.dw-new-tab-button-selected::after{
  content: '';
  position: absolute;
  height: calc(100% + 3px);
  inset: 0;
  box-shadow: 3px -3px 0px #ffffff, -3px -3px 0px #ffffff,
              3px 0px 0px #ffffff, -3px 0px 0px #ffffff;
}


.header-separator {
  align-self: self-end;
  flex: 1;
  height: 6px;
  transform: translateY(3.5px);
  background-color: rgba(0, 0, 0, 0.9);;
  background-clip: padding-box;
  border: none;
  border-top: 3px solid rgba(255, 255, 255, 0.2);
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
