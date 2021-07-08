<template>
  <div class='search-container'>
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="$router.back()"
        @focus="isResultShow=false"
      />
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <search-result v-if="isResultShow" :search-text="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch" />
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <search-history v-else :search-histories="searchHistories" @search="onSearch" />
    <!-- /历史记录 -->
  </div>
</template>
<script>
import searchSuggestion from './components/search-suggestion.vue'
import searchHistory from './components/search-history.vue'
import searchResult from './components/search-result.vue'
import { setItem, getItem } from '@/utils/storage.js'
import { mapState } from 'vuex'
import { getSearchHistories } from '@/api/search.js'
export default {
  name: 'searchIndex',
  components: {
    searchSuggestion,
    searchHistory,
    searchResult
  },
  props: {
  },
  data () {
    return {
      searchText: '', // 搜索文本框
      isResultShow: false, // 控制搜索结果展示
      searchHistories: [] // 搜索历史数据
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
  },
  created () {
    this.loadSearchHistories()
  },
  mounted () {
  },
  methods: {
    onSearch (val) {
      // console.log('val+', val, 'searchText+', this.searchText)
      this.searchText = val
      // 将搜索框的文本保存到data中的searchHistories数组中(注意:后输入的在前面,且如果有重复的需要删除数组之前的,将后面的放在数组前面)
      const index = this.searchHistories.indexOf(val)
      // 如果此字符串中没有这样的字符,则返回 -1
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      // 把最新的搜索历史记录放到顶部
      this.searchHistories.unshift(val)
      // 如果用户已登录,则把搜索历史记录存储到线上
      // 提示:只要我们调用获取搜索结果的数据接口,后面会给我们自动存储用户的搜索历史记录
      // 如果没有登录页,则把搜索历史记录存储到本地
      setItem('search-histories', this.searchHistories)
      this.isResultShow = true
    },
    async loadSearchHistories () {
      // 因为后端帮我们存储的用户搜索历史记录太少了(只有4条)
      // 所以我们这里让后端返回的历史记录和本地的历史记录合并到一起
      let searchHistories = getItem('search-histories') || []
      // 如果用户已登录
      if (this.user) {
        const { data } = await getSearchHistories()
        // 合并数组:[...数组, ...数组]
        // 把Set转为数组:[...Set对象]
        // 数组去重:[...new Set([...数组,...数组])]
        searchHistories = [...new Set([...searchHistories, ...data.data.keywords])]
      }
      this.searchHistories = searchHistories
    }
  }
}
</script>
<style lang="less" scoped>
</style>
