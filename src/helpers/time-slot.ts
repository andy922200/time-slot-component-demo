import dayjs from '@/plugins/dayjs'

export interface TimeSlot {
  slotStart: string
  slotEnd: string
  isOverlap?: boolean
  isPast?: boolean
  date: string
}

export interface TimeSlotFromAPI {
  startTime: string
  endTime: string
  date: string
}

export interface StartTimeOption {
  label: string
  value: string
  originalObj: TimeSlot
  isNow: boolean
  fullString: string
}

export interface EndTimeOption {
  label: string
  value: string
  originalObj: TimeSlot
}

const parseStartTime = ({
  isNow,
  targetDate,
  timeSector,
  nowDayjs,
  startTime,
}: {
  isNow: boolean
  targetDate: string
  timeSector: number
  nowDayjs: dayjs.Dayjs
  startTime: string
}) => {
  if (isNow) {
    // 處理 "Now" 的選項，並精確到最近的 timeSector
    const minutes = nowDayjs.minute()
    const diff = minutes % timeSector
    return nowDayjs.subtract(diff, 'minute').second(0).startOf('second')
  } else {
    // 處理一般選項
    return parseTimeWithPrecision({
      dateStr: targetDate,
      timeStr: startTime,
    })
  }
}

const generateEndTimeSameDayOptions = ({
  allTimeSlots,
  targetDate,
  startTimeDayjs,
  nextDayHintKey,
}: {
  allTimeSlots: TimeSlot[]
  targetDate: string
  startTimeDayjs: dayjs.Dayjs
  nextDayHintKey: string
}) => {
  const endTimeOptions: EndTimeOption[] = []
  let sameDayBreak = false // 記錄是否因重疊而停止生成

  for (const slot of allTimeSlots) {
    let slotStartDayjs = parseTimeWithPrecision({
      dateStr: targetDate,
      timeStr: slot.slotStart,
    })

    if (slot.slotEnd === '00:00') {
      slotStartDayjs = slotStartDayjs.add(1, 'day')
    }

    // 只選在 startTime 之後的區段
    if (slotStartDayjs.isSameOrAfter(startTimeDayjs)) {
      if (slot.isOverlap) {
        sameDayBreak = true
        break
      }

      endTimeOptions.push({
        originalObj: slot,
        label: slot.slotEnd === '00:00' ? `00:00_${nextDayHintKey}` : slot.slotEnd,
        value: slot.slotEnd,
      })
    }
  }
  return { endTimeOptions, sameDayBreak }
}

const generateEndTimeNextDayOptions = ({
  startTimeDayjs,
  maxUsageHours,
  usedTimeSlots,
  timeSector,
  targetDate,
  nextDayHintKey,
  dateFormat = 'YYYY-MM-DD',
  timeFormat = 'HH:mm',
}: {
  startTimeDayjs: dayjs.Dayjs
  maxUsageHours: number
  usedTimeSlots: TimeSlotFromAPI[]
  timeSector: number
  targetDate: string
  nextDayHintKey: string
  dateFormat?: string
  timeFormat?: string
}) => {
  const endTimeOptions: EndTimeOption[] = []
  const nextDay = dayjs(targetDate).add(1, 'day').format(`${dateFormat}`)
  const nextDayUsedTimeSlots = usedTimeSlots.filter((range) => range.date === nextDay)
  const maxEndTime = startTimeDayjs.add(maxUsageHours, 'hour')

  let nextDayStart = dayjs(`${nextDay} 00:00`, `${dateFormat} ${timeFormat}`)
  const nextDayEndLimit =
    nextDayUsedTimeSlots.length > 0
      ? nextDayUsedTimeSlots.reduce(
          (earliest, range) => {
            const rangeStartTime = parseTimeWithPrecision({
              dateStr: nextDay,
              timeStr: range.startTime,
            })

            // 將 usedTimeSlots 的 startTime 對齊到最近的 timeSector
            const adjustedStartTime = rangeStartTime
              .minute(Math.floor(rangeStartTime.minute() / timeSector) * timeSector)
              .second(0)

            return adjustedStartTime.isBefore(earliest) ? adjustedStartTime : earliest
          },
          dayjs(`${nextDay} 24:00`, `${dateFormat} ${timeFormat}`),
        )
      : dayjs(`${nextDay} 24:00`, `${dateFormat} ${timeFormat}`)

  const actualNextDayEndLimit = nextDayEndLimit.isBefore(maxEndTime) ? nextDayEndLimit : maxEndTime

  while (nextDayStart.isBefore(actualNextDayEndLimit)) {
    const slotEnd = nextDayStart.add(timeSector, 'minute')
    endTimeOptions.push({
      originalObj: {
        slotStart: nextDayStart.format(`${timeFormat}`),
        slotEnd: slotEnd.format(`${timeFormat}`),
        date: nextDay,
      },
      label: `${slotEnd.format(`${timeFormat}`)}_${nextDayHintKey}`,
      value: slotEnd.format(`${timeFormat}`),
    })
    nextDayStart = slotEnd
  }

  return endTimeOptions
}

