<script setup lang="ts">
const props = defineProps({
  class: {
    type: String,
    default: 'border px-2 py-1 text-sm',
  },
  hasPrependIcon: {
    type: Boolean,
    default: false,
  },
  hasAppendIcon: {
    type: Boolean,
    default: false,
  },
})

defineOptions({
  name: 'BaseTag',
})
</script>

<template>
  <div class="tag inline-flex items-center rounded" :class="props.class">
    <span v-if="hasPrependIcon" class="prepend-icon">
      <slot name="prepend-icon" />
    </span>
    <span class="tag__text mx-2">
      <slot name="text" />
    </span>
    <span v-if="hasAppendIcon" class="append-icon">
      <slot name="append-icon" />
    </span>
  </div>
</template>
