<script setup lang="ts">
import { ref } from 'vue'

import PaginationButtons from '@/components/Pagination/PaginationButtons.vue'

const currentPage = ref(1)
const pageCount = ref(10)
const totalAmount = ref(95)
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Pagination Buttons 分頁按鈕</h1>

    <div class="my-4 flex items-center justify-center">
      <PaginationButtons v-model="currentPage" :total="totalAmount" :size="pageCount" />
    </div>

    <div class="flex flex-wrap items-center justify-center">
      <p class="w-full text-center">Current Page 當前頁數: {{ currentPage }}</p>
      <p class="w-full text-center">Total Amount 總數量: {{ totalAmount }}</p>
    </div>
  </div>
</template>
