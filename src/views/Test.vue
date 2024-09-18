<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

// 用來動態調整一週的開始日
const weekStartDay = ref(1) // 0 表示星期日開始，1 表示星期一開始

// 定義一個物件來存放星期的索引、值和顯示文字
const weekDaysMap = {
  0: { value: '0', text: 'Sun' },
  1: { value: '1', text: 'Mon' },
  2: { value: '2', text: 'Tue' },
  3: { value: '3', text: 'Wed' },
  4: { value: '4', text: 'Thu' },
  5: { value: '5', text: 'Fri' },
  6: { value: '6', text: 'Sat' },
}

const fullWeekLabels = Object.entries(weekDaysMap).map(([, value]) => value.text)

// 根據 weekStartDay 調整順序
const adjustWeekOrder = (labels: string[], startDay: number) => {
  return [...labels.slice(startDay), ...labels.slice(0, startDay)]
}
const dynamicWeekLabels = ref(adjustWeekOrder(fullWeekLabels, weekStartDay.value))
const dynamicDaysOfWeekIndices = ref(adjustWeekOrder(Object.keys(weekDaysMap), weekStartDay.value))

const dayToggles = ref(new Array(7).fill(false)) // 控制每一天是否啟用選擇
const selectedStartTimes = ref(new Array(7).fill(null)) // 存儲每一天選擇的開始時間
const selectedEndTimes = ref(new Array(7).fill(null)) // 存儲每一天選擇的結束時間
const availableStartTimesArray = ref(new Array(7).fill([])) // 存放每一天生成的開始時間
const availableEndTimesArray = ref(new Array(7).fill([])) // 存放每一天動態生成的結束時間

const generateDailyTimeSlots = (timeSlotDuration: number, weekday: string) => {
  const allTimeSlots = []
  let hour = 0
  let minute = 0

  while (hour < 24) {
    const start = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    minute += timeSlotDuration
    if (minute === 60) {
      minute = 0
      hour++
    }
    const end = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    allTimeSlots.push({
      start,
      end,
      weekday,
    })
  }

  return allTimeSlots
}

// 當組件掛載時，生成每一天的時間槽
onMounted(() => {
  availableStartTimesArray.value = dynamicDaysOfWeekIndices.value.map(
    (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => generateDailyTimeSlots(30, weekDaysMap[day].value),
  )
})

// 更新結束時間槽
const updateEndTimes = (index) => {
  const startTime = selectedStartTimes.value[index]
  if (startTime) {
    availableEndTimesArray.value[index] = availableStartTimesArray.value[index].filter(
      (slot) => slot.start > startTime,
    )
  } else {
    availableEndTimesArray.value[index] = []
  }
}

// 監聽每一天的開始時間，並單獨更新其結束時間選單
dynamicDaysOfWeekIndices.value.forEach((_, index) => {
  watch(
    () => selectedStartTimes.value[Number(dynamicDaysOfWeekIndices.value[index])],
    () => {
      updateEndTimes(Number(dynamicDaysOfWeekIndices.value[index]))
    },
  )
})

// 計算每一天可選的開始時間槽
const getAvailableStartTimeOptions = (index: number) => {
  const realIndex = Number(dynamicDaysOfWeekIndices.value[index])
  return availableStartTimesArray.value[realIndex] || []
}

// 提供對應每一天的動態生成的結束時間槽
const getAvailableEndTimeOptions = (index: number) => {
  const realIndex = Number(dynamicDaysOfWeekIndices.value[index])
  return availableEndTimesArray.value[realIndex] || []
}
</script>

<template>
  <div v-for="(label, index) in dynamicWeekLabels" :key="index">
    <label :for="'toggle-' + index">Enable {{ label }}</label>
    <input :id="'toggle-' + index" v-model="dayToggles[index]" type="checkbox" />

    <div v-if="dayToggles[index]">
      <!-- 選擇開始時間 -->
      <label :for="'start-time-' + index">Select Start Time for {{ label }}</label>
      <select
        :id="'start-time-' + index"
        v-model="selectedStartTimes[dynamicDaysOfWeekIndices[index]]"
      >
        <option
          v-for="slot in getAvailableStartTimeOptions(index)"
          :key="slot.start"
          :value="slot.start"
        >
          {{ slot.start }}
        </option>
      </select>

      <!-- 選擇結束時間 -->
      <label :for="'end-time-' + index">Select End Time for {{ label }}</label>
      <select :id="'end-time-' + index" v-model="selectedEndTimes[dynamicDaysOfWeekIndices[index]]">
        <option v-for="slot in getAvailableEndTimeOptions(index)" :key="slot.end" :value="slot.end">
          {{ slot.end }}
        </option>
      </select>
    </div>
  </div>
</template>
