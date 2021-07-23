<template>
  <div class='post-comment'>
    <!-- v-model.trim="message" // 自动去掉文字两边空格 -->
    <van-field
      class="message"
      v-model.trim="message"
      rows="1"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
      <van-button
        class="pubdate"
        type="default"
        size="mini"
        @click="onPubdate"
        :disabled="!message"
      >发布</van-button>
  </div>
</template>
<script>
import { addComment } from '@/api/comment.js'
export default {
  name: 'postComment',
  components: {
  },
  props: {
    // 如果是发布文章评论，则传递文章ID
    // 如果是发布评论回复，则传递评论ID
    targetId: {
      type: [Number, Object, String],
      required: true
    },
    // 如果是发布评论回复，则也需要传递文章ID
    articleId: {
      type: [Number, Object, String],
      default: null
    }
  },
  data () {
    return {
      message: '' // 输入框内容
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
    async onPubdate () {
      // this.$toast.loading({
      //   message: '发布中',
      //   forbidClick: true // 禁止被点击
      // })
      const { data } = await addComment({
        target: this.targetId,
        // target: this.targetId.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id)
        content: this.message, // 评论内容
        // art_id: null
        art_id: this.articleId ? this.articleId : null // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
      })
      this.$emit('post-success', data.data.new_obj)
      console.log(data)
      console.log(this.targetId)
      // 处理响应结果
      // this.$toast.success('发布成功')
      // 发布成功，清空文本框内容
      this.message = ''
    }
  }
}
</script>
<style lang="less" scoped>
  .post-comment {
    display: flex;
    align-items: center;
    padding: 14px;
    .pubdate {
      width: 50px;
    }
  }
</style>
