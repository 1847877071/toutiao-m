<template>
  <div class='search-history'>
    <van-cell
      title="搜索历史"
    >
      <div v-if="isDeleteShow">
        <!-- prop数据如果是引用类型(数组\对象)可以修改,但是这个修改指的是:user.name='jack'\arr.push(123)\arr.splce(0,1)这种,

        但是任何prop数据都不能重新赋值:xxx=xxx
        如果你想要让prop数据=新的数据,
        只能让父组件修改 -->
        <span @click="$emit('update-histories', [])">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow=false">完成</span>
      </div>
      <div v-else @click="isDeleteShow=true">
        <van-icon name="delete"></van-icon>
      </div>
    </van-cell>
    <van-cell :title="history" v-for="(history, index) in searchHistories" :key="index" @click="onDeleteHistory(history,index)">
      <div v-show="isDeleteShow">
        <van-icon name="close"></van-icon>
      </div>
    </van-cell>
  </div>
</template>
<script>
import { setItem } from '@/utils/storage.js'
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
      isDeleteShow: false // 删除按钮显示状态
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
    onDeleteHistory (history, index) {
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
        // 持久化处理
        // 1. 修改本地存储的数据
        // 2. 请求接口删除线上的数据
        // 无论是否登录都先把数据持久化到本地,如果已经登录,则删除线上的历史数据,
        // 没有删除单个历史记录的接口,只有删除所有历史记录的接口
        setItem('search-histories', this.searchHistories)
      } else {
        this.$emit('search', history)
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
