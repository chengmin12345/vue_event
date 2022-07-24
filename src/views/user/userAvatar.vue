<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>更换头像</span>
      </div>
      <!-- 图片，用来显示用户选择的头像 -->
      <img class="the_img" v-if="!this.avatar" src="../../assets/images/avatar.jpg" alt="">
      <img class="the_img" v-else :src="avatar" alt="">
      <!-- 按钮区域 -->
      <div class="user-btn">
        <input type="file" accept="image/*" style="display:none" ref="iptRef" @change="onFileChange">
        <el-button type="primary" @click="chooseImg"><i class="el-icon-plus"></i>选择图片</el-button>
        <el-button type="success" :disabled="avatar===''" @click="uploadFn"><i class="el-icon-upload"></i>上传头像</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { updateUserAvatarAPI } from '@/api'
export default {
    name:'user-avatar',
    data(){
      return{
        avatar:''  //头像
      }
    },
    methods:{
      // 选择图片->点击事件
      chooseImg(){
        // 目的：为了让Input[type=file]标签，让他再用js代码触发点击事件（导致给一个文件选择窗口）
        // 原因：input[type = file]是一个原生标签，样式不好改
        // 解决：移花接木
        this.$refs.iptRef.click()
      },
      onFileChange(e){  //e原生事件对象
          const files = e.target.files  //拿到用户选择的文件数组
          if(files.length === 0){
            //  证明刚刚文件选择窗口打开了，但是它一个文件都没选择然后点击了确定关闭的选择弹框
            this.avatar = ''
          }else{
            // 证明它选择了文件（默认只能选一个，如果选择多个需要给Input标签添加额外的原生属性）
            console.log(files[0]);

            // 目标：选择的文件要给到img标签上，要做到纯前端预览
            /* img标签的src值
                只能是图片的‘链接地址’（外链http://开头，图片文件相对路径）
                或者是图片的base64字符串（而且字符串还必须是data:image/png;base64,图片转base64字符串
            */
          /*
            解决方案1：文件 -> 内存临时地址（不能发给后台只能在Js内存中）
            语法:URL.createObjectURL(文件)
            返回值：内存临时地址
          */
          //  this.avatar = URL.createObjectURL(files[0])

          /*
          解决方案2：文件 -> base64字符串（此字符串是可以发给后台的）
          */
         const fr = new FileReader()
         fr.readAsDataURL(files[0])  //传入文件对象开始读
         fr.onload = (e) =>{ //onload等待把文件读成base64字符串后发给后台会触发onload事件函数
         //e.target.result 的值就是读完的结果
         this.avatar = e.target.result  //赋予给变量，让它显示在img的src中

         }
          }

      },
      // 开始上传头像
      async uploadFn () {
        const { data: res } = await updateUserAvatarAPI(this.avatar)
        console.log(res);
        if(res.code === 0){
          this.$message.success(res.message)
          // 立刻让vuex里的actions（获取用户信息的actions）再请求一次后台更新vuex里的值
          this.$store.dispatch('getUserInfoActions')
        }else{
          this.$message.error(res.message)
        }
      }
    }

}
</script>

<style lang="less" scoped>
.user-btn{
  margin-top: 10px;
}
.the_img{
      width: 350px;
      height: 350px;
}
</style>