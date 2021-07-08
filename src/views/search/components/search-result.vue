<template>
  <div class='search-result'>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(article, index) in list" :key="index" :title="article.title" />
    </van-list>
  </div>
</template>
<script>
import { getSearchResults } from '@/api/search.js'
export default {
  name: 'searchResult',
  components: {
  },
  props: {
    searchText: []
    // searchText: {
    //   type: String,
    //   required: true
    // }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      per_page: 10, // 搜索结果每页展示条数
      page: 1 // 展示第几页
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
    async onLoad () {
      // 1.请求获取接口数据
      const { data } = await getSearchResults({
        page: this.page,
        per_page: this.per_page,
        q: this.searchText
      })
      // 2.将数据放到数据列表中
      const { results } = data.data
      this.list.push(...results)
      // 3.关闭本次的loading
      this.loading = false
      // 4. 判断是否还有数据
      if (results.length) {
        // 如果有,则更新获取下一页数据的页码
        this.page++
      } else {
        // 如果没有,则把finished设置为true,关闭加载更多
        this.finished = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .search-result {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 54px;
    overflow-y: auto;
  }
</style>
