<script setup lang="ts">
import { computed, PropType } from 'vue'

import IconParkSolidDownOne from '~icons/icon-park-solid/down-one'
import IconParkSolidUpOne from '~icons/icon-park-solid/up-one'

const props = defineProps({
  modelValue: {
    type: Number as PropType<number>,
    default: 1,
  },
  total: {
    type: Number as PropType<number>,
    default: 0,
  },
  size: {
    type: Number as PropType<number>,
    required: false,
    default: 10,
  },
})

const emits = defineEmits(['update:modelValue'])

const currentPage = computed({
  get: () => props.modelValue,
  set: (value: number) => emits('update:modelValue', value),
})
const totalPage = computed(() => Math.ceil(props.total / props.size))

const toggleAdd = () => {
  if (currentPage.value < totalPage.value) {
    currentPage.value += 1
  }
}

const toggleMinus = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}
</script>

<template>
  <button
    class="rounded-full border border-transparent p-2"
    :class="{
      'cursor-default opacity-50': totalPage === 0 || currentPage === 1,
      'cursor-pointer hover:border-gray-300': currentPage !== 1,
    }"
    :disabled="totalPage === 0 || currentPage === 1"
    @click="toggleMinus"
  >
    <slot name="minus-icon">
      <IconParkSolidUpOne />
    </slot>
  </button>
  <button
    class="rounded-full border border-transparent p-2"
    :class="{
      'cursor-default opacity-50': totalPage === 0 || currentPage === totalPage,
      'cursor-pointer hover:border-gray-300': totalPage !== 0 && currentPage !== totalPage,
    }"
    :disabled="totalPage === 0 || currentPage === totalPage"
    @click="toggleAdd"
  >
    <slot name="add-icon">
      <IconParkSolidDownOne />
    </slot>
  </button>
</template>
