<template>
  <van-cell class='comment-item'>
    <van-image
      slot="icon"
      class="avater"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title">
      <div class="title-wrap">
        <div class="name">{{ comment.aut_name }}</div>
        <div
          class="icon-wrap"
          @click="onCommentLike"
        >
          <van-icon
            class="lick-icon"
            :class="{like:comment.is_liking}"
            :name="comment.is_liking?'good-job':'good-job-o'"
          />
          <span class="like-count">{{comment.like_count}}</span>
        </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div class="reply-wrap">
        <span class="pubdate">{{ comment.pubdate | dateTime }}</span>
        <van-button
          class="reply-btn"
          round
          size="mini"
          @click="$emit('reply-click', comment)"
        >{{ comment.reply_count }} 回复</van-button>
      </div>
    </div>
  </van-cell>
</template>
<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment.js'
export default {
  name: 'commentItem',
  components: {
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
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
    async onCommentLike () {
      if (this.comment.is_liking) {
        await deleteCommentLike(this.comment.com_id)
        this.comment.like_count--
      } else {
        await addCommentLike(this.comment.com_id)
        this.comment.like_count++
      }
      this.comment.is_liking = !this.comment.is_liking
    }
  }
}
</script>
<style lang="less" scoped>
.like {
  color: orangered;
}
  .comment-item {
    // display: flex;
    .avater {
      width: 36px;
      height: 36px;
      margin-right: 13px;
    }
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    .name {
      font-size: 14px;
      color: #406599;
    }
    .icon-wrap {
      display: flex;
      // justify-content: center;
      align-items: center;
      // .van-icon-good-job-o::before {
      //   content: '\F068';
      //   padding-top: 5px;
      // }
    }
    .content {
      font-size: 16px;
      color: #222;
    }
  }
  .pubdate {
    font-size: 10px;
    margin-right: 10px;
  }
  .reply-wrap {
    display: flex;
    .reply-btn {
      font-size: 4px;
    }
  }
</style>
