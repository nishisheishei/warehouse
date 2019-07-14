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
        :style="{ height: '95%' }"
        position="bottom"
    />
</template>

<script>
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },

  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
