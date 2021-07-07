<template>
  <div class='home-container'>
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
    >
      <van-button
        slot="title"
        round
        icon="search"
        class="search-btn"
        >搜索</van-button>
    </van-nav-bar>
    <!-- /导航栏 -->
    <!-- 文章频道列表 -->
    <!--
      标签页组件有一个功能，只有你第一次查看标签页的时候才会渲染里面的内容
     -->
    <van-tabs class="channel-tabs" v-model="active">
      <!-- <van-tab v-for="channels in channels" :key="channels.id" :title="channels.name">内容 1</van-tab> -->
      <van-tab v-for="(channels, index) in channels" :key="index" :title="channels.name">
        <!-- 文章列表 -->
        <article-list :channel="channels"></article-list>
        <!-- /文章列表 -->
      </van-tab>
      <!-- 汉堡按钮定位把列表最后的位置给挡住了，解决办法就是在这里添加一个占位元素 -->
      <div slot="nav-right" class="wap-nav-placeholder"></div>
      <!-- 右侧汉堡插槽 -->
      <div
        slot="nav-right"
        class="wap-nav-wrap"
        @click="isChannelEditShow=true"
      >
        <van-icon name="wap-nav" />
      </div>
      <!-- /右侧汉堡插槽 -->
    </van-tabs>
    <!-- /文章频道列表 -->
    <!-- 汉堡频道页面 -->
    <van-popup
      v-model="isChannelEditShow"
      position="bottom"
      style="height: 100%"
      closeable
      get-container="body"
    >
    <!-- 频道子组件 -->
    <!-- 模板中的$event表示事件参数
    所以 @updateIndex="onUpdateActive"这里的函数可以替代为：
    @updateIndex="active=$event"-->
      <channel-edit :user-channels="channels"     @close="isChannelEditShow=false" @updateIndex="onUpdateActive"
      :active="active"
      />
    <!-- /频道子组件 -->
    </van-popup>
    <!-- /汉堡频道页面 -->
  </div>
</template>
<script>
import { getChannels } from '@/api/user.js'
import articleList from './components/article-list.vue'
import channelEdit from './components/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage.js'
export default {
  name: 'homeIndex',
  components: {
    articleList,
    channelEdit
  },
  props: {
  },
  data () {
    return {
      channels: [],
      active: 0, // 控制被激活的标签
      isChannelEditShow: true // 频道编辑区域是否显示
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
  },
  created () {
    this.loadChannels()
  },
  mounted () {
  },
  methods: {
    async loadChannels () {
      let channels = []
      if (this.user) {
        // 就获取线上数据
        const { data } = await getChannels()
        channels = data.data.channels
      } else {
        // 如果没有登录，判断是否有本地存储
        const loacalChannels = getItem('user-channels')
        if (loacalChannels) {
          // 有本地存储，就获取本地存储
          channels = loacalChannels
        } else {
          // 用户没有登录，也没有本地存储，那就请求获取默认推荐频道列表
          const { data } = await getChannels()
          channels = data.data.channels
        }
      }
      // 把处理好的数据放到data中以供模板使用
      this.channels = channels
      // // 获取频道数据
      // const { data } = await getChannels()
      // // console.log(data)
      // this.channels = data.data.channels
    },
    onUpdateActive (index) {
      this.active = index
      console.log(index)
    }
  }
}
</script>
<style lang="less" scoped>
  .home-container {
    .app-nav-bar {
      // background-color: unset;
      background-color: rgb(40, 125, 252);
      /deep/.van-nav-bar__title {
        max-width: unset;
        .search-btn {
          width: 277px;
          height: 32px;
          background-color: #5babfb;
          border: none;
          color: #fff;
          border: none;
          .van-icon {
            font-size: 16px;
            color: #fff;
          }
          .van-button__text {
            font-size: 14px;
          }
        }
      }
    }
  }
  .channel-tabs {
    /deep/.van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/.van-tabs__line {
      // width: unset;
      width: 15px;
      height: 3px;
      background-color: #3296fa;
      margin-bottom: 4px;
    }
    .wap-nav-wrap {
      position: fixed;
      right: 0;
      height: 43px;
      line-height: 43px;
      background-color: #fff;
      opacity: .9;
      width: 33px;
      .van-icon {
        font-size: 22px;
      }
    }
    .wap-nav-placeholder {
      width:33px;
      flex-shrink:0;
    }
  }
</style>
