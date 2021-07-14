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
// 获取文章详情页
export const getArticleById = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}
// 收藏文章
export const addCollected = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/collections',
    data: {
      target: articleId
    }
  })
}
// 取消收藏文章
export const deleteCollected = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${articleId}`
  })
}
// 文章点赞
export const addattitude = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}
// 取消文章点赞
export const deleteattitude = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}
