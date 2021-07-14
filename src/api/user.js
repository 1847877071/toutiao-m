/**
 * 用户相关请求模块
 */
import request from '@/utils/request.js'

// 在非组件模块中获取store必须通过这种方式
// 这里单独加载store，和在组件中this.store一个东西
// import store from '@/store'

/**
 * 登录注册
 */
export const login = data => {
  return request({
    url: '/app/v1_0/authorizations',
    method: 'POST',
    data
  })
}

// 获取手机验证码
export const sendSms = (mobile) => {
  return request({
    url: `/app/v1_0/sms/codes/${mobile}`,
    method: 'GET'
  })
}
// export function login (data) {
//   return request({
//     method: 'POST',
//     url: '/app/v1_0/authorizations',
//     data
//   })
// }

// 获取登录用户的信息
export const getCurrentUser = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // store.state.user.token它是看网页登录状态时vue里面的store中state存储路径
    // }
  })
}

// 获取频道列表
export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 获取全部频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

// 编辑保存频道列表
export const addChannel = data => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data
  })
}

// 删除用户频道列表
export const deleteChannel = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${target}`
  })
}
// 关注用户
export const AddFollow = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}
// 取消关注用户
export const deleteFollow = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
// 获取用户个人信息
export const getUserProfile = data => {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'GET',
    data
  })
}
