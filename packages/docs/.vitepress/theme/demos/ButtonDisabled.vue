<script setup lang="ts">
import { DwButton } from '@drawings-ui/components'
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
    <DwButton disabled>禁用</DwButton>
    <DwButton type="primary" disabled>禁用</DwButton>
    <DwButton type="success" disabled>禁用</DwButton>
    <DwButton type="danger" disabled>禁用</DwButton>
  </div>
</template>
