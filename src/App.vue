<template>
  <div id="app">
    <!-- <p>123</p> -->
    <div class="box"></div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
.box {
  width: 375px;
  height: 200px;
  background-color: yellow;
}
</style>
