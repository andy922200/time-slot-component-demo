<script setup lang="ts">
import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  offset,
  Placement,
  shift,
} from '@floating-ui/dom'
import { nextTick, onMounted, PropType, ref } from 'vue'

import { isMobileAgent } from '@/helpers'

defineOptions({
  name: 'BaseTooltip',
})

const props = defineProps({
  offsetValue: {
    type: Number as PropType<number>,
    default: 8,
  },
  text: {
    type: Object as PropType<{ triggerArea: string; content: string }>,
    default: () => ({
      triggerArea: 'Trigger Text',
      content: 'Content Text',
    }),
  },
  placement: {
    type: String as PropType<Placement>,
    default: 'right',
  },
  className: {
    type: Object as PropType<{ triggerItem?: string; floatingDom?: string }>,
    default: () => ({
      triggerItem: '',
      floatingDom: '',
    }),
  },
  floatingArrowColor: {
    type: String,
    default: 'bg-green-300',
  },
})

const triggerItem = ref()
const floatingDom = ref()
const floatingArrow = ref()
const displayTooltip = ref(false)
const position = ref({
  x: 0,
  y: 0,
})

const middleware = [offset(props.offsetValue), flip(), shift()]
const setFloating = async () => {
  autoUpdate(triggerItem.value, floatingDom.value, async () => {
    if (!triggerItem.value || !floatingDom.value || !floatingArrow.value) return
    const { x, y, placement, middlewareData } = await computePosition(
      triggerItem.value,
      floatingDom.value,
      {
        placement: props.placement,
        middleware: [...middleware, arrow({ element: floatingArrow.value })],
      },
    )

    const staticSideMap: Record<string, string> = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }
    const staticSide = staticSideMap[placement.split('-')[0]]

    Object.assign(floatingDom.value.style, {
      left: `${x}px`,
      top: `${y}px`,
    })

    const { x: arrowX, y: arrowY } = middlewareData.arrow || {}

    Object.assign(floatingArrow.value.style, {
      left: arrowX !== undefined ? `${arrowX}px` : '',
      top: arrowY !== undefined ? `${arrowY}px` : '',
      right: '',
      bottom: '',
      [staticSide]: '-4px',
    })
  })
}

onMounted(async () => {
  await nextTick()
  setFloating()
})

const showTooltip = (value: boolean, type: string) => {
  if (isMobileAgent()) {
    if (['mouse-enter'].includes(type)) return
  }
  displayTooltip.value = value
}
</script>

<template>
  <div class="base-tooltip relative w-fit text-sm">
    <div
      ref="triggerItem"
      class="trigger-item relative flex w-fit items-center"
      :class="className.triggerItem"
      @touchstart="showTooltip(true, 'touch-start')"
      @touchend="showTooltip(false, 'touch-end')"
      @mouseenter="showTooltip(true, 'mouse-enter')"
      @mouseleave="showTooltip(false, 'mouse-leave')"
    >
      <slot name="trigger">
        <span class="inline-block">{{ text.triggerArea }}</span>
      </slot>
    </div>

    <div
      v-show="displayTooltip"
      ref="floatingDom"
      :style="{
        top: `${position.x}px`,
        left: `${position.y}px`,
        width: 'max-content',
      }"
      class="floating-dom absolute left-0 top-0 z-20 w-max rounded p-2"
      :class="[className.floatingDom, floatingArrowColor]"
    >
      <slot name="content">
        {{ text.content }}
      </slot>
      <div
        ref="floatingArrow"
        class="floating-arrow absolute size-2 rotate-45"
        :class="[floatingArrowColor]"
      />
    </div>
  </div>
</template>
