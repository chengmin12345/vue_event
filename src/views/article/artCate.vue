<template>
  <div>
    <el-card class="box-card">
        <div slot="header" class="clearfix header-box">
          <span>文章分类</span>
          <el-button type="primary" size="mini" @click="addCateShowDialogBtnFn"><span>添加分类</span></el-button>
        </div>
        <!-- 分类数据表格 -->
       <el-table border style="width: 100%" stripe :data="cateList">
        <!-- type是table-column内置属性，告诉它用index,意思是第一个单元格用索引值 -->
        <el-table-column  type="index" label="序号" width="100"></el-table-column>
        <el-table-column  prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column  prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column  label="操作">
          <!-- scope对象：{row:行对象} -->
          <!-- 作用域插槽：情景-》有很多按钮，点击哪个可以拿到哪个的对象 -->
            <template v-slot="scope">
               <el-button type="primary" size="mini" @click="updateCateBtnFn(scope.row)">修改</el-button>
               <el-button type="danger" size="mini" @click="deletArtCateBtnFn(scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加分类的表单 -->
    <!-- .sync类似于v-modle，可以给子组件实现”双向数据绑定“
    本质：给所在标签绑定：props属性名='vue变量' -->
      <el-dialog :title="isEdit?'编辑文件分类':'添加文件分类'" 
          :visible.sync="dialogFormVisible" width="650px" 
          @close="dialogCloseFn">
        <el-form 
            :model="addForm" 
            :rules="addRules" 
            ref="addForm" 
            label-width="80px">
          <el-form-item label="分类名称" prop="cate_name">
            <el-input v-model="addForm.cate_name" ></el-input>
          </el-form-item>
          <el-form-item label="分类别名" prop="cate_alias">
            <el-input v-model="addForm.cate_alias" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
          <el-button type="primary" @click="confirmFn" size="mini">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
/*
经验：如果使用同一个按钮，想要做状态区分
1、定义一个标记变量isEdit(true编辑，false新增)，还有定义本次编辑的数据唯一id值，editId
2、在点击修改时，isEdit改为true,editId保存要修改的数据id
3、在点击新增按钮的时候，isEdit改为false,editId清空
4、点击确定按钮，可以用isEdit变量区分
*/
import { getArtCateListAPI, addArtCateAPI ,updateArtCateAPI ,deletArtCateAPI} from '@/api'
export default {
    name:'artCate',
    data(){
      return{
        cateList:[],
        dialogFormVisible: false,  //增加分类对话框，默认不显示，点击增加才显示
        addForm: {
          cate_name:'',
          cate_alias: '',

        },
        isEdit:false,//true是编辑，false是新增
        editId:'',  //保存要编辑的数据id值
        addRules:{
           cate_name:[
                      {required: true, message: '请输入分类名称', trigger: 'blur'},
                      { 
                          pattern:/^\S{1,10}$/, 
                          message: '昵称必须是1-10位的非空字符串',
                          trigger: 'blur'
                      }
           ],
           cate_alias:[
                      {required: true, message: '请输入分类别名', trigger: 'blur'},
                      { 
                          pattern:/^\S{1,10}$/, 
                          message: '昵称必须是1-10位的非空字符串',
                          trigger: 'blur'
                      }
           ]
        },
        formLabelWidth: '80px'
      };
    },
    methods:{
      // 获取文章分类
      async getArtiCateList(){
        const res = await getArtCateListAPI()
        this.cateList = res.data.data
      },
      // 添加分类按钮
      addCateShowDialogBtnFn(){
        this.editId = ''
        this.dialogFormVisible = true
        this.isEdit = false
      },
      // 对话框确定按钮
      confirmFn(){
        // 发送请求时，进行表单兜底校验
        this.$refs.addForm.validate (
          async (valid) => {
            if(valid){
              // 通过校验
              if(this.isEdit){
                //修改
                // this.addForm.id = this.editId  //把要编辑的文章分类的id添加到对象上
                const {data:res} = await updateArtCateAPI({id:this.editId, ...this.addForm})
                // console.log(res);
                if(res.code === 0){
                  this.$message.success(res.message)
                  }else{
                  this.$message.error(res.message)}

              }else{
                  // 新增
                const { data: res} = await addArtCateAPI( this.addForm)
                    // console.log(res);
                if(res.code === 0){
                  this.$message.success(res.message)
                }else{
                  this.$message.error(res.message)
                }
              }
               // 再次请求一次文章列表，拿到最新数据，让表格更新
               // 添加成功后调用获取文章分类的函数
                  this.getArtiCateList()
                  this.dialogFormVisible = false      
            }else{
              return false
            }
          }
        )

      },
      // 关闭增加类型框,清空表单
      dialogCloseFn(){
        this.$refs.addForm.resetFields()
      },
      // 修改分类按钮 ->点击事件（先做数据回显）
      updateCateBtnFn(obj){
        // obj的值 {id,cate_name,cate_alias}
        // console.log(obj);
        this.isEdit = true
        this.editId = obj.id
        // 点击修改按钮，弹出添加分类框
        this.dialogFormVisible = true
        // 让el-dialog第一次挂载el-form时，先用addForm空字符串初始值绑定到内容，后续用作resetField重置
        // 所以让真实DOM先创建并在内部绑定好”复制“好初始值
        // 接着让真实的DOM更新后绑定好，再给数据回填
        this.$nextTick(()=>{
            // 数据回填
            this.addForm.cate_name = obj.cate_name
            this.addForm.cate_alias = obj.cate_alias
        })
        // console.log(obj);

      },
      // 删除文章分类
      async deletArtCateBtnFn(obj){
        // obj中有id
        console.log(obj);
        const { data:res } = await deletArtCateAPI(obj.id)
        console.log(res)
        if(res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        this.getArtiCateList()
      }
    },
    mounted(){
      this.getArtiCateList()

    }

}
</script>

<style lang="less" scoped>
.header-box{
  display: flex;
  justify-content:space-between;
  align-items: center;
}

</style>>

</style>