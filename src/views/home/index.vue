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
    </van-tabs>
    <!-- /文章频道列表 -->
  </div>
</template>
<script>
import { getChannels } from '@/api/user.js'
import articleList from './components/article-list.vue'
export default {
  name: 'homeIndex',
  components: {
    articleList
  },
  props: {
  },
  data () {
    return {
      channels: [],
      active: 0 // 控制被激活的标签
    }
  },
  computed: {
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
      // 获取频道数据
      const { data } = await getChannels()
      // console.log(data)
      this.channels = data.data.channels
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
  }
</style>
