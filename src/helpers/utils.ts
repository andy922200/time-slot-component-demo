import dayjs from '@/plugins/dayjs'

export const fixedDomOverflow = (dom: HTMLElement | null, boolean: boolean) => {
  if (!dom) return
  dom.style.overflow = boolean ? 'hidden' : ''
}

export const isMobileAgent = () => {
  return !!window.navigator.userAgent.match(
    /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
  )
}

export const isCustomEmpty = (value: any) => {
  if (value === undefined || value === null) {
    return true
  }

  if (typeof value === 'string' && value.trim() === '') {
    return true
  }

  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true
  }

  return false
}

export const generateDailyTimeSlots = ({
  timeSlotDuration,
  weekday,
}: {
  timeSlotDuration: number
  weekday: string
}) => {
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

export const checkWeekdaysInRange = ({
  startDate,
  endDate,
}: {
  startDate: string
  endDate: string
}) => {
  if (!startDate || !endDate) return null

  let currentDate = dayjs(startDate)
  const end = dayjs(endDate)
  const weekdaysFound = new Set()

  while (currentDate.isSameOrBefore(end)) {
    const weekday = currentDate.day()
    weekdaysFound.add(weekday)

    if (weekdaysFound.size === 7) {
      break
    }

    currentDate = currentDate.add(1, 'day')
  }

  const include = Array.from(weekdaysFound)
  const exclude = [0, 1, 2, 3, 4, 5, 6].filter((day) => !weekdaysFound.has(day))

  return { include, exclude }
}

export const generateRandomTimeRange = (existingRanges: { start: string; end: string }[]) => {
  let startHour, startMinute, endHour, endMinute, start, end

  const formatTime = (hour: number, minute: number) => {
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }

  const isOverlapping = (newStart: string, newEnd: string) => {
    return existingRanges.some(({ start, end }) => newStart < end && newEnd > start)
  }

  do {
    startHour = Math.floor(Math.random() * 23) // 小時最大值為 23
    startMinute = Math.floor(Math.random() * 60)
    endHour = startHour + Math.floor(Math.random() * (23 - startHour)) // 確保 endHour >= startHour
    endMinute = Math.floor(Math.random() * 60)

    start = formatTime(startHour, startMinute)
    end =
      endHour === startHour && endMinute <= startMinute
        ? formatTime(startHour, startMinute + 1) // 確保 end > start
        : formatTime(endHour, endMinute)
  } while (isOverlapping(start, end))

  return { start, end }
}
