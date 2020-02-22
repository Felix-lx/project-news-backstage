import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.config.productionTip = false

// axios优化
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios

// 过滤器
Vue.filter('time', function (input) {
  return moment(input).format('YYYY-MM-DD HH:mm:SS')
})

// 给vue原型添加方法用于图片的处理
Vue.prototype.$checkURL = function (url) {
  if (url.startsWith('http')) {
    return url
  } else {
    return axios.defaults.baseURL + url
  }
}
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
