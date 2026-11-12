<script setup lang="ts">
import { ref } from 'vue'
import { DwTabs } from '@star-dream051118/drawings-ui'

const active = ref(0)
</script>

<template>
  <div class="row1">
    <DwTabs v-model="active" :labels="['首页', '设置', '状态', '关于']" />
  </div>
</template>
