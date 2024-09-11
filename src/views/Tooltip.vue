<script setup lang="ts">
import BaseTooltip from '@/components/BaseTooltip/index.vue'

defineOptions({
  name: 'DemoTooltip',
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Tooltip 工具提示框</h1>

    <div class="flex items-center justify-center">
      <BaseTooltip
        :offset-value="4"
        floating-arrow-color="bg-[#eee]"
        :class-name="{
          floatingDom: 'border border-light-gray text-[#484848]',
        }"
      >
        <template #trigger>
          <button class="inline-block rounded border bg-gray-100 p-4">Here</button>
        </template>

        <template #content>
          <span>Content in Tooltip</span>
        </template>
      </BaseTooltip>
    </div>
  </div>
</template>
