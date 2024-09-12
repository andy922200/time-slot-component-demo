<script setup lang="ts">
import { computed, ref } from 'vue'

import MaterialSymbolsLightCheck from '~icons/material-symbols-light/check'

const props = withDefaults(
  defineProps<{
    options: { label: string; value: string }[]
    modelValue: string
    iconClass?: string
    verticalMode?: boolean
    checkboxMode?: boolean
    labelClass?: string
    checkboxClass?: {
      border?: string
      background?: string
      size?: string
      icon?: string
    }
  }>(),
  {
    options: () => [],
    modelValue: '',
    iconClass: 'text-blue-600',
    verticalMode: false,
    checkboxMode: false,
    labelClass: '',
    checkboxClass: () => ({
      border: 'border-gray-300',
      background: 'bg-white',
      size: 'size-6',
      icon: 'text-green-500',
    }),
  },
)

const emits = defineEmits(['update:modelValue'])
const isControlled = computed(() => props.modelValue !== undefined)
const localValue = ref(props.modelValue)

const internalValue = computed({
  get: () => (isControlled.value ? props.modelValue : localValue.value),
  set: (value) => {
    isControlled.value ? emits('update:modelValue', value) : (localValue.value = value)
    emits('update:modelValue', value)
  },
})

defineOptions({
  name: 'BaseRadioGroup',
})
</script>

<template>
  <div class="radio-group__wrapper p-1" :class="[verticalMode ? 'flex flex-col' : '']">
    <label
      v-for="option in options"
      :key="option.value"
      class="m-2 inline-flex cursor-pointer items-center"
    >
      <template v-if="props.checkboxMode">
        <input v-model="internalValue" type="radio" :value="option.value" class="hidden" />
        <span
          class="checkbox-span mr-2 flex cursor-pointer items-center justify-center rounded border"
          :class="[
            props.checkboxClass.border,
            props.checkboxClass.background,
            props.checkboxClass.size,
          ]"
        >
          <span v-if="internalValue === option.value" class="rounded">
            <MaterialSymbolsLightCheck
              :class="[props.checkboxClass.icon, props.checkboxClass.size]"
            />
          </span>
        </span>
      </template>

      <template v-else>
        <input
          v-model="internalValue"
          type="radio"
          :value="option.value"
          class="form-radio mr-1 cursor-pointer"
          :class="iconClass"
        />
      </template>

      <span :class="[props.labelClass]">{{ option.label }}</span>
    </label>
  </div>
</template>
