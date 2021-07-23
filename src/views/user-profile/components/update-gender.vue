<template>
  <div class='update-gender'>
    <van-picker
      show-toolbar
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      :default-index="value"
      @change="onGenderChange"
    />
  </div>
</template>
<script>
import { updateUserProfile } from '@/api/user.js'
export default {
  name: 'updateGender',
  components: {
  },
  props: {
    value: {
      type: Number
    }
  },
  data () {
    return {
      updateNameClose: false,
      columns: ['男', '女'],
      defaultIndex: this.value
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
    // 这个看组件的picker组件里的参数说明，里面有个change事件绑定给标签中，因为要获取Index,所以前面两个参数必须写出来，不然获取不到第三位
    onGenderChange (Picker, value, index) {
      this.defaultIndex = index
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...请勿重复点击！',
        forbidClick: true
      })
      // 请求提交用户性别
      await updateUserProfile({
        gender: this.value
      })
      this.$toast({
        message: '保存成功！'
      })
      this.$emit('input', this.defaultIndex)
      this.$emit('updateNameClose')
    }
  }
}
</script>
<style lang="less" scoped>

</style>
