<template>
    <div>
        <!-- 导航栏 -->
        <van-nav-bar
            title="标题"
            left-text="返回"
            right-text="按钮"
            left-arrow
            fixed
            @click-left="$router.back()"
        />
        <!-- 导航栏 -->

        <!-- 内容部分 -->
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            >
            <van-cell
                v-for="item in artiles"
                :key="item.art_id.toString()"
                :title="item.title"
            />
        </van-list>
    </div>
</template>

<script>
/**
 *这里有两个缓存：
 * 组件缓存
 *      生命周期不会重走，页面的切换回销毁重建
 * 路由本身的缓存
 *     当你从 a 路径导航到 b 路径的时候
 *     由于a 路径和 b 路径使用的都是同一个组件，那么此时默认给你路由缓存
 *  列如 从 /search/a 到 /search/b /,重用了
 *  但是 从 、search/xxx 到 /非search 没有缓存 （前提是，不是同一个组件）
 *  /search 就销毁了
 */

import { getSearch } from '@/api/search'

export default {
  name: 'SearchResult',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10,
      artiles: []
    }
  },

  watch: {
    '$router' (to, from) {
      // 对路由变化作出响应
      console.log('路由变化了')
    }
  },

  computed: {
    q () {
      return this.$route.params.q
    }
  },

  async created () {
    const data = await getSearch({
      q: this.$route.params.q,
      page: 1
    })
    console.log(data)
  },

  methods: {
    async onLoad () {
      // 异步更新数据
      // setTimeout(() => {
      //     for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1);
      //     }
      //     // 加载状态结束
      //     this.loading = false;

      //     // 数据全部加载完成
      //     if (this.list.length >= 40) {
      //     this.finished = true;
      //     }
      // }, 500);

      await this.$sleep(800)

      const data = await this.getSarchResult()
      // 如果请求结果数组为空，则设置 List 组件已加载结束
      if (!data.results.length) {
        this.loading = false
        this.finished = true
        return
      }

      // 如果有数据，则将本次加载到的数据 push 到列表数组中
      this.artiles.push(...data.results)

      // 数据加载完毕，更新当前页码为下一页，用于下一次加载更多
      this.page += 1

      // 结束当前加载的 Loading
      // List 列表组件每次 onLoad 会自动将 loading 设置为 true
      // 如果你不设置的话，它不会触发下一次的 onload
      this.loading = false
    },

    getSarchResult () {
      return getSearch({
        page: this.page,
        perPage: this.perPage,
        q: this.q
      })
    }
  }
}
</script>

<style lang="less" scpoed>
.van-nav-bar {
    background-color: orange;

    .van-nav-bar__title {
        color: #fff
    }

    .van-icon-arrow-left , .van-nav-bar__text {
        color: #fff
    }
}
.van-list {
    margin-top: 92px;
}
</style>
