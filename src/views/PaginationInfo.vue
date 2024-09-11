<script setup lang="ts">
import { ref } from 'vue'

import PaginationButtons from '@/components/Pagination/PaginationButtons.vue'
import PaginationInfo from '@/components/Pagination/PaginationInfo.vue'

const currentPage = ref(1)
const pageCount = ref(10)
const totalAmount = ref(95)
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Pagination Info 分頁資訊</h1>

    <div class="my-4 flex items-center justify-center">
      <PaginationButtons v-model="currentPage" :total="totalAmount" :size="pageCount" />
    </div>

    <div class="flex items-center justify-center">
      <PaginationInfo v-model="currentPage" :total="totalAmount" />
    </div>
  </div>
</template>
