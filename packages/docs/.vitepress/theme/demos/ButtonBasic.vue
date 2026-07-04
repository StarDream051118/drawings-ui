<script setup lang="ts">
import { UiButton } from '@drawings-ui/components'
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
    <UiButton>默认按钮</UiButton>
    <UiButton type="primary">主要按钮</UiButton>
    <UiButton type="success">成功按钮</UiButton>
    <UiButton type="danger">危险按钮</UiButton>
  </div>
</template>
