<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const mixed = ref(1)
const allDisabled = ref(0)
</script>

<template>
  <div class="row2">
    <div class="flex-center-h">
      <DwTabs v-model="mixed">
        <DwTabButton>正常</DwTabButton>
        <DwTabButton disabled>禁用</DwTabButton>
        <DwTabButton>正常</DwTabButton>
      </DwTabs>
    </div>
    <div class="flex-center-h">
      <DwTabs v-model="allDisabled" disabled>
        <DwTabButton>整条禁用</DwTabButton>
        <DwTabButton>无法点击</DwTabButton>
      </DwTabs>
    </div>
  </div>
</template>
