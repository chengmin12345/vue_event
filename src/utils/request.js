// 基于axios封装，网络请求函数
import axios from 'axios'
import store from '@/store'  //引入vuex
import router from '@/router'  //引入路由
import { Message } from 'element-ui';  //引入警告框组件

export const baseURL='http://big-event-vue-api-t.itheima.net' //接口和图片资源所在的服务器地址
// axios.create()创建一个带配置的自定义axios函数
// myAxios请求时，地址baseURL+url,然后请求后台
const myAxios = axios.create({
    baseURL
})
// 定义请求拦截器
// api里每一次调用request都会先走这个请求拦截器
myAxios.interceptors.request.use(
    function(config){
    // config配置对象(要请求后台的参数都在这个对象上)
    // 在请求前会触发一次,这个return交给axios源码内,根据配置项发起请求
    // 在发起时,统一携带请求头Authorization和token值
    // 判断,登录页面和注册页面,Vuex中无token,而且登录接口和注册接口不需要携带token(其他页面需要)
    if(store.state.token){ 
        config.headers.Authorization = store.state.token
    }
   return config
    },
    function(error){
    // 请求发起前的代码,如果有异常,会直接进入这里
    // 返回一个拒绝状态的Promise对象(axios留着原地的Promise对象状态为失败结果就为error变量)
    // 此函数类似于catch函数()里的return
    // 口诀:return非Promise对象值,会作为成功额结果,返回给下一个Promise对象(axios留着原地)
    // 口诀:return Promise对象,这个Promise对象状态,返回给下一个Promise对象
    // Promise.reject()原地留下一个新的Promise对象(状态为失败) 它是Promise的类方法reject()
       return Promise.reject(error)
       /*
       等同于
       return new Promise((resolve,reject)=>{
        reject(error)
       })
       */
    })

// 定义响应拦截器
myAxios.interceptors.response.use(
    function(response){
        // 状态码为2xx或3xx时触发成功回调,形参中的response时'成功的结果'
        // return到axios原地promise对象,作为成功的结果
        return response
    },
    function(error){
        // 响应码为4xx,5xx触发失败回调,形参error是'失败的结果'
        // return到axios原地promise对象位置,作为失败拒绝的状态(如果那边用try+catch函数捕获,可以捕获到传过去的error变量)
        if(error.response.status === 401){
            // 响应的token过期
            // 清除vuex所有数据
            store.commit('updateToken','')
            store.commit('updateUserInfo',{})
            // 强制跳转到登录页面
            router.push('/login')
            Message.error({
                message:"用户身份已过期,请重新登录!!",
                type:'warning'
            })
        }
    }
)
// 导出axios自定义函数
export default myAxios