<script setup lang="ts">
const props = defineProps<{
  selectedDate: string
  dateObj: Record<string, any>
  holidayColor: string
  showBarColor: string
}>()

const emits = defineEmits<{
  'date-select': [value: string]
}>()

const dateSelectHandler = (e: MouseEvent, isInView: boolean) => {
  const target = e.currentTarget as HTMLElement | null

  if (target && isInView) {
    emits('date-select', `${target.dataset.date}`)
  }
}
</script>

<template>
  <div
    class="date-col"
    :data-date="props.dateObj.fullDateText"
    :class="{
      'in-view': props.dateObj.isInView,
      'date-selected': props.selectedDate === props.dateObj.fullDateText,
    }"
    @click="(e: MouseEvent) => dateSelectHandler(e, props.dateObj.isInView)"
  >
    <div
      class="date-content"
      :class="[{ 'show-bar': props.dateObj.shouldShowBar }, { holiday: props.dateObj.isHoliday }]"
      :style="{
        '--base-cal_holiday-color': props.holidayColor,
        '--base-cal_show-bar-color': props.showBarColor,
      }"
    >
      {{ props.dateObj.briefDateText }}
    </div>
  </div>
</template>

<style scoped>
.date-col {
  @apply relative h-0 w-1/7 select-none pt-[calc(100%/6)] text-sm text-gray-200 md:pt-[calc(100%/8.5)];
}

.in-view {
  @apply cursor-pointer text-black;
}

.date-content {
  @apply absolute left-1/2 top-1/2 flex h-full max-h-[2.2rem] w-full max-w-[2.2rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg md:max-h-[2.5rem] md:max-w-[2.5rem];
}

.in-view > .date-content {
  @apply hover:bg-slate-100;
}

.in-view > .date-content.holiday::before {
  @apply absolute left-1/2 top-[5%] h-[6px] w-[6px] -translate-x-1/2 rounded-full content-[''] md:top-[10%];
  background-color: var(--base-cal_holiday-color);
}

.in-view > .date-content.show-bar::after {
  @apply absolute bottom-[15%] left-1/2 w-4 -translate-x-1/2 rounded-sm border-b-[0.2rem] content-[''] md:bottom-[18%] md:w-5;
  border-bottom-color: var(--base-cal_show-bar-color);
}

.in-view.date-selected > .date-content {
  @apply pointer-events-none text-[#ffffff] bg-[#808080D9];
}
</style>
