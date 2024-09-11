<script setup lang="ts">
import { ref } from 'vue'

import BaseSwitch from '@/components/BaseSwitch/index.vue'

const switchOn = ref(false)

defineOptions({
  name: 'DemoSwitch',
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Switch 切換按鈕</h1>

    <div class="my-4 flex items-center justify-center">
      <BaseSwitch v-model:value="switchOn" off-side-str="close" on-side-str="open" class="h-full" />
    </div>
  </div>
</template>
