<script setup lang="ts">
import { DwButton } from '@drawings-ui/components'
</script>

<template>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
    <DwButton loading>加载中</DwButton>
    <DwButton type="primary" loading>加载中</DwButton>
    <DwButton type="success" loading>加载中</DwButton>
    <DwButton type="danger" loading>加载中</DwButton>
  </div>
</template>
