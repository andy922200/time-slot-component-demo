import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import CalendarCell from '@/components/BaseCalendar/CalendarCell.vue'

describe('CalendarCell.vue', () => {
  it('renders the correct date text', () => {
    const wrapper = mount(CalendarCell, {
      props: {
        selectedDate: '2024/08/29',
        dateObj: {
          fullDateText: '2024/08/29',
          briefDateText: '29',
          isInView: true,
          isHoliday: true,
          shouldShowBar: true,
        },
        holidayColor: '#ff9600',
        showBarColor: '#ffffff',
      },
    })

    expect(wrapper.text()).toContain('29')
  })

  it('applies the correct classes and styles', () => {
    const wrapper = mount(CalendarCell, {
      props: {
        selectedDate: '2024/08/29',
        dateObj: {
          fullDateText: '2024/08/29',
          briefDateText: '29',
          isInView: true,
          isHoliday: true,
          shouldShowBar: true,
        },
        holidayColor: '#ff9600',
        showBarColor: '#ffffff',
      },
    })

    const dateContent = wrapper.find('.date-content')
    expect(dateContent.classes()).toContain('holiday')
    expect(dateContent.classes()).toContain('show-bar')
    expect(wrapper.find('.in-view').exists()).toBe(true)
    expect(dateContent.attributes('style')).toContain('--base-cal_holiday-color: #ff9600')
    expect(dateContent.attributes('style')).toContain('--base-cal_show-bar-color: #ffffff')
  })

  it('emits the correct event on click', async () => {
    const wrapper = mount(CalendarCell, {
      props: {
        selectedDate: '2024/08/29',
        dateObj: {
          fullDateText: '2024/08/29',
          briefDateText: '29',
          isInView: true,
        },
        holidayColor: '#ff9600',
        showBarColor: '#ffffff',
      },
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('date-select')).toBeTruthy()
    expect(wrapper.emitted('date-select')?.[0]).toEqual(['2024/08/29'])
  })
})
