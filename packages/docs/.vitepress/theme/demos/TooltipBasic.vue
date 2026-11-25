<script setup lang="ts">
import { ref } from 'vue'
import { DwButton, DwInput, DwTooltip } from '@star-dream051118/drawings-ui'

const name = ref('新的世界')
</script>

<template>
  <div class="tooltip-demo">
    <DwTooltip content="点击创建一个新的世界">
      <DwButton>创建新的世界</DwButton>
    </DwTooltip>
    <DwTooltip content="优先显示在光标左下角" placement="bottom-left">
      <DwButton>左下方位</DwButton>
    </DwTooltip>
    <DwTooltip placement="top-right" :show-delay="200">
      <DwButton>右上（延迟 200ms）</DwButton>
      <template #content>
        支持<strong>富文本</strong>的提示
      </template>
    </DwTooltip>
    <DwTooltip content="触屏设备长按 500ms 显示" touch>
      <DwButton>长按（触屏）</DwButton>
    </DwTooltip>
    <DwTooltip content="这是一段很长很长的提示文字，用于演示最大字符数截断" :max-length="12">
      <DwButton>最大 12 字符</DwButton>
    </DwTooltip>
    <DwTooltip :max-length="12">
      <template #content>
        世界名称：{{ name }}
      </template>
      <DwInput v-model="name" class="tooltip-demo-input" />
    </DwTooltip>
  </div>
</template>

<style>
.tooltip-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 10px;
  background: #48494a;
}

.tooltip-demo-input {
  display: block;
  width: 240px;
  height: 40px;
  padding: 4px 6px;
  border: 3px solid #a0a0a0;
  background: #000000;
  color: var(--dw-color-text);
  font-size: 14px;
}

.tooltip-demo-input:hover:not(:focus),
.tooltip-demo-input:focus {
  border-color: #ffffff;
  outline: none;
}
</style>
