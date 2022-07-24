<template>
  <!-- 注册页面的整体盒子 -->
  <div class="reg-container">
    <!-- 注册盒子 -->
    <div class="reg-box">
        <!-- 标题盒子 -->
        <div class="title-box"></div>
             <!-- 注册表单区域 -->
        <el-form :model="registerForm" :rules="rulesObj" ref="registerForm">
            <el-form-item prop="username">
                <el-input placeholder="请输入用户名" v-model="registerForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" placeholder="请输入密码"  v-model="registerForm.password"></el-input>
            </el-form-item>
            <el-form-item prop="repassword">
                <el-input type="password" placeholder="请再次输入密码" v-model="registerForm.repassword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button class="btn-reg" type="primary" @click="registerFn">注册</el-button>
                <el-link type="info" @click="$router.push('/login')">去登陆</el-link>
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
import {registerAPI} from '@/api'
export default {
    name:'register',
    data(){
        // 自定义表单校验函数
        const samePwdFn = (rules, value, callback)=>{
            if(value === ''){
                callback(new Error('请再次输入密码'))
            }else if(value !== this.registerForm.password){
                callback(new Error('两次密码不一致'))
            }else{
                callback()
            }
        }
        return{
            registerForm:{  //表单数据对象
                username:''  ,//用户名
                password:'', //密码
                repassword:'',//确认密码
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
                 ],
                 repassword:[
                    {required: true, message: '请再次输入密码', trigger: 'blur'},
                    { 
                        pattern:/^\S{6,15}$/, 
                        message: '密码必须是6-15位的非空字符',
                        trigger: 'blur'
                    },
                    // 确认密码不可以用表单校验，需要自定义表单校验
                    {
                        validator:samePwdFn,
                        trigger:'blur'
                    }
                 ]
            }
        }
    },
    methods:{
        // 注册->点击事件
        registerFn(){
            // JS兜底校验
            this.$refs.registerForm.validate(
                async (valid)=>{
                if(valid){
                    // 通过验证，拿到绑定的数据
                    console.log(this.registerForm);
                    // 1、调用接口
                    const {data:res} = await registerAPI(this.registerForm)
                    console.log((res));
                    // 2、注册失败，提示用户
                    // elemengtUI在vue原型上添加了弹窗提示，$message属性
                    if(res.code !== 0){
                        return this.$message.error(res.message)
                    }
                    // 3、注册成功：提示用户
                    this.$message.success(res.message)
                    // 4、跳转登录页面
                    this.$router.push('/login')
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

        .btn-reg{
            width:100%
        }

    }
}
</style>