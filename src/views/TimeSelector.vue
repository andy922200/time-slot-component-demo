<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import {
  checkOverlaps,
  EndTimeOption,
  generateTimeSlots,
  getEndTimeOptions,
  getStartTimeOptions,
  StartTimeOption,
  TimeSlot,
  TimeSlotFromAPI,
} from '@/helpers/time-selector'
import dayjs from '@/plugins/dayjs'

defineOptions({
  name: 'DemoTimeSelector',
})

const dateFormatStr = 'YYYY-MM-DD'
const todayDayjs = dayjs()
const yesterdayDayjs = todayDayjs.subtract(1, 'day')
const tomorrowDayjs = todayDayjs.add(1, 'day')
const selectedDate = ref(todayDayjs.format(dateFormatStr))
const selectedStartTime = ref('')
const selectedEndObj = ref<EndTimeOption | null>(null)
const selectedEndDateTime = ref('')
const timeSlots = ref<TimeSlot[]>([])
const startTimeOptions = ref<StartTimeOption[]>([])
const endTimeOptions = ref<EndTimeOption[]>([])
const maxUsageHours = ref(24)
const minUsageHours = ref(0.5)
const timeSector = ref(30)
const generateCrossDay = ref(true)
const isNowActive = ref(true)

const usedTimeSlots = ref<TimeSlotFromAPI[]>([])

const maxUsageHoursOptions = Array.from({ length: 24 }, (_, i) => i + 1)
const minUsageHoursOptions = computed(() => {
  const maxHours = 1
  return Array.from(
    { length: maxHours / (timeSector.value / 60) },
    (_, i) => (i + 1) * (timeSector.value / 60),
  )
})
const timeSectorOptions = [15, 30, 60]

const fetchUsedTimeSlots = async () => {
  await new Promise((r) => setTimeout(r, 500))
  return [
    { startTime: '21:00', endTime: '22:30', date: yesterdayDayjs.format(dateFormatStr) },
    { startTime: '08:00', endTime: '08:30', date: todayDayjs.format(dateFormatStr) },
    { startTime: '23:00', endTime: '23:30', date: todayDayjs.format(dateFormatStr) },
    { startTime: '00:00', endTime: '00:50', date: tomorrowDayjs.format(dateFormatStr) },
    { startTime: '20:30', endTime: '23:30', date: tomorrowDayjs.format(dateFormatStr) },
  ]
}

onMounted(async () => {
  const mockUsedTimeSlots = await fetchUsedTimeSlots()

  usedTimeSlots.value = mockUsedTimeSlots
  handleDateChange()
})

const resetAllSelector = () => {
  resetTimeSlots()
  resetStartTimeArea()
  resetEndTimeArea()
}

const resetTimeSlots = () => {
  timeSlots.value = []
}

const resetStartTimeArea = () => {
  startTimeOptions.value = []
  selectedStartTime.value = ''
}

const resetEndTimeArea = () => {
  endTimeOptions.value = []
  selectedEndObj.value = null
  selectedEndDateTime.value = ''
}

const getNewTimeSlots = () => {
  timeSlots.value = generateTimeSlots({
    targetDate: selectedDate.value,
    timeSector: timeSector.value,
    dateFormat: dateFormatStr,
  })

  checkOverlaps({
    timeSlots: timeSlots.value,
    usedTimeSlots: usedTimeSlots.value,
    targetDate: selectedDate.value,
    dateFormat: dateFormatStr,
  })
}

const generateStartTimeOptions = () => {
  const result = getStartTimeOptions({
    allTimeSlots: timeSlots.value,
    targetDate: selectedDate.value,
    usedTimeSlots: usedTimeSlots.value,
    isNowActive: isNowActive.value,
    timeSector: timeSector.value,
    dateFormat: dateFormatStr,
  })

  startTimeOptions.value = result
}

const generateEndTimeOptions = () => {
  const result = getEndTimeOptions({
    startTime: selectedStartTime.value,
    allTimeSlots: timeSlots.value,
    targetDate: selectedDate.value,
    usedTimeSlots: usedTimeSlots.value,
    maxUsageHours: maxUsageHours.value,
    minUsageHours: minUsageHours.value,
    timeSector: timeSector.value,
    generateCrossDay: generateCrossDay.value,
    dateFormat: dateFormatStr,
  })
  endTimeOptions.value = result
}

const handleDateChange = () => {
  resetAllSelector()
  getNewTimeSlots()
  generateStartTimeOptions()
}

const handleStartTimeChange = () => {
  resetEndTimeArea()
  generateEndTimeOptions()
}

