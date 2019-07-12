<template>
    <!-- <div>home 页面</div> -->
    <div>
      <!-- 导航栏 -->
      <van-nav-bar
          class="login-bar"
          fixed
          title="首页"
      />
      <!-- /导航栏 -->

      <!-- 频道标签 -->
      <van-tabs class="channel-tabs" v-model="activeChannelIndex">
        <van-tab title="标签 1">
          <!--
            下拉刷新组件
            isLoading 控制下拉的 loading 状态
            refresh 下拉之后触发的事件
          -->
          <van-pull-refresh v-model="pullRefreshLoading" @refresh="onRefresh">
            <!--
              中间的内容
              loading 控制加载更多的 loading 状态
              finished 控制是否已加载结束
              onLoad 事件会在滚动到底部区域的时候自动调用，每次 onLoad 他会自动让 loading 为 true
            -->
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                v-for="item in list"
                :key="item"
                :title="item"
              />
            </van-list>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="标签 2">内容 2</van-tab>
        <van-tab title="标签 3">内容 3</van-tab>
        <van-tab title="标签 4">内容 4</van-tab>
      </van-tabs>
      <!-- /频道标签 -->

      <!-- 底部导航 -->
      <van-tabbar>
        <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
        <van-tabbar-item icon="search" to="/qq">问答</van-tabbar-item>
        <van-tabbar-item icon="friends-o" to="/qa">视频</van-tabbar-item>
        <van-tabbar-item icon="setting-o" to="/qaq">我的</van-tabbar-item>
      </van-tabbar>
      <!-- /底部导航 -->
    </div>
</template>

<script>
export default {
  name: 'HomeIndex',
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      finished: false,
      pullRefreshLoading: false
    }
  },

  methods: {
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          // 所有数据加载完毕， 设置finished 为 true
          this.finished = true
        }
      }, 500)
    },
    onRefresh () {
      setTimeout(() => {
        this.$toast('刷新成功')
        this.pullRefreshLoading = false
        this.count++
      }, 500)
    }
  }
}

</script>

<style lang="less" scoped>
.login-bar {
  width: 100%;
  background-color: blue;
  .van-nav-bar__title {
  color: #fff;
  }
}

//  /deep/ 的作用 （深度作业选择器）
// 资料在 vuejs 中
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  top: 92px;
}

.channel-tabs /deep/ .van-tabs__content {
  margin-top: 92px;
}
</style>
