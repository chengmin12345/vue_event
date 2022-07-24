<template>
<div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item label="文章分类">
            <el-select v-model="q.cate_id" placeholder="请选择分类">
              <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left:15px">
            <el-select v-model="q.state" placeholder="请选择状态">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="choseFn" size="small">筛选</el-button>
            <el-button type="info" size="small" @click="resetFn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章按钮 -->
        <el-button type="primary" class="sendArt" size="small" @click="showPubDialogFn">发表文章</el-button>
    </div>
    <!-- 文章标题筛选 -->
       <el-table border style="width: 100%" stripe :data="artList">
        <!-- type是table-column内置属性，告诉它用index,意思是第一个单元格用索引值 -->
        <el-table-column  prop="title" label="文章标题">
          <template v-slot="scope">
             <el-link type="primary" @click="getArtDetail(scope.row.id)">{{ scope.row.title}}</el-link>
          </template>
        </el-table-column>
        <el-table-column  prop="cate_name" label="分类"></el-table-column>
        <el-table-column  prop="pub_date" label="发表时间">
          <template v-slot="scope">
            <span>{{ $formatDate(scope.row.pub_date)}}</span>
          </template>
        </el-table-column>
        <el-table-column  prop="state" label="状态"></el-table-column>
        <el-table-column  label="操作">
          <template v-slot="scope">
              <el-button type="danger" size="mini" @click="deletArtFn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 翻页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="q.pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size.sync="q.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 发表文章的Dia对话框 -->
    <el-dialog
        title="发表文章"
        :visible.sync="pubDialogVisible"
        fullscreen
        :before-close="handleClose"
        >
        <el-form :model="pubForm" :rules="pubFormRules" ref="pubForm" label-width="100px" class="demo-ruleForm">
              <!-- 输入框 -->
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="pubForm.title"></el-input>
            </el-form-item>
            <el-form-item label="文章分类" prop="cate_id">
              <el-select v-model="pubForm.cate_id" placeholder="请选择分类" style="width:100%">
                <el-option v-for="obj in cateList" :key="obj.id" :label="obj.cate_name" :value="obj.id"></el-option>  
              </el-select>
            </el-form-item>
            <!-- 富文本 -->
            <el-form-item label="文章内容" prop="content">
                <quill-editor v-model="pubForm.content" @blur="contentChangeFn"></quill-editor>
            </el-form-item>      
            <!-- 封面图 -->
            <el-form-item label="文章封面" prop="cover_img">
                    <img class="the_img"   src="../../assets/images/cover.jpg" alt="" ref="imgRef">
                    <!-- 选择文件的界面，先隐藏，点击后再显示 -->
                    <input type="file" accept="image/*" style="display:none" ref="iptRef" @change="changeCoverFn">
                    <!-- 按钮区域 -->
                    <div style="margin:10px 0">
                      <el-button type="text" icon="el-icon-plus" @click="selCoverFn">选择封面</el-button>
                    </div>
                    <div class="user-btn" >
                      
                    </div>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" style="margin-right:10px" @click="pubArtFn('已发布')">发布</el-button>
                      <el-button type="info" @click="pubArtFn('草稿')">存为草稿</el-button>
            </el-form-item> 
        </el-form>
    </el-dialog>
    <!-- 文章详情的Dia对话框 -->
    <el-dialog
      title="文章预览"
      :visible.sync="artDetaildialogVisible"
      width="80%">
      <h1 class="title">{{ artDetail.title}}</h1>
      <div>
        <span>作者：{{ artDetail.nickname  || artDetail.username}}</span>
        <span>发布时间；
          {{ $formatDate(artDetail.pub_date)}}</span>
        <span>所属分类：{{ artDetail.cate_name}}</span>
        <span>状态：{{ artDetail.state}}</span>
      </div>
       <el-divider></el-divider>
       <img v-if="artDetail.cover_img" :src="baseURL + artDetail.cover_img" alt="">
       <div v-html="artDetail.content"> </div>

    </el-dialog>

