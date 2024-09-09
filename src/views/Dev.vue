<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import useStore from '../store/index'

const route = useRoute()
const path = computed(() => route.path)
const { main, demo } = useStore()
const { selectedLanguage } = storeToRefs(main)
const { user } = storeToRefs(demo)
const userEmail = user.value.email
</script>

<template>
  <h1>Dev Page</h1>
  <h2 id="path">Path: {{ path }}</h2>
  <h3>This is value 'selectedLanguage: {{ selectedLanguage }}'.</h3>
  <h3>This is value 'userEmail: {{ userEmail }}'.</h3>
</template>
