<script setup lang="ts">
import { ref } from 'vue'

import ExpansionGroup from '@/components/Expansion/ExpansionGroup.vue'
import TeenyiconsDownOutline from '~icons/teenyicons/down-outline'

const items = [
  { title: 'Item 1', content: 'Content 1', date: '2024/09/09' },
  { title: 'Item 2', content: 'Content 2', date: '2024/09/10' },
]

const singleMode = ref(true)
defineOptions({
  name: 'DemoExpansion',
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Expansion 展開元件</h1>

    <div class="my-2 flex w-full items-center justify-center">
      <div class="mx-2">
        <label for="single-mode">{{ $t('single-mode') }}：</label>
        <input id="single-mode" v-model="singleMode" type="checkbox" />
      </div>
    </div>

    <div class="my-2 flex w-full items-center justify-center">
      <ExpansionGroup
        :single="singleMode"
        :items="items"
        :full-border="false"
        header-class="justify-between items-center h-10"
        class="w-1/2 rounded border"
      >
        <template v-for="(item, index) in items" :key="index" #[`header-${index}`]>
          <div class="md:text flex flex-wrap items-center text-sm font-normal text-[#333333]">
            <span class="ml-1 w-full min-[400px]:m-0 min-[400px]:w-max">{{ item.title }}</span>
            <span class="ml-1 w-full min-[400px]:ml-4 min-[400px]:w-max">{{ item.date }}</span>
          </div>
        </template>

        <template v-for="(item, index) in items" :key="index" #[`expand-area-${index}`]>
          <div
            class="article-area mt-2 flex flex-col px-4 py-2 font-normal text-[#333333]"
            v-html="item.content"
          />
        </template>

        <template #caret-icon>
          <span class="text-sm text-gray-600">
            <TeenyiconsDownOutline />
          </span>
        </template>
      </ExpansionGroup>
    </div>
  </div>
</template>
