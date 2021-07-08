<template>
  <div class='search-suggestion'>
    <van-cell
      icon='search'
      v-for="(suggestion, index) in suggestions"
      :key="index"
      @click="$emit('search', suggestion)"
    >
      <div slot="title" v-html="highlight(suggestion)"></div>
    </van-cell>
  </div>
</template>
<script>
import { searchSuggestions } from '@/api/search.js'
import { debounce } from 'lodash'
export default {
  name: 'searchSuggestion',
  components: {
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: []
    }
  },
  computed: {
  },
  // watch 详细的使用语法参考：https://cn.vuejs.org/v2/api/#watch
  watch: {
    // 属性名:要监视的数据的名称
    searchText: {
      // 当数据发生变化则会执行handler处理函数
      handler: debounce(async function () {
        // 找到数据接口
        // 请求获取数据
        // 模板半丁展示
        const { data } = await searchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 200),
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    highlight (suggestion) {
      // 正则表达式//双斜杠里面的内容都会当作正则匹配模式字符来对待
      // 错误的写法:/this.searchText/gi
      // RefExp 是正则表达式的构造函数
      // 参数1:字符串
      // 参数2:匹配模式
      // 返回值:正则对象
      return suggestion.replace(
        new RegExp(this.searchText, 'gi'), // 此处正则表达式还是有问题,就是当搜索框搜的带有特殊符号的就不行,有警告错误
        `<span style="color: red">${this.searchText}</span>`
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
