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
            <van-cell title="hello" icon="location-o" />
            <van-cell title="hello" icon="location-o" />
            <van-cell title="hello" icon="location-o" />
        </van-cell-group>
        <!-- /联想建议 -->

        <!-- 历史记录 -->
        <van-cell-group>
            <van-cell title="历史记录">
                <van-icon
                    slot="right-icon"
                    name="delete"
                    style="line-height: inherit;"
                />
            </van-cell>
        </van-cell-group>
        <!-- /历史记录 -->
    </div>
</template>

<script>
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: ''
    }
  }
}
</script>

<style lang="less" scoped>

</style>
