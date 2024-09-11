import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseTag from '@/components/BaseTag/index.vue'

describe('BaseTag.vue', () => {
  it('renders default class', () => {
    const wrapper = mount(BaseTag)
    expect(wrapper.classes()).toContain('border')
    expect(wrapper.classes()).toContain('px-2')
    expect(wrapper.classes()).toContain('py-1')
    expect(wrapper.classes()).toContain('text-sm')
  })

  it('renders with custom class', () => {
    const wrapper = mount(BaseTag, {
      props: {
        class: 'custom-class',
      },
    })
    expect(wrapper.classes()).toContain('custom-class')
  })

  it('renders prepend icon when hasPrependIcon is true', () => {
    const wrapper = mount(BaseTag, {
      props: {
        hasPrependIcon: true,
      },
      slots: {
        'prepend-icon': '<span class="test-prepend-icon">Prepend Icon</span>',
      },
    })
    expect(wrapper.find('.prepend-icon').exists()).toBe(true)
    expect(wrapper.find('.test-prepend-icon').exists()).toBe(true)
  })

  it('renders append icon when hasAppendIcon is true', () => {
    const wrapper = mount(BaseTag, {
      props: {
        hasAppendIcon: true,
      },
      slots: {
        'append-icon': '<span class="test-append-icon">Append Icon</span>',
      },
    })
    expect(wrapper.find('.append-icon').exists()).toBe(true)
    expect(wrapper.find('.test-append-icon').exists()).toBe(true)
  })

  it('renders text in default slot', () => {
    const wrapper = mount(BaseTag, {
      slots: {
        text: 'Test Text',
      },
    })
    expect(wrapper.find('.tag__text').text()).toBe('Test Text')
  })
})
