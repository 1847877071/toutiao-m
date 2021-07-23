<template>
  <div class='comment-container'>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      > -->
      <comment-item
        v-for="(comment, index) in commentlist"
        :key="index"
        :comment="comment"
        @reply-click="$emit('reply-click',$event)"
      />
    </van-list>
  </div>
</template>
<script>
import { getcomments } from '@/api/comment.js'
import commentItem from './comment-item.vue'
export default {
  name: 'commentIndex',
  components: {
    commentItem
  },
  props: {
    source: {
      type: [String, Object, Number],
      required: true
    },
    type: {
      type: String,
      default: 'a'
    },
    // commentList: []
    commentlist: {
      type: Array,
      // 数组或对象的默认值必须通过函数返回
      // required: true,
      default: () => []
    }
  },
  data () {
    return {
      // commentlist: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    this.onLoad()
  },
  mounted () {
  },
  methods: {
    async onLoad () {
      // 请求数据
      const { data } = await getcomments({
        type: this.type, // a或c,评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.source.toString(), // 源id,文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: this.limit// 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
      })
      this.$emit('total-count', data.data.total_count)
      // console.log(data)
      const { results } = data.data
      // 数据加给list
      this.commentlist.push(...results)
      // console.log(this.commentlist)
      // 关闭加载
      this.loading = false
      // 判断是否加载完毕
      // console.log(results.length)
      if (results.length) {
        this.offset = data.data.last_id
        // console.log(data.data.last_id)
        // this.commentlist.push(...results)
      } else {
        // 没有数据了，把加载状态设置结束，不再触发加载更多
        this.finished = true
      }
      // this.commentlist.push(...results)
      // console.log(this.commentlist)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
