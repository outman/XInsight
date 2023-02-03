import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/flame',
      name: 'flame',
      component: () => import('../views/FlameView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('XINSIGHT-TOKEN')
  if (!token && to.name !== 'login') {
    next({ name: 'login'})
  } else {
    next()
  }
})
export default router
