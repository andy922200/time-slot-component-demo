<script setup lang="ts">
import { ref } from 'vue'

import BaseCalendar from '@/components/BaseCalendar/index.vue'

const selectedDate = ref<string>('')
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Calendar 日曆</h1>

    <div class="flex items-center justify-center">
      <BaseCalendar v-model="selectedDate" class="my-1 max-w-[18.75rem] md:max-w-[30rem]" />
    </div>

    <div class="my-1 flex justify-center">
      <p>Selected Date 所選日期: {{ selectedDate }}</p>
    </div>
  </div>
</template>
