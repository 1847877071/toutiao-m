<template>
  <div class='article-list' ref='article-list'>
    <!--
      List 组件通过 loading 和 finished 两个变量控制加载状态，
当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 设置成 true，此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。
若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
load 事件
List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。
loading 属性：控制加载中的 loading 状态
非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

finished 属性：控制加载结束的状态
在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
所有数据加载结束，finished 为 true，此时不会触发 load 事件
     -->
    <van-pull-refresh :success-text="refreshSuccessText" v-model="isRefreshLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <article-item v-for="(article, index) in articles"
          :key="index"
          :article="article"
        ></article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import { getArticles } from '@/api/article.js'
import articleItem from '@/components/article-item/article-item.vue'
import { debounce } from 'lodash'
export default {
  name: 'articleList',
  components: {
    articleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      articles: [],
      loading: false,
      finished: false,
      timestamp: null, // 获取下一页数据的时间戳
      isRefreshLoading: false, // 下拉刷新的loading
      refreshSuccessText: '', // 下拉刷新成功的提示文本
      scrollTop: 0 // 列表滚动到顶部的距离
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    // this.loadArticles()
  },
  mounted () {
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce(() => {
      // console.log(articleList.scrollTop)
      // 把记录到顶部的距离重新设置回去
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  // 在 2.2.0 及其更高版本中，activated 和 deactivated 将会在 <keep-alive> 树内的所有嵌套组件中触发。缓存时其它的生命周期钩子不执行了，但是这两个会执行，没有缓存，这两个钩子是不会调用的
  activated () {
    // console.log('从缓存中被激活')
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  // deactivated () {
  //   console.log('组件失去活动了')
  // },
  methods: {
    async onLoad () {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳,timestamp相当于页码，请求最新数据使用当前最新事件戳，下一页数据使用上一次返回的数据中的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      // console.log(data)
      // 2. 把数据放到list数组中
      // 注意：是push进去的
      const { results } = data.data
      this.articles.push(...results)
      // console.log(this.articles)

      // 3.设置本次加载状态结束，它才可以判断是否需要加载下一次，否则就会永远的停在这里
      // 加载状态结束
      this.loading = false
      // 4.数据全部加载完成
      if (results.length) {
        // 更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据了，把加载状态设置结束，不再触发加载更多
        this.finished = true
      }
    },
    async onRefresh () {
      // 下拉刷新，组件自己就会展示Loading状态
      // 1. 请求获取数据
      const { data } = await getArticles({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(),
        with_top: 1
      })
      const { results } = data.data
      // 2. 把数据数据放到数据列表中（往顶部追加）
      this.articles.unshift(...results)
      this.refreshSuccessText = `更新了${results.length}条数据`
      // 3.关闭刷新的状态 Loading
      this.isRefreshLoading = false
      if (results.length) {
        // 更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据了，把加载状态设置结束，不再触发加载更多
        this.finished = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .article-list {
    position: fixed;
    left:0;
    right: 0;
    top: 90px;
    bottom: 50px;
    overflow-y: auto;
  }
</style>
