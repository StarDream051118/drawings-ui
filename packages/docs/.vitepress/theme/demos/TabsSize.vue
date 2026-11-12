<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const defaultActive = ref(0)
const mediumActive = ref(0)
const largeActive = ref(0)
</script>

<template>
  <div class="row2">
    <DwTabs v-model="defaultActive">
      <DwTabButton>默认</DwTabButton>
      <DwTabButton>自适应宽度</DwTabButton>
      <DwTabButton>按钮</DwTabButton>
    </DwTabs>
    <DwTabs v-model="mediumActive" size="medium">
      <DwTabButton>中号</DwTabButton>
      <DwTabButton>150px</DwTabButton>
    </DwTabs>
    <DwTabs v-model="largeActive" size="large">
      <DwTabButton>大号</DwTabButton>
      <DwTabButton>300px</DwTabButton>
    </DwTabs>
  </div>
</template>
