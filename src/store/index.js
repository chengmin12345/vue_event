import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'  //引入插件
import { getUserInfoAPI } from '@/api'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token:'',//保存token字符串
    userInfo:{}, //保存用户信息(id,username,nickname,email,user_pic)
  },
  getters: {
    // username(state){
    //   return state.userInfo.username
    // },
    // 简写
    username:state => state.userInfo.username,  //用户名
    nickname:state => state.userInfo.nickname,  //用户昵称
    user_pic:state => state.userInfo.user_pic  //用户头像
  },
  mutations: {
    // 保存token
    updateToken(state,val){
      state.token = val
    },
    // 保存用户信息
    updateUserInfo(state,val){
      state.userInfo = val
    }  
},
  actions: {
    // 请求->用户信息
    async getUserInfoActions(store){
      const {data:res} = await getUserInfoAPI()
      console.log(res);
      if(res.code === 0){
        store.commit('updateUserInfo',res.data)
      }
    }
  },
  // 配置为 vuex 的插件
    plugins: [createPersistedState()]//注册持久化插件
})

// vuex默认保存在内存中，所以刷新所有的值都会回归初始化（无法做到持久化存储）
// 借助yarn add vuex-persistedstate@3.2.1这个包可以让vuex做到持久化存储
