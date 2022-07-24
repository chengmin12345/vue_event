import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/layout/layout'),
    redirect: '/home', // 默认显示首页的二级路由
    children:[
      {
        path: 'home',
        component: () => import('@/views/home/home')
      },
      {
        path: 'user-info',  //必须用这个值，因为侧边栏导航切换用的是他
        component: () => import('@/views/user/userInfo.vue')
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/user/userAvatar.vue')
      },
      {
        path: 'user-pwd',
        component: () => import('@/views/user/userPwd.vue')
      },
      {
        path: 'art-cate',
        component: () => import('@/views/article/artCate.vue')
      },
      {
        path: 'art-list',
        component: () => import('@/views/article/artList.vue')
      },

    ]
  } ,
  {
    path:'/register',
    component:()=>import('@/views/register/register.vue')
    // webpack提供的import函数来路由懒加载导入组件
    // 路由懒加载，就是页面路由路径切换到/reg,才去加载对应组件代码
    // 好处：让首页加载文件体积更新打开更快
  }
  ,
  {
    path:'/login',
    component:()=>import('@/views/login/login')
  }

]

const router = new VueRouter({
  routes
})

// 没有登录也可以路由跳转的白名单
const whiteList = ['/register','/login']

// 全局前置路由守卫
// 知识点1:浏览器一打开项目页面,会触发一次全局前置路由守卫函数
// 知识点2:判断登录与否,有token登录了,没token没登录
router.beforeEach((to, from, next) => {
  const token = store.state.token
  // 登陆了
  if(token){
    if(token && !store.state.userInfo.username){
      // 现在本地有token的值，才去请求用户信息
        store.dispatch('getUserInfoActions')
    }
    next()
  }
  // // 没登陆,强制跳转到登录页面
  else{
    if(whiteList.includes(to.path)){
      // 未登录,可以访问路由地址,则放行(路由全局前置守卫不会再次触发,而是匹配路由表,由组件挂载)
      next()
    }else{
    // next()强制切换到登录路径上
    next('/login')
    }

  }

})

export default router

// 退出登录，重新登录，只走相关组件代码（异步dom切换，不会导致所有的代码重新执行，App.vue不走）
// 效果不对：换个账号得重新请求客户数据
// 解决：1可以在登录页面，登录成功后，再发送请求拿到用户信息
      // 2可以在全局前置路由守卫中，写（路由跳转得时候，判断+获取）
