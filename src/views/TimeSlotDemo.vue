<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'

import dayjs from '@/plugins/dayjs'
import {
  checkOverlaps,
  EndTimeOption,
  generateTimeSlots,
  getEndTimeOptions,
  getStartTimeOptions,
  StartTimeOption,
  TimeSlot,
  TimeSlotFromAPI,
} from '@/time-slot-filter'

import useStore from '../store/index'

const { main } = useStore()
const { selectedLanguage } = storeToRefs(main)

const todayDayjs = dayjs()
const yesterdayDayjs = todayDayjs.subtract(1, 'day')
const tomorrowDayjs = todayDayjs.add(1, 'day')
const selectedDate = ref(todayDayjs.format('YYYY-MM-DD'))
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
const maxUsageHoursOptions = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
]
const fetchUsedTimeSlots = async () => {
  await new Promise((r) => setTimeout(r, 500))
  return [
    { startTime: '21:31', endTime: '22:40', date: yesterdayDayjs.format('YYYY-MM-DD') },
    { startTime: '23:05', endTime: '23:10', date: yesterdayDayjs.format('YYYY-MM-DD') },
    { startTime: '19:00', endTime: '19:50', date: todayDayjs.format('YYYY-MM-DD') },
    { startTime: '23:29', endTime: '23:50', date: tomorrowDayjs.format('YYYY-MM-DD') },
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

const generateStartTimeOptions = () => {
  startTimeOptions.value = getStartTimeOptions({
    allTimeSlots: timeSlots.value,
    targetDate: selectedDate.value,
    usedTimeSlots: usedTimeSlots.value,
    isNowActive: isNowActive.value,
    timeSector: timeSector.value,
  })
}

const generateEndTimeOptions = () => {
  endTimeOptions.value = getEndTimeOptions({
    startTime: selectedStartTime.value,
    allTimeSlots: timeSlots.value,
    targetDate: selectedDate.value,
    usedTimeSlots: usedTimeSlots.value,
    maxUsageHours: maxUsageHours.value,
    minUsageHours: minUsageHours.value,
    timeSector: timeSector.value,
    generateCrossDay: generateCrossDay.value,
  })
}

const handleDateChange = () => {
  resetAllSelector()

  timeSlots.value = generateTimeSlots({
    targetDate: selectedDate.value,
    timeSector: timeSector.value,
  })

  checkOverlaps({
    timeSlots: timeSlots.value,
    usedTimeSlots: usedTimeSlots.value,
    targetDate: selectedDate.value,
  })

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
      ? `${dayjs(selectedDate.value).add(1, 'day').format('YYYY-MM-DD')} ${time}`
      : `${selectedDate.value} ${time}`
}

const handleMaxHourChange = () => {
  resetEndTimeArea()
  generateEndTimeOptions()
}
</script>

<template>
  <div class="time-slot-demo">
    <h1>Time Slot 選擇器示範</h1>
    <h2>{{ $t('selected-lang') }}: {{ selectedLanguage }}</h2>

    <div class="other-fixed-rules">
      <h3>{{ $t('other-fixed-rules') }}</h3>
      <ul>
        <li>{{ $t('min-usage-hours') }}: {{ minUsageHours }} {{ $t('hours') }}</li>
        <li>{{ $t('time-sector') }}: {{ timeSector }} {{ $t('minutes') }}</li>
        <li>{{ $t('generate-cross-day') }} - true</li>
        <li>{{ $t('is-now-active') }} - true</li>
      </ul>
    </div>

    <div class="used-time-slots">
      <h3>{{ $t('used-time-slots') }}</h3>
      <ul>
        <li v-for="slot in usedTimeSlots" :key="slot.startTime">
          <p>{{ slot.date }} {{ slot.startTime }} ~ {{ slot.endTime }}</p>
        </li>
      </ul>
    </div>

    <div class="selector-area">
      <div class="selector">
        <label for="date-picker">{{ $t('date') }}：</label>
        <input id="date-picker" v-model="selectedDate" type="date" @change="handleDateChange" />
      </div>

      <div class="selector">
        <label for="max-usage-hours">{{ $t('max-usage-hours') }}：</label>
        <select id="max-usage-hours" v-model="maxUsageHours" @change="handleMaxHourChange">
          <option v-for="hours in maxUsageHoursOptions" :key="hours" :value="hours">
            {{ hours }} {{ $t('hours') }}
          </option>
        </select>
      </div>

      <div class="selector">
        <label for="start-time-picker">{{ $t('start-time') }}：</label>
        <select
          id="start-time-picker"
          v-model="selectedStartTime"
          :disabled="startTimeOptions.length === 0"
          @change="handleStartTimeChange"
        >
          <option v-for="option in startTimeOptions" :key="option.value" :value="option.value">
            {{ option.value === 'Now' ? $t('now') : option.label }}
          </option>
        </select>
      </div>

      <div class="selector">
        <label for="end-time-picker">{{ $t('end-time') }}：</label>
        <select
          id="end-time-picker"
          v-model="selectedEndObj"
          :disabled="endTimeOptions.length === 0"
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

    <div class="display-result">
      <p>{{ $t('selected-start-dateTime') }}： {{ selectedDate }} {{ selectedStartTime }}</p>
      <p>{{ $t('selected-end-dateTime') }}： {{ selectedEndDateTime }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.time-slot-demo {
  width: 100%;

  h1,
  h2 {
    text-align: center;
  }

  .selector-area {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5rem 0;

    .selector {
      margin: 0 0.5rem;

      select {
        min-width: 8rem;
      }
    }
  }

  .display-result {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    p {
      width: 100%;
      text-align: center;
      margin: 0.5rem 0;
    }
  }

  .used-time-slots {
    display: flex;
    justify-content: center;
    align-items: center;

    h3 {
      margin: 0 0.5rem;
    }
  }

  .other-fixed-rules {
    display: flex;
    justify-content: center;
    align-items: center;

    h3 {
      margin: 0 0.5rem;
    }
  }
}
</style>
