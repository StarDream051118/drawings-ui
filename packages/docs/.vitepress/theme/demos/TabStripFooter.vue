<script setup lang="ts">
import { ref } from 'vue'
import {
  DwTabStrip,
  DwTabStripGroup,
  DwTabStripButton,
  DwTabStripContent,
  DwTabStripFooter,
} from '@star-dream051118/drawings-ui'

const active = ref('world')
</script>

<template>
  <div class="row1">
    <DwTabStrip v-model="active">
      <DwTabStripGroup>
        <DwTabStripButton value="game">游戏</DwTabStripButton>
        <DwTabStripButton value="world">世界</DwTabStripButton>
        <DwTabStripButton value="more">更多</DwTabStripButton>
      </DwTabStripGroup>
      <DwTabStripContent :content-height="160">
        <p class="tab-strip-demo-text">内容区域</p>
      </DwTabStripContent>
      <DwTabStripFooter>
        <p class="tab-strip-demo-text">页脚区域</p>
      </DwTabStripFooter>
    </DwTabStrip>
  </div>
</template>

<style>
.tab-strip-demo-text {
  margin: 0;
  padding: 16px;
  color: #fff;
}
</style>
