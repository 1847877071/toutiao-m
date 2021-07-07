<template>
  <div class='channel-edit'>
    <!-- 我的频道 -->
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button plain round type="danger" size='mini' @click="
      isEdit=!isEdit">{{isEdit?'完成':'编辑'}}</van-button>
    </van-cell>
    <!-- :class="{active:index===激活的频道}"
    这里active是类名，后面的是条件 -->
    <van-grid :gutter="10">
      <van-grid-item
        v-for="(channel, index) in userChannels"
        :class="{active:index===active}"
        :key="index"
        :text="channel.name"
        :icon="(isEdit&&index!==0)?'clear':''" @click="onUserChannelClick(channel, index)"
      />
    </van-grid>
    <!-- /我的频道 -->
    <!-- 频道推荐 -->
    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item v-for="(channel, index) in recommendChannels" :key="index" :text="channel.name" @click="addChannel(channel)"/>
    </van-grid>
    <!-- /频道推荐 -->
  </div>
</template>
<script>
import { getAllChannels, addChannel, deleteChannel } from '@/api/user.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  name: 'channelEdit',
  components: {
  },
  props: {
    userChannels: [],
    // userChannels: {
    //   type: Object,
    //   required: true
    // }
    active: {
      type: Number,
      requried: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  computed: {
    ...mapState(['user']), // 这样就将user映射到本地了
    // 一般已有一些数据,需要衍生一些数据时,放在computed里
    // 计算属性会观测内部依赖数据的变化而重新求值
    // 推荐的频道列表
    recommendChannels () {
      // 思路:所有频道-我的频道=推荐频道
      // filter方法:过滤数据,根据方法返回的布尔值true来收集数据
      // filter方法查找满足条件的所有元素
      return this.allChannels.filter(channel => {
        // 判断channel是否属于用户频道
        // find方法查找满足条件的单个元素
        return !this.userChannels.find(userChannel => {
          // 找到满足该条件的元素
          return (userChannel.id === channel.id)
        })
      })
    }
  },
  watch: {
  },
  created () {
    this.loadAllChannels()
  },
  mounted () {
  },
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async addChannel (channel) {
      this.userChannels.push(channel)
      // TODO:数据持久化
      if (this.user) {
        // 传到网上
        await addChannel({
          channels: [{
            id: channel.id,
            seq: this.userChannels.length
          }]
        })
      } else {
        // 传到本地
        setItem('user-channels', this.userChannels)
      }
    },
    onUserChannelClick (channel, index) {
      if (this.isEdit) {
        // 编辑状态,删除频道
        this.deleteChannel(channel, index)
      } else {
        // 非编辑状态,切换频道
        this.switchChannel(index)
      }
    },
    async deleteChannel (channel, index) {
      if (index <= this.active) {
        this.$emit('updateIndex', this.active - 1)
      }
      this.userChannels.splice(index, 1)
      // 数据持久化
      if (this.user) {
        // 传到网上
        await deleteChannel(channel.id)
      } else {
        // 传到本地
        setItem('user-channels', this.userChannels)
      }
    },
    switchChannel (index) {
      console.log('切换频道')
      this.$emit('close')
      this.$emit('updateIndex', index)
    }

  }
}
</script>
<style lang="less" scoped>
  .channel-edit {
    margin-top: 54px;
    .channel-title {
      font-size: 16px;
      color: #333;
    }
    /deep/.van-grid-item__icon {
      position: absolute;
      top: -5px;
      right:-5px;
      color: red;
      font-size: 20px;
    }
    /deep/.active {
      .van-grid-item__text {
       color: red !important;
      }
    }
  }
  .van-grid-item {
    width: 80px;
    height: 43px;
    /deep/.van-grid-item__content {
      background: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
  }
</style>
