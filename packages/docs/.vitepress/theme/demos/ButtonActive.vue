<script setup lang="ts">
import { DwButton } from '@star-dream051118/drawings-ui'
</script>

<template>
  <div class="row2">
    <DwButton :active="true">默认</DwButton>
    <DwButton :active="true" type="danger">危险</DwButton>
    <DwButton :active="true" type="primary">主要</DwButton>
  </div>
</template>
