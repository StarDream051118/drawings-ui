<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const active = ref(0)
</script>

<template>
  <div class="row2">
    <DwTabs v-model="active">
      <DwTabButton>默认</DwTabButton>
      <DwTabButton size="medium">中号</DwTabButton>
      <DwTabButton size="large">大号</DwTabButton>
    </DwTabs>
    <DwTabs v-model="active" :size="120">
      <DwTabButton>120px</DwTabButton>
      <DwTabButton>数值宽度</DwTabButton>
    </DwTabs>
    <DwTabs v-model="active" disabled>
      <DwTabButton>禁用</DwTabButton>
      <DwTabButton>全部不可点</DwTabButton>
    </DwTabs>
  </div>
</template>
