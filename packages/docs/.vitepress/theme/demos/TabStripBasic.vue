<script setup lang="ts">
import { ref } from 'vue'
import { DwTabStrip } from '@star-dream051118/drawings-ui'

const tabs = [
  { value: 'game', label: '游戏' },
  { value: 'world', label: '世界' },
  { value: 'more', label: '更多' },
]
const active = ref('world')
</script>

<template>
  <div class="row1">
    <DwTabStrip v-model="active" :items="tabs" :content-height="180">
      <p class="tab-strip-demo-text">当前选中：{{ active }}</p>
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
