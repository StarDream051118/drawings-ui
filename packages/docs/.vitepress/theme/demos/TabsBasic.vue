<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const active = ref(0)
</script>

<template>
  <div class="row1">
    <DwTabs v-model="active">
      <DwTabButton>首页</DwTabButton>
      <DwTabButton>设置</DwTabButton>
      <DwTabButton>状态</DwTabButton>
      <DwTabButton>关于</DwTabButton>
    </DwTabs>
  </div>
</template>
