<template>
  <div class='user-chat'>
    <van-nav-bar
      title="小智同学"
      left-text="返回"
      left-arrow
      class="app-nav-bar"
      @click-left="$router.back()"
    />
    <van-cell-group class="message-list" ref="message-list">
      <van-cell :title="item.msg" v-for="(item, index) in messages" :key="index"/>
    </van-cell-group>
    <van-cell-group class="cend-message-wrap" center>
      <van-field v-model="message" placeholder="请输入消息内容" :border="false"/>
      <van-button size="small" type="primary" class="send-btn" @click="onSend">发送</van-button>
    </van-cell-group>
  </div>
</template>
<script>
import { getItem, setItem } from '@/utils/storage.js'
import io from 'socket.io-client' // 加载客户端
// const socket = io('http://ttapi.research.itcast.cn') // 建立连接
// 监听事件，要等组件渲染出来，所以这个放到created里面，看created里面
// socket.on('connect', function(){
//   // 表示建立成功了
// })
// // socket.on('event', function(data){
// //   // 这个方法是收到了某个事件，没啥用
// // })
// socket.on('disconnect', function(){
//   // 断开连接了
// })
// window.socket = socket // 控制台不能访问全局变量，这样写了，控制台就可以访问socket了
// 发送消息
// socket.emit('消息类型', 消息内容)
// // 接收消息
// socket.on('消息类型', function(data) {data消息})
export default {
  name: 'userChat',
  components: {
  },
  props: {
  },
  data () {
    return {
      message: '',
      socket: null, // WebSocket通信对象
      messages: getItem('chat-messages') || [] // 消息列表
    }
  },
  computed: {
  },
  watch: {
    messages () {
      setItem('chat-messages', this.messages)
      // 数据改变影响视图更新这件事不是立即的,(我发的消息能立即看见，机器人对方回复的不能够在编辑框上看到，向下滑动才能看到)
      // 如果你要在操作数据之后立即操作数据应先滚动视图DOM，那么最好把代码放到nextTick函数中
      this.$nextTick(() => {
        this.scrollToBottom() // 监视数据变化，让滚动到底部
      })
    }
  },
  created () {
    const socket = io('http://ttapi.research.itcast.cn') // 建立连接
    this.socket = socket
    socket.on('connect', () => {
    // 表示建立成功了
      console.log('连接成功了')
    })
    // socket.on('event', function(data){
    //   // 这个方法是收到了某个事件，没啥用
    // })
    socket.on('disconnect', () => {
      // 断开连接了
      console.log('连接已断开')
    })
    window.socket = socket // 控制台不能访问全局变量，这样写了，控制台就可以访问socket了 socket.emit('message', {msg: 'hello',timestamp: Date.now()})
    // 监听message事件，接收服务端消息
    socket.on('message', data => { // 这里message是接口文档中说明的
      // 把对方发给我的消息放到数组中
      this.messages.push(data)
    })
    // 以上都用箭头函数，不然this就不是指向vue实例了
  },
  mounted () {
    this.scrollToBottom() // 因为要操作DOM所以放在这里
  },
  methods: {
    onSend () {
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      this.socket.emit('message', data)
      // 把用户发出的信息存储到messages数组中，方便对话框遍历展示
      this.messages.push(data)
      // 清空输入框
      this.message = ''
    },
    scrollToBottom () {
      const list = this.$refs['message-list']
      list.scrollTop = list.scrollHeight
    }
  }
}
</script>
<style lang="less" scoped>
  .message-list {
    position: fixed;
    top: 47px;
    bottom: 44px;
    left: 0px;
    right: 0px;
    overflow-y: auto;
  }
  .cend-message-wrap {
    align-items: center;
    padding: 0 14px;
    display: flex;
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    .send-btn {
      width: 46px;
    }
  }
</style>
