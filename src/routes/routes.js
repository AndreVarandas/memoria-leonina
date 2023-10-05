import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/MainView.vue'),
  },
  {
    path: '/new-game',
    name: 'Game',
    component: () => import('../views/GameView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
