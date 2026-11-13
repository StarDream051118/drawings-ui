<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const active = ref(0)
const silent = ref(0)
</script>

<template>
  <div class="row2">
    <DwTabs v-model="active">
      <DwTabButton>有音效</DwTabButton>
      <DwTabButton>切换试试</DwTabButton>
    </DwTabs>
    <DwTabs v-model="silent" :sound="false">
      <DwTabButton>无音效</DwTabButton>
      <DwTabButton>切换试试</DwTabButton>
    </DwTabs>
  </div>
</template>
