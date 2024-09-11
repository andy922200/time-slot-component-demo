import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('../views/TimeSelector.vue'),
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('../views/Dev.vue'),
  },
]

const baseURL = process.env.NODE_ENV === 'production' ? '/component-library-demo/' : ''
const Router = createRouter({
  history: createWebHashHistory(baseURL),
  linkExactActiveClass: 'active',
  routes,
})

export default Router