const filterEndTimeOptions = ({
  endTimeOptions,
  startTimeDayjs,
  minUsageHours,
  maxUsageHours,
  isNow = false,
  nowDayjs,
  dateFormat = 'YYYY-MM-DD',
  timeFormat = 'HH:mm',
}: {
  endTimeOptions: EndTimeOption[]
  startTimeDayjs: dayjs.Dayjs
  minUsageHours: number
  maxUsageHours: number
  isNow: boolean
  nowDayjs: dayjs.Dayjs
  dateFormat?: string
  timeFormat?: string
}) => {
  const filterByDuration = (endTimeDayjs: dayjs.Dayjs, referenceTime: dayjs.Dayjs) => {
    const durationInMinutes = endTimeDayjs.diff(referenceTime, 'minute')
    const durationInHours = durationInMinutes / 60
    return durationInHours >= minUsageHours && durationInHours <= maxUsageHours
  }

  return endTimeOptions.filter((option) => {
    let endTimeDayjs = dayjs(
      `${option.originalObj.date} ${option.value}`,
      `${dateFormat} ${timeFormat}`,
    )

    if (option.originalObj.slotEnd === '00:00') {
      endTimeDayjs = endTimeDayjs.add(1, 'day')
    }

    // 根據是否為 "Now" 來決定參照時間
    const referenceTime = isNow ? nowDayjs : startTimeDayjs

    return filterByDuration(endTimeDayjs, referenceTime)
  })
}

// 判斷時間區間是否在指定的區塊內
function isInTimeSlotStrict({
  startTime,
  endTime,
  date,
  slotStart,
  slotEnd,
  slotDate,
  dateFormat = 'YYYY-MM-DD',
  timeFormat = 'HH:mm',
}: {
  startTime: string
  endTime: string
  date: string
  slotStart: string
  slotEnd: string
  slotDate: string
  dateFormat?: string
  timeFormat?: string
}) {
  const start = dayjs(`${date} ${startTime}`, `${dateFormat} ${timeFormat}`)

  // 如果 endTime 是 "00:00"，並且開始時間在 00:00 之前，則認為是隔天的 00:00
  let end = dayjs(`${date} ${endTime}`, `${dateFormat} ${timeFormat}`)
  if (endTime === '00:00' && end.isBefore(start)) {
    end = end.add(1, 'day')
  }

  const slotStartDayjs = dayjs(`${slotDate} ${slotStart}`, `${dateFormat} ${timeFormat}`)

  let slotEndDayjs = dayjs(`${slotDate} ${slotEnd}`, `${dateFormat} ${timeFormat}`)

  if (slotEnd === '00:00' && slotEndDayjs.isBefore(slotStartDayjs)) {
    slotEndDayjs = slotEndDayjs.add(1, 'day')
  }

  return start.isBefore(slotEndDayjs) && end.isAfter(slotStartDayjs)
}

