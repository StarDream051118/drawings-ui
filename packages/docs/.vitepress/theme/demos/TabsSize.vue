<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs } from '@star-dream051118/drawings-ui'

const active = ref(0)
</script>

<template>
  <div class="row2">
    <DwTabs v-model="active" :labels="['默认', '中号', '大号']" />
    <DwTabs v-model="active" :labels="['120px', '160px', '200px']" :size="120" />
    <DwTabs v-model="active" :labels="['禁用', '全部不可点']" disabled />
  </div>
</template>
