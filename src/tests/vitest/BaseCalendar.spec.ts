import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import BaseCalendar from '@/components/BaseCalendar/index.vue'

describe('BaseCalendar.vue', () => {
  it('renders the correct calendar header text', () => {
    const wrapper = mount(BaseCalendar, {
      props: {
        modelValue: '2024/08/29',
      },
    })

    expect(wrapper.text()).toContain('2024 / 08')
  })

  it('disables the previous button when on the minDate month', async () => {
    const wrapper = mount(BaseCalendar, {
      props: {
        modelValue: '2024/01/01',
        minDate: new Date('2024/01/01'),
      },
    })

    await nextTick()
    expect(wrapper.find('button').classes()).toContain('pointer-events-none')
  })

  it('disables the next button when on the maxDate month', async () => {
    const wrapper = mount(BaseCalendar, {
      props: {
        modelValue: '2024/12/01',
        maxDate: new Date('2024/12/01'),
      },
    })

    await nextTick()

    expect(wrapper.find('button:last-of-type').classes()).toContain('pointer-events-none')
  })

  it('emits "update:modelValue" when a date is selected', async () => {
    const wrapper = mount(BaseCalendar, {
      props: {
        modelValue: '2024/08/29',
      },
    })

    const calendarCells = wrapper.findAllComponents({ name: 'CalendarCell' })
    await calendarCells[14].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('does not allow selection outside of minDate and maxDate', async () => {
    const wrapper = mount(BaseCalendar, {
      props: {
        modelValue: '2024/08/15',
        minDate: new Date('2024/08/01'),
        maxDate: new Date('2024/08/31'),
      },
    })

    const calendarCells = wrapper.findAllComponents({ name: 'CalendarCell' })
    const calendarCellBeforeMinDate = calendarCells[0]
    const calendarCellAfterMaxDate = calendarCells[40]
    await calendarCellBeforeMinDate.trigger('click')
    await calendarCellAfterMaxDate.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('updates internal value and calendar header when navigating months', async () => {
    const wrapper = mount(BaseCalendar, {
      props: {
        modelValue: '2024/08/15',
      },
    })

    const nextButton = wrapper.find('button:last-of-type')
    await nextButton.trigger('click')
    expect(wrapper.text()).toContain('2024 / 09')

    const prevButton = wrapper.find('button:first-of-type')
    await prevButton.trigger('click')
    await prevButton.trigger('click')
    expect(wrapper.text()).toContain('2024 / 07')
  })

  it('displays holiday and show-bar correctly', () => {
    const wrapper = mount(BaseCalendar, {
      props: {
        modelValue: '2024/08/15',
        holidayList: ['2024/08/15'],
        showBarList: ['2024/08/20'],
      },
    })

    const holidayCell = wrapper.find('[data-date="2024/08/15"]')
    expect(holidayCell.find('.holiday').exists()).toBe(true)

    const showBarCell = wrapper.find('[data-date="2024/08/20"]')
    expect(showBarCell.find('.show-bar').exists()).toBe(true)
  })
})
