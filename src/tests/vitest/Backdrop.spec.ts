import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Backdrop from '@/components/Backdrop/index.vue'

describe('Backdrop.vue', () => {
  it('should render content when "show" is true', () => {
    const wrapper = mount(Backdrop, {
      props: {
        show: true,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })

    expect(wrapper.find('.backdrop').isVisible()).toBe(true)
  })

  it('should not render content when "show" is false', () => {
    const wrapper = mount(Backdrop, {
      props: {
        show: false,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })

    expect(wrapper.find('.backdrop').isVisible()).toBe(false)
  })

  it('should call closeFunc when backdrop is clicked', async () => {
    const closeFunc = vi.fn()
    const wrapper = mount(Backdrop, {
      props: {
        show: true,
        closeFunc,
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })

    await wrapper.find('.backdrop').trigger('click')
    expect(closeFunc).toHaveBeenCalled()
  })

  it('should not call closeFunc when content slot is clicked', async () => {
    const closeFunc = vi.fn()
    const wrapper = mount(Backdrop, {
      props: {
        show: true,
        closeFunc,
      },
      slots: {
        content: '<div class="content">Content</div>',
      },
      global: {
        stubs: {
          teleport: true,
        },
      },
    })
    await wrapper.find('.content').trigger('click')
    expect(closeFunc).not.toHaveBeenCalled()
  })
})
