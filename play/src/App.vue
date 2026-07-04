<script setup lang="ts">
import { UiButton } from '@drawings-ui/components'
import '@drawings-ui/components/styles/index.scss'
</script>

<template>
  <div class="demo">
    <h1>DrawingsUI Button 组件预览</h1>

    <section>
      <h2>类型</h2>
      <div class="row">
        <UiButton>默认</UiButton>
<!--         <UiButton type="primary">主要</UiButton>
        <UiButton type="success">成功</UiButton>
        <UiButton type="danger">危险</UiButton> -->
      </div>
    </section>

<!--     <section>
      <h2>尺寸</h2>
      <div class="row">
        <UiButton size="small">小号</UiButton>
        <UiButton>中号</UiButton>
        <UiButton size="large">大号</UiButton>
      </div>
    </section> -->

<!--     <section>
      <h2>状态</h2>
      <div class="row">
        <UiButton disabled>禁用</UiButton>
        <UiButton loading>加载中</UiButton>
        <UiButton type="primary" loading>加载中</UiButton>
      </div>
    </section> -->
  </div>
</template>

<style lang="scss">
html {
  color: #ffffff;
  background-color: #202020;
}
.demo {
  max-width: 680px;
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

  .row {
    display: flex;
    gap: 12px;
    padding: 10px 10px;
    background-color: #48494A;
    flex-wrap: wrap;
    align-items: center;
  }
}
</style>
