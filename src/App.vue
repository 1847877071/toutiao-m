<template>
  <div id="app">
    <!-- 路由的出口 -->
    <!-- 一级路由的出口，路由表中所有的顶层路由都是以及路由，因为router-view是一级路由出口
    keep-alive仅对该路由出口渲染的组件有效（缓存）（即这里表示只对一级路由出口有效 ，二级路由需要重新加，见layout组件里-->
    <!-- 这里有个问题就是用户登录的信息也会缓存，所以为了解决这个问题，需要进行清除这个缓存，所以就到vuex的store里添加cachePages，添加清除和添加两个方法，并在登录页面111行清除缓存this.$store.commit('removeCachePage', 'layoutIndex')，再到layoutIndex页面的mounted里面添加缓存：this.$store.commit('addCachePage', 'layoutIndex')，详细见那两个页面 -->
    <keep-alive :include="cachePages">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'app',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>

<style lang="less">
</style>
