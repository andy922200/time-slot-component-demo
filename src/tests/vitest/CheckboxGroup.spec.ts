import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import BaseCheckbox from '@/components/BaseCheckbox/index.vue'
import CheckboxGroup from '@/components/CheckboxGroup/index.vue'
import { CheckboxGroupOptionMap } from '@/components/CheckboxGroup/type'

describe('CheckboxGroup.vue', () => {
  let optionMap = {} as CheckboxGroupOptionMap

  beforeEach(() => {
    optionMap = {
      id: 'group1',
      data: [
        { id: 'father1', name: 'Father', isFather: true, checked: false, value: 'father1' },
        { id: 'child1', name: 'Child 1', isFather: false, checked: false, value: 'child1' },
        { id: 'child2', name: 'Child 2', isFather: false, checked: false, value: 'child2' },
        { id: 'child3', name: 'Child 3', isFather: false, checked: false, value: 'child3' },
      ],
    }
  })

  it('renders father and children checkboxes', () => {
    const wrapper = mount(CheckboxGroup, {
      props: { optionMap },
    })

    const fatherCheckbox = wrapper.findComponent(BaseCheckbox)
    expect(fatherCheckbox.exists()).toBe(true)
    expect(fatherCheckbox.text()).toBe('Father')

    const childrenCheckboxes = wrapper
      .findAllComponents(BaseCheckbox)
      .filter((c) => c.text() !== 'Father')
    expect(childrenCheckboxes.length).toBe(3)
    expect(childrenCheckboxes[0].text()).toBe('Child 1')
    expect(childrenCheckboxes[1].text()).toBe('Child 2')
    expect(childrenCheckboxes[2].text()).toBe('Child 3')
  })

  it('updates children checkboxes when father checkbox is checked', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { optionMap },
    })

    const fatherCheckbox = wrapper.findComponent(BaseCheckbox)
    await fatherCheckbox.setValue(true)
    fatherCheckbox.vm.$emit('change', true)

    await nextTick()

    const childrenCheckboxes = wrapper
      .findAllComponents(BaseCheckbox)
      .filter((c) => c.text() !== 'Father')
    expect(childrenCheckboxes[0].props('modelValue')).toBe(true)
    expect(childrenCheckboxes[1].props('modelValue')).toBe(true)
  })

  it('updates father checkbox when all children checkboxes are checked', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { optionMap },
    })

    const childrenCheckboxes = wrapper
      .findAllComponents(BaseCheckbox)
      .filter((c) => c.text() !== 'Father')

    for (let i = 0; i < childrenCheckboxes.length; i++) {
      await childrenCheckboxes[i].setValue(true)
      childrenCheckboxes[i].vm.$emit('change', true)
    }

    await nextTick()

    const fatherCheckbox = wrapper.findComponent(BaseCheckbox)
    expect(fatherCheckbox.props('modelValue')).toBe(true)
  })

  it('unchecks father checkbox when all children checkboxes are unchecked', async () => {
    optionMap.data[0].checked = true
    optionMap.data[1].checked = true
    optionMap.data[2].checked = true
    optionMap.data[3].checked = true

    const wrapper = mount(CheckboxGroup, {
      props: { optionMap },
    })

    const childrenCheckboxes = wrapper
      .findAllComponents(BaseCheckbox)
      .filter((c) => c.text() !== 'Father')

    for (let i = 0; i < childrenCheckboxes.length; i++) {
      await childrenCheckboxes[i].setValue(false)
      childrenCheckboxes[i].vm.$emit('change', false)
    }

    await nextTick()

    const fatherCheckbox = wrapper.findComponent(BaseCheckbox)
    expect(fatherCheckbox.props('modelValue')).toBe(false)
  })

  it('emits update:father-option-change when father checkbox is checked', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { optionMap },
    })

    const fatherCheckbox = wrapper.findComponent(BaseCheckbox)
    await fatherCheckbox.setValue(true)
    fatherCheckbox.vm.$emit('change', true)

    await nextTick()

    expect(wrapper.emitted('update:father-option-change')).toBeTruthy()
    expect(wrapper.emitted('update:father-option-change')?.[0]).toEqual([
      { checked: true, options: optionMap.data[0] },
    ])
  })

  it('emits update:father-option-change when father checkbox is unchecked', async () => {
    optionMap.data[0].checked = true
    optionMap.data[1].checked = true
    optionMap.data[2].checked = true
    optionMap.data[3].checked = true

    const wrapper = mount(CheckboxGroup, {
      props: { optionMap },
    })

    const fatherCheckbox = wrapper.findComponent(BaseCheckbox)
    await fatherCheckbox.setValue(false)
    fatherCheckbox.vm.$emit('change', false)

    await nextTick()

    expect(wrapper.emitted('update:father-option-change')).toBeTruthy()
    expect(wrapper.emitted('update:father-option-change')?.[0]).toEqual([
      { checked: false, options: optionMap.data[0] },
    ])
  })

  it('emits update:children-option-change when a child checkbox is checked', async () => {
    const wrapper = mount(CheckboxGroup, {
      props: { optionMap },
    })

    const childrenCheckboxes = wrapper
      .findAllComponents(BaseCheckbox)
      .filter((c) => c.text() !== 'Father')

    await childrenCheckboxes[0].setValue(true)
    childrenCheckboxes[0].vm.$emit('change', true)

    await nextTick()

    expect(wrapper.emitted('update:children-option-change')).toBeTruthy()
    expect(wrapper.emitted('update:children-option-change')?.[0]).toEqual([
      {
        fatherOption: optionMap.data[0],
        options: optionMap.data.slice(1),
        checkedOptions: [optionMap.data[1]],
      },
    ])
  })

  it('emits update:children-option-change when a child checkbox is unchecked', async () => {
    optionMap.data[0].checked = true
    optionMap.data[1].checked = true
    optionMap.data[2].checked = true
    optionMap.data[3].checked = true

    const wrapper = mount(CheckboxGroup, {
      props: { optionMap },
    })

    const childrenCheckboxes = wrapper
      .findAllComponents(BaseCheckbox)
      .filter((c) => c.text() !== 'Father')

    await childrenCheckboxes[0].setValue(false)
    childrenCheckboxes[0].vm.$emit('change', false)

    await nextTick()

    expect(wrapper.emitted('update:children-option-change')).toBeTruthy()
    expect(wrapper.emitted('update:children-option-change')?.[0]).toEqual([
      {
        fatherOption: optionMap.data[0],
        options: optionMap.data.slice(1),
        checkedOptions: [optionMap.data[2], optionMap.data[3]],
      },
    ])
  })
})
