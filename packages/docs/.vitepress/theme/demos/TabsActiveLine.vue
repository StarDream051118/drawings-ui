<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const onActive = ref('a')
const offActive = ref('a')
</script>

<template>
  <div class="row2">
    <DwTabs v-model="onActive">
      <DwTabButton value="a">默认（有下划线）</DwTabButton>
      <DwTabButton value="b">选中项</DwTabButton>
    </DwTabs>
    <DwTabs v-model="offActive" :active-line="false">
      <DwTabButton value="a">关闭下划线</DwTabButton>
      <DwTabButton value="b">选中项</DwTabButton>
    </DwTabs>
  </div>
</template>
