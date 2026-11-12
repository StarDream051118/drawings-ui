<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs } from '@star-dream051118/drawings-ui'

const borderActive = ref(1)
const pressedActive = ref(1)
</script>

<template>
  <div class="row2">
    <DwTabs v-model="borderActive" :labels="['描边式', '默认效果']" active-effect="border" />
    <DwTabs v-model="pressedActive" :labels="['按压式', '深底效果']" active-effect="pressed" />
  </div>
</template>
