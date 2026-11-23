<script setup lang="ts">
import { ref } from 'vue'
import {
  DwButton,
  DwInput,
  DwTabStrip,
  DwTabStripGroup,
  DwTabStripButton,
  DwTabStripContent,
  DwTabStripFooter,
} from '@star-dream051118/drawings-ui'

interface ShowcaseTab {
  value: string
  label: string
}

const tabs: ShowcaseTab[] = [
  { value: 'game', label: '游戏' },
  { value: 'world', label: '世界' },
  { value: 'more', label: '更多' },
]
const tabWidth = 300
const active = ref('game')
const worldName = ref('新的世界')
const tabStripBg = `${import.meta.env.BASE_URL}images/star.png`
</script>

<template>
  <div class="tabstrip-showcase">
    <DwTabStrip v-model="active" :size="tabWidth" :bg-image="tabStripBg" :bg-blur="3">
      <DwTabStripGroup>
        <DwTabStripButton
          v-for="item in tabs"
          :key="item.value"
          :value="item.value"
          style="font-size: 18px;"
        >
          {{ item.label }}
        </DwTabStripButton>
      </DwTabStripGroup>
      <DwTabStripContent :content-height="500">
        <div class="tabstrip-showcase-frame">
          <div class="tabstrip-showcase-content">
            <div class="showcase-world-title">世界名称</div>
            <DwInput v-model="worldName" class="showcase-input" />
            <DwButton class="showcase-button">游戏模式：生存</DwButton>
            <DwButton class="showcase-button">难度：普通</DwButton>
            <DwButton class="showcase-button">允许指令：关</DwButton>
          </div>
        </div>
      </DwTabStripContent>
      <DwTabStripFooter>
        <div class="tabstrip-showcase-footer">
          <div class="showcase-button-group">
            <DwButton class="showcase-footer-button">创建新的世界</DwButton>
            <DwButton class="showcase-footer-button">取消</DwButton>
          </div>
        </div>
      </DwTabStripFooter>
    </DwTabStrip>
  </div>
</template>

<style>
.tabstrip-showcase {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.tabstrip-showcase-frame {
  width: 550px;
  max-width: 100%;
  margin: 20px auto;
}

.tabstrip-showcase-content {
  width: 100%;
  height: 100%;
}

.showcase-world-title {
  margin-top: 30px;
  margin-bottom: 10px;
  font-size: 18px;
}

.showcase-input {
  display: block;
  width: 100%;
  height: 46px;
  margin-bottom: 20px;
  padding: 5px;
  border: 3px solid #a0a0a0;
  border-radius: 0;
  background: #000000;
  color: var(--dw-color-text);
  font-size: 16px;
  text-shadow: var(--dw-text-color-shadow);
}

.showcase-input:hover:not(:focus) {
  border-color: #ffffff;
}

.showcase-input:focus {
  outline: none;
  border-color: #ffffff;
}

.showcase-button {
  width: 100%;
  margin-bottom: 20px;
}

.tabstrip-showcase-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.showcase-button-group {
  display: flex;
  gap: 20px;
  width: 60%;
}

.showcase-footer-button {
  width: 100%;
}
</style>
