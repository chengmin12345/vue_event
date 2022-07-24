<template>
    <div class="app">
          <!-- 一级路由规则对象组件的挂载点 -->
          <router-view></router-view>
    </div>
  
</template>

<script>
export default {
    name:'App',
    // created(){
    //     this.$store.dispatch('getUserInfoActions')
    // }
}
</script>

<style scoped>
.app{
    height: 100%;
}
</style>
