<script setup lang="ts">
import { ref } from 'vue'

import BaseSelect from '@/components/BaseSelect/index.vue'
import { BaseSelectOption } from '@/components/BaseSelect/type'

const selectedItem = ref({
  val: '',
  isError: false,
})

const options: BaseSelectOption[] = [
  { id: '1', label: 'Option 1', value: 'option1' },
  { id: '2', label: 'Option 2', value: 'option2' },
  { id: '3', label: 'Option 3', value: 'option3' },
]

defineOptions({
  name: 'DemoSelector',
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Selector 選擇器</h1>

    <div class="flex items-center justify-center">
      <BaseSelect
        id="base-select"
        v-model="selectedItem.val"
        :options="options"
        :is-error="selectedItem.isError"
        wrapper-class="my-4"
        select-class="!py-1 text-sm h-9"
        @change="
          () => {
            selectedItem.isError = !selectedItem.isError
          }
        "
      />
    </div>

    <div class="my-1 flex justify-center">
      <p>Your Choice 你的選擇: {{ selectedItem.val }}</p>
    </div>
  </div>
</template>
