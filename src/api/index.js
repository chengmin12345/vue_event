// 封装的是具体的接口请求方法
// 注意：每个方法只负责一个url地址
import request from '@/utils/request'  //引入自定义的axios函数

/**
 *注册接口
 * @param {*} param0 {username:用户名，password:密码,repassword:确认密码}
 * @returns Promise对象
 */
// 导出接口方法，为了在逻辑页面引入调用
export const registerAPI = ({username,password,repassword}) => {  //从传入的form对象中解构赋值
    // 原地是一个Promise对象（内部包含原生的ajax)
    // return这个Promise对象到逻辑页面，去那边对Promise对象提取结果
   return request({
        url:'/api/reg',
        method:'POST',
        data:{//Es6简写
            username,
            password,
            repassword
        
    }
    })
}

/**
 * 登录接口
 * @param {*} param0 {username:用户名，password:密码}
 * @returns Promise对象
 */
export const loginAPI = ({username,password}) =>{
    return request({
        url:'/api/login',
        method:'POST',
        data:{
            username,
            password
        }
    })
}

/**
 * 获取用户信息接口
 * @param {*} param0 
 * @returns Promise对象
 */
export const getUserInfoAPI = () => {
    return request({
        url:'/my/userinfo',
        // methods不写，默认get方法
        // 传参给后台：params（查询字符串quray),data(请求体body),headers(请求体)
        // headers:{
        //     Authorization: store.state.token
        // },
    })
}

/**
 * 获取侧边栏数据接口
 * @param {*} param0 
 * @returns Promise对象
 */
export const getMenuListAPI = () => {
    return request({
        url:'/my/menus',
    })
}

/**
 * 更新基本资料接口
 * @param {*} param0 
 * @returns Promise对象
 */
export const updateUserInfoAPI = ({ id, username, nickname, email , user_pic}) => {
    return request({
        url:'/my/userinfo',
        methods:'PUT',
        data:{
            id,
            username,
            nickname,
            email,
            user_pic
        }

    })
}

/**
 * 更新用户头像接口
 * @param {*} avatar
 * @returns Promise对象
 */
export const updateUserAvatarAPI = (avatar) =>{
    return request({
        url:'/my/update/avatar',
        method:'PATCH',
        data:{
            avatar  //头像base64字符串
        }
    })
}
/**
 * 更新用户密码接口
 * @param {*}  
 * @returns Promise对象
 */
export const updateUserPwdAPI =( {old_pwd, new_pwd,re_pwd}) =>{
    return request({
        url:'my/updatepwd',
        method:'PATCH',
        data:{
            old_pwd,
            new_pwd,
            re_pwd
        }
    })
}
/**
 * 获取文章分类接口
 * @param {*}  {  cate_name, cate_alias}
 * @returns Promise对象
 */
export const getArtCateListAPI = () => {
    return request({
        url:'/my/cate/list'
    })
}
/**
 * 增加文章分类接口
 * @param {*}  {  cate_name, cate_alias}
 * @returns Promise对象
 */
export const addArtCateAPI = ({ cate_name, cate_alias}) => {
   return request({
    url:'/my/cate/add',
    method:'POST',
    data:{  
        cate_name, 
        cate_alias
        }
   })
}
/**
 * 更新文章分类接口
 * @param {*}  { id, cate_name, cate_alias}
 * @returns Promise对象
 */
export const updateArtCateAPI = ({ id, cate_name, cate_alias}) => {
    return request({
        url:'/my/cate/info',
        method:'PUT',
        data:{
            id,
            cate_name, 
            cate_alias

        }
    })
}
/**
 * 删除文章分类接口
 * @param {*}  {id}
 * @returns Promise对象
 */
export const deletArtCateAPI = (id) =>{
    return request({
        url: '/my/cate/del',
        method: 'DELETE',
        params: {
          id
        }
      })
}
/**
 * 发布文章接口
 * @param {*}  fd  FormData表单数据对象
 * @returns Promise对象
 */
 export const uploadArtileAPI = (fd) =>{
    return request({
        url: '/my/article/add',
        method: 'POST',
        data:fd
        // 这个接口文档要求请求体里是一个FormData类型（表单数据对象）携带给后台
      })
}
/**
 * 获取文章列表接口
 * @param {*}  {pagenum ,pagesize ,cate_id ,state }
 * @returns Promise对象
 */
export const getArtListAPI = ({pagenum ,pagesize ,cate_id ,state }) => {
    return request({
        url:'/my/article/list',
        params:{
            pagenum,
            pagesize,
            cate_id,
            state
        }
    })
}
/**
 * 获取文章详情接口
 * @param {*}  
 * @returns Promise对象
 */
export const getArtDetailAPI = ( id ) => {
    return request({
        url:'/my/article/info',
        params:{
            id
        }

    })
}
/**
 * 删除文章接口
 * @param {*}  
 * @returns Promise对象
 */
export const deletArticalAPI = (id) => {
    return request({
        url:'/my/article/info',
        method:'DELETE',
        params:{
            id
        }
    })
}