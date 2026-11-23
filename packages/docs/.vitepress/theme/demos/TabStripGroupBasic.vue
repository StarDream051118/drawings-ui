<script setup lang="ts">
import { ref } from 'vue'
import { DwTabStripGroup } from '@star-dream051118/drawings-ui'

const tabs = [
  { value: 'game', label: '游戏' },
  { value: 'world', label: '世界' },
  { value: 'more', label: '更多' },
]
const active = ref('game')
</script>

<template>
  <div class="row1">
    <DwTabStripGroup v-model="active" :items="tabs" :size="180" />
  </div>
</template>
