<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const defaultActive = ref('a')
const primaryActive = ref('a')
const dangerActive = ref('a')
</script>

<template>
  <div class="row2">
    <div class="flex-center-h">
      <DwTabs v-model="defaultActive">
        <DwTabButton value="a">默认</DwTabButton>
        <DwTabButton value="b">标签</DwTabButton>
        <DwTabButton value="c">样式</DwTabButton>
      </DwTabs>
    </div>
    <div class="flex-center-h">
      <DwTabs v-model="primaryActive" type="primary">
        <DwTabButton value="a">主要</DwTabButton>
        <DwTabButton value="b">标签</DwTabButton>
        <DwTabButton value="c">样式</DwTabButton>
      </DwTabs>
    </div>
    <div class="flex-center-h">
      <DwTabs v-model="dangerActive" type="danger">
        <DwTabButton value="a">危险</DwTabButton>
        <DwTabButton value="b">标签</DwTabButton>
        <DwTabButton value="c">样式</DwTabButton>
      </DwTabs>
    </div>
  </div>
</template>
