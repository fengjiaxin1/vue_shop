import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import './assets/fonts/iconfont.css'

import './assets/global.css'

import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器及样式
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueQuillEditor, /* { default global options } */ )

//根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//拦截器
axios.interceptors.request.use((config) => {
  //  console.log(config);
  Nprogress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
})
axios.interceptors.response.use(config => {
  Nprogress.done();
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)

//时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const date = new Date(originVal)

  const year = date.getFullYear();
  const month = (date.getMonth() + 1 + '').padStart(2, '0')
  const day = (date.getDate() + '').padStart(2, '0')
  const hh = (date.getHours() + '').padStart(2, '0')
  const mm = (date.getMinutes() + '').padStart(2, '0')
  const ss = (date.getSeconds() + '').padStart(2, '0')

  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`

})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')