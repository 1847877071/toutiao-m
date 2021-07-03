/**
 * 文章请求相关模块
 */
import request from '@/utils/request.js'

// 获取文章列表

export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params
  })
}
