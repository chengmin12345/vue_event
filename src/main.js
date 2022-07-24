import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less' // 引入全局样式,@代表src目录下的文件
import '@/elementUI/index'// 让elementUi参与打包才能使用
// 全局挂载 VueQuillEditor
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入dayjs方法
import dayjs from 'dayjs'
// 定义时间格式化函数
Vue.prototype.$formatDate = (dateObj) => {
return dayjs(dateObj).format('YYYY-MM-DD HH:mm:ss')
}

Vue.use(VueQuillEditor)



Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
