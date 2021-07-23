<template>
  <div class='update-name'>
    <van-nav-bar title="昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    >
    </van-nav-bar>
    <div class="nav-field-wrap">
      <van-field
        v-model="localUser.name"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user.js'
export default {
  name: 'updateName',
  components: {
  },
  props: {
    currentUser: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      localUser: this.currentUser
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
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...请勿重复点击！',
        forbidClick: true
      })
      try {
        await updateUserProfile({
          name: this.localUser.name
        })
        this.$toast({
          message: '保存成功！'
        })
        // this.$emit('updateName', this.localUser.name)
        this.$emit('updateNameClose')
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast({
            message: '此名字太抢手了，已被占用！'
          })
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .nav-field-wrap {
    padding: 10px;
  }
</style>
