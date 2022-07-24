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
            // 绘制面积图表
            // 数据源(模拟后台返回的数据)
            const aListAll = [
              { count: 36, date: '2019-04-13' },
              { count: 52, date: '2019-04-14' },
              { count: 78, date: '2019-04-15' },
              { count: 85, date: '2019-04-16' },
              { count: 65, date: '2019-04-17' },
              { count: 72, date: '2019-04-18' },
              { count: 88, date: '2019-04-19' },
              { count: 64, date: '2019-04-20' },
              { count: 72, date: '2019-04-21' },
              { count: 90, date: '2019-04-22' },
              { count: 96, date: '2019-04-23' },
              { count: 100, date: '2019-04-24' },
              { count: 102, date: '2019-04-25' },
              { count: 110, date: '2019-04-26' },
              { count: 123, date: '2019-04-27' },
              { count: 100, date: '2019-04-28' },
              { count: 132, date: '2019-04-29' },
              { count: 146, date: '2019-04-30' },
              { count: 200, date: '2019-05-01' },
              { count: 180, date: '2019-05-02' },
              { count: 163, date: '2019-05-03' },
              { count: 110, date: '2019-05-04' },
              { count: 80, date: '2019-05-05' },
              { count: 82, date: '2019-05-06' },
              { count: 70, date: '2019-05-07' },
              { count: 65, date: '2019-05-08' },
              { count: 54, date: '2019-05-09' },
              { count: 40, date: '2019-05-10' },
              { count: 45, date: '2019-05-11' },
              { count: 38, date: '2019-05-12' }
            ]

            // 但是图标要求直接给数字的值, 所以要把对象的值取出来形成2个只有值的数组
            const aCount = []
            const aDate = []

            for (let i = 0; i < aListAll.length; i++) {
              aCount.push(aListAll[i].count)
              aDate.push(aListAll[i].date)
            }

            // 绘制图表
            myChart.setOption({
                title: {
                    text: '月新增文章数', // 标题
                    left: 'center', // 位置居中
                    top: '10' // 标题距离容器顶部px
                  },
                tooltip: { // 提示框组件
                    trigger: 'axis' // 坐标轴触发(鼠标放在坐标轴就能出提示框)
                  },
                legend: { // 图例组件(每种颜色的意思)
                      data: ['新增文章'], // 图例文字解释(要和series里name对应)
                      top: '40' // 距离容器顶部px
                    },
                toolbox: {
                    feature: {
                      mark: { show: true }, // 辅助线开关
                      dataView: { readOnly: false },
                      magicType: {type: ["line", "bar"]},
                      magicType: { show: true, type: ['line', 'bar'] }, // 动态类型切换
                      restore: {show: true},
                      saveAsImage: {show: true}
                    }
                  },
                grid: {
                    show: true,
                    x: 50,
                    x2: 50,
                    y: 80,
                    height: 220
                  },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    name:'日',
                    boundaryGap: false, // 坐标轴两边留白策略 (不留白)
                    data: aDate // 水平轴上的数字数据 (时间)
                },
                yAxis: {
                    type: 'value',
                    name:'月新增文章数'
                },
                color: ['#ff9565'], // 系列颜色
                series: [
                 {
                  name:'新增文章',
                  type: 'line', // 折线图
                  smooth: true, // 是否平滑视觉引导线，默认不平滑，可以设置成 true 平滑显示
                  areaStyle: { type: 'default' }, // 区域填充样式。设置后显示成区域面积图。
                  itemStyle: { color: '#f80', lineStyle: { color: '#f80' } }, // 折线拐点标志的样式。
                  data: aCount // 真正数据源(用下标和x轴数组对应)
                 }   
                ]
                })
        },
        // 初始化文章数量比函数
        initartNumFn(){
            // 基于准备好的dom，初始化echarts实例
            const myChart = echarts.init(document.getElementById('pie_show'));
            // 绘制图表
            myChart.setOption({
                    title: {
                      text: '分享文章数量比', // 标题
                      left: 'center', // 位置居中
                      top: '10' // 标题距离容器顶部px
                    },
                    color: ['#5885e8', '#13cfd5', '#00ce68', '#ff9565'], // 系列颜色
                    toolbox: {
                        left:'center',
                        top:'35',
                        show: true,
                        feature: {
                          dataView: {readOnly: false},                     
                          restore: {show: true},
                          saveAsImage: {show: true}
                        }
                    },
                    legend: {
                        orient: 'horizontal',
                        x: 'center',
                        top:'70',
                        data: ['奇趣事', '会生活', '爱旅行', '趣美味']
                    },
                    tooltip: {
                      trigger:'item'  ,//在图形上才会触发提示
                      formatter:'访问来源 <br> {b} : {c} ({d}%)',   //提示文字的格式
                      // a: 系列名
                      // b: 数据名
                      // c: 数值
                      // d: 百分比 (只有饼状图生效)
                    },
                    series: [
                        {
                        type: 'pie',
                        top:'80',
                        radius: ['60%', '80%'],
                        avoidLabelOverlap: false,
                        emphasis: {
                            label: {
                            show: true,
                            }
                        },
                        data: [
                            { value: 300, name: '奇趣事' },
                            { value: 100, name: '会生活' },
                            { value: 260, name: '爱旅行' },
                            { value: 180, name: '趣美味' }
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
                title: {
                      text: '文章访问量', // 标题
                      left: 'center', // 位置居中
                      top: '10' // 标题距离容器顶部px
                    },
                tooltip: { trigger: 'axis'},
                toolbox: {
                    feature: {
                      mark: { show: true },
                      dataView: {readOnly: false},
                      magicType: { type: ["line", "bar"]},
                      restore: {show: true},
                      saveAsImage: {show: true}
                    }
                  },
                color: ['#fd956a', '#2bb6db', '#13cfd5', '#00ce68'], // 系列颜色
                legend: {
                    orient: 'horizontal',
                    x: 'center',
                    top:'50',
                    },
                dataset: {
                    source: [
                    ['product', '奇趣事', '会生活', '爱旅行','趣美味'],
                    ['一月', 800, 400, 500, 600],
                    ['二月', 708, 468,668,508],
                    ['三月', 920, 520,520,720],
                    ['四月', 1090, 690, 790,890],
                    ['五月', 1200, 800, 900,1000]
                    ]
                },
                grid: {
                    show: true,
                    x: 50,
                    x2: 30,
                    y: 80,
                    height: 260
                  },
                xAxis: {  type: 'category' },
                yAxis: {  name:'访问量' },
                series:[
                  {type:'bar',barWidth:20},
                  {type:'bar',barWidth:20},
                  {type:'bar',barWidth:20},
                  {type:'bar',barWidth:20}
                  ],
              dataZoom: [ // 给x轴设置滚动条
                  {
                    start: 0, // 默认为0
                    end: 100 - 1000 / 31, // 默认为100
                    type: 'slider',
                    show: true,
                    xAxisIndex: [0],
                    handleSize: 0, // 滑动条的 左右2个滑动条的大小
                    height: 8, // 组件高度
                    left: 45, // 左边的距离
                    right: 50, // 右边的距离
                    bottom: 26, // 右边的距离
                    handleColor: '#ddd', // h滑动图标的颜色
                    handleStyle: {
                      borderColor: '#cacaca',
                      borderWidth: '1',
                      shadowBlur: 2,
                      background: '#ddd',
                      shadowColor: '#ddd'
                    }
                  }
                ]
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