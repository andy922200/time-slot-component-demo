import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import DivTable from '@/components/DivTable/index.vue'
import { HeaderItem } from '@/components/DivTable/type'

describe('DivTable.vue', () => {
  const header: HeaderItem[] = [
    { titleKey: 'Name', paramKey: 'name' },
    { titleKey: 'Age', paramKey: 'age' },
  ]

  const data: Record<string, any>[] = [
    { name: 'John', age: '30' },
    { name: 'Jane', age: '25' },
  ]

  it('renders header correctly', () => {
    const wrapper = mount(DivTable, {
      props: { header, data },
    })

    const headerItems = wrapper.findAll('.div-table__header-item')
    expect(headerItems).toHaveLength(header.length)

    headerItems.forEach((headerWrapper, index) => {
      expect(headerWrapper.text()).toContain(header[index].titleKey)
    })
  })

  it('renders data correctly for large screens', async () => {
    window.innerWidth = 1024
    window.dispatchEvent(new Event('resize'))

    const wrapper = mount(DivTable, {
      props: { header, data },
    })

    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('.div-table__row')
    expect(rows).toHaveLength(data.length)

    rows.forEach((rowWrapper, rowIndex) => {
      const cells = rowWrapper.findAll('.div-table__cell')
      expect(cells).toHaveLength(header.length)
      cells.forEach((cellWrapper, cellIndex) => {
        expect(cellWrapper.text()).toContain(data[rowIndex][header[cellIndex].paramKey])
      })
    })
  })

  it('renders data correctly for small screens', async () => {
    window.innerWidth = 500
    window.dispatchEvent(new Event('resize'))

    const wrapper = mount(DivTable, {
      props: { header, data },
    })

    await wrapper.vm.$nextTick()

    const rows = wrapper.findAll('.div-table__row--mobile')
    expect(rows).toHaveLength(data.length)

    rows.forEach((rowWrapper, rowIndex) => {
      const cells = rowWrapper.findAll('.div-table__cell--mobile')
      expect(cells).toHaveLength(header.length)
      cells.forEach((cellWrapper, cellIndex) => {
        expect(cellWrapper.text()).toContain(data[rowIndex][header[cellIndex].paramKey])
      })
    })
  })
})
