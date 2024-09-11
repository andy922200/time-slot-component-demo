<script setup lang="ts">
import { ref } from 'vue'

import BaseInput from '@/components/BaseInput/index.vue'

const inputItem = ref({
  val: '',
  isError: false,
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Input 輸入框</h1>

    <div class="flex items-center justify-center">
      <BaseInput
        id="base-input"
        v-model="inputItem.val"
        type="input"
        is-required
        label-name="Label 1"
        placeholder="Enter ..."
        wrapper-class="mb-4"
        class="h-9"
        :is-error="inputItem.isError"
        @change="() => (inputItem.isError = !inputItem.isError)"
      />
    </div>

    <div class="my-1 flex justify-center">
      <p>你輸入的內容 Your Input: {{ inputItem.val }}</p>
    </div>
  </div>
</template>
