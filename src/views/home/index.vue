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
        <!-- 频道标签上的字体图标 -->
        <div slot="nav-right" class="nav-right" @click="isChannelShow = true">
          <van-icon name="wap-nav" />
        </div>
        <van-tab
          v-for="channelItem in channels"
          :key="channelItem.id"
          :title="channelItem.name"
        >
          <!--
            下拉刷新组件
            isLoading 控制下拉的 loading 状态
            refresh 下拉之后触发的事件
          -->
          <van-pull-refresh
            v-model="channelItem.pullRefreshLoading"
            @refresh="onRefresh"
            :success-text="channelItem.pullSuccessText"
            :seccess-duration="1000"
            >
            <!--
              中间的内容
              loading 控制加载更多的 loading 状态
              finished 控制是否已加载结束
              onLoad 事件会在滚动到底部区域的时候自动调用，每次 onLoad 他会自动让 loading 为 true
            -->
            <van-list
              v-model="channelItem.upLoading"
              :finished="channelItem.finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
            <!-- 列表内容 -->
              <van-cell
                v-for="item in channelItem.articles"
                :key="item.art_id.toString()"
                :title="item.title"
              >
                <div slot="label">
                  <template v-if="item.cover.type">
                    <van-grid :border="false" :column-num="3">
                      <van-grid-item v-for="(img, index) in item.cover.images" :key="index">
                        <van-image :src="img" lazy-load />
                      </van-grid-item>
                    </van-grid>
                  </template>
                  <p>
                    <span>{{ item.aut_name }}</span>
                    &nbsp;
                    <span>{{ item.comm_count }}评论</span>
                    &nbsp;
                    <!-- <span>{{ relativeTime(item.pubdate) }}</span> -->
                    <!--
                      | relativeTime 就是在调用过滤器函数
                      过滤器函数接收的参数就是 | 前面的 item.pubdate
                      过滤器函数返回值会输出到这里
                    -->

                    <!--
                      过滤器说白了就是函数，在模板中调用函数的另一种方式
                      一般用于格式化输出内容，其中不会有太多业务逻辑，一般都是对字符串的格式化处理
                      过滤器可以定义到：
                        全局：Vue.filter('过滤器名称')，可以在任何组件中使用
                        局部：filters 选项，只能在组件内部使用
                    -->
                    <span>{{ item.pubdate | relativeTime }}</span>
                    <!-- 这里更多操作的点击按钮 -->
                    <van-icon class="close" name="close" @click="handleShowMoreAction(item)" />
                  </p>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </van-tab>
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

      <!-- 频道组件 -->
      <!--
        :value='isChannelShow'
        @input='isChannelShow = $event'

        :user-channels='channels' 父传子

        @update-user-channels="channels.push($event)"
        .sync 修饰符会自动监听一个事件：
        v-on:update:user-channels="channels = $event"的简写
       -->
       <!--
         过滤器说白了就是函数，在模板中调用函数的另一种方式
         一般用于格式化输出内容，其中不会有太多业务逻辑，一般都是对字符串的格式化处理
         过滤器可以定义到：
            全局： Vue.filter('过滤器名称')， 可以在任何组件中使用
            局部： filters 选项，只能在组件内部使用
        -->
      <home-channel
        v-model="isChannelShow"
        :user-channels.sync='channels'
        :active-index.sync="activeChannelIndex"
      />
      <!-- /频道组件 -->

      <!-- 更多操作弹窗 -->
      <van-dialog
        v-model="isMoreActionShow"
        :show-confirm-button="false"
        closeOnClickOverlay
        :before-close="handleMoreActionClose"
      >
        <van-cell-group v-if="!toggleRubbish">
          <van-cell icon="arrow-left" @click="isMoreActionShow = false" />
          <van-cell title="不感兴趣" icon="location-o" @click="handleDislick" />
          <van-cell title="反馈垃圾内容" icon="close" is-link @click="toggleRubbish = true" />
          <van-cell title="拉黑作者" icon="delete" @click="handleAddBlacklist" />
        </van-cell-group>
        <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="toggleRubbish = false" />
          <van-cell
            v-for="item in repotTypes"
            :key="item.value"
            :title="item.label"
            @click="handleReportArticle(item.value)"
          />
        </van-cell-group>
      </van-dialog>
      <!-- /更多操作弹窗 -->
    </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
import { getArticles, dislikesArticle, reportArticle } from '@/api/article'
import HomeChannel from './components/channel'
import { addBlacklists } from '@/api/user'

