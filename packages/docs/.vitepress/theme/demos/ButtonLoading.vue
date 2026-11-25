<script setup lang="ts">
import { DwButton } from '@star-dream051118/drawings-ui'
</script>

<template>
  <div class="row2">
    <DwButton :loading="true">默认</DwButton>
    <DwButton :loading="true" type="primary">主要</DwButton>
    <DwButton :loading="true" type="danger">危险</DwButton>
  </div>
</template>
