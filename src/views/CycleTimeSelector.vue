<script setup lang="ts">
import { computed, ref } from 'vue'

import CycleTimeSelector from '@/components/CycleTimeSelector/index.vue'
import { CycleTimeSelectorEmitItem } from '@/components/CycleTimeSelector/type'

const disableDays = ref([0, 3])
const selectedCycleTimeResult = ref<CycleTimeSelectorEmitItem[]>([])
const handleCycleTimeChange = (result: CycleTimeSelectorEmitItem[]) => {
  selectedCycleTimeResult.value = result
}

const isValidCycleTimeResult = computed(() => {
  return selectedCycleTimeResult.value.every((item) => item.isValid)
})
</script>

<template>
  <div class="mx-auto w-full">
    <CycleTimeSelector
      :week-start-day="1"
      :disabled-days="disableDays"
      class="flex justify-center"
      @change="handleCycleTimeChange"
    />

    <div class="my-1 flex flex-wrap justify-center">
      <p class="mb-2 w-full text-center">限制選取日: {{ disableDays }}</p>
      <p class="mb-2 w-full text-center">0: Sun, 1: Mon, ...etc.</p>
      <p class="mb-2 w-full text-center">選取內容無漏填: {{ isValidCycleTimeResult }}</p>
    </div>

    <div class="my-1 flex flex-wrap justify-center">
      <p class="mb-2 w-full text-center">選取的週期時間</p>
      <p
        v-for="item in selectedCycleTimeResult"
        :key="item.weekday"
        class="mb-2 w-full text-center"
        :class="{ 'text-red-500': !item.isValid }"
      >
        {{ item.weekday }}: {{ item.selectedStartTime }} ~ {{ item.selectedEndTime }}
      </p>
    </div>
  </div>
</template>
