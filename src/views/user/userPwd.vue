<template>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>重置密码</span>
      </div>
      <el-form :model="userPwsForm" :rules="rules" ref="userPwsForm" label-width="100px" >
        <el-form-item label="原密码" prop="old_pwd">
          <el-input type="password"  v-model="userPwsForm.old_pwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_pwd">
          <el-input type="password"  v-model="userPwsForm.new_pwd" ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="re_pwd">
          <el-input type="password" v-model="userPwsForm.re_pwd"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePwdForm">修改密码</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
</template>

<script>
import { updateUserPwdAPI } from '@/api'
import { Message } from 'element-ui';  //引入警告框组件
export default {
     name:'userPwd',
     data(){
      // 自定义表单校验函数
      // 原密码和新密码不一样
      const samePwd = (rules,value,callback) =>{
          if(value === this.userPwsForm.old_pwd){
            callback(new Error('新密码和原密码不能相同'))

          }else{
               callback()            
          }
      }
      // 确定密码和密码一致
      const rePwdFn = (rules,value,callback) =>{
        if(value === ''){
          callback(new Error('请再次输入密码'))
        }else if(value !== this.userPwsForm.new_pwd){
          callback(new Error('两次输入的密码不一致'))
        }else{
           callback()
        }
      }
      return{
        userPwsForm:{
          old_pwd:'',
          new_pwd:'',
          re_pwd:'',
        },
         rules:{  //表单校验规则
                   old_pwd:[
                    {required: true, message: '请输入原密码', trigger: 'blur'},
                    { 
                        pattern:/^\S{6,15}$/, 
                        message: '密码必须是6-15位的非空字符',
                        trigger: 'blur'
                    }
                   ],
                    new_pwd:[
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {
                            pattern:/^\S{6,15}$/, 
                            message: '密码必须是6-15位的非空字符',
                            trigger: 'blur'
                        },
                        {validator:samePwd , trigger:'blur'}
                   ],
                   re_pwd:[
                      {required: true, message: '请确认新密码', trigger: 'blur'},
                    { 
                        pattern:/^\S{6,15}$/, 
                        message: '密码必须是6-15位的非空字符',
                        trigger: 'blur'
                    },
                    // 确认密码不可以用表单校验，需要自定义表单校验
                    { validator:rePwdFn, trigger:'blur'}
                   ]                  
         }
      }
     },
     methods:{
      // 更新密码
      changePwdForm(){
        // console.log('修改成功');
        this.$refs.userPwsForm.validate(
          async (vaild) => {
            if(vaild){
                  const {data:res} = await updateUserPwdAPI(this.userPwsForm)
                  if(res.code === 0){
                    this.$message.success(res.message)
                    // 清空vuex上的所有数据
                    this.$store.commit('updateToken','')
                    this.$store.commit('updateUserInfo',{})
                    setTimeout(()=>{
                     // 强制跳转会登录页面
                     this.$router.push('/login')
                       Message.error({
                            message:"用户身份已过期,请重新登录!!",
                            type:'warning'
                        })
                    },1500)
        }else{
          this.$message.error(res.message)
        }
            }else{
              return false
            }
          }
        )
      },
      // 重置表单
      resetForm(){
        this.$refs.userPwsForm.resetFields();
      }
     }

}
</script>

<style lang="less" scoped>
.el-form{
  width:500px;
}
</style>