</div>
</template>

<script>
import { getArtCateListAPI , uploadArtileAPI , getArtListAPI , getArtDetailAPI , deletArticalAPI} from '@/api' 
// 导入默认的封面图片
import defaultImg from '@/assets/images/cover.jpg'
// 导入图片所在的服务器地址
import { baseURL} from '@/utils/request'
export default {
  name:'artList',
   data() {
      return {
        // 查询参数对象
        q: {
          pagenum: 1,  //默认第一页数据
          pagesize: 2, //默认当前页需要2条数据（传递给后台，后台就返回几个）
          cate_id: '',
          state: ''
        },
        pubDialogVisible: false ,//是否显示文章发表页面
        artDetaildialogVisible:false,//文章详情页
        pubForm:{//发表文章---表单的数据对象
          title:'',  //文章标题
          cate_id: '',  //文章分类Id
          content:'',  //富文本内容数据（文章内容）
          cover_img:'' , //封面图片（保存的文件）
          state:''//文章发布状态，可以选择两个：已发布，存为草稿
        },  
        // 发布文章-表单校验规则
        pubFormRules:{
          title:[
           { required: true, message: '请输入文章标题', trigger: 'blur' },
           { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
          ],
          cate_id:[
            { required: true, message: '请选择文章分类', trigger: 'change' },

          ],
          // 不是el-ul的组件提供的，是quill-editor富文本编辑器，不能走blur和change事件
          // 自己给quill-editor绑定change事件(文档里查)
          content:[
            { required: true, message: '请输入文章内容', trigger: 'blur' }
          ],
          cover_img:[
            { required: true, message: '请选择封面', trigger: 'change' }
          ]
        },
        cateList:[],  //文章分类的数据
        artList:[],  //保存文章列表
        total:0,//保存总数
        artDetail:{},  //保存文章详情的数据
        baseURL


      }
    },
    created(){
      // 页面加载完获取文章分类
      this.getArtCate()
      // 获取文章列表
      this.getArtList()

    },
    methods: {
      // 发表文章按钮->点击事件->让添加文章对话框出现
      showPubDialogFn(){
        this.pubDialogVisible = true
      },
      // 点击关闭发表文章页面的回调，只有触发了才会关闭发表文章页面
      async handleClose(close){
        const confirmResult = await this.$confirm('此操作将导致文章信息丢失，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 取消关闭---阻止住，什么都不干
        if(confirmResult === 'cancel') return
        
        // 点击关闭页面按钮，重置内容
        this.$refs.pubForm.resetFields();
        this.pubForm.cover_img = this.$refs.imgRef.setAttribute('src', defaultImg)
        this.pubForm.content = ''
        // 确认关闭
        close()
      },

      // 获取文章分类
      async getArtCate(){
        const {data :res } = await getArtCateListAPI()
        // console.log(res);
        this.cateList = res.data
      },
      // 选择封面--->点击事件,让文件选择窗口出现
      selCoverFn(){
        // 先获取file的原生标签对象
        this.$refs.iptRef.click()
      },
      // 用户选择封面文件
      changeCoverFn(e){
        const files = e.target.files
        if(files.length === 0){
          // 文件窗口打开了，但是没有选择文件,将图片文件清空
           this.pubForm.cover_img = null
           this.$refs.imgRef.setAttribute('src', defaultImg)
        }else{
          // console.log(files[0]);
                  this.pubForm.cover_img = files[0]
                  const url = URL.createObjectURL(files[0])
                  this.$refs.imgRef.setAttribute('src', url)
          // 选择了文件
        // const fr = new FileReader()
        //  fr.readAsDataURL(files[0])  //传入文件对象开始读
        //  fr.onload = (e) =>{ //onload等待把文件读成base64字符串后发给后台会触发onload事件函数
        //  //e.target.result 的值就是读完的结果
        //  this.pubForm.cover_img = e.target.result  //赋予给变量，让它显示在img的src中
        //  }      这种方法校验的时候有问题-------->没解决
        }
        //  让表单单独校验封面
        this.$refs.pubForm.validateField('cover_img')
      },
      //  表单里点击发布/存为草稿按钮点击事件--->准备后端接口
      pubArtFn(str){
        // str值为‘已发布’‘存草稿’（后端要求的参数）
        this.pubForm.state = str //保存到统一表单对象上
   
        //  兜底校验
        this.$refs.pubForm.validate  (
          async valid => {
             if(valid){
              //通过兜底校验
              // console.log(this.pubForm);
              const fd = new FormData()  //准备一个表单数据对象的容器 FormDate
              fd.append('title', this.pubForm.title)
              fd.append('cate_id' ,this.pubForm.cate_id)
              fd.append('content' ,this.pubForm.content)
              fd.append('cover_img' ,this.pubForm.cover_img)
              fd.append('state' ,this.pubForm.state)
              // 遍历   等同于上边的一堆append
              // Object.keys(this.pubForm).forEach((key) => {
              //   fd.append(key,this.pubForm[key])
              // })
              const {data :res} = await uploadArtileAPI(fd)
              console.log(res);
              if( res.code !== 0) return this.$message.error(res.message)
                this.$message.success(res.message)
                // 发布成功关闭对话框
                this.pubDialogVisible = false
                // 刷新文章列表
                this.getArtList()
                      
              // 发布完成后也要重置内容
              this.$refs.pubForm.resetFields();
              this.pubForm.cover_img = this.$refs.imgRef.setAttribute('src', defaultImg)
              this.pubForm.content = ''
             }
             else{
              // 未通过兜底校验
              return false  //阻止默认行为（因为按钮有默认提交行为）
             }

          }
        )
      },
      // 富文本编辑器内容改变触发此事件
      contentChangeFn(){
        // 单独校验用validateField
        this.$refs.pubForm.validateField('content')
      },
      // 获取所有文章列表
      async getArtList(){
         const { data: res } = await getArtListAPI(this.q)
        //  console.log(res);
         this.artList = res.data  //保存当前获取的文章列表（有分页不是所有的数据）
         this.total = res.total //保存总数
      },

      //  筛选按钮---->点击事件
      choseFn() {
      //  目的：当筛选后，页码回归1，每页条数回归2
          this.q.pagenum = 1
          this.q.pagesize = 2
          // 重新获取文章列表
          this.getArtList()       

      },
      // 重置按钮---- >点击事件
      resetFn(){
        // 清空q
        this.q.pagenum = 1
        this.q.pagesize =2
        this.q.cate_id =''
        this.q.state = ''
          // 重新获取文章列表
          this.getArtList()
      },
      // 分页--->每页条数改变触发
      handleSizeChange(newSize) {
        this.q.pagesize = newSize
        this.q.pagenum = 1
        this.getArtList()

      },
      // 当前页码改变时触发
      handleCurrentChange(nowPage) {
       this.q.pagenum = nowPage
        this.getArtList()
      },
      // 文章标题获取文章详情--->点击事件
      async getArtDetail(artId){
        const { data: res } = await getArtDetailAPI (artId)
        console.log(res);
        this.artDetaildialogVisible = true
        this.artDetail = res.data

      },
      // 删除文章列表
      async deletArtFn(artId){
        // 1. 询问用户是否要删除
          const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)

          // 2. 取消了删除
          if (confirmResult === 'cancel') return
          // 执行删除操作
          const { date: res} = await deletArticalAPI(artId)
          if(this.artList.length === 1){
            if(this.q.pagenum>1){
              this.q.pagenum--
            }
          }

          // 刷新文章列表
          this.getArtList()
      }
    }
}
</script>

<style lang="less" scoped>
.search{
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .sendArt{
    margin-top: 5px;
  }
}
// scoped不会给组件内标签添加data-v属性，所以要用::v-deep穿透选择组件内的标签设置样式
::v-deep .ql-editor{
  min-height: 300px;

}
.the_img{
      width: 350px;
      height: 350px;
}
.title{
  text-align: center;
}
</style>