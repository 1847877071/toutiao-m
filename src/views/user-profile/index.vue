<template>
  <div class='user-profile'>
    <!-- 导航栏 -->
    <van-nav-bar
      title="用户信息"
      left-arrow
      @click-left="$router.back()"
      class="app-nav-bar"
    />
    <!-- /导航栏 -->
    <van-cell title="头像" is-link center>
      <van-image
        width="30"
        height="30"
        round
        fit="cover"
        :src="currentUser.photo"
        />
    </van-cell>
    <van-cell title="昵称" is-link :value="currentUser.name" @click="isUpdateNmeShow=true" ></van-cell>
    <van-cell title="性别" is-link :value="currentUser.gender===1?'女':'男'" ></van-cell>
    <van-cell title="生日" is-link :value="currentUser.birthday" ></van-cell>
    <van-popup v-model="isUpdateNmeShow" position="bottom" :style="{ height: '100%' }">
      <update-name @close="isUpdateNmeShow=false" :currentUser="currentUser" />
    </van-popup>
  </div>
</template>
<script>
import { getUserProfile } from '@/api/user.js'
import updateName from './components/update-name.vue'
export default {
  name: 'userProfile',
  components: {
    updateName
  },
  props: {
  },
  data () {
    return {
      currentUser: {},
      isUpdateNmeShow: false
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    this.loadCurrentUser()
  },
  mounted () {
  },
  methods: {
    async loadCurrentUser () {
      const { data } = await getUserProfile()
      console.log(data)
      this.currentUser = data.data
    }
  }
}
</script>
<style lang="less" scoped>
  .van-popup {
    background-color: #f5f7f9;
  }
</style>
