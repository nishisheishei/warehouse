<template>
  <div id="app">
    <!--
      路由组件是动态的，默认情况下切换都会销毁重建，状态丢失
      如果想要在切换的时候保留状态，说白了不要销毁，则使用 keep-alive 缓存就可以了
     -->
     <keep-alive>
       <router-view/>
     </keep-alive>

     <!--
       当你给 router-view 没有设置 keep-alive 的话，每个页面都会重新创建（离开销毁，进来创建）
       但是当你设置了keep-alive，就会缓存起来，只有第 1 次才会触发那些生命周期，包括原来的数据之类的都会缓存起来

       watch 可以应对 x 路由 导航到 y 路由，这两使用的同一个组件，wacth 可以很好处理
       但是，当你把路由组件给 keep-alive 了以后，组件不会销毁了，哪怕你导航到别的组件路由，也给 wacth 到了

       如果你没有开启 keep-alive，则使用 wacth 就够了
       假如使用了 keep-alive，没理解
       如果两个一起使用的时候 ， 那么 wacth 就会缓存 同一个组件的路由
      -->
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
