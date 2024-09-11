import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseSelect from '@/components/BaseSelect/index.vue'
import { BaseSelectOption } from '@/components/BaseSelect/type'

describe('BaseSelect.vue', () => {
  const options: BaseSelectOption[] = [
    { id: '1', label: 'Option 1', value: 'option1' },
    { id: '2', label: 'Option 2', value: 'option2' },
    { id: '3', label: 'Option 3', value: 'option3' },
  ]

  it('renders select options correctly', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'select-id',
        options,
      },
    })

    const optionElements = wrapper.findAll('option')
    expect(optionElements).toHaveLength(options.length)
    options.forEach((option, index) => {
      expect(optionElements[index].text()).toBe(option.label)
    })
  })

  it('updates internal value when no modelValue prop is provided', async () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'select-id',
        options,
      },
    })

    const selectElement = wrapper.find('select').element as HTMLSelectElement
    expect(selectElement.value).toBe('')

    await wrapper.find('select').setValue('option2')
    expect(selectElement.value).toBe('option2')

    await wrapper.find('select').setValue('option3')
    expect(selectElement.value).toBe('option3')
  })

  it('emits update:modelValue and change event when value changes', async () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'select-id',
        options,
        modelValue: 'option1',
      },
    })

    const selectElement = wrapper.find('select')
    await selectElement.setValue('option2')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['option2'])

    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')?.[0]).toEqual(['option2'])
  })

  it('renders with the correct classes', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'select-id',
        options,
        wrapperClass: 'custom-wrapper',
        selectClass: 'custom-select',
        optionClass: 'custom-option',
      },
    })

    expect(wrapper.classes()).toContain('custom-wrapper')
    const selectElement = wrapper.find('select')
    expect(selectElement.classes()).toContain('custom-select')

    const optionElements = wrapper.findAll('option')
    optionElements.forEach((optionElement) => {
      expect(optionElement.classes()).toContain('custom-option')
    })
  })

  it('handles multiple selection correctly when multiple is true', async () => {
    const wrapper = mount(BaseSelect, {
      props: {
        id: 'select-id',
        options,
      },
      attrs: {
        multiple: true,
      },
    })

    const selectElement = wrapper.find('select').element as HTMLSelectElement
    expect(selectElement.multiple).toBe(true)

    await wrapper.setProps({ modelValue: ['option1', 'option2'] })
    expect(Array.from(selectElement.selectedOptions).map((opt) => opt.value)).toEqual([
      'option1',
      'option2',
    ])

    selectElement.options[0].selected = false
    selectElement.options[2].selected = true
    await wrapper.find('select').trigger('change')

    const emittedValue = wrapper.emitted('update:modelValue')?.[0]?.[0]
    expect(emittedValue).toEqual(['option2', 'option3'])
  })
})
