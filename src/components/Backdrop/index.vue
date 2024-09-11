<script setup lang="ts">
import { PropType } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    required: false,
    default: false,
  },
  closeFunc: {
    type: Function as PropType<(payload: MouseEvent) => void>,
    required: false,
    default: () => {},
  },
})
</script>

<template>
  <Teleport to="body">
    <div v-show="props.show" class="backdrop" @click.self="props.closeFunc">
      <slot name="content" />
    </div>
  </Teleport>
</template>

<style scoped>
.backdrop {
  background: rgba(230, 230, 230, 0.8);
  @apply fixed bottom-0 left-0 right-0 top-0 z-20 flex h-full w-full items-center justify-center;
}
</style>
