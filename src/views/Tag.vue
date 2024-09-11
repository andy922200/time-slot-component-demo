<script setup lang="ts">
import BaseTag from '@/components/BaseTag/index.vue'
import IonSnow from '~icons/ion/snow'
defineOptions({
  name: 'DemoTag',
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Tag 標籤</h1>

    <div class="flex items-center justify-center">
      <BaseTag
        has-prepend-icon
        class="mx-1 px-2 py-1 text-sm text-white"
        :style="{ backgroundColor: '#0096FF' }"
      >
        <template #prepend-icon>
          <IonSnow />
        </template>

        <template #text> Tag 1 </template>
      </BaseTag>
    </div>
  </div>
</template>
