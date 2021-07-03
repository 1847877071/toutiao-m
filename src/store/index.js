import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage.js'

Vue.use(Vuex)

// 因为保存的用户名字符串就算不一致也不会报错，为了更严谨一点，因为获取和存储的用户名需一致，为了没写对会报错，所以单独对它进行设置个特别点的常量
const USER_KEY = 'toutiao-user'
export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY) // 当前登录用户的登录状态（token等数据）
    // user: JSON.parse(window.localStorage.getItem('user'))
  },
  mutations: {
    setUser1 (state, data) {
      state.user = data
      // 为了防止页面刷新数据丢失，我们还需要把数据放到本地存储中，这里仅仅是为了持久化数据
      setItem(USER_KEY, state.user)
      // window.localStorage.setItem('user', JSON.stringify(state.user))
      // 因为state.user是对象，所以存储需要用JSON转化为字符串
    }
  },
  actions: {
  },
  modules: {
  }
})
