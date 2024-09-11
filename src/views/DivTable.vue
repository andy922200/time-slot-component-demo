<script setup lang="ts">
import DivTable from '@/components/DivTable/index.vue'
import { HeaderItem } from '@/components/DivTable/type'

const header: HeaderItem[] = [
  { titleKey: 'Name', paramKey: 'name' },
  { titleKey: 'Age', paramKey: 'age' },
]

const data: Record<string, any>[] = [
  { name: 'John', age: '30' },
  { name: 'Jane', age: '25' },
]
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">DIV Table 表格</h1>

    <div class="flex w-full items-center justify-center p-2">
      <DivTable :header="header" :data="data" class="w-full" />
    </div>
  </div>
</template>
