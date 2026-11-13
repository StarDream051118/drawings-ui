<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs, DwTabButton } from '@star-dream051118/drawings-ui'

const borderActive = ref(1)
const pressedActive = ref(1)
</script>

<template>
  <div class="row2">
    <div class="flex-center-h">
      <DwTabs v-model="borderActive" active-effect="border">
        <DwTabButton>描边式</DwTabButton>
        <DwTabButton>默认效果</DwTabButton>
      </DwTabs>
    </div>
    <div class="flex-center-h">
      <DwTabs v-model="pressedActive" active-effect="pressed">
        <DwTabButton>按压式</DwTabButton>
        <DwTabButton>深底效果</DwTabButton>
      </DwTabs>
    </div>
  </div>
</template>
