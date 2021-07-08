import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/login/index.vue'
// const Login = () => import('@/views/login/index.vue') 路由懒加载

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    // component: Login 路由懒加载，这句和上面第四行结合简写为下面第13行
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    // name: 'layout',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/views/home/index.vue')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/index.vue')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/index.vue')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/index.vue')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/index.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
