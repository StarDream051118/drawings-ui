<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const active = ref('home')
</script>

<template>
  <div class="row1">
    <DwTabs v-model="active">
      <DwTabButton value="home">首页</DwTabButton>
      <DwTabButton value="settings">设置</DwTabButton>
      <DwTabButton value="status">状态</DwTabButton>
      <DwTabButton value="about">关于</DwTabButton>
    </DwTabs>
  </div>
</template>
