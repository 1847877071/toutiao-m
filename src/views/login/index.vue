<template>
  <div class='login-container'>
    <!-- 导航栏 -->
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="$router.back()"
      class="app-nav-bar"
    />
    <!-- /导航栏 -->
    <!-- /导航栏 -->
    <!-- 登录表单 -->
    <!-- 基于Vant的表单验证：
    1、使用van-form组件包裹所有的表单项van-field
    2、给van-form绑定submit事件，当表单提交的时候会触发submit事件。
      提示：只有表单验证通过，它才会调用submit
    3、使用Field的rules属性帝国一校验规则 -->
    <van-form
      :show-error="false"
      :show-error-message="false"
      validate-first
      @submit="onLogin"
      @failed="onFailed"
      ref="login-form"
    >
      <van-field
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        name="mobile"
        placeholder="请输入手机号"
        :rules="formRules.mobile"
      />
      <van-field
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        name="code"
        class="form-code"
        placeholder="请输入验证码"
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down v-if="isCountDownShow" :time="time" format="ss s" @finish="isCountDownShow=false" />
          <van-button v-else class="send-btn" size="mini" @click.prevent="onSendSms" :loading="isSendSmsLoading" round>发送验证码</van-button>
        </template>
      </van-field>
    <div class="login-btn-wrap">
      <van-button type="info" class="login-btn" block>登录</van-button>
    </div>
    </van-form>
    <!-- /登录表单 -->
  </div>
</template>
<script>
import { login, sendSms } from '@/api/user.js'
import { Toast } from 'vant'
export default {
  name: 'loginIndex',
  components: {
  },
  props: {
  },
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      formRules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      time: 1000 * 6,
      isCountDownShow: false, // 控制倒计时和发送按钮的显示状态
      isSendSmsLoading: false
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
    async onLogin () {
      Toast.loading({
        message: '加载中...', // 提示文本
        forbidClick: true, // 加载中禁止背景点击
        duration: 0 // 展示时长（ms),值为0时，toast不会消失
      })
      // 找到数据接口
      // 封装请求方法
      // 请求调用登录
      try {
        const res = await login(this.user)
        // 处理响应结果
        console.log(res)
        Toast.success('展示成功提示')
        // 将后端返回的用户登录状态（token等数据）放到Vuex容器中
        this.$store.commit('setUser1', res.data.data)
        // 登录成功，跳转回原来页面
        this.$router.back() // 先用这种方式，但是它不太好
      } catch (err) {
        console.log(err)
        Toast.fail('登陆失败，手机号或者验证码错误')
      }
    },
    onFailed (err) {
      if (err.errors[0]) {
        Toast({
          message: err.errors[0].message,
          position: 'top' // 防止手机键盘太高看不见
        })
      }
    },
    async onSendSms () {
      try {
        // 校验手机号码
        await this.$refs['login-form'].validate('mobile')
        // 验证通过，请求发送验证码
        await sendSms(this.user.mobile)
        // console.log(data)
        this.isSendSmsLoading = true // 展示按钮的Loading状态，防止网络慢用户多次点击触发送行为
        // 短信发出去了，显示倒计时
        this.isCountDownShow = true
        // 倒计时结束->隐藏倒计时，显示发送按钮
        // 隐藏倒计时，显示发送按钮（监视倒计时的finish事件处理）
      } catch (error) {
        // try里面任何代码的错误都会进入catch
        // 不同的错误需要有不同的提示，那就需要判断了
        // console.dir(error) // 这里可以看到具体的错误，并且能够看到代码，详细见“验证码请求错误图”
        let message = ''
        if (error && error.response && error.response.status === 429) {
          // 发送短信失败的错误提示：一分钟内发一次，频繁错误提示
          message = '发送太频繁了，请稍后再试'
        } else if (error.name === 'mobile') {
          // 表单验证失败的错误提示
          message = error.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        // 提示用户
        Toast({
          message,
          position: 'top'
        })
      }
      // 无论发送验证码成功还是失败，最后都要关闭发送按钮的load定状态
      this.isCountDownShow = false
      // 校验手机号码
      // 验证通过->请求发送验证码->用户接收短信->输入验证码->请求登录
      // 请求发哦那个验证码->隐藏发送按钮，显示倒计时
      // 倒计时结束->隐藏倒计时，显示发送按钮
    }
  }
}
</script>
<style lang="less" scoped>
.login-container {
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
  .form-code {
    align-items: center;
  }
  .send-btn {
    width: 76px;
    height: 23px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666;
    }
  }
}
</style>
