<script setup lang="ts">
import { ref } from 'vue'
import {
  DwTabStrip,
  DwTabStripGroup,
  DwTabStripButton,
  DwTabStripContent,
} from '@star-dream051118/drawings-ui'

const active = ref('world')
const disabledActive = ref('world')
</script>

<template>
  <div class="row2">
    <div class="flex-center-h">
      <DwTabStrip v-model="active">
        <DwTabStripGroup>
          <DwTabStripButton value="game">游戏</DwTabStripButton>
          <DwTabStripButton value="world">世界</DwTabStripButton>
          <DwTabStripButton value="more">更多</DwTabStripButton>
        </DwTabStripGroup>
        <DwTabStripContent :content-height="120">
          <p class="tab-strip-demo-text">正常：可以点击切换</p>
        </DwTabStripContent>
      </DwTabStrip>
    </div>

    <div class="flex-center-h">
      <DwTabStrip v-model="disabledActive" disabled>
        <DwTabStripGroup>
          <DwTabStripButton value="game">游戏</DwTabStripButton>
          <DwTabStripButton value="world">世界</DwTabStripButton>
          <DwTabStripButton value="more">更多</DwTabStripButton>
        </DwTabStripGroup>
        <DwTabStripContent :content-height="120">
          <p class="tab-strip-demo-text">禁用：无法点击切换</p>
        </DwTabStripContent>
      </DwTabStrip>
    </div>
  </div>
</template>
