/**
 * 请求模块
 */

import axios from 'axios'
import JSONbig from 'json-bigint'
import { Toast } from 'vant'

// 在非组件模块中获取store必须通过这种方式
// 这里单独加载store，和在组件中this.store一个东西
import store from '@/store'
import router from '@/router'

// 用于刷新获取新的token,没有请求拦截器
const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn', // 基础路径
  // transformResponse之前对其进行更改：
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    try {
      return JSONbig.parse(data)
    } catch (err) {
      return data
    }
  }]
  // baseURL: '/api'
})

// const request = axios.create({
//   baseURL: '/api'
//   // baseURL: 'http://ttapi.research.itcast.cn/'
//   // baseURL: process.env.NODE_ENV === 'production'
//   //   ? 'http://api-toutiao-web.itheima.net'
//   //   : 'http://ttapi.research.itcast.cn/'
// })

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // console.log(config)
  // 处理完之后一定要把config返回，否则请求就会停在这里
  return config
}, function (error) {
  // Do something with request error
  console.log(error)
  return Promise.reject(error)
})

// 响应拦截器
// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, async function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  console.log(error)
  const status = error.response.status
  if (status === 400) {
    // 客户端参数错误
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    // token无效
    // 如果没有user或者user.token，直接去登录
    const { user } = store.state
    if (!user || !user.token) {
      // 直接跳转到登录页面
      return redirectLogin()
    }
    // 如果有refresh_token,则请求获取新的token
    // 使用refresh_token 请求获取新的token
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 拿到新的token之后把它更新到容器中
      user.token = data.data.token
      console.log(user)
      store.commit('setUser1', user)
      // 把失败的请求重新发送出去
      // error.config是本次请求的相关配置信息对象
      // 这里使用request发请求,它会走自己的拦截器
      // 它的请求拦截器中通过store容器访问token数据
      return request(error.config)
    } catch (err) {
      // 刷新token都失败了,直接跳转到登录页
      redirectLogin()
    }
  } else if (status === 403) {
    // 没有权限操作
    Toast.fail('没有权限操作')
  } else if (status === 500) {
    // 服务端异常
    Toast.fail('服务端异常，请稍后重试')
  }
  return Promise.reject(error)
})
function redirectLogin () {
  router.replace({
    name: '/login',
    // 传递查询参数,查询参数会以?作为分隔符放到url后面
    query: {
      // 数据名是自己起的
      // router.currentRoute 和我们在组件中获取的this.$route是一个东西
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
