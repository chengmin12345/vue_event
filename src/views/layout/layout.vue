<template>
     <el-container class="main-container">
        <!-- 头部 -->
        <el-header class="layout-head">
            <!-- 左侧Logo -->
            <img src="../../assets/images/logo.png" alt="">
            <!-- 右侧菜单
              el-menu 导航菜单
                  mode:元素排列方式（默认垂直，horizontal是水平
                  text-color:导航上文字的颜色
                  acyive-text-color:激活时文字颜色
                  
                  el-menu-item 直接出现在导航上的某一项
                  el-submenu 证明此导航有子导航
                      template插槽title,是导航上先显示的一个标题
                      el-mune-item 是子菜单
                          index属性：是子菜单的唯一标识（用于激活高亮/后续和路由配合使用）-->
            <el-menu class="el-menu-top" mode="horizontal" background-color="#23262e" text-color="#fff" active-text-color="#409EFF">
                <el-submenu index="1">
                    <template slot="title">
                        <img class="the_img" :src="user_pic" alt="" v-if="user_pic">
                        <img class="the_img" src="../../assets/images/logo.png" alt="" v-else>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="1-1" @click="$router.push('user-info')"><i class="el-icon-s-operation" ></i>基本资料</el-menu-item>
                    <el-menu-item index="1-2" @click="$router.push('user-avatar')"><i class="el-icon-camera"></i>更换头像</el-menu-item>
                    <el-menu-item index="1-3" @click="$router.push('user-pwd')"><i class="el-icon-key"></i>重置密码</el-menu-item> 
                </el-submenu>
                <el-menu-item index="2" @click="quitFn"><i class="el-icon-switch-button"></i>退出</el-menu-item>
            </el-menu>
        </el-header>

        <el-container>
            <!-- 侧边栏 -->
            <el-aside width="200px">
              <!-- 侧边栏-用户登录信息 -->
              <div class="user-box">
                <img class="the_img" :src="user_pic" alt="" v-if="user_pic">
                <img class="the_img" src="../../assets/images/logo.png" alt="" v-else>
                <span>欢迎  {{nickname||username}}</span>
              </div>
              <!-- 侧边栏导航-菜单 -->
                <el-menu
                    :default-active="$route.path"
                    class="el-menu-vertical-demo"
                    background-color="#23262e" 
                    text-color="#fff" 
                    active-text-color="#409EFF"
                    unique-opened
                    router
                    >
                <template v-for="item in menus">
                    <el-menu-item 
                    v-if="!item.children" 
                    :index="item.indexPath" 
                    :key="item.indexPath">
                      <i :class="item.icon"></i>
                      <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                    <el-submenu 
                    v-else 
                    :index="item.indexPath" 
                    :key="item.indexPath1">
                      <template slot="title">
                        <i :class="item.icon"></i>
                        <span>{{ item.title }}</span>
                      </template>
                        <el-menu-item v-for="li in item.children" :key="li.indexPath" :index="li.indexPath"><i :class="li.icon"></i>{{ li.title}}</el-menu-item>   
                    </el-submenu>
                </template>
                </el-menu>
            </el-aside>
            <el-container>
            <!-- 页面主体 -->
            <el-main>
                <!-- 二级路由 -->
                <router-view></router-view>
            </el-main>
            <!-- 底部footer -->
            <el-footer>© www.itheima.com - 黑马程序员</el-footer>
            </el-container>
        </el-container>
     </el-container>
</template>

<script>
/*
经验：在组件标签上绑定的都是自定义事件（包括click,input等），都需要$emit触发
    如果组件内不支持原生时间名？？
    解决：@事件名.native='methods里的方法名'
         .native给组件内根标签绑定这个原生事件

*/
import { mapGetters } from 'vuex';
import { getMenuListAPI } from '@/api'
export default {
    name:'layout',
    data(){
      return {
        menus:[]  //侧边栏数据
      }
    },
    computed:{
      ...mapGetters(['nickname','username','user_pic'])
    },
    methods:{
        // 退出登录->点击事件
        quitFn(){
            this.$confirm('您确定退出吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$message({
                type: 'success',
                message: '退出成功!'
            }),
            // 清除vuex，userInfo
            this.$store.commit('updateToken','')
            this.$store.commit('updateUserInfo',{})
        
            // 强制跳转到登录页面
            this.$router.push('/login')
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消登录'
          });          
        });
        },
        // 请求侧边栏数据
        async getMenuListFn(){
          const res = await getMenuListAPI()
          // console.log(res);
          this.menus = res.data.data
        }
    },
    created(){
      // 请求侧边栏数据
       this.getMenuListFn()
    }
    

}
</script>

   <style lang="less" scoped>
   .main-container {
     height: 100%;
     .el-header,
     .el-aside {
       background-color: #23262e;
     }
     .el-header {
       padding: 0;
       display: flex;
       justify-content: space-between;
       .el-submenu{
        background-color: #23262e;
       }
     }
     .el-main {
       overflow-y: scroll;
       height: 0;
       background-color: #F2F2F2;
     }
     .el-footer {
       background-color: #eee;
       font-size: 12px;
       display: flex;
       justify-content: center;
       align-items: center;
     }
   }
   .avatar,.the_img {
     border-radius: 50%;
     width: 35px;
     height: 35px;
     background-color: #fff;
     margin-right: 10px;
     object-fit: cover;
   }
  //  左边栏用户信息
   .user-box{
      height: 70px;
      display: flex;
      justify-content:center;
      align-items: center;
      border-top:1px solid #000;
      border-bottom: 1px solid #000;
      user-select:none;
    // img{
    //     border-radius: 50%;
    //     width: 35px;
    //     height: 35px;
    //     background-color: #fff;
    //     margin-right: 15px;
    //     object-fit: cover;
    // }
    span{
      color:white;
      font-size: 12px;
    }
   }
   </style>