export default {
  name: 'HomeIndex',
  components: {
    HomeChannel
  },
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false,
      // finished: false,
      // pullRefreshLoading: false,
      // 获取用户频道列表
      channels: [],
      isChannelShow: false, // 控制频道面板的显示状态
      isMoreActionShow: false, // 控制更多操作弹框面板
      toggleRubbish: false, // 控制反馈垃圾
      currentArticle: null, // 存储当前操作更多的文章
      // 0-其他问题，1-标题夸张，2-低俗色情，3-错别字多，4-旧闻重复，5-广告软文，6-内容不实，7-涉嫌违法犯罪，8-侵权'
      repotTypes: [
        { value: '1', label: '标题夸张' },
        { value: '2', label: '低俗色情' },
        { value: '3', label: '错别字多' },
        { value: '4', label: '旧闻重复' },
        { value: '5', label: '广告软文' },
        { value: '6', label: '内容不实' },
        { value: '7', label: '涉嫌违法犯罪' },
        { value: '8', label: '侵权' },
        { value: '0', label: '其他问题' }
      ]
    }
  },
  //  注册在全局了
  // filters: {
  //   relativeTime (val) {
  //     return dayjs().from(dayjs(val))
  //     return 123
  //   }
  // },

  async created () {
    await this.loadChannels()

    /**
       * 初始加载第一项频道的数据列表
       * 注意：务必在记载频道之后
       */
    // this.loadArticles()
  },

  computed: {
    activeChannel () {
      return this.channels[this.activeChannelIndex]
    }
  },

  watch: {
    /**
     * 监视容器中的 user 的状态，只要 user发生改变，那么久重新获取频道列表
     * 注意： 凡是能 this. 点出来的东西都可以被监视
     */
    async '$store.state.user' () {
      // 重新加载频道数据
      await this.loadChannels()

      // 由于重新加载了频道数据，所以文章内容也都被清空了
      // 而且上拉加载更多的 onLoad 没有主动触发

      // 我们在这里可以手动的触发上拉加载更多的 onLoad
      // 提示：只需要将当前激活频道的上拉 loading 设置为 true，它会自动调用自己的 onLoad 函数
      // 注意：这里肯定有别的东西影响了，没有自动调用 onLoad
      this.activeChannel.upLoading = true
      // 自己调用一下
      this.onLoad()
    }
  },

  methods: {
    // 上拉加载更多，应该往频道的 articles 中最后 push 数据
    //  onLoad 一上来就会自动调用，当请求的数据不够一屏的时候，它会多次调用
    //  onLoad 会自动开启加载 loading 效果
    async onLoad () {
      await this.$sleep(800)
      const articles = await this.loadArticles()

      // 将请求得到的数据放入频道文章列表中
      this.activeChannel.articles.push(...articles)

      // 数据加载好以后，让 loading 结束
      this.activeChannel.upLoading = false
    },
    // 下拉刷新，应该往频道的 articles 中顶部 unshift 增量
    async onRefresh () {
      // 获取最新数据
      const data = await getArticles({
        channelId: this.activeChannel.id,
        timestamp: Date.now(),
        withTop: 1
      })

      // 如果有最新数据
      if (data.results.length) {
        // 将最新数据重置到当前频道
        this.activeChannel.articles = data.results
        this.activeChannel.timestamp = data.pre_timestamp

        this.activeChannel.pullSuccessText = '更新完成'

        // 因为最新数据无法撑满一页，所以使用加载更多在请求一次
        this.onLoad()
      }

      this.activeChannel.pullSuccessText = '暂无数据更新'

      // 无论如何，最后都关闭加载状态
      this.activeChannel.pullRefreshLoading = false
    },

    // 获取用户频道列表
    async loadChannels () {
      let channels = []
      // 1,得到频道数据
      const { user } = this.$store.state

      // 如果已登录，则请求用户频道列表
      if (user) {
        channels = (await getUserChannels()).channels
      } else {
        // 如果没有登录
        // 判断是否有本地存储的频道列表
        const localChannels = JSON.parse(window.localStorage.getItem('channels'))
        // 如果有，则使用
        if (localChannels) {
          channels = localChannels
        } else {
          // 如果没有则请求获取推荐的默认频道列表
          channels = (await getUserChannels()).channels
        }
      }
      // 2. 扩展频道数据满足其他业务需求
      channels.forEach(item => {
        // 频道的文章
        item.articles = []
        // 用于下页频道数据的时间戳
        item.timestamp = Date.now()
        // 控制该频道上拉加载是否已加载完毕
        this.finished = false
        // 控制该频道的下拉刷新 loading
        item.upLoading = false
        // 控制频道列表的下拉刷新状态
        item.pullRefreshLoading = false
        // 控制频道列表的下拉刷新成功提示文字
        item.pullSuccessText = ''
      })

      this.channels = channels
    },
    // async loadChannels () {
    //   try {
    //     let channels = []
    //     const localChannels = window.localStorage.getItem('channels')

    //     // 如果有本地存储的频道列表，则使用本地的
    //     if (localChannels) {
    //       // this.channels = localChannels
    //       channels = localChannels
    //     } else {
    //       // this.channels = (await getUserChannels()).channels
    //       channels = (await getUserChannels()).channels
    //     }

    //     // 对频道中的数据统一处理以供页面使用
    //     channels.forEach(item => {
    //       // 频道的文章
    //       item.articles = []
    //       // 用于下页频道数据的时间戳
    //       item.timestamp = Date.now()
    //       // 控制该频道上拉加载是否已加载完毕
    //       this.finished = false
    //       // 控制该频道的下拉刷新 loading
    //       item.upLoading = false
    //       // 控制频道列表的下拉刷新状态
    //       item.pullRefreshLoading = false
    //       // 控制频道列表的下拉刷新成功提示文字
    //       item.pullSuccessText = ''
    //     })

    //     this.channels = channels
    //   } catch (err) {
    //     console.log(err)
    //   }
    // },

    async loadArticles () {
      const { id: channelId, timestamp } = this.activeChannel
      try {
        const data = await getArticles({
          channelId,
          timestamp,
          withTop: 1
        })

        // 如果没有最新数据，则请求上一次的数据
        if (data.pre_timestamp && data.results.length === 0) {
          // 将最近的推荐数据请求的时间戳更新到频道中
          this.activeChannel.timestamp = data.pre_timestamp
          return this.loadArticles()
        }

        if (data.results.length) {
          this.activeChannel.timestamp = data.pre_timestamp
          return data.results
        }
      } catch (err) {
        console.log(err)
      }
    },

    // 处理显示更多操作弹窗面板
    handleShowMoreAction (item) {
      // 将点击操作更多的文章存储起来，用于后续使用
      this.currentArticle = item

      // 显示弹框
      this.isMoreActionShow = true
    },

    // 弹框中的不感兴趣
    async handleDislick () {
      // 拿到操作的文章 id
      const articleId = this.currentArticle.art_id.toString()

      // 请求完成操作
      await dislikesArticle(articleId)

      // 隐藏对话框
      this.isMoreActionShow = false

      // 当前频道文章列表
      const articles = this.activeChannel.articles

      // // 找到不喜欢的文章位于文章中的索引
      // // findIndex 是一个数组方法，它会遍历数组，找到满足 item.id === articleId 条件的数据 id
      const delIndex = articles.findIndex(item => item.art_id.toString() === articleId)
      // 获取到的id
      // console.log(delIndex)
      // // 把本条数据移除
      articles.splice(delIndex, 1)

      this.$toast('已移除')
    },

    // 拉黑作者
    async handleAddBlacklist () {
      await addBlacklists(this.currentArticle.aut_id)
      // 隐藏对话框
      this.isMoreActionShow = false

      this.$toast('拉黑作者')
    },

    // 反馈垃圾内容
    async handleReportArticle (type) {
      // console.log(type)
      try {
        await reportArticle({
          articleId: this.currentArticle.art_id.toString(),
          type,
          remark: ''
        })
        this.isMoreActionShow = false
        this.$toast('举报成功')
      } catch (err) {
        // console.log('反馈失败')
        if (err.response.status === 409) {
          this.$toast('该文章已被举报！')
        }
      }
    },

    /**
     * 该函数会在关闭对话的时候被调用
     * 我们可以在这里加入一些关闭之前的逻辑
     * 如果设置了这个函数，那么最后必须手动的 done 才会关闭对话框
     */
    handleMoreActionClose (action, done) {
      // console.log(1)
      done()
      window.setTimeout(() => {
        this.toggleRubbish = false
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
.channel-tabs .nav-right {
  position: sticky;
  right: 0px;
  display: flex;
  align-items: center;
  background-color: #fff;
}
.channel-tabs .close {
  float: right;
  font-size: 30px;
}
</style>
