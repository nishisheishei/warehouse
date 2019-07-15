<template>
<!--
    v-model 是：
        v-bind：value="数据"
        v-on：input="数据 = $event" 的缩写

    @input="handleInput"
    handleInput (e) {
        console.log('handleInput => s', e)
        this.$emit('input', e)
    }
    等价于
    @input="$emit('input', $event)"
 -->
    <van-popup
        :value="value"
        @input="$emit('input', $event)"
        position="bottom"
        get-container="body"
        :style="{ height: '95%' }"
        >
        <!-- 我的频道 -->
        <div class="channel">
        <div class="channel-head">
            <div>
            <span class="title">我的频道</span>
            <span class="desc">点击进入频道</span>
            </div>
            <div>
            <van-button
                type="danger"
                plain
                size="mini"
                @click="isEdit = !isEdit"
            >{{ isEdit ? '完成' : '编辑'}}</van-button>
            </div>
        </div>
        <van-grid class="channel-content" :gutter="10" clickable>
            <van-grid-item
            v-for="(item, index) in userChannels"
            :key="item.id"
            @click="handleUserChannelClick(item, index)"
            >
            <!-- 字体下面的高亮 -->
            <span
                class="text"
                :class="{ active: index === activeIndex && !isEdit }"
            >{{ item.name }}</span>
            <!-- 删除按钮 字体图标 -->
            <van-icon class="close-icon" v-show="isEdit" name="close" />
            </van-grid-item>
        </van-grid>
        </div>
        <!-- /我的频道 -->

        <!-- 推荐频道 -->
        <div class="channel">
        <div class="channel-head">
            <div>
            <span class="title">频道推荐</span>
            <span class="desc">点击添加频道</span>
            </div>
        </div>
        <van-grid class="channel-content" :gutter="10" clickable>
            <van-grid-item
            v-for="item in recommendChannels"
            :key="item.id"
            @click="handleAddChannel(item)"
            >
            <div class="info">
                <span class="text">{{ item.name }}</span>
            </div>
            </van-grid-item>
        </van-grid>
        </div>
        <!-- /推荐频道 -->
    </van-popup>
</template>

<script>
import {
  getAllChannels,
  deleteUserChannel,
  updateUserChannel
} from '@/api/channel'

export default {
  name: 'HomeChannel',
  // 接收数据
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 父传子 传下来的数据
    userChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allChannels: [],
      isEdit: false
    }
  },

  computed: {
    /**
     * 该计算属性用于处理获取推荐数据 （也就是不包含频道列表的其他所有频道列表）
     * 计算属性其实也拥有 watch 的功能，但它的作用是用于当数据改变之后重新计算返回一些数据供我们使用
     */
    // 筛选出已有的数据
    recommendChannels () {
      // 拿到所有重复的数据 id
      const duplicates = this.userChannels.map(item => item.id)
      // filter 是过滤的作用   includes（包含的意思） 是 ES6中新加的语法： 用于判断是否有  有的话返回 true 没有返回 false
      return this.allChannels.filter(item => !duplicates.includes(item.id))
    }
  },

  created () {
    this.loadAllChannels()
  },

  methods: {
    //   获取全部的频道列表
    async loadAllChannels () {
      try {
        const data = await getAllChannels()
        // console.log(data)

        // 将获取到的频道数据统一处理成我们需要的数据格式
        data.channels.forEach(item => {
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

        this.allChannels = data.channels
      } catch (err) {
        console.log('获取全部数据失败')
      }
    },
    // 点击添加
    async handleAddChannel (item) {
      // console.log(item)
      // userChannels 是 props 数据
      // props 数据有个原则：单向数据流
      //    数据只受父组件影响，但是反之不会
      //    但是引用类型除外
      //    即便是这样：也最好不要利用这个特点
      // 建议做法就是将数据传递给父组件，让父组件自己去修改
      // this.userChannels.push(item)

      // 截取一个新数组，操作这个数组，操作结束将结果传递给父组件，让父组件自己去修改
      //   始终记住一个原则：Props 数据是单向的，不要在子组件中修改它，始终由父组件去修改从而影响它
      const channels = this.userChannels.slice(0)
      channels.push(item)
      this.$emit('update:user-channels', channels)

      const { user } = this.$store.state
      // 判断： 如果已登录，则请求添加用户频道
      if (user) {
        // console.log(user)
        await updateUserChannel([{
          id: item.id,
          // 序号
          seq: channels.length - 1
        }])
      } else {
        // 如果没有登录，则添加到本地存储
        // 没有就创建，有的直接覆盖
        // 注意：本地存储数据无法像 js 数据变量去修改，要想改变只能完全重写
        window.localStorage.setItem('channels', JSON.stringify(channels))
      }
    },

    async handleUserChannelClick (item, index) {
      // 如果是非编辑状态，则是切换 tab 显示
      if (!this.isEdit) {
        this.$emit('update:active-index', index)
        this.$emit('input', false)
        return
      }
      // 如果是编辑状态，则是删除操作
      const channels = this.userChannels.slice(0)
      channels.splice(index, 1)
      this.$emit('update:user-channels', channels)

      const { user } = this.$store.state

      //  判断 如果用户已登录，则请求删除
      if (user) {
        console.log(item.id)
        await deleteUserChannel(item.id)
        return
      }

      //   如果没有登录，则将数据保存到本地存储
      window.localStorage.setItem('channels', JSON.stringify(channels))
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
    // .action {}
  }
  .channel-content {
    .text {
      font-size: 24px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 40px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
