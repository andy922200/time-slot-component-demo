import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/TimeSlotDemo.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/Dev.vue'),
  },
]

const baseURL = process.env.NODE_ENV === 'production' ? '/time-slot-component-demo/' : ''
const Router = createRouter({
  history: createWebHashHistory(baseURL),
  linkExactActiveClass: 'active',
  routes,
})

export default Router
