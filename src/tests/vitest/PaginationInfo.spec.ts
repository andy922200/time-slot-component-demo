import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import PaginationInfo from '@/components/Pagination/PaginationInfo.vue'

describe('PaginationInfo.vue', () => {
  it('renders the correct range of items', () => {
    const wrapper = mount(PaginationInfo, {
      props: {
        modelValue: 2,
        total: 35,
        size: 10,
      },
    })

    const span = wrapper.find('span')
    expect(span.text()).toBe('11 - 20 of 35')
  })

  it('updates the current page when prop changes', async () => {
    const wrapper = mount(PaginationInfo, {
      props: {
        modelValue: 1,
        total: 35,
        size: 10,
      },
    })

    await wrapper.setProps({ modelValue: 3 })
    const span = wrapper.find('span')
    expect(span.text()).toBe('21 - 30 of 35')
  })

  it('emits update:modelValue when currentPage is updated', async () => {
    const wrapper = mount(PaginationInfo, {
      props: {
        modelValue: 1,
        total: 35,
        size: 10,
      },
    })

    wrapper.vm.currentPage = 2
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted()['update:modelValue']).toBeTruthy()
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([2])
  })

  it('displays 0 - 0 of 0 when total is 0', () => {
    const wrapper = mount(PaginationInfo, {
      props: {
        modelValue: 1,
        total: 0,
        size: 10,
      },
    })

    const span = wrapper.find('span')
    expect(span.text()).toBe('0 - 0 of 0')
  })
})
