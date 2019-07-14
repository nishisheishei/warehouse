<template>
  <div id="app">
    <!--
      路由组件是动态的，默认情况下切换都会销毁重建，状态丢失
      如果想要在切换的时候保留状态，说白了不要销毁，则使用 keep-alive 缓存就可以了
     -->
     <keep-alive>
       <router-view/>
     </keep-alive>
  </div>
  <!--
  注意：
  github 上
  频道管理 - 不要在子组件中修改道具数组 和
  频道管理 - 处理获取其它频道数据的数据格式问题 提交反了
   -->
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>

</style>
