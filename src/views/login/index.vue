<template>
    <!-- <div>login 页面</div> -->
    <div>
      <div class="login-warp">
        <van-nav-bar
          class="login-bar"
          title="登录"
        />
      </div>
      <form>
        <van-cell-group>
          <van-field
            v-model="user.mobile"
            clearable
            left-icon="phone"
            label="手机号"
            placeholder="请输入手机号"
          />

          <van-field
            v-model="user.code"
            left-icon="weapp-nav"
            label="验证码"
            placeholder="请输入验证码"
          />
        </van-cell-group>

        <div class="login-btn">
          <van-button class="login-btn-box" type="info">点击登录</van-button>
        </div>
      </form>
    </div>
</template>

<script>

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-warp {
  margin-bottom: 40px;
}
.login-bar {
  width: 100%;
  background-color: blue;
}
.van-nav-bar__title {
  color: #fff;
}
.login-btn {
  padding: 20px;
  margin-top: 20px;
  .login-btn-box {
    width: 100%;
  }
}
</style>
