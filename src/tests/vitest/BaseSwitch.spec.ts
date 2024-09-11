import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import Switch from '@/components/BaseSwitch/index.vue'

describe('Switch.vue', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(Switch)
    expect(wrapper.exists()).toBe(true)
  })

  it('toggles the switch correctly', async () => {
    const wrapper = mount(Switch, {
      props: {
        value: false,
      },
    })
    const input = wrapper.find('input')

    // Check initial state
    expect(wrapper.vm.isBaseSwitchOn).toBe(false)

    // Simulate a click & set computed property
    await input.trigger('click')
    await wrapper.setProps({ value: true })

    expect(wrapper.vm.isBaseSwitchOn).toBe(true)
    expect(input.element.checked).toBe(true)
  })

  it('displays the correct side strings and colors', async () => {
    const wrapper = mount(Switch, {
      props: {
        value: false,
        offSideStr: 'Off',
        onSideStr: 'On',
        activeStrColor: '#000000',
        inactiveStrColor: '#d6d6d6',
      },
    })
    const label = wrapper.find('label')
    const offSideSpan = wrapper.find('.off').element as HTMLSpanElement
    const onSideSpan = wrapper.find('.on').element as HTMLSpanElement

    // Check initial colors
    expect(offSideSpan.style.color).toBe('rgb(0, 0, 0)')
    expect(onSideSpan.style.color).toBe('rgb(214, 214, 214)')

    // Simulate a click & set computed property
    await label.trigger('click')
    await wrapper.setProps({ value: true })

    // Check colors after toggling
    expect(offSideSpan.style.color).toBe('rgb(214, 214, 214)')
    expect(onSideSpan.style.color).toBe('rgb(0, 0, 0)')
  })

  it('sets the correct width based on props', async () => {
    const width = 80
    const wrapper = mount(Switch, {
      props: {
        value: false,
        width,
      },
    })

    const label = wrapper.find('label')
    const circle = wrapper.find('.circle')

    // Check the initial width of the switch
    expect(label.element.style.width).toBe(`${width}px`)

    // Simulate a click on the label
    await label.trigger('click')
    await wrapper.setProps({ value: true })

    // Wait for Vue to update the DOM
    await nextTick()

    // Check the circle position based on the width
    expect(getComputedStyle(circle.element).transform).toBe(`translateX(${width}px)`)
  })
})