const handleEndTimeChange = () => {
  if (!selectedEndObj.value) return

  const [time, nextDayStr] = selectedEndObj.value.label.split('_')

  selectedEndDateTime.value =
    nextDayStr === 'next-day'
      ? `${dayjs(selectedDate.value).add(1, 'day').format(dateFormatStr)} ${time}`
      : `${selectedDate.value} ${time}`
}

const handleMinHourChange = () => {
  resetEndTimeArea()
  generateEndTimeOptions()
}

const handleMaxHourChange = () => {
  resetEndTimeArea()
  generateEndTimeOptions()
}

const handleTimeSectorChange = () => {
  if (!minUsageHoursOptions.value.includes(minUsageHours.value)) {
    minUsageHours.value = minUsageHoursOptions.value[0]
  }

  resetStartTimeArea()
  resetEndTimeArea()
  getNewTimeSlots()
  generateStartTimeOptions()
}

const handleGenerateCrossDayChange = () => {
  resetEndTimeArea()
  generateEndTimeOptions()
}

const handleIsNowActive = () => {
  resetStartTimeArea()
  resetEndTimeArea()
  generateStartTimeOptions()
}
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">Time Selector 選擇器</h1>

    <div class="flex items-center justify-center">
      <h3 class="m-2">{{ $t('used-time-slots') }}</h3>
      <ul>
        <li v-for="slot in usedTimeSlots" :key="slot.startTime">
          <p>{{ slot.date }} {{ slot.startTime }} ~ {{ slot.endTime }}</p>
        </li>
      </ul>
    </div>

    <div class="flex flex-wrap items-center justify-center">
      <div class="m-2 flex flex-wrap">
        <div class="mx-2">
          <label for="generate-cross-day">{{ $t('generate-cross-day') }}：</label>
          <input
            id="generate-cross-day"
            v-model="generateCrossDay"
            type="checkbox"
            @change="handleGenerateCrossDayChange"
          />
        </div>

        <div class="mx-2">
          <label for="is-now-active">{{ $t('is-now-active') }}：</label>
          <input
            id="is-now-active"
            v-model="isNowActive"
            type="checkbox"
            @change="handleIsNowActive"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-center">
      <div class="m-2">
        <label for="time-sector">{{ $t('time-sector') }}：</label>
        <select
          id="time-sector"
          v-model="timeSector"
          class="min-w-32"
          @change="handleTimeSectorChange"
        >
          <option v-for="item in timeSectorOptions" :key="item" :value="item">
            {{ item }} {{ $t('minutes') }}
          </option>
        </select>
      </div>

      <div class="m-2">
        <label for="min-usage-hours">{{ $t('min-usage-hours') }}：</label>
        <select
          id="min-usage-hours"
          v-model="minUsageHours"
          class="min-w-32"
          @change="handleMinHourChange"
        >
          <option v-for="hours in minUsageHoursOptions" :key="hours" :value="hours">
            {{ hours }} {{ $t('hours') }}
          </option>
        </select>
      </div>

      <div class="m-2">
        <label for="max-usage-hours">{{ $t('max-usage-hours') }}：</label>
        <select
          id="max-usage-hours"
          v-model="maxUsageHours"
          class="min-w-32"
          @change="handleMaxHourChange"
        >
          <option v-for="hours in maxUsageHoursOptions" :key="hours" :value="hours">
            {{ hours }} {{ $t('hours') }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-center">
      <div class="m-2">
        <label for="date-picker">{{ $t('date') }}：</label>
        <input id="date-picker" v-model="selectedDate" type="date" @change="handleDateChange" />
      </div>

      <div class="m-2">
        <label for="start-time-picker">{{ $t('start-time') }}：</label>
        <select
          id="start-time-picker"
          v-model="selectedStartTime"
          :disabled="startTimeOptions.length === 0"
          class="min-w-32"
          @change="handleStartTimeChange"
        >
          <option v-for="option in startTimeOptions" :key="option.value" :value="option.value">
            {{ option.value === 'Now' ? $t('now') : option.label }}
          </option>
        </select>
      </div>

      <div class="m-2">
        <label for="end-time-picker">{{ $t('end-time') }}：</label>
        <select
          id="end-time-picker"
          v-model="selectedEndObj"
          :disabled="endTimeOptions.length === 0"
          class="min-w-32"
          @change="handleEndTimeChange"
        >
          <option v-for="option in endTimeOptions" :key="option.value" :value="option">
            {{
              option.label.includes('next-day')
                ? `${option.label.split('_')[0]} ${$t(`${option.label.split('_')[1]}`)}`
                : option.label
            }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-center">
      <p class="my-2 w-full text-center">
        {{ $t('selected-start-dateTime') }}： {{ selectedDate }} {{ selectedStartTime }}
      </p>
      <p class="my-2 w-full text-center">
        {{ $t('selected-end-dateTime') }}： {{ selectedEndDateTime }}
      </p>
    </div>
  </div>
</template>
