<template>
  <div class='user-profile'>
    <!-- 导航栏 -->
    <van-nav-bar
      title="用户信息"
      left-arrow
      @click-left="$router.back()"
      class="app-nav-bar"
    />
    <!-- @change是input本身的事件属性 -->
    <input type="file" hidden ref="file" accept="image/*" @change="onFileChange">
    <!-- /导航栏 -->
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <van-image
        width="30"
        height="30"
        round
        fit="cover"
        :src="currentUser.photo"
        />
    </van-cell>
    <van-cell title="昵称" is-link :value="currentUser.name" @click="isUpdateNmeShow=true" ></van-cell>
    <van-cell title="性别" is-link :value="currentUser.gender===1?'女':'男'" @click="isUpdateGenderShow=true"></van-cell>
    <van-cell title="生日" is-link :value="currentUser.birthday" @click="isUpdateBirthdayShow=true" ></van-cell>
    <!-- 编辑昵称 -->
    <van-popup v-model="isUpdateNmeShow" position="bottom" :style="{ height: '100%' }">
      <!-- 当你传递给子组件的数据既要使用又要修改，例如这里的currentuser,这种情况下我们可以使用v-model简写 -->
      <!-- v-model说明：
      v-model="user.name"默认传递一个名字叫value的数据（:value="user.name）;默认监听input事件，@input="user.name=$event";v-model的本质还是父子组件通信，它仅仅是简化了父组件的使用，但是子组件里的prop里的名字不能乱写，只能写value，并且函数发送的属性名也只能写input，即（this.$emit('input',this.localUser.name) -->
      <!-- v-model只能使用一次 -->

      <!-- 如果有多个数据需要保持同步，使用.sync修饰符，
      :gender = "user.gender"
      @update-gender="user.gender = $event"

      :gender.sync = "user.gender"
      :gender = "user.gender"
      @update：gender="user.gender = $event"
      @update：属性名称=“user.gender = $event"
      当然：子组件也必须配合写
      props中写法：gender: {
    type: Object,
      required: true
    }
 函数中发送命令写法：（this.$emit(update：gender',this.localUser.name)

      我们一般把最常用的数据设计为v-model绑定，把不太常用的数据设计为.sync
      参考文档：https://cn.vuejs.org/v2/guide/components-custom-events.html#sync-%E4%BF%AE%E9%A5%B0%E7%AC%A6

      -->
      <update-name
        @close="isUpdateNmeShow=false"
        v-if="isUpdateNmeShow"
        :currentUser="currentUser"
        @updateNameClose="isUpdateNmeShow=false"
      />
    </van-popup>
    <!-- /编辑昵称 -->

    <!-- 编辑性别 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        @close="isUpdateGenderShow=false"
        v-if="isUpdateGenderShow"
        v-model="currentUser.gender"
        @updateNameClose="isUpdateGenderShow=false"
      />
    </van-popup>
    <!-- /编辑性别 -->
    <!-- 编辑生日 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday
        v-if="isUpdateBirthdayShow"
        v-model="currentUser.birthday"
        @close="isUpdateBirthdayShow=false"
      />
    </van-popup>
    <!-- /编辑生日 -->
    <!-- 编辑用户头像 -->
    <van-popup v-model="isUpdatePhotoShow" position="bottom" style="height:100%" class="update-photo-pop">
      <update-photo
        v-if="isUpdatePhotoShow"
        :file="previewImage"
        @update-photo="currentUser.photo=$event"
        @close="isUpdatePhotoShow=false"
      />
    </van-popup>
    <!-- /编辑用户头像 -->
  </div>
</template>
<script>
import { getUserProfile } from '@/api/user.js'
import updateName from './components/update-name.vue'
import updateGender from './components/update-gender.vue'
import updateBirthday from './components/update-birthday.vue'
import updatePhoto from './components/update-photo.vue'
export default {
  name: 'userProfile',
  components: {
    updateName,
    updateGender,
    updateBirthday,
    updatePhoto
  },
  props: {
  },
  data () {
    return {
      currentUser: {},
      isUpdateNmeShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      previewImage: null // 上传预览图片
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    this.loadCurrentUser()
  },
  mounted () {
  },
  methods: {
    onFileChange () {
      this.isUpdatePhotoShow = true
      const blob = this.$refs.file.files[0]
      this.previewImage = blob
      // 展示弹出层，在弹出层里面预览图片
      // 为了解决相同文件不触发change事件，所以在这里手动的清空file的value
      this.$refs.file.value = ''
    },
    async loadCurrentUser () {
      const { data } = await getUserProfile()
      // console.log(data)
      this.currentUser = data.data
    }
  }
}
</script>
<style lang="less" scoped>
  .update-photo-pop { // 这里不用van-pop自带的类名,因为此页面有两个pop,生日那里也是的
    background-color: #000;
  }
</style>
