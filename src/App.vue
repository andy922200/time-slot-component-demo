<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { LayoutLanguages, Locales } from './plugins/i18n/config/locales'
import { useMainStore } from './store/modules/main'

const mainStore = useMainStore()
const { locale } = useI18n()
const selectedLanguageModel = computed({
  get() {
    return mainStore.selectedLanguage
  },
  set(value: Locales) {
    locale.value = value
    mainStore.setLanguage(value)
  },
})
</script>

<template>
  <div class="flex items-center justify-center">
    <img alt="Vue logo" src="./assets/logo.png" class="size-20" />
  </div>

  <div class="my-2 flex items-center justify-center">
    <p class="mx-2">語言選擇 Language Select</p>
    <select v-model="selectedLanguageModel">
      <option v-for="list in LayoutLanguages" :key="list.param" :value="list.param">
        {{ list.title }}
      </option>
    </select>
  </div>

  <div class="w-full">
    <div class="flex w-full items-center justify-center">
      <router-link :to="{ name: 'index' }" class="m-2">Time Selector 時間選擇</router-link>
      <router-link :to="{ name: 'calendar' }" class="m-2">Calendar 日曆</router-link>
      <router-link :to="{ name: 'selector' }" class="m-2">Selector 選擇器</router-link>
      <router-link :to="{ name: 'checkbox' }" class="m-2">Checkbox 核取方塊</router-link>
    </div>
  </div>

  <!-- render route here -->
  <router-view></router-view>
</template>
