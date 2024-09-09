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
  <div class="outside__router">
    <img alt="Vue logo" src="./assets/logo.png" />
    <select v-model="selectedLanguageModel">
      <option v-for="list in LayoutLanguages" :key="list.param" :value="list.param">
        {{ list.title }}
      </option>
    </select>
  </div>

  <div class="info-content">
    <div class="info-content__links">
      <router-link :to="{ name: 'index' }">To Home</router-link>
      <router-link :to="{ name: 'test' }">To Test</router-link>
    </div>
  </div>

  <!-- render route here -->
  <router-view></router-view>
</template>

<style lang="scss" src="./styles/App.scss"></style>
