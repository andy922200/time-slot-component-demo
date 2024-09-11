<script setup lang="ts">
import { computed, ref } from 'vue'

import CheckboxGroup from '@/components/CheckboxGroup/index.vue'

const optionMap = ref({
  id: 'group1',
  data: [
    { id: 'father1', name: 'Father', isFather: true, checked: false, value: 'father1' },
    { id: 'child1', name: 'Child 1', isFather: false, checked: false, value: 'child1' },
    { id: 'child2', name: 'Child 2', isFather: false, checked: false, value: 'child2' },
    { id: 'child3', name: 'Child 3', isFather: false, checked: false, value: 'child3' },
  ],
})

const optionStyle = {
  bgColor: '#ffffff',
  checkedBgColor: '#ffffff',
  checkedBorderColor: '#16a34a',
  defaultMarkIconColor: '#16a34a',
}

const selectedOptions = computed(() =>
  optionMap.value.data.filter((option) => option.checked && !option.isFather),
)
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">CheckboxGroup 核取方塊群</h1>

    <div class="flex items-center justify-center">
      <CheckboxGroup
        :option-map="optionMap"
        :option-style="optionStyle"
        group-wrapper-class="my-4 lg:items-center"
        father-class="mb-2 lg:mb-0 lg:mr-4 lg:w-[12rem] lg:break-all"
        children-area-class="px-4 py-2 border border-[#cccccc] rounded lg:w-[calc(100%-13rem)] lg:bg-[#d9d9d94d]"
        children-class="my-1 mr-4"
      />
    </div>

    <div class="my-1 flex justify-center">
      <p>Selected 選擇:</p>
      <ul>
        <li v-for="option in selectedOptions" :key="option.id">
          {{ option.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
