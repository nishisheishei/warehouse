<template>
<!-- <p>搜索</p> -->
    <div>
        <!-- 搜索 -->
        <van-search
            placeholder="请输入搜索关键词"
            v-model="searchText"
            show-action
        />
        <!-- /搜索 -->

        <!-- 联想建议 -->
        <van-cell-group>
            <van-cell
                v-for="item in suggestions"
                :key="item"
                :title="item"
                icon="location-o" />
        </van-cell-group>
        <!-- /联想建议 -->

        <!-- 历史记录 -->
        <!-- <van-cell-group>
            <van-cell title="历史记录">
                <van-icon
                    slot="right-icon"
                    name="delete"
                    style="line-height: inherit;"
                />
            </van-cell>
        </van-cell-group> -->
        <!-- /历史记录 -->
    </div>
</template>

<script>
import { getSuggestion } from '@/api/search'

export default {
  name: 'SearchIndex',
  data () {
    return {
      // 请输入搜索关键词
      searchText: '',
      // 获取到的  联想建议补全
      suggestions: []
    }
  },

  //  监视用的
  watch: {
    //   有两个参数  newVue 和 oldVal  分别是  改变后的状态  改变前的状态
    async searchText (newVue) {
      newVue = newVue.trim() // 去除首尾空格

      //   判断  当输入内容为空的时候 则什么都不管
      if (!newVue) {
        return
      }

      // 如果不为空的时候，则请求联想建议补全
      const data = await getSuggestion(newVue)
      // console.log(data)
      this.suggestions = data.options
    }
  }
}
</script>

<style lang="less" scoped>

</style>
