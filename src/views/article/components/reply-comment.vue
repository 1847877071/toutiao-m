<template>
  <div class='reply-comment'>
    <!-- 头部信息 -->
    <van-nav-bar
      :title="`${comment.reply_count}条回复`"
    >
      <van-icon slot="left" name="cross" @click="$emit('close')" />
    </van-nav-bar>
    <!-- /头部信息 -->

    <!-- 当前评论项 -->
    <commentItem :comment="comment" />
    <!-- /当前评论项 -->

    <!-- 所有评论回复 -->
    <van-divider
        :style="{ color: '#000', borderColor: '#888', padding: '0 16px' }"
      >
        全部评论
      </van-divider>
      <comment-index
        :source="comment.com_id"
        type="c"
      />
    <!-- /所有评论回复 -->
    <!-- 底部区域 -->
    <div class="footer">
      <van-cell center>
        <van-button
          class="write-btn"
          type='default'
          size="mini"
          @click="isPostShow = true"
        >
        写评论
        </van-button>
      </van-cell>
    </div>
    <!-- /底部区域 -->
    <!-- 评论回复 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
      <post-comment :target-id="comment.com_id" :article-id="articleId" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>
<script>
import commentItem from './comment-item.vue'
import commentIndex from './comment.vue'
import postComment from './post-comment.vue'
export default {
  name: 'replyComment',
  components: {
    commentItem,
    commentIndex,
    postComment
  },
  props: {
    articleId: {
      type: [Number, Object, String],
      default: null
    },
    comment: {
      type: Object,
      required: true
      // default: () => {}
    }
  },
  data () {
    return {
      isPostShow: false,
      commentList: []
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
    onPostSuccess (comment) {
      this.commentList.unshift(comment)
      this.comment.reply_count++
      this.isPostShow = false
    }
  }
}
</script>
<style lang="less" scoped>
  .write-btn {
    width: 340px;
    height: 40px;
    // float: left;
    border: 1px solid #ccc;
  }
</style>
