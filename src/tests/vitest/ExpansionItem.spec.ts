import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ExpansionItem from '@/components/Expansion/ExpansionItem.vue'

describe('ExpansionItem.vue', () => {
  it('renders props.title when passed', () => {
    const title = 'Test Title'
    const wrapper = mount(ExpansionItem, {
      props: { title },
    })
    expect(wrapper.text()).toMatch(title)
  })

  it('emits toggle event on click', async () => {
    const wrapper = mount(ExpansionItem, {
      props: { title: 'Click Me' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('toggle')
  })

  it('shows content in slot when isOpen is true', () => {
    const wrapper = mount(ExpansionItem, {
      props: { title: 'Test', isOpen: true },
      slots: { 'expand-area': '<p>Test Content</p>' },
    })
    expect(wrapper.html()).toContain('Test Content')
  })

  it('renders custom caret-icon when passed', () => {
    const wrapper = mount(ExpansionItem, {
      props: { title: 'Expand' },
      slots: {
        'caret-icon': '<span class="custom-caret">🔽</span>',
      },
    })
    expect(wrapper.html()).toContain('<span class="custom-caret">🔽</span>')
  })
})
