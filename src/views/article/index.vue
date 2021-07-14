<template>
  <div class='article-container'>
    <!-- 导航栏 -->
    <van-nav-bar
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
      class="app-nav-bar"
      type="info"
    />
    <!-- /导航栏 -->
    <div class="middle-container">
      <!-- 用户信息 -->
      <h1 class="title">{{article.title}}</h1>
      <van-cell center class="user-info">
        <div
          slot="title"
          class="userName">{{article.aut_name}}</div>
        <van-image
          slot="icon"
          class="avater"
          round
          fit="cover"
          :src="article.aut_photo"
        />
        <div class="pubdate" slot="label">{{article.pubdate | relativeTime}}</div>
        <van-button
          :icon="article.is_followed?'':'plus'"
          :type="article.is_followed?'default':'info'"
          round
          class="follow-btn"
          size="small"
          :loading="isFollowLoading"
          @click="onFollow"
        >{{article.is_followed?'已关注':'关注'}}</van-button>
      </van-cell>
      <!-- /用户信息 -->
      <!-- 文章正文 -->
      <div class="markdown-body" v-html="article.content" ref="article-content">
      </div>
      <van-divider
        :style="{ color: '#000', borderColor: '#888', padding: '0 16px' }"
      >
        全部评论
      </van-divider>
      <commentIndex :source = articleId :commentList="commentList" @total-count="totalCommentCount=$event" @reply-click="onReplyClick" />
      <!-- /文章正文 -->
    </div>
    <!-- 底部区域 -->
    <div class="footer">
      <van-cell center>
        <van-button
          class="write-btn"
          type='default'
          round
          size="mini"
          @click="isPostShow = true"
        >
        写评论
        </van-button>
        <ul>
          <li><van-icon
          class="comment-icon"
          color="#777"
          name="comment-o"
          :badge="totalCommentCount" /></li>
          <li>
            <van-icon
              @click="onCollected"
              :color="article.is_collected ? 'orange' : '#777'"
              :name="article.is_collected ? 'star' : 'star-o'"
              />
          </li>
          <li><van-icon
            :color="article.attitude===1?'orange':'#777'"
            :name="article.attitude===1?'good-job':'good-job-o'"
            @click="onAttitude"
          /></li>
          <li><van-icon color="#777" name="share" /></li>
        </ul>
      </van-cell>
    </div>
    <!-- /底部区域 -->
    <!-- 评论区域 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
      <post-comment :targetId="articleId" @post-success="onPostSuccess" />
    </van-popup>:targetId="articleId"
    <!-- /评论区域 -->
    <!-- 回复评论弹出区域 -->
    <van-popup
      v-model="isReplyShow"
      position="bottom"
    >
      <!-- 这里使用v-if的目的是让组件随着弹出层的显示进行渲染和销毁，防止加载过的组件不重新渲染导致数据不会重新加载的问题 -->
      <reply-comment
        v-if="isReplyShow"
        @close="isReplyShow=false"
        :comment="replyCommentclick"
        :targetId="articleId"
      />
    </van-popup>
    <!-- /回复评论弹出区域 -->
  </div>
