<script setup lang="ts">
import { ref } from 'vue'
import { DwInput } from '@star-dream051118/drawings-ui'

const value = ref('新的世界')
const slowValue = ref('慢速闪烁')
</script>

<template>
  <div class="input-demo">
    <div class="input-demo-title">世界名称</div>
    <DwInput v-model="value" class="input-demo-field" />

    <div class="input-demo-title input-demo-title--gap">慢速闪烁（1.5 秒）</div>
    <DwInput v-model="slowValue" :blink-duration="1.5" class="input-demo-field" />
  </div>
</template>

<style>
.input-demo {
  width: 360px;
  max-width: 100%;
  padding: 16px;
  background: #2b2b2b;
}

.input-demo-title {
  margin-bottom: 10px;
  font-size: 18px;
  color: #ffffff;
}

.input-demo-title--gap {
  margin-top: 16px;
}

.input-demo-field {
  display: block;
  width: 100%;
  height: 46px;
  padding: 5px;
  border: 3px solid #a0a0a0;
  border-radius: 0;
  background: #000000;
  color: var(--dw-color-text);
  font-size: 16px;
  text-shadow: var(--dw-text-color-shadow);
}

.input-demo-field:hover:not(:focus) {
  border-color: #ffffff;
}

.input-demo-field:focus {
  outline: none;
  border-color: #ffffff;
}
</style>
