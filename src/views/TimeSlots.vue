<script setup lang="ts">
import { onMounted, ref } from 'vue'

import TimeSlots from '@/components/TimeSlots/index.vue'
import { TimeSlotDataInterval } from '@/components/TimeSlots/type'
import dayjs from '@/plugins/dayjs'

const todayDayjs = dayjs()
const yesterdayDayjs = todayDayjs.subtract(1, 'day')
const tomorrowDayjs = todayDayjs.add(1, 'day')
const selectedDate = ref(todayDayjs.format('YYYY-MM-DD'))
const dataIntervals = ref<TimeSlotDataInterval[]>([])

const fetchData = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return [
    { date: yesterdayDayjs.format('YYYY-MM-DD'), start: '08:00', end: '09:30', type: 'disabled' },
    { date: yesterdayDayjs.format('YYYY-MM-DD'), start: '12:17', end: '17:38', type: 'used' },
    { date: todayDayjs.format('YYYY-MM-DD'), start: '00:00', end: '02:00', type: 'used' },
    { date: todayDayjs.format('YYYY-MM-DD'), start: '02:00', end: '02:30', type: 'disabled' },
    { date: todayDayjs.format('YYYY-MM-DD'), start: '16:17', end: '18:38', type: 'used' },
    { date: todayDayjs.format('YYYY-MM-DD'), start: '22:00', end: '22:40', type: 'disabled' },
    { date: tomorrowDayjs.format('YYYY-MM-DD'), start: '10:00', end: '16:30', type: 'disabled' },
    { date: tomorrowDayjs.format('YYYY-MM-DD'), start: '20:17', end: '22:38', type: 'used' },
  ] as TimeSlotDataInterval[]
}

const slotStyle = {
  disabled: '!border-y-gray-600 !bg-gray-600',
  used: '!border-y-[#FF4500] !bg-[#FF4500]',
  past: 'opacity-60',
  normal: 'border-y-white bg-white',
}

onMounted(async () => {
  dataIntervals.value = await fetchData()
})

defineOptions({
  name: 'DemoTimeSlots',
})
</script>

<template>
  <div class="w-full">
    <h1 class="text-center text-lg">TimeSlots 時間間隔顯示</h1>

    <div class="flex items-center justify-center">
      <h3 class="m-2">{{ $t('used-time-slots') }}</h3>
      <ul>
        <li v-for="slot in dataIntervals" :key="slot.start">
          <p>{{ slot.date }} {{ slot.start }} ~ {{ slot.end }} : {{ $t(slot.type) }}</p>
        </li>
      </ul>
    </div>

    <div class="flex items-center justify-center">
      <div class="m-2">
        <label for="date-picker">{{ $t('date') }}：</label>
        <input id="date-picker" v-model="selectedDate" type="date" />
      </div>
    </div>

    <div class="flex items-center justify-center">
      <TimeSlots
        class="w-full"
        text-color="#ABABAB"
        :time-slot-interval="15"
        :target-date="selectedDate"
        :data-intervals="dataIntervals"
        :slot-class="slotStyle"
      />
    </div>
  </div>
</template>
