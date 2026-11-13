<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const autoActive = ref(0)
const fillActive = ref(0)
</script>

<template>
  <div class="row2">
    <DwTabs v-model="autoActive">
      <DwTabButton>默认</DwTabButton>
      <DwTabButton>按内容宽</DwTabButton>
      <DwTabButton>右侧留白</DwTabButton>
    </DwTabs>
    <DwTabs v-model="fillActive" fill>
      <DwTabButton>铺满</DwTabButton>
      <DwTabButton>均分</DwTabButton>
      <DwTabButton>宽度</DwTabButton>
    </DwTabs>
  </div>
</template>
