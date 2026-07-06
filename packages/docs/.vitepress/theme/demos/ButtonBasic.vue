<script setup lang="ts">
import { DwButton } from '@drawings-ui/components'
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
    <DwButton>默认按钮</DwButton>
    <DwButton type="primary">主要按钮</DwButton>
    <DwButton type="success">成功按钮</DwButton>
    <DwButton type="danger">危险按钮</DwButton>
  </div>
</template>
