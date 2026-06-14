<template>
<div class="menu">
  <!-- 左侧一级分类菜单 -->
 <div class="menu-left">
 <ul>
  <!-- 给左侧菜单项添加一个单击事件 -->
   <!-- 动态绑定 class 样式，激活左侧菜单项 -->
 <li class="menu-item" v-for="(menu, index) in menus" :key="index" :class="{ current: index === currentIndex }" @click="clickList(index)" ref="menuList">
 <p class="text">{{ menu.name }}</p>
 </li>
 </ul>
 </div>
 <!-- 为元素绑定一个 ref 属性，且属性值为 itemList -->
  <!-- ref 属性用于获取 DOM 对象的引用，itemList 需要被赋值为 ref() -->
 <div class="menu-right" ref="itemList">
 <!-- 显示二级分类 -->
 <ul>
  <!-- 遍历一级分类，显示其下的二级分类 -->
 <li class="cate" v-for="(menu, index1) in menus" :key="index1">
 <h4 class="cate-title">{{ menu.name }}</h4>
 <ul class="cate-item">
   <!-- 遍历二级分类 -->
 <li v-for="(item, index2) in menu.children" :key="index2">
 <!-- 点击跳转到商品列表页 -->
  <router-link class="cate-item-wrapper":to="{ name: 'goodsList', params:{ category_id: item.id } }">
 <div class="cate-item-img">
 <img :src="item.picture" alt="">
 </div>
 <span>{{ item.name }}</span>

 </router-link>
 </li>
 </ul>
 </li>
 <!-- 添加一个<li>标签，设置元素的高度 -->
 <li class="cate-bottom"></li>
 </ul>
 </div>
 </div>
</template>
<script setup>
  // 导入 watch 和 nextTick，调用 initRightHeight()监听右侧菜单列表高度
import { onMounted, watch, nextTick, ref, computed } from 'vue'
import { getCategoryList } from '../api'
import BScroll from '@better-scroll/core' // 移动端滚动库
const menus = ref([])
// 定义一个 rightLiTops 数组，用于存储所有分类头部位置
const rightLiTops = ref([])
//动态绑定 class 样式，激活左侧菜单项
const menuList = ref()
//监听右侧滚动事件，当右侧菜单滚动的时候计算出滚动的距离
const scrollY = ref(0) // 右侧列表滑动的 y 轴坐标
//调用 initBScroll()，监听左右菜单的滚动
let leftBScroll = null
let rightBScroll = null
const itemList = ref()
onMounted(() => {
 loadCategoryList()
 //组件挂载后立即执行 RightHeightFix()
 RightHeightFix()
})
// 监听
// nextTick()用于在 DOM 更新之后执行传入的回调函数
watch(menus, () => {
 nextTick(() => {
  initBScroll()
 initRightHeight()
 })
})
// 获取分类数据
const loadCategoryList = async () => {
 let data = await getCategoryList()
 // 将一维数组数据转换为树形结构
 const treeData = convertToTree(data)
 // 将转换后的数据赋值给 menus
 menus.value = treeData
 console.log(treeData)
 console.log(data)
 }
 // 将一维数组转换成树形结构的方法
const convertToTree = data => {
 const treeData = []
 const map = {}
 // 遍历一维数组数据，建立节点映射表
 for (const item of data) {
 map[item.id] = { ...item, children: [] }
 }
 // 遍历映射表，将节点添加到父节点的 children 中
 for (const item of data) {
  const node = map[item.id]
 if (item.pid === 0) {
  // 一级分类：pid为0
 treeData.push(node)
 } else {
  // 二级分类：找到父节点并添加到children
 const parent = map[item.pid]
 parent.children.push(node)
 }
 }
 return treeData
}
// 单击左侧菜单项
const clickList = index => {
console.log(index)
//  单击当前菜单项时，通过 index 索引会得到右侧菜单每一块<li>标签的高度
 console.log(rightLiTops.value[index])
 //单击左侧菜单项，右侧菜单滚动到相应位置
 scrollY.value = rightLiTops.value[index]
 rightBScroll.scrollTo(0, -scrollY.value)
}
// 初始化右侧菜单的高度
const initRightHeight = () => {
 const itemArray = []
 let top = 0
 itemArray.push(top)
 const allList = itemList.value.getElementsByClassName('cate')
 Array.prototype.slice.call(allList).forEach(li => {
 top += li.clientHeight
 itemArray.push(top)
 })
 rightLiTops.value = itemArray
}
//定义 initBScroll()，初始化左菜单和右菜单
// 初始化 BScroll
const initBScroll = () => {
 // 初始化左菜单
 leftBScroll = new BScroll('.menu-left', {
 click: true,
 mouseWheel: true
 })
 // 初始化右菜单
 rightBScroll = new BScroll('.menu-right', {
 click: true,
 mouseWheel: true,
 probeType: 3 // 实时派发 scroll 事件
 })
 //监听右侧滚动事件，当右侧菜单滚动的时候计算出滚动的距离
 rightBScroll.on('scroll', pos => {
 scrollY.value = Math.abs(pos.y)
 })
 }
//  参数：scrollToElement(el, time, offsetX, offsetY, easing)，用于滚动到指定的目标元素。
// easing 缓动函数，一般不建议修改。
// el：目标元素
// 300：滚动动画执行的时长，单位毫秒
// 0：相对于目标元素的横轴偏移量
// -100：相对于目标元素的纵轴偏移量
 const initLeftScroll = index => {
 const menu = menuList.value
 let el = menu[index]
 leftBScroll.scrollToElement(el, 300, 0, -100)
}
 //添加一个<li>标签，设置元素的高度
 const RightHeightFix = () => {
 let bottom = itemList.value.getElementsByClassName('cate-bottom')[0]
 bottom.style.height = itemList.value.clientHeight / 1.2 + 'px'
}
//使用 computed 计算 currentIndex
const currentIndex = computed(() => {
 return rightLiTops.value.findIndex((top, index) => {
 if (index === rightLiTops.value.length - 2) {
 return true
 }
 if (scrollY.value >= top && scrollY.value < rightLiTops.value[index +
1]) {
 initLeftScroll(index)
 return true
 }
 })
})
</script>
<style lang="less" scoped>
ul {
 margin: 0;
 padding: 0;
}
li {
 list-style: none;
}
.menu {
 display: flex;
 position: absolute;
 text-align: center;
 top: 46px;
 bottom: 50px;
 width: 100%;
 overflow: hidden;
 .menu-left {
 flex: 0 0 80px;
 width: 80px;
 background: #f3f5f7;
 line-height: 54px;
 .menu-item {
 height: 54px;
 width: 100%;
 border-bottom: 1px solid #e1e1e1;
 .text {
 width: 100%;
 margin: 0;
 }
 }
 .current {
 width: 100%;
 background: #fff;
 .text {
 color: red;
 }
 }
 }
 .menu-right {
 flex: 1;
 background: #fff;
 .cate {
 height: 100%;
 .cate-title {
 margin: 0;
 text-align: left;
 font-size: 14px;
 color: #333;
 font-weight: bold;
 padding: 10px;
 }
 .cate-item {
 padding: 7px 10px 10px;
 display: flex;
 overflow: hidden;
 flex-flow: row wrap;
 li {
 width: 33.3%;
 .cate-item-wrapper {
 .cate-item-img {
 width: 100%;
 img {
 width: 70px;
 height: 70px;
 }
 }
 span {
 display: inline-block;
 font-size: 14px;
 color: #333;
 }
 }
 }
 }
 }
 }
 }
</style>