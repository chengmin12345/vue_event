<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本资料</span>
      </div>
      <el-form :model="userInfoForm" :rules="rules" ref="userInfoForm" label-width="100px" >
        <el-form-item label="登录名称" prop="username">
          <el-input  v-model="userInfoForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input  v-model="userInfoForm.nickname" ></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="userInfoForm.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交修改</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { updateUserInfoAPI } from '@/api'
  export default {
    data() {
      return {
          userInfoForm:{  //表单数据对象
                username:this.$store.state.userInfo.username  ,//用户名
                nickname:'', //用户昵称
                email:'',//邮箱
            },
            rules:{  //表单校验规则
                   nickname:[
                    {required: true, message: '请输入用户昵称', trigger: 'blur'},
                    { 
                        pattern:/^\S{1,10}$/, 
                        message: '昵称必须是1-10位的非空字符串',
                        trigger: 'blur'
                    }
                 ],
                 email:[
                    {required: true, message: '请输入用户邮箱', trigger: 'blur'},
                    { 
                      type:'email',
                      message:'邮箱格式不正确',
                      trigger:'blur'
                    }
                 ]
    }
      }
    },
    methods: {
      // 提交
      submitForm() {
        this.$refs.userInfoForm.validate(
          async (valid) => {
          if (valid) {
            // 因为后端更新接口需要基本资料接口，需要带id过去，userInfoForm没有，但是vuex上的userInfo上有
            this.userInfoForm.id = this.$store.state.userInfo.id
            const {data:res} = await updateUserInfoAPI(this.userInfoForm)
            if(res.code === 0){
              this.$message.success('更新成功')
              // 重新让Vuex获取最新的用户数据
              this.$store.dispatch('getUserInfoActions')
            }else{
              this.$message.error('更新用户信息失败')
            }
          } else {
            console.log('error submit!!');
            // 未通过校验
            return false;
          }
        });
      },
      // 重置按钮
      resetForm() {
        // el-form提供了一个重置表单（而且还重置报错提示）
        this.$refs.userInfoForm.resetFields();
      }
    }
  }
</script>

<style lang="less" scoped>
 
  .el-form{
    width: 500px;
  }
</style>