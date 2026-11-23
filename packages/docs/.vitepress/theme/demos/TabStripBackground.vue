<script setup lang="ts">
import { ref } from 'vue'
import {
  DwTabStrip,
  DwTabStripGroup,
  DwTabStripButton,
  DwTabStripContent,
} from '@star-dream051118/drawings-ui'

const active = ref('world')

// 用内联 SVG 当背景图，避免示例依赖外部资源
const bgImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180">
    <rect width="320" height="180" fill="#1b2a4a"/>
    <rect y="120" width="320" height="60" fill="#101d33"/>
    <circle cx="52" cy="44" r="10" fill="#e8d98a" opacity=".85"/>
    <circle cx="132" cy="70" r="5" fill="#9fd6ff" opacity=".7"/>
    <circle cx="226" cy="38" r="7" fill="#ffffff" opacity=".5"/>
    <circle cx="284" cy="92" r="4" fill="#9fd6ff" opacity=".6"/>
  </svg>`,
)}`
</script>

<template>
  <div class="row1">
    <DwTabStrip v-model="active">
      <DwTabStripGroup>
        <DwTabStripButton value="game">游戏</DwTabStripButton>
        <DwTabStripButton value="world">世界</DwTabStripButton>
        <DwTabStripButton value="more">更多</DwTabStripButton>
      </DwTabStripGroup>
      <DwTabStripContent :bg-image="bgImage" :bg-blur="3" :content-height="180">
        <p class="tab-strip-demo-text">背景图 + 模糊</p>
      </DwTabStripContent>
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
