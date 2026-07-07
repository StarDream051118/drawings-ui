<script setup lang="ts">
import { DwButton } from '@drawings-ui/components'
</script>

<template>
  <div class="row1">
  <DwButton>有音效</DwButton>
  <DwButton :sound="false">无音效</DwButton>
  </div>
</template>
