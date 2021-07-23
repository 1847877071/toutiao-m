<template>
  <div class='update-photo'>
    <img :src="image" ref="image" class="image">
    <van-nav-bar
      class="footer-nav-bar"
      left-text="取消"
      right-text="确认"
      left-arrow
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
  </div>
</template>
<script>
import { updateUserPhoto } from '@/api/user.js'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'updatePhoto',
  components: {
  },
  props: {
    file: {
      required: true
    }
  },
  data () {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null // 裁切器实例
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  mounted () {
    // 获取需要裁切的图片 DOM，这里是vue，我们选择ref方法
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
    // cropper.moveTo(-100, -100)
    // setCanvasData({
    //   left: 0,
    //   right: 0,
    //   top: 50%
    // })
    // console.log(this.cropper)
  },
  methods: {
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file)
        })
      })
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidclick: true,
        duration: 0 // 展示时间，0表示持续展示
      })
      const file = await this.getCroppedCanvas() // 这里实际是调用62行的toBlob函数(组件中写的复制过来的),但它不是promise对象,所以上面getCroppedCanvas这个方法就是为了把它包装成promise对象,因为这里要用await!
      // 如果要求Content-Type 是 multipart/form-data，则一定要提交FormData数据对象，专门用于文件上传的，不能提交{}，没用
      const fd = new FormData()
      fd.append('photo', file)
      await updateUserPhoto({
        photo: fd
      })
      this.$toast.success('保存成功')
      // 更新父组件中的用户头像
      this.$emit('update-photo', window.URL.createObjectURL(file))
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
  .footer-nav-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #000;
  }
  .image {
    display: block;
    max-width: 100%;
  }
</style>
// 裁切步骤：1.先安装npm install cropperjs；
// 2.引入样式和cropperjs
// import 'cropperjs/dist/cropper.css'
// import Cropper from 'cropperjs'
// 3.将获取需要裁切的图片 DOM放入到mounted,并修改设置
// 4.注意img标签要放在block块级元素里,并且img的样式设置 display: block;max-width: 100%
// 5.在mounted里加入(因为是获取DOM所以放在mounted里面)
    // 获取需要裁切的图片 DOM，这里是vue，我们选择ref方法
    // const image = this.$refs.image
    // const cropper = new Cropper(image, {
    //   viewMode: 1,
    //   dragMode: 'move',
    //   aspectRatio: 1,
    //   cropBoxMovable: false, // 裁切框不能拖动
    //   cropBoxResizable: false, // 裁切框不能改变大小
    //   background: false,
    //   movable: true
    // })
// 6. 设置黑色背景,子页面设置不了,因为在pop上,所以需要在引用的pop的父页面里
// 7. (要获取文档对象,用await,所以需要包装一个promise对象,)写getCroppedCanvas这个方法并包装成Promise,因为后面要用,拿到在mounted里面裁切到的结果,但是method中不能直接拿mounted里面的数据,所以把cropper放在data中,具体看函数方法,参考了pop文档的,'this.cropper.getCroppedCanvas().toBlob((file) => {'这个就是文档里面的.
// 8. 在onConfirm函数中获取裁切的文件对象file,const file = await this.getCroppedCanvas()
// 9. 更新父组件的头像this.$emit('update-photo', window.URL.createObjectURL(file))
// 10. 到父组件接收更新的头像@update-photo="currentUser.photo=$event"
// 11. 这时选择第二张图片时没有变化,还是前一张的,所以需要让它更新,每次选择都时新的,所以此时直接在父页面使用子页面组件的标签上添加v-if="isUpdatePhotoShow"
