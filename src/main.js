import Vue from 'vue'
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import router from "./route/index";
import axios from './api/index'

Vue.config.productionTip = false
Vue.use(ElementUI);

Vue.prototype.$axios = axios
Vue.prototype.$url = axios.baseUrl

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  el: '#app',
  render: h => h(App),
  router
});