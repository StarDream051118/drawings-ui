<script setup lang="ts">
import { DwButton } from '@star-dream051118/drawings-ui'
</script>

<template>
  <div class="row2">
    <DwButton :active="true" disabled>默认</DwButton>
    <DwButton :active="true" type="danger" disabled>危险</DwButton>
    <DwButton :active="true" type="primary" disabled>主要</DwButton>
  </div>
</template>
