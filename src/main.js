import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './utils/vant-ui'
import './styles/common.less'
import './utils/request'

// 全部導入
// import Vant from 'vant'
// import 'vant/lib/index.css'
// Vue.use(Vant)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
