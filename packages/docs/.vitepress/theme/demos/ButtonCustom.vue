<script setup lang="ts">
import { DwButton } from '@star-dream051118/drawings-ui'
import rightIcon from '../icons/right.svg'
import closeIcon from '../icons/close.svg'
import heartIcon from '../icons/heart.svg'
</script>

<template>
  <div class="row1">
    <DwButton :icon="rightIcon">确认</DwButton>
    <DwButton :icon="closeIcon">关闭</DwButton>
    <DwButton :icon="heartIcon">收藏</DwButton>
  </div>
</template>
