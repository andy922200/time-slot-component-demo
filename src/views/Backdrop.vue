<script setup lang="ts">
import Backdrop from '@/components/Backdrop/index.vue'
import { useBackdrop } from '@/composables/useBackdrop'

const { isShowBackdrop, showBackdrop, closeBackdrop } = useBackdrop()

defineOptions({
  name: 'DemoBackdrop',
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Backdrop 背景板</h1>

    <div class="flex items-center justify-center">
      <button class="rounded bg-blue-300 p-6" @click="showBackdrop">Open Backdrop</button>
    </div>

    <Backdrop v-if="isShowBackdrop" :show="isShowBackdrop" :close-func="closeBackdrop">
      <template #content>
        <div class="flex size-60 items-center justify-center">
          <p>Content Here</p>
        </div>
      </template>
    </Backdrop>
  </div>
</template>
