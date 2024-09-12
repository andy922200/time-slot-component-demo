<script setup lang="ts">
import { ref } from 'vue'

import RadioGroup from '@/components/RadioGroup/index.vue'

const radioOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
]
const selectedOption = ref('option1')

defineOptions({
  name: 'DemoRadioGroup',
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">RadioGroup 單選按鈕組</h1>

    <div class="my-2 flex items-center justify-center">
      <RadioGroup v-model="selectedOption" :options="radioOptions" :checkbox-mode="false" />
    </div>

    <div class="flex items-center justify-center">
      <span class="mr-2">Selected Option:</span>
      <span>{{ selectedOption }}</span>
    </div>
  </div>
</template>
