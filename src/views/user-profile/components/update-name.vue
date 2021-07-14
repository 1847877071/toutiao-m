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
        v-model="localName.name"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        :placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>
<script>
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
      localName: this.currentUser
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
    onConfirm () {
      this.$oast('按钮')
    }
  }
}
</script>
<style lang="less" scoped>
  .nav-field-wrap {
    padding: 10px;
  }
</style>
