<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const autoActive = ref(0)
const equalActive = ref(0)
</script>

<template>
  <div class="row2">
    <DwTabs v-model="autoActive" width-mode="auto">
      <DwTabButton>首页</DwTabButton>
      <DwTabButton>个人设置</DwTabButton>
      <DwTabButton>关于我们团队</DwTabButton>
    </DwTabs>
    <DwTabs v-model="equalActive" width-mode="equal">
      <DwTabButton>首页</DwTabButton>
      <DwTabButton>个人设置</DwTabButton>
      <DwTabButton>关于我们团队</DwTabButton>
    </DwTabs>
  </div>
</template>
