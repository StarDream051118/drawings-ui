<script setup lang="ts">
import { DwButton } from '@stardream051118/drawings-ui'
</script>

<template>
  <div class="row2">
    <DwButton>默认</DwButton>
    <DwButton type="danger">危险</DwButton>
    <DwButton type="primary">主要</DwButton>
  </div>
</template>

<style>
  .row1 {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 10px 10px;
    background-color: #48494A;
    flex-wrap: wrap;
    align-items: center;
  }

  .row2 {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    gap: 12px;
    padding: 10px 10px;
    background-color: #48494A;
    flex-wrap: wrap;
    align-items: center;
  }

  .row3 {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    padding: 10px 10px;
    background-color: #48494A;
    flex-wrap: wrap;
    align-items: center;
  }
</style>
