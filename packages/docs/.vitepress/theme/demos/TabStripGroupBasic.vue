<script setup lang="ts">
import { ref } from 'vue'
import {
  DwTabStripGroup,
  DwTabStripButton,
} from '@star-dream051118/drawings-ui'

const active = ref('game')
</script>

<template>
  <div class="row1">
    <DwTabStripGroup v-model="active" :size="180">
      <DwTabStripButton value="game">游戏</DwTabStripButton>
      <DwTabStripButton value="world">世界</DwTabStripButton>
      <DwTabStripButton value="more">更多</DwTabStripButton>
    </DwTabStripGroup>
  </div>
</template>
