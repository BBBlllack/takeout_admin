import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/',
      component: () => import('@/views/AdminView.vue'),
      redirect: 'category',
      children: [
        { path: 'dish', component: () => import('@/views/DishView.vue') },
        { path: 'category', component: () => import('@/views/CategoryView.vue') },
        { path: 'order', component: () => import('@/views/OrderView.vue') },
        { path: 'setting', component: () => import('@/views/SettingView.vue') }
      ]
    }
  ]
})

export default router
