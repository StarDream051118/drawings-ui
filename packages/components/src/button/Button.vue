<script setup lang="ts">
defineOptions({ name: 'UiButton' })

interface Props {
  type?: 'default' | 'primary' | 'success' | 'danger'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
})
</script>

<template>
  <button
    class="ui-button"
    :class="[`ui-button--${type}`, `ui-button--${size}`]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="ui-button__loading" />
    <span class="ui-button__content">
      <slot />
    </span>
  </button>
</template>

<style src="./button.scss" />
