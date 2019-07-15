import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 表单验证
// 表单验证多语言包
import VeeValidate, { Validator } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import relativeTime from './filters/relative-time'

// 这个第三方引入即可，它会自动根据页面宽度设置页面基准字体大小
import 'amfe-flexible'

import Vant from 'vant'
// 表单验证
import 'vant/lib/index.css'

// 注册一个全局过滤器： 处理相对时间
Vue.filter('relativeTime', relativeTime)
// 语言包
Vue.use(VeeValidate, {
  events: '' // 禁用默认事件验证
})
Validator.localize('zh_CN', zhCN)

Vue.use(Vant)

Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(resolve, time)
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
