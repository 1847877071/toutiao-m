import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store'
// import Login from '@/views/login/index.vue'
// const Login = () => import('@/views/login/index.vue') 路由懒加载

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    // component: Login 路由懒加载，这句和上面第四行结合简写为下面第13行
    component: () => import('@/views/login/index.vue'),
    meta: { requiresAuth: false } // 添加额外的自定义数据,处理登录才能看的数据
  },
  {
    path: '/',
    // name: 'layout',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/index.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/index.vue'),
        meta: { requiresAuth: false }
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/index.vue'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/index.vue'),
    meta: { requiresAuth: false }
  },
  {
    name: 'article',
    path: '/article/:articleId',
    component: () => import('@/views/article/index.vue'),
    // 将动态路由参数映射到组件的props中,无论是访问还是维护性都很方便
    props: true,
    meta: { requiresAuth: false }
  },
  {
    name: 'user-profile',
    path: '/user/profile',
    component: () => import('@/views/user-profile/index.vue'),
    meta: { requiresAuth: false }
  },
  {
    name: 'user-chat',
    path: '/user/chat',
    component: () => import('@/views/user-chat/user-chat.vue'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes
})

// to: 要访问的页面路由信息
// from: 来自哪个页面的路由信息
// next: 放行的标记
router.beforeEach((to, from, next) => {
  // 判断页面是否需要登录才能访问
  // console.log(to)
  if (to.meta.requiresAuth) {
    // 如果已登录,则直接通过
    if (store.state.user) {
      return next()
    }

    // 没有登录,提示是否登录
    // 校验登录状态,提示用户
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问,确认登录吗'
    })
      .then(() => {
        // on confirm确认执行这里
        router.replace({
          name: 'login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      })
      .catch(() => {
        // on cancel取消了执行这里
        next(false)
      })
  } else {
    // 不需要登录状态的页面,直接过去
    next()
  }
})
export default router
