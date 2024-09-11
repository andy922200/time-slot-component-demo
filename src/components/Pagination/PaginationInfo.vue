<script setup lang="ts">
import { computed, PropType } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number as PropType<number>,
    default: 1,
  },
  total: {
    type: Number as PropType<number>,
    default: 0,
  },
  size: {
    type: Number as PropType<number>,
    default: 10,
  },
})

const emits = defineEmits(['update:modelValue'])

const currentPage = computed({
  get: () => props.modelValue,
  set: (value: number) => emits('update:modelValue', value),
})

defineExpose({ currentPage })
</script>

<template>
  <span class="inline-block max-w-48 grow truncate text-center text-sm">
    <slot name="info">
      {{ total === 0 ? 0 : (currentPage - 1) * size + 1 }} -
      {{ currentPage * size > total ? total : currentPage * size }} of {{ total }}
    </slot>
  </span>
</template>
