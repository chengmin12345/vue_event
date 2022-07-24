<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册盒子 -->
    <div class="reg-box">
        <!-- 标题盒子 -->
        <div class="title-box"></div>
             <!-- 注册表单区域 -->
        <el-form :model="loginForm" :rules="rulesObj" ref="loginForm">
            <el-form-item prop="username">
                <el-input placeholder="请输入用户名" v-model="loginForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" placeholder="请输入密码"  v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn-login" type="primary" @click="loginFn">登录</el-button>
                <el-link type="info" @click="$router.push('/register')">去注册</el-link>
            </el-form-item>
        </el-form>    
    </div>
  </div>
</template>

<script>
/*
经验：
    前端绑定数据对象“属性名”，可以直接给要调用的功能接口的“参数名”一致
    好处：可以直接把前端对象（带着同名属性和前端的值）发给后台
*/
import {loginAPI} from '@/api'
import { mapMutations } from 'vuex'
export default {
    name:'login',
    data(){
        return{
            loginForm:{  //表单数据对象
                username:''  ,//用户名
                password:'', //密码
            },
            rulesObj:{  //表单校验规则
                 username:[
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    { 
                        pattern: /^[a-zA-Z0-9]{1,10}$/, 
                        message: '用户名必须是1-10的大小写字母数字',
                        trigger: 'blur'}
                 ],
                   password:[
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    { 
                        pattern:/^\S{6,15}$/, 
                        message: '密码必须是6-15位的非空字符',
                        trigger: 'blur'
                    }
                 ]

            }
        }
    },
    methods:{
      ...mapMutations(['updateToken']),
        // 注册->点击事件
        loginFn(){
            // JS兜底校验
            this.$refs.loginForm.validate(
                async (valid)=>{
                if(valid){
                    // 通过验证，拿到绑定的数据
                    console.log(this.loginForm);
                    // 1、调用接口
                    const {data:res} = await loginAPI(this.loginForm)
                    console.log((res));
                    // 2、登录成功：提示用户
                    // elemengtUI在vue原型上添加了弹窗提示，$message属性
                    if(res.code === 0){
                          this.$message.success(res.message)
                          // 把返回的token提交给Mutation,并保存到vuex
                          this.updateToken(res.token)
                            // 3、登录成功跳转到后台主页
                          this.$router.push('/')
                    }
                   // 4、登录失败，提示用户
                    else{
                           this.$message.error(res.message)
                    }

                }else{
                    return false  //阻止默认提交行为（表单下面红色提示框会显示）
                }
            })

        }
    }

}
</script>

<style lang="less" scoped>
.reg-container{
    height: 100%;
    background:url(../../assets/images/login_bg.jpg) center;
    background-image: cover;

    .reg-box{
        width:400px;
        height: 335px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        top:50%;
        left:50%;
        // margin-top: -200px;
        // margin-left:-167.5px;
        transform: translate(-50%,-50%);
        padding:0 30px;
        box-sizing: border-box;

        .title-box{
            height: 60px;
            background: url(../../assets/images/login_title.png) no-repeat center;
        }

        .btn-login{
            width:100%
        }

    }
}
</style>