// 檢查每個 timeSlot 是否與時間段重疊
function checkOverlaps({
  timeSlots,
  usedTimeSlots,
  targetDate,
  dateFormat = 'YYYY-MM-DD',
  timeFormat = 'HH:mm',
}: {
  timeSlots: TimeSlot[]
  usedTimeSlots: TimeSlotFromAPI[]
  targetDate: string
  dateFormat?: string
  timeFormat?: string
}) {
  const now = dayjs()
  timeSlots.forEach((slot) => {
    let hasOverlap = false

    usedTimeSlots.forEach(({ startTime, endTime, date }) => {
      if (
        isInTimeSlotStrict({
          startTime,
          endTime,
          date,
          slotStart: slot.slotStart,
          slotEnd: slot.slotEnd,
          slotDate: targetDate,
        })
      ) {
        hasOverlap = true
      }
    })

    slot.isOverlap = hasOverlap

    // 檢查該時間區段是否已經過去
    let slotEndDayjs = dayjs(`${targetDate} ${slot.slotEnd}`, `${dateFormat} ${timeFormat}`)
    if (slot.slotEnd === '00:00') {
      slotEndDayjs = slotEndDayjs.add(1, 'day')
    }

    const isPast = slotEndDayjs.isBefore(now)
    slot.isPast = isPast

    // console.log(
    //   `區塊 ${targetDate} ${slot.slotStart} ~ ${
    //     slot.slotEnd === '00:00' ? '00:00 (隔日)' : slot.slotEnd
    //   } 重疊: ${slot.isOverlap} 是否已過去： ${slot.isPast}`,
    // )
  })
}

// 生成一天內的 15,30,60 分鐘區塊，從 00:00 到 24:00
function generateTimeSlots({
  targetDate,
  timeSector,
  dateFormat = 'YYYY-MM-DD',
  timeFormat = 'HH:mm',
}: {
  targetDate: string
  timeSector: number
  dateFormat?: string
  timeFormat?: string
}): TimeSlot[] {
  const slots = []
  let start = dayjs(`${targetDate} 00:00`, `${dateFormat} ${timeFormat}`)
  const end = dayjs(`${targetDate} 24:00`, `${dateFormat} ${timeFormat}`)

  while (start.isBefore(end)) {
    const slotEnd = start.add(timeSector, 'minute')

    slots.push({
      slotStart: start.format(`${timeFormat}`),
      slotEnd: slotEnd.format(`${timeFormat}`),
      isOverlap: false,
      isPast: false,
      date: targetDate,
    })

    start = slotEnd
  }
  return slots
}

// 解析時間字串，並且設定精確度
function parseTimeWithPrecision({
  dateStr,
  timeStr,
  dateFormat = 'YYYY-MM-DD',
  timeFormat = 'HH:mm',
}: {
  dateStr: string
  timeStr: string
  dateFormat?: string
  timeFormat?: string
}) {
  return dayjs(`${dateStr} ${timeStr}`, `${dateFormat} ${timeFormat}`).startOf('second')
}

// 取得可選擇的開始時間選項
function getStartTimeOptions({
  allTimeSlots,
  targetDate,
  usedTimeSlots,
  isNowActive = true,
  timeSector,
  dateFormat = 'YYYY-MM-DD',
  timeFormat = 'HH:mm',
}: {
  allTimeSlots: TimeSlot[]
  targetDate: string
  usedTimeSlots: TimeSlotFromAPI[]
  timeSector: number
  isNowActive?: boolean
  nowLabelStr?: string
  dateFormat?: string
  timeFormat?: string
}): StartTimeOption[] {
  const today = dayjs().format(`${dateFormat}`)
  const now = dayjs().second(0).startOf('second')

  if (!targetDate || dayjs(targetDate).isBefore(now, 'day')) return []

  const availableTimes = allTimeSlots
    .filter((slot) => {
      // 如果是今天，過濾掉已經過去的時間段
      if (targetDate === today) {
        const slotStartDayjs = dayjs(
          `${targetDate} ${slot.slotStart}`,
          `${dateFormat} ${timeFormat}`,
        )
          .second(0)
          .startOf('second')
        return slotStartDayjs.isSameOrAfter(now)
      }
      // 非今天的時間段，直接回傳 true
      return true
    })
    .filter((slot) => !slot.isOverlap)
    .map((slot) => ({
      originalObj: slot,
      label: slot.slotStart,
      value: slot.slotStart,
      isNow: false,
      fullString: `${slot.date}_${slot.slotStart}-${slot.slotEnd}`,
    }))

  // 計算當前時間落在哪個時間區段
  const nowFormatted = now.format(`${timeFormat}`)
  const nowMinutes = now.minute()
  const nowSlotEnd = now
    .add(timeSector - (nowMinutes % timeSector), 'minute')
    .second(0)
    .startOf('second')
    .format(`${timeFormat}`)

  // 檢查 Now 所在的時間區段是否被佔用
  const isNowOccupied = usedTimeSlots.some(({ startTime, endTime, date }) => {
    if (date === today) {
      return isInTimeSlotStrict({
        startTime,
        endTime,
        date,
        slotStart: nowFormatted,
        slotEnd: nowSlotEnd,
        slotDate: today,
      })
    }
    return false
  })

  // isNow 所代表的時間段是否已存在
  const isNowAlreadyInList = availableTimes.some((time) => time.value === nowFormatted)

  // 用戶選擇開啟 && targetDate 是今天 && 不在重疊區間 && isNow 所代表的時間段不存在，才加入 "Now" 選項
  if (isNowActive && targetDate === today && !isNowOccupied && !isNowAlreadyInList) {
    availableTimes.unshift({
      label: 'now',
      value: 'Now',
      originalObj: {
        slotStart: nowFormatted,
        slotEnd: nowSlotEnd,
        date: today,
      },
      isNow: true,
      fullString: `${today}_${nowFormatted}-${nowSlotEnd}`,
    })
  }

  return availableTimes
}

// 取得可選擇的結束時間選項
function getEndTimeOptions({
  startTime,
  allTimeSlots,
  targetDate,
  usedTimeSlots,
  maxUsageHours = 24,
  minUsageHours = 0,
  timeSector,
  generateCrossDay = true,
  nextDayHintKey = 'next-day',
  dateFormat = 'YYYY-MM-DD',
  timeFormat = 'HH:mm',
}: {
  startTime: string
  allTimeSlots: TimeSlot[]
  targetDate: string
  usedTimeSlots: TimeSlotFromAPI[]
  maxUsageHours?: number
  minUsageHours?: number
  timeSector: number
  generateCrossDay?: boolean
  nextDayHintKey?: string
  dateFormat?: string
  timeFormat?: string
}) {
  const now = dayjs()
  const isNow = startTime === 'Now'

  if (
    !targetDate ||
    !startTime ||
    dayjs(targetDate).isBefore(now, 'day') ||
    (dayjs(targetDate).isAfter(now, 'day') && isNow)
  ) {
    return []
  }

  const startTimeDayjs = parseStartTime({
    isNow: startTime === 'Now',
    targetDate,
    timeSector,
    nowDayjs: now,
    startTime,
  })

  const { endTimeOptions, sameDayBreak } = generateEndTimeSameDayOptions({
    allTimeSlots,
    targetDate,
    startTimeDayjs,
    nextDayHintKey,
  })

  if (generateCrossDay && !sameDayBreak) {
    const nextDayEndOptions = generateEndTimeNextDayOptions({
      startTimeDayjs,
      maxUsageHours,
      usedTimeSlots,
      timeSector,
      targetDate,
      nextDayHintKey,
      dateFormat,
      timeFormat,
    })
    endTimeOptions.push(...nextDayEndOptions)
  }

  return filterEndTimeOptions({
    endTimeOptions,
    startTimeDayjs,
    minUsageHours,
    maxUsageHours,
    isNow: startTime === 'Now',
    nowDayjs: now,
    dateFormat,
    timeFormat,
  })
}

export {
  checkOverlaps,
  generateTimeSlots,
  getEndTimeOptions,
  getStartTimeOptions,
  isInTimeSlotStrict,
  parseTimeWithPrecision,
}
