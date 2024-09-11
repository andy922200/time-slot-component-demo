import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/TimeSelector.vue'),
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('../views/Calendar.vue'),
  },
  {
    path: '/selector',
    name: 'selector',
    component: () => import('../views/Selector.vue'),
  },
  {
    path: '/checkbox',
    name: 'checkbox',
    component: () => import('../views/Checkbox.vue'),
  },
  {
    path: '/input',
    name: 'input',
    component: () => import('../views/Input.vue'),
  },
  {
    path: '/tooltip',
    name: 'tooltip',
    component: () => import('../views/Tooltip.vue'),
  },
  {
    path: '/spinner',
    name: 'spinner',
    component: () => import('../views/Spinner.vue'),
  },
  {
    path: '/backdrop',
    name: 'backdrop',
    component: () => import('../views/Backdrop.vue'),
  },
]

const baseURL = process.env.NODE_ENV === 'production' ? '/component-library-demo/' : ''
const Router = createRouter({
  history: createWebHashHistory(baseURL),
  linkExactActiveClass: 'active',
  routes,
})

export default Router
