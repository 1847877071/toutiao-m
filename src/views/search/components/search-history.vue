<template>
  <div class='search-history'>
    <van-cell
      title="搜索历史"
    >
      <div>
        <span>全部删除</span>
        &nbsp;&nbsp;
        <span>完成</span>
      </div>
      <div>
        <!-- <van-icon name="delete"></van-icon> -->
      </div>
    </van-cell>
    <van-cell :title="history" v-for="(history, index) in searchHistories" :key="index" @click="$emit('search', history)">
      <div>
        <van-icon name="close"></van-icon>
      </div>
    </van-cell>
  </div>
</template>
<script>
export default {
  name: 'searchHistory',
  components: {
  },
  props: {
    searchHistories: {
      type: Array,
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

</style>
