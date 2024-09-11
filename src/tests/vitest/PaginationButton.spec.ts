import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PaginationButtons from '@/components/Pagination/PaginationButtons.vue'

describe('PaginationButtons', () => {
  it('increments the page number when add button is clicked', async () => {
    const wrapper = mount(PaginationButtons, {
      props: {
        modelValue: 1,
        total: 100,
        size: 10,
      },
    })
    const addButton = wrapper.find('button:last-child')
    await addButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([2])
  })

  it('decrements the page number when minus button is clicked', async () => {
    const wrapper = mount(PaginationButtons, {
      props: {
        modelValue: 2,
        total: 100,
        size: 10,
      },
    })
    const minusButton = wrapper.find('button:first-child')
    await minusButton.trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([1])
  })

  it('disables minus button on first page', () => {
    const wrapper = mount(PaginationButtons, {
      props: {
        modelValue: 1,
        total: 100,
        size: 10,
      },
    })
    const minusButton = wrapper.find('button:first-child')
    expect(minusButton.attributes('disabled')).toBeDefined()
  })

  it('disables add button on last page', () => {
    const wrapper = mount(PaginationButtons, {
      props: {
        modelValue: 10,
        total: 100,
        size: 10,
      },
    })
    const addButton = wrapper.find('button:last-child')
    expect(addButton.attributes('disabled')).toBeDefined()
  })

  it('renders custom slot content for icons', () => {
    const wrapper = mount(PaginationButtons, {
      props: {
        modelValue: 1,
        total: 100,
        size: 10,
      },
      slots: {
        'minus-icon': '<span class="minus-icon">minus</span>',
        'add-icon': '<span class="add-icon">add</span>',
      },
    })
    expect(wrapper.find('.minus-icon').text()).toBe('minus')
    expect(wrapper.find('.add-icon').text()).toBe('add')
  })
})
