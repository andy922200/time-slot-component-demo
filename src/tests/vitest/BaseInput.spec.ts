import { mount } from '@vue/test-utils'

import BaseInput from '@/components/BaseInput/index.vue'

describe('BaseInput.vue', () => {
  it('renders input with the correct id', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('id')).toBe('test-input')
  })

  it('applies custom class', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        class: 'custom-class',
      },
    })
    const input = wrapper.find('input')
    expect(input.classes()).toContain('custom-class')
  })

  it('passes down attributes correctly', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        type: 'text',
        placeholder: 'Enter text',
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('placeholder')).toBe('Enter text')
  })

  it('does not include class attribute from props in the input element', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        class: 'custom-class',
      },
      attrs: {
        class: 'another-class',
      },
    })
    const input = wrapper.find('input')
    expect(input.classes()).not.toContain('another-class')
  })

  it('renders label with correct text when labelName is provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        labelName: 'Label Text',
      },
    })
    const label = wrapper.find('label')
    expect(label.text()).toBe('Label Text')
  })

  it('shows required asterisk when isRequired is true', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        isRequired: true,
      },
    })
    const asterisk = wrapper.find('span.text-red-500')
    expect(asterisk.exists()).toBe(true)
    expect(asterisk.text()).toBe('*')
  })

  it('applies wrapperClass to the outer div element', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        wrapperClass: 'custom-wrapper-class',
      },
    })
    const wrapperDiv = wrapper.find('.base-input__wrapper')
    expect(wrapperDiv.classes()).toContain('custom-wrapper-class')
  })

  it('updates internalValue and emits update:modelValue event', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        modelValue: 'initial',
      },
    })
    const input = wrapper.find('input')
    await input.setValue('changed')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['changed'])
  })

  it('disables the input when disabled prop is true', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        disabled: true,
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('applies error class when isError prop is true', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        isError: true,
      },
    })
    const input = wrapper.find('input')
    expect(input.classes()).toContain('border-red-500')
  })

  it('renders append slot when hasAppend is true', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        hasAppend: true,
      },
      slots: {
        append: '<div class="append-content">Append Content</div>',
      },
    })
    const appendContent = wrapper.find('.append-content')
    expect(appendContent.exists()).toBe(true)
    expect(appendContent.text()).toBe('Append Content')
  })

  it('applies maxlength attribute when maxLength prop is provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        maxLength: 10,
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('maxlength')).toBe('10')
  })

  it('applies max attribute when max prop is provided', () => {
    const wrapper = mount(BaseInput, {
      props: {
        id: 'test-input',
        max: 100,
      },
    })
    const input = wrapper.find('input')
    expect(input.attributes('max')).toBe('100')
  })
})
