<script setup lang="ts">
import { computed, PropType, ref, useAttrs, watch } from 'vue'

import { ExpansionItemData } from '@/components/Expansion/Expansion.type'

import ExpansionItem from './ExpansionItem.vue'

// Disable inheritAttrs
defineOptions({
  name: 'ExpansionGroup',
})

const attrs = useAttrs()
const props = defineProps({
  modelValue: {
    type: Array as PropType<boolean[] | undefined>,
    required: false,
    default: () => undefined,
  },
  items: {
    type: Array as PropType<ExpansionItemData[]>,
    required: false,
    default: () => [],
  },
  fullBorder: {
    type: Boolean,
    required: false,
    default: false,
  },
  single: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const emits = defineEmits(['update:modelValue'])

/* Internal State as Default */
const internalOpenStates = ref(props.items.map(() => false))

/* if v-modal is used, use v-modal */
const isUsingExternalControl = computed(() => props.modelValue !== undefined)
const isCurrentlyOpen = (index: number) => {
  return isUsingExternalControl.value && props.modelValue
    ? props.modelValue[index]
    : internalOpenStates.value[index]
}

const handleToggle = (index: number) => {
  if (isUsingExternalControl.value && props.modelValue) {
    let newValue = [...props.modelValue] // shallow copy
    newValue[index] = !newValue[index] // toggle target index
    if (props.single) {
      // if single mode, close other items
      newValue = newValue.map((state, idx) => (idx === index ? state : false))
    }
    emits('update:modelValue', newValue)
  } else {
    props.single
      ? (internalOpenStates.value = internalOpenStates.value.map((state, idx) =>
          idx === index ? !state : false,
        ))
      : (internalOpenStates.value[index] = !internalOpenStates.value[index])
  }
}

// watch items change, reset internalOpenStates
watch(
  () => props.items,
  () => {
    internalOpenStates.value = props.items.map(() => false)
  },
)

// for Unit Test
defineExpose({ isUsingExternalControl, isCurrentlyOpen })
</script>

<template>
  <div class="expansion">
    <ExpansionItem
      v-for="(item, index) in items"
      :key="index"
      :title="item.title"
      :is-open="isCurrentlyOpen(index)"
      :is-first="index === 0"
      :is-last="index === items.length - 1"
      :single="single"
      :full-border="fullBorder"
      :caret-class="`${attrs['caret-class']}`"
      :header-class="`${attrs['header-class']}`"
      @toggle="handleToggle(index)"
    >
      <template #header>
        <slot :name="`header-${index}`" />
      </template>

      <template #expand-area>
        <slot :name="`expand-area-${index}`">
          {{ item.content }}
        </slot>
      </template>

      <template #caret-icon>
        <slot name="caret-icon"> &#9660; </slot>
      </template>
    </ExpansionItem>
  </div>
</template>
