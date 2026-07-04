<script setup lang="ts">
import { UiButton } from '@drawings-ui/components'
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
    <UiButton loading>加载中</UiButton>
    <UiButton type="primary" loading>加载中</UiButton>
    <UiButton type="success" loading>加载中</UiButton>
    <UiButton type="danger" loading>加载中</UiButton>
  </div>
</template>
