import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TimeSlots from '@/components/TimeSlots/index.vue'
import dayjs from '@/plugins/dayjs'

const mockFetchContainerSize = () => {
  // mock container & time-cell
  const mockContainer = { clientWidth: 360 } as HTMLElement
  const mockTimeCells = Array.from({ length: 96 }, () => document.createElement('div'))

  // spy on document.querySelector & querySelectorAll
  vi.spyOn(document, 'querySelector').mockImplementation((selector: string) => {
    if (selector === '.time-slot') return mockContainer
    return null
  })

  vi.spyOn(document, 'querySelectorAll').mockImplementation((selector: string) => {
    if (selector === '.time-cell') return mockTimeCells
    return [] as any
  })
}

describe('TimeSlots.vue', () => {
  it('should correctly update visibleLabels based on container width', async () => {
    const wrapper = mount(TimeSlots, {
      props: {
        targetDate: '2024-09-24',
        timeSlotInterval: 15,
        minLabelSpacing: 30,
      },
    })

    mockFetchContainerSize()

    // trigger resize event
    window.dispatchEvent(new Event('resize'))

    await wrapper.vm.$nextTick()

    // check if visibleLabels are updated
    expect(wrapper.vm.visibleLabels.length).toBeGreaterThan(0)
    expect(wrapper.vm.visibleLabels).toEqual([0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22])
  })

  it('should correctly calculate past time slots', async () => {
    const mockCurrentTime = dayjs('2024-09-24 12:00', 'YYYY-MM-DD HH:mm').toDate()
    vi.useFakeTimers()
    vi.setSystemTime(mockCurrentTime)

    const wrapper = mount(TimeSlots, {
      props: {
        targetDate: '2024-09-24',
        timeSlotInterval: 30,
      },
    })

    mockFetchContainerSize()

    // trigger resize event
    window.dispatchEvent(new Event('resize'))

    await wrapper.vm.$nextTick()

    const timeCells = wrapper.findAll('.time-cell')
    const currentTime = dayjs('2024-09-24 12:00', 'YYYY-MM-DD HH:mm')

    timeCells.forEach((cell, index) => {
      const slotTime = dayjs('2024-09-24')
        .startOf('day')
        .add(index * 30, 'minute')

      if (slotTime.isBefore(currentTime, 'minute')) {
        expect(cell.classes()).toContain('opacity-60')
      } else {
        expect(cell.classes()).not.toContain('opacity-60')
      }
    })

    vi.useRealTimers()
  })

  it('should correctly calculate disabled and used time slots', async () => {
    const wrapper = mount(TimeSlots, {
      props: {
        targetDate: '2024-09-24',
        dataIntervals: [
          { date: '2024-09-24', start: '08:00', end: '09:00', type: 'used' },
          { date: '2024-09-24', start: '12:00', end: '13:00', type: 'disabled' },
        ],
        timeSlotInterval: 15,
      },
    })

    mockFetchContainerSize()

    // trigger resize event
    window.dispatchEvent(new Event('resize'))

    await wrapper.vm.$nextTick()

    const timeCells = wrapper.findAll('.time-cell')

    // Test if 08:00 to 09:00 slots are marked as used
    for (let i = 32; i < 36; i++) {
      expect(timeCells[i].classes()).toContain('!border-y-[#fdeadb]')
    }

    // Test if 12:00 to 13:00 slots are marked as disabled
    for (let i = 48; i < 52; i++) {
      expect(timeCells[i].classes()).toContain('!border-y-gray-400')
    }
  })
})
