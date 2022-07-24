<template>
<div>
    <div class="contain-fluid">
        <el-row  class="spannel_list" :gutter="10">
            <el-col :sm="6" :xs="12">
               <div class="spannel cl1">
                   <em>10015</em><i>篇</i>
                   <span>总文章数</span>
              </div>
            </el-col>
            <el-col :sm="6" :xs="12">
               <div class="spannel cl2">
                    <em>123</em><i>篇</i>
                    <span>日新增文章数</span>
                </div>
            </el-col>
            <el-col :sm="6" :xs="12">
               <div class="spannel cl3">
                    <em>35</em><i>条</i>
                    <span>评论总数</span>
               </div>  
            </el-col>
            <el-col :sm="6" :xs="12">
               <div class="spannel cl4">
                    <em>123</em><i>条</i>
                    <span>日新增评论数</span>
                </div>             
            </el-col>
        </el-row>
    </div>
    <div class="contain-fluid">
        <el-row  class="curve-pie" :gutter="10">
            <el-col :sm="16" :xs="16">
               <div  class="gragh_pannel" id="curve_show"></div>
            </el-col>
            <el-col :sm="8" :xs="8">
               <div class="gragh_pannel" id="pie_show"></div>
            </el-col>
        </el-row>
    </div>
    <div class="contain-fluid">
       <div class="column_pannel"></div>
    </div>

</div>
  
</template>

<script>
// echarts内部用的是命名导出 export const 变量名 多个
import * as echarts from 'echarts'

export default {
    name:'home',
    mounted () {
      //调用初始化面积图函数
      this.initCurveFn()
      //调用文章数量比函数
      this.initartNumFn()
     // 调用文章访问量函数  
     this.initartVisiteFn()
    },
    methods:{
        // 初始化面积图
        initCurveFn(){
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById('curve_show'));
            // 绘制图表
            myChart.setOption({
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    areaStyle: {}
                    }
                ]
                });
        },
        // 初始化文章数量比函数
        initartNumFn(){
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById('pie_show'));
            // 绘制图表
            myChart.setOption({
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        data: ['A', 'B', 'C', 'D', 'E']
                    },
                    series: [
                        {
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center',
                            emphasis: {
                            show: true
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        emphasis: {
                            label: {
                            show: true,
                            fontSize: '30',
                            fontWeight: 'bold'
                            }
                        },
                        data: [
                            { value: 335, name: 'A' },
                            { value: 310, name: 'B' },
                            { value: 234, name: 'C' },
                            { value: 135, name: 'D' },
                            { value: 1548, name: 'E' }
                        ]
                        }
                    ]
                    })
                        },
        // 初始化文章访问量
        initartVisiteFn(){
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.querySelector('.column_pannel'));
            // 绘制图表
            myChart.setOption({
                legend: {},
                tooltip: {},
                dataset: {
                    source: [
                    ['product', '奇趣事', '会生活', '爱旅行','趣美味'],
                    ['一月', 800, 400, 500, 600],
                    ['二月', 708, 468,668,508],
                    ['三月', 920, 520,520,720],
                    ['四月', 1090, 690, 790,890],

                    ]
                },
                xAxis: { type: 'category' },
                yAxis: {},
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' },{ type: 'bar' }]
                });
        }
    }

}
</script>

<style lang="less" scoped>
// 第一行样式
.spannel_list{
    margin-top:20px;
    .spannel{
        height: 100px;
        overflow: hidden;
        text-align: center;
        position: relative;
        background-color: #fff;
        border:1px solid #e7e7e9;
        margin-bottom:20px;
        em{
            font-style: normal;
            font-size: 50px;
            line-height: 50px;
            display: inline-block;
            margin:10px 0 0 20px;
            font-family: 'Arial';

        }
        &.cl1{
            color:#83a2ed
        }
        
        &.cl2{
            color: #6ac6e2;
        }
        
        &.cl3{
             color: #5fd9de;
        }
        
        &.cl4{
             color: #58d88e;
        }
        i{
            font-size: 14px;
            display: inline-block;
            color: #83a2ed;
            margin-left: 10px; 
            font-style:normal
        }
        span {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            line-height: 24px;
            background: #e5e5e5;
            color: #333;
            font-size: 14px;
            font-weight: normal;  
        }
    }
}
// 第二行样式
.gragh_pannel{
    height: 350px;
    border:1px solid #e7e7e9;
    background-color: #fff !important;
    margin-bottom: 20px;
}

//   主体第三行样式
.column_pannel{
    margin-bottom:20px;
    height: 400px;
    border:1px solid #e7e7e9;
    background-color: #fff !important;
}

</style>