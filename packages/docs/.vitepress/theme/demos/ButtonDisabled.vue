<script setup lang="ts">
import { UiButton } from '@drawings-ui/components'
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
    <UiButton disabled>禁用</UiButton>
    <UiButton type="primary" disabled>禁用</UiButton>
    <UiButton type="success" disabled>禁用</UiButton>
    <UiButton type="danger" disabled>禁用</UiButton>
  </div>
</template>
