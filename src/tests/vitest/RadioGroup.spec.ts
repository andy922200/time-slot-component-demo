import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseRadioGroup from '@/components/RadioGroup/index.vue'

describe('BaseRadioGroup', () => {
  const options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ]

  it('should render all radio options', () => {
    const wrapper = mount(BaseRadioGroup, {
      props: {
        options,
        modelValue: '1',
      },
    })

    const labels = wrapper.findAll('label')
    expect(labels.length).toBe(options.length)
    options.forEach((option, index) => {
      expect(labels[index].text()).toContain(option.label)
    })
  })

  it('should update modelValue when option is clicked', async () => {
    const wrapper = mount(BaseRadioGroup, {
      props: {
        options,
        modelValue: '1',
      },
    })

    const radio = wrapper.findAll('input[type="radio"]').at(1)
    await radio?.setValue()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2'])
  })

  it('should render checkbox mode correctly', () => {
    const wrapper = mount(BaseRadioGroup, {
      props: {
        options,
        modelValue: '1',
        checkboxMode: true,
      },
    })

    const checkboxes = wrapper.findAll('.checkbox-span')

    expect(checkboxes.length).toBe(options.length)
  })

  it('should apply vertical mode when enabled', () => {
    const wrapper = mount(BaseRadioGroup, {
      props: {
        options,
        modelValue: '1',
        verticalMode: true,
      },
    })

    expect(wrapper.classes()).toContain('flex-col')
  })

  it('should apply custom classes correctly', () => {
    const wrapper = mount(BaseRadioGroup, {
      props: {
        options,
        modelValue: '1',
        labelClass: 'text-red-500',
        checkboxClass: {
          border: 'border-red-500',
          background: 'bg-yellow-500',
          size: 'w-8 h-8',
          icon: 'text-red-500',
        },
        checkboxMode: true,
      },
    })

    const checkbox = wrapper.find('.checkbox-span')
    expect(checkbox.classes()).toContain('border-red-500')
    expect(checkbox.classes()).toContain('bg-yellow-500')
    expect(checkbox.classes()).toContain('w-8')
    expect(checkbox.classes()).toContain('h-8')
  })
})
