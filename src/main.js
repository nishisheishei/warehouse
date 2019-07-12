import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 表单验证

// 表单验证多语言包
import VeeValidate, { Validator } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'
// 这个第三方引入即可，它会自动根据页面宽度设置页面基准字体大小
import 'amfe-flexible'

import Vant from 'vant'
// 表单验证
import 'vant/lib/index.css'
// 语言包
Vue.use(VeeValidate)
Validator.localize('zh_CN', zhCN)

Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