</template>
<script>
import { getArticleById, addCollected, deleteCollected, addattitude, deleteattitude } from '@/api/article.js'
import { ImagePreview } from 'vant'
import { AddFollow, deleteFollow } from '@/api/user.js'
import commentIndex from './components/comment.vue'
import postComment from './components/post-comment.vue'
import replyComment from './components/reply-comment.vue'
// import JSONbig from 'json-bigint'
// 在组件中获取动态路由参数:
// 方式1: this.$route.params.articleId // 这里可以在网页vue中看到下面有个route参数
// 方式2: props传参,推荐
export default {
  name: 'articleIndex',
  components: {
    commentIndex,
    postComment,
    replyComment
  },
  props: {
    articleId: {
      type: [String, Object, Number], // 可能是多种类型
      required: true
    }
  },
  data () {
    return {
      replyCommentclick: {},
      isReplyShow: false, // 评论回复弹窗展示
      totalCommentCount: 0, // 评论总数量
      commentList: [],
      isPostShow: false, // 控制发布评论的显示状态
      isCollectedLoading: false,
      isFollowLoading: false, // 关注点击的加载状态
      article: {} // 文章数据对象
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    this.loadArticleById()
  },
  mounted () {
  },
  methods: {
    onReplyClick (comment) {
      this.isReplyShow = true
      this.replyCommentclick = comment
      // console.log(comment)
    },
    onPostSuccess (comment) {
      this.commentList.unshift(comment)
      this.totalCommentCount++
      this.isPostShow = false
    },
    async onAttitude () {
      this.$toast({
        message: '操作中.....',
        forbidClick: true // 禁止背景被点击
      })
      if (this.article.attitude === 1) {
        // 等于1,已点赞,点击取消点赞
        await deleteattitude(this.articleId)
        this.article.attitude = -1
      } else {
        await addattitude(this.articleId)
        this.article.attitude = 1
      }
    },
    async onCollected () {
      this.$toast.loading({
        message: '操作中...',
        forbidClick: true // 禁止背景被点击
      })
      // this.isCollectedLoading = true
      if (this.article.is_collected) {
        // 如果已收藏,点击就取消收藏
        await deleteCollected(this.articleId)
      } else {
        // 如果没有收藏,点击就收藏
        await addCollected(this.articleId)
      }
      this.article.is_collected = !this.article.is_collected
      // this.isCollectedLoading = false
      this.$toast(`${this.article.is_collected ? '' : '取消'}收藏成功`)
      // this.$toast(`${this.article.is_collected ? '收藏成功' : '取消收藏成功'}`)
    },
    async onFollow () {
      this.isFollowLoading = true
      // 如果已经关注,点击就取消
      // 如果是没有关注,点击就关注
      if (this.article.is_followed) {
        await deleteFollow(this.article.aut_id)
        this.article.is_followed = false
      } else {
        await AddFollow(this.article.aut_id)
        this.article.is_followed = true
      }
      // this.article.is_followed = !this.article.is_followed
      this.isFollowLoading = false
    },
    async loadArticleById () {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data
      // 获取文章内容DOM容器
      // 得到所有的img标签
      // 循环img列表，给img注册点击事件
      // 在事件处理函数中调用ImagePreview(函数)预览
      this.$nextTick(() => {
        const articleContent = this.$refs['article-content']
        const imgs = articleContent.querySelectorAll('img')
        const imgPaths = [] // 收集所有图片路径
        imgs.forEach((img, index) => {
          imgPaths.push(img.src)
          img.onclick = function () {
            ImagePreview({
              images: imgPaths,
              startPosition: index
            })
          }
        })
      })

      // 数据改变影响视图更新(DOM数据)不是立即的
      // 所以我们如果需要在修改数据之后马上操作被该数据影响的视图DOM,需要把这个代码放到$nextTick中
      // this.$nextTick是Vue提供的一个方法
      // this.$nextTick(() => {
      //   this.handlePreViewImage()
      // })
    }
    // handlePreViewImage () {
    //   // 获取DOM节点
    //   const articleContent = this.$refs['article-content']
    //   const imgs = articleContent.querySelectorAll('img')
    //   const imgPaths = []
    //   imgs.forEach((img, index) => {
    //     imgPaths.push(img.src)
    //     img.onclick = function () {
    //       console.log(1111)
    //       ImagePreview({
    //         images: imgPaths,
    //         startPosition: index
    //       })
    //     }
    //   })
    // }
  }
}
</script>
<style lang="less" scoped>
  .title {
    font-size: 22px;
    color: #3a3a3a;
    padding: 14px;
    background-color: #fff;
    margin: 0;
  }
  .middle-container {
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 46px;
    overflow-y: auto;
  }
  .article-container {
    .user-info {
      .avater {
        width: 35px;
        height: 35px;
        margin-right: 8px;
      }
      .name {
        font-size: 12px;
        color: #333;
      }
      .pubdate {
        font-size: 11px;
        color: #b4b4b4
      }
      .follow-btn {
        width: 85px;
        height: 29px;
      }
    }
  }
  .markdown-body {
    padding: 14px;
    background-color: #fff;
  }
  .footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    ul {
      float: right;
    }
    li {
      float: left;
      list-style-type: none;
      width: 45px;
      line-height: 40px;
    }
    .write-btn {
      width: 160px;
      // float: left;
      border: 1px solid #ccc;
    }
    .van-icon {
      font-size: 20px;
    }
    .comment-icon {
      bottom: -2px;
    }
    .share-icon {
      bottom: -10px;
    }
  }
</style>
