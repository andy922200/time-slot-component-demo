export const weekDayLocale = {
  en: [
    { full: 'Sunday', abbr: 'Sun' },
    { full: 'Monday', abbr: 'Mon' },
    { full: 'Tuesday', abbr: 'Tue' },
    { full: 'Wednesday', abbr: 'Wed' },
    { full: 'Thursday', abbr: 'Thu' },
    { full: 'Friday', abbr: 'Fri' },
    { full: 'Saturday', abbr: 'Sat' },
  ],
  zh_tw: [
    { full: '星期日', abbr: '日' },
    { full: '星期一', abbr: '一' },
    { full: '星期二', abbr: '二' },
    { full: '星期三', abbr: '三' },
    { full: '星期四', abbr: '四' },
    { full: '星期五', abbr: '五' },
    { full: '星期六', abbr: '六' },
  ],
  zh_cn: [
    { full: '星期日', abbr: '日' },
    { full: '星期一', abbr: '一' },
    { full: '星期二', abbr: '二' },
    { full: '星期三', abbr: '三' },
    { full: '星期四', abbr: '四' },
    { full: '星期五', abbr: '五' },
    { full: '星期六', abbr: '六' },
  ],
}

export type WeekStartDayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6

export interface WeekDayItemOption {
  start: string
  end: string
  weekday: string
}

export interface WeekDayItem {
  value: string
  text: string
  isToggle: boolean
  isDisableDay: boolean
  selectedStartTime: string
  selectedEndTime: string
  startTimeOptions: WeekDayItemOption[]
  endTimeOptions: WeekDayItemOption[]
}

export interface CycleTimeSelectorEmitItem {
  isValid: boolean
  selectedStartTime: string
  selectedEndTime: string
  text: string
  weekday: string
}
