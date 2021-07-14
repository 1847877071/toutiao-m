/**
 * 请求模块
 */

import axios from 'axios'
import JSONbig from 'json-bigint'

// 在非组件模块中获取store必须通过这种方式
// 这里单独加载store，和在组件中this.store一个东西
import store from '@/store'
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
  return Promise.reject(error)
})

// 响应拦截器
// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

export default request
