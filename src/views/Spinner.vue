<script setup lang="ts">
import Spinner from '@/components/Spinner/index.vue'

defineOptions({
  name: 'DemoSpinner',
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Spinner 讀取圖示</h1>

    <div class="flex items-center justify-center">
      <Spinner color="#e623dd" />
    </div>
  </div>
</template>
