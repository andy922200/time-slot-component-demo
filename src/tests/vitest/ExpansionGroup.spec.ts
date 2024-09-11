import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { ExpansionItemData } from '@/components/Expansion/Expansion.type'
import ExpansionGroup from '@/components/Expansion/ExpansionGroup.vue'
import ExpansionItem from '@/components/Expansion/ExpansionItem.vue'

describe('ExpansionGroup.vue', () => {
  let items: ExpansionItemData[] = []

  beforeEach(() => {
    items = [
      { title: 'Item 1', content: 'Content 1' },
      { title: 'Item 2', content: 'Content 2' },
    ]
  })

  it('renders multiple expansion items', () => {
    const wrapper = mount(ExpansionGroup, {
      props: { items },
    })
    expect(wrapper.findAllComponents(ExpansionItem).length).toBe(2)
  })

  it('toggles expansion item from closed to open', async () => {
    const items = [{ title: 'Item 1', content: 'Content 1' }]
    const wrapper = mount(ExpansionGroup, {
      props: { items },
    })
    await wrapper.findAllComponents(ExpansionItem)[0].trigger('click')
    expect(wrapper.findAllComponents(ExpansionItem)[0].vm.isOpen).toBe(true)
  })

  it('handles single open mode correctly', async () => {
    const wrapper = mount(ExpansionGroup, {
      props: { items, single: true },
    })
    await wrapper.findAllComponents(ExpansionItem)[0].trigger('click')
    expect(wrapper.vm.isCurrentlyOpen(0)).toBe(true)
    await wrapper.findAllComponents(ExpansionItem)[1].trigger('click')
    expect(wrapper.vm.isCurrentlyOpen(0)).toBe(false)
    expect(wrapper.vm.isCurrentlyOpen(1)).toBe(true)
  })

  it('updates internal state when v-model changes', async () => {
    const items = [
      { title: 'Item 1', content: 'Content 1' },
      { title: 'Item 2', content: 'Content 2' },
    ]
    const wrapper = mount(ExpansionGroup, {
      props: { items, modelValue: [false, false] },
    })
    await wrapper.setProps({ modelValue: [true, false] })
    expect(wrapper.vm.isCurrentlyOpen(0)).toBe(true)
    expect(wrapper.vm.isCurrentlyOpen(1)).toBe(false)
  })

  it('emits update:modelValue when an item is toggled', async () => {
    const items = [
      { title: 'Item 1', content: 'Content 1' },
      { title: 'Item 2', content: 'Content 2' },
    ]
    const wrapper = mount(ExpansionGroup, {
      props: { items, modelValue: [false, false] },
    })

    wrapper.findAllComponents(ExpansionItem)[0].vm.$emit('toggle')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([[true, false]])
  })

  it('only allows one item to be open at a time when single is true', async () => {
    const wrapper = mount(ExpansionGroup, {
      props: { items, single: true, modelValue: [false, false] },
    })

    wrapper.findAllComponents(ExpansionItem)[0].vm.$emit('toggle')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([[true, false]])

    await wrapper.setProps({ modelValue: [true, false] }) // Simulating the response to the emission

    wrapper.findAllComponents(ExpansionItem)[1].vm.$emit('toggle')
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual([[false, true]])
  })

  it('renders custom header content when passed via slots', async () => {
    const wrapper = mount(ExpansionGroup, {
      props: { items },
      slots: {
        'header-0': '<div class="custom-header">Custom Header 1</div>',
        'header-1': '<div class="custom-header">Custom Header 2</div>',
      },
    })
    expect(wrapper.findAll('.custom-header')[0].html()).toContain('Custom Header 1')
    expect(wrapper.findAll('.custom-header')[1].html()).toContain('Custom Header 2')
  })

  it('renders default expand-area content when no slot content is provided', () => {
    const wrapper = mount(ExpansionGroup, {
      props: { items },
    })
    const expansionItems = wrapper.findAllComponents(ExpansionItem)
    expect(expansionItems[0].text()).toContain('Content 1')
    expect(expansionItems[1].text()).toContain('Content 2')
  })

  it('renders custom expand-area content when passed via slots', async () => {
    const wrapper = mount(ExpansionGroup, {
      props: { items },
      slots: {
        'expand-area-0': '<p class="custom-content">Custom Content 1</p>',
        'expand-area-1': '<p class="custom-content">Custom Content 2</p>',
      },
    })
    expect(wrapper.findAll('.custom-content')[0].html()).toContain('Custom Content 1')
    expect(wrapper.findAll('.custom-content')[1].html()).toContain('Custom Content 2')
  })

  it('renders default caret-icon when no slot content is provided', () => {
    const wrapper = mount(ExpansionGroup, {
      props: { items },
    })
    const defaultCaret = wrapper.findAll('.expansion-item__header span')[0]
    expect(defaultCaret.html()).toContain('▼')
  })

  it('renders custom caret-icon content when passed via slots', async () => {
    const wrapper = mount(ExpansionGroup, {
      props: { items },
      slots: {
        'caret-icon': '<span class="custom-caret">Custom Icon</span>',
      },
    })
    expect(wrapper.find('.custom-caret').exists()).toBe(true)
    expect(wrapper.find('.custom-caret').html()).toContain('Custom Icon')
  })
})
