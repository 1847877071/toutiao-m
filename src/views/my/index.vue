<template>
  <div class='my-container'>
    <van-cell-group v-if="user" class="my-info">
      <van-cell
      class="base-info"
      title="单元格"
      value=""
      center
      :border="false"
      >
        <van-image
          class="avater"
          slot="icon"
          round
          fit="cover"
          :src="currentUser.photo"
        />
        <div slot="title" class="user-name">{{currentUser.name}}</div>
        <!-- <van-cell title="昵称" slot="icon" /> -->
        <van-button class="update-btn" slot="right-icon" round size="small" to="/user/profile" >编辑资料</van-button>
      </van-cell>
      <van-grid :border="false" class="data-info">
        <van-grid-item class="data-info-item">
          <span class="count">{{currentUser.art_count}}</span>
          <span class="text">头条</span>
        </van-grid-item>
        <van-grid-item class="data-info-item" text="文字">
          <span class="count">{{currentUser.follow_count}}</span>
          <span class="text">关注</span>
        </van-grid-item>
        <van-grid-item class="data-info-item" text="文字">
          <span class="count">{{currentUser.fans_count}}</span>
          <span class="text">粉丝</span>
        </van-grid-item>
        <van-grid-item class="data-info-item">
          <div slot="text">
            <div class="count">{{currentUser.like_count}}</div>
            <div class="text">获赞</div>
          </div>
        </van-grid-item>
      </van-grid>
    </van-cell-group>
    <div v-else class="notlog">
      <div @click="$router.push('/login')">
        <img class="mobile" src="./mobile.png" alt="">
      </div>
      <div class="text">登录/注册</div>
    </div>
    <van-grid clickable class="nav-grid mb-4" :column-num="2">
      <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="shoucang" text="收藏" to="" />
      <van-grid-item class="nav-grid-item" icon-prefix="toutiao" icon="lishi" text="历史" to="" />
    </van-grid>
    <van-cell title="消息通知" is-link to="" />
    <van-cell class="mb-4" title="小智同学" is-link to="" />
    <van-button
      v-if="user"
      class="logout-cell"
      block
      @click="onLogout"
    >退出登录</van-button>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user.js'
export default {
  name: 'myIndex',
  components: {
  },
  props: {
  },
  data () {
    return {
      // 当前登录用户信息
      currentUser: {}
    }
  },
  computed: {
    ...mapState(['user'])
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
      const { data } = await getCurrentUser()
      // console.log(data)
      this.currentUser = data.data
    },
    onLogout () {
      // 提示用户确认退出
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？'
      })
        .then(() => {
          // on confirm
          // 退出登录，将vuex容器中的用户登录状态（token等数据）清掉
          this.$store.commit('setUser1', null)
        })
        .catch(() => {
          // on cancel
        })
      // 确认->处理退出
    }
  }
}
</script>
<style lang="less" scoped>
.my-container {
  .my-info {
    background: url("./banner.png");
    background-size: cover;
    .base-info {
      box-sizing: border-box;
      height: 115px;
      background-color: unset;
      padding-top: 38px;
      padding-bottom: 11px;
      .avater {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        margin-right: 11px;
        border: 1px solid #fff;
      }
      .user-name {
        color: #fff;
        font-size: 15px;
      }
      .update-btn {
        height: 16px;
        font-size: 10px;
        color: #666;
      }
    }
    .data-info {
      text-align: center;
      .data-info-item {
        height: 65px;
        color: #fff;
        .count {
          font-size: 18px;
        }
        .text {
          font-size: 11px;
        }
      }
    }
    /deep/.van-grid-item__content {
      background-color: unset;
    }
  }
  .notlog {
    background-image: url('./banner.png');
    height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      color: #fff;
      font-size: 14px;
    }
  }
  /deep/.nav-grid {
    // box-sizing: border-box;
    .nav-grid-item{
      // height: unset;
      height: 70px;
      .toutiao {
        font-size:22px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333;
      }
    }
  }
  .logout-cell {
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>
