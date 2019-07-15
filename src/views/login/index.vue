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
            v-validate="'required'"
            name="mobile"
            :error-message="errors.first('mobile')"
          />

          <van-field
            v-model="user.code"
            left-icon="weapp-nav"
            label="验证码"
            placeholder="请输入验证码"
            v-validate="'required'"
            name="code"
            :error-message="errors.first('code')"
          />
        </van-cell-group>

        <div class="login-btn">
          <van-button
            class="login-btn-box"
            type="info"
            :loading="loadLogin"
            loading-text="登录中"
            @click.prevent="handleLogin"
          >点击登录</van-button>
        </div>
      </form>
    </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      // 提交登录的表单数据
      user: {
        mobile: '16619947998',
        code: '246810'
      },
      // 控制登录按钮的 loading 状态
      loadLogin: false,
      myErrors: {
        mobile: '',
        code: ''
      }
    }
  },

  created () {
    this.configFormMessage()
  },

  methods: {
    async handleLogin () {
      try {
        // 调用JavaScript 触发验证
        const valid = await this.$validator.validate()

        // 如果效验失败，则停止后续代码执行
        if (!valid) {
          return
        }

        // 发送请求之前，效验表单数据，效验通过，才进行登录
        // const { mobile, code } = this.user

        // 表单验证通过，发送请求 loading 加载
        this.loadLogin = true
        const data = await login(this.user)
        // console.log(data)
        this.$store.commit('setUser', data)
        /**
         * 这里先简单的 跳转到首页
         * 真实的业务要处理成跳转到之前过来的页面
         */
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        this.$toast.fail('登录失败')
      }
      this.loadLogin = false
    },

    configFormMessage () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          code: {
            required: '密码不能为空'
          }
        }
      }
      // 如果需要错误消息提示全局生效
      // Validator.localize('en', dict)
      // 组件中这也注册生效
      // or use the instance method
      this.$validator.localize('zh_CN', dict)
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
