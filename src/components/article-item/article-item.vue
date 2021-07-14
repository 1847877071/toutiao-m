<template>
  <div class='article-item'>
    <van-cell :to="{
      name: 'article',
      params: {
        articleId: article.art_id
      }
    }">
      <div slot="title" class="title van-multi-ellipsis--l3">{{article.title}}</div>
      <div slot="label">
        <div v-if="article.cover.images.length === 3" class="cover-wrap">
          <div
            class="cover-wrap-item"
            v-for="(image, index) in article.cover.images"
            :key="index"
          >
            <van-image
              class="cover-item"
              fit="cover"
              :src="image"
            />
          </div>
        </div>
        <div class="label-wrap">
          <span>{{ article.aut_name }}</span>
          <span>{{article.comm_count}}</span>
          <span>{{ article.pubdate | relativeTime }}</span>
        </div>
      </div>
      <!-- 默认的插槽名字交default,可以省略 -->
      <van-image
        v-if="article.cover.images.length === 1"
        fit="cover"
        :src="article.cover.images[0]"
      />
    </van-cell>
    <!-- <van-cell :border="false" title="单元格" value="内容" /> -->
  </div>
</template>
<script>
export default {
  name: 'articleItem',
  components: {
  },
  props: {
    article: {
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
  }
}
</script>
<style lang="less" scoped>
  .title {
    font-size: 16px;
    color: #3a3a3a;
  }
  .label-wrap {
    font-size: 11px;
    color: #b4b4b4;
    span {
      &:not(:last-child) {
        padding-right: 12px;
      }
    }
  }
  /deep/.van-cell__value {
    flex: unset;
    margin-left: 11px;
    width: 116px;
    height: 73px;
    .van-image__img {
      width: 116px;
      height: 73px;
    }
  }
  .cover-wrap {
    padding: 15px 0;
    display: flex;
    .cover-wrap-item {
      flex: 1; // 均分排在一行
      height: 73px;
      &:not(:last-child) {
        padding-right:4px;
      }
      .cover-item {
        width: 100%;
        height: 73px;
      }
    }
  }
</style>
