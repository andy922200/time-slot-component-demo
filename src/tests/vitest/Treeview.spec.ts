import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import TreeView from '@/components/TreeView/index.vue'
import { TreeNode } from '@/components/TreeView/TreeView.type'

describe('TreeView.vue', () => {
  const nodes: TreeNode[] = [
    { key: '1', text: 'Node 1', level: 0, parentKey: null },
    { key: '2', text: 'Node 2', level: 1, parentKey: '1' },
    { key: '3', text: 'Node 3', level: 1, parentKey: '1' },
    { key: '4', text: 'Node 4', level: 0, parentKey: null },
  ]

  it('renders root nodes correctly', () => {
    const wrapper = mount(TreeView, {
      props: {
        nodes,
        parentKey: null,
        level: 0,
      },
    })
    expect(wrapper.findAll('.tree-node').length).toBe(2)

    const nodeTexts = wrapper.findAll('.node-text').map((node) => node.text())
    expect(nodeTexts).toContain('Node 1')
    expect(nodeTexts).toContain('Node 4')
  })

  it('toggles node visibility when clicked', async () => {
    const wrapper = mount(TreeView, {
      props: {
        nodes,
        parentKey: null,
        level: 0,
      },
    })

    // 檢查初始渲染的根節點
    const rootNode = wrapper.find('.node-text')
    expect(rootNode.exists()).toBe(true)
    expect(rootNode.text()).toBe('Node 1')

    // 點擊打開節點
    await wrapper.find('.toggle-icon').trigger('click')

    // 等待 DOM 更新
    await nextTick()

    // 檢查子 TreeView 是否存在
    const childTreeView = wrapper.findAllComponents(TreeView)
    expect(childTreeView.length).toBe(1)
    expect(childTreeView[0].exists()).toBe(true)

    // 檢查子 TreeView 的節點數量
    const childNodeTexts = childTreeView[0].findAll('.node-text').map((node) => node.text())
    expect(childTreeView[0].vm.filteredNodes.length).toBe(2)
    expect(childNodeTexts.length).toBe(2)
    expect(childNodeTexts).toContain('Node 2')
    expect(childNodeTexts).toContain('Node 3')
  })

  it('does not display child nodes initially', () => {
    const wrapper = mount(TreeView, {
      props: {
        nodes,
        parentKey: null,
        level: 0,
      },
    })
    expect(wrapper.findAllComponents(TreeView).length).toBe(0)
  })

  it('renders node with custom slot', () => {
    const wrapper = mount(TreeView, {
      props: {
        nodes,
        parentKey: null,
        level: 0,
      },
      slots: {
        'node-text': '<template #node-text="{ node }">Custom Slot</template>',
      },
    })
    expect(wrapper.find('.node-header').text()).toBe('Custom Slot')
  })

  it('applies custom classes to node header and text', () => {
    const wrapper = mount(TreeView, {
      props: {
        nodes,
        parentKey: null,
        level: 0,
        nodeHeaderClass: 'custom-header-class',
        textClass: 'custom-text-class',
      },
    })
    expect(wrapper.find('.node-header').classes()).toContain('custom-header-class')
    expect(wrapper.find('.node-text').classes()).toContain('custom-text-class')
  })

  it('handles accordion functionality correctly', async () => {
    const wrapper = mount(TreeView, {
      props: {
        nodes,
        parentKey: null,
        level: 0,
        isAccordion: true,
      },
    })

    // 展開第一個節點
    await wrapper.find('.toggle-icon').trigger('click')
    expect(wrapper.findAllComponents(TreeView).length).toBe(1)

    await wrapper.findAll('.toggle-icon').at(1)?.trigger('click')

    // 檢查同層的節點是否被關閉
    expect(wrapper.findAllComponents(TreeView).length).toBe(1)
  })
})
