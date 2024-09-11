<script setup lang="ts">
import { ref } from 'vue'

import BaseCheckbox from '@/components/BaseCheckbox/index.vue'

const selected = ref<boolean>(false)
const optionStyle = {
  bgColor: '#ffffff',
  checkedBgColor: '#ffffff',
  checkedBorderColor: '#16a34a',
  defaultMarkIconColor: '#16a34a',
}

defineOptions({
  name: 'DemoCheckbox',
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Checkbox 核取方塊</h1>

    <div class="flex items-center justify-center">
      <BaseCheckbox
        v-model="selected"
        class="my-1 mr-3"
        :bg-color="optionStyle.bgColor"
        :checked-bg-color="optionStyle.checkedBgColor"
        :checked-border-color="optionStyle.checkedBorderColor"
        :default-mark-icon-color="optionStyle.defaultMarkIconColor"
      >
        <span>Box 選項 1</span>
      </BaseCheckbox>
    </div>

    <div class="my-1 flex justify-center">
      <p>Selected 選擇？: {{ selected }}</p>
    </div>
  </div>
</template>
