<template>
<div class="cart">
 <div class="cart-container">
  <!-- 空购物车提示 -->
 <van-empty v-show="goodsList.length == 0" description="购物车目前还没有商品" :image="cartEmptyImage">
 <!-- 去购物按钮 -->
  <router-link :to="{ name: 'category' }">
 <van-button round type="danger" class="bottom-button">去购物</van-button>
 </router-link>
 </van-empty>
 <!-- 购物车列表 -->
  <div v-for="item in goodsList" :key="item.id" class="list">
    <!-- 电脑端固定删除按钮 -->
   <van-button 
     class="delete-btn-fixed"
     size="mini" 
     type="danger" 
     icon="delete"
     @click="onDelete(item)"
   >
     删除
   </van-button>
 <van-swipe-cell>
 <!-- 复选框 -->
 <div class="checkbox">
 <van-checkbox 
   :name="item" 
   v-model="item.cart.checked" 
   @change="onCheck"
   checked-color="#f11a27"
 ></van-checkbox>
 </div>
 <!-- 商品图片 -->
 <div class="image">
 <router-link :to="{ name: 'goodsDetail', params: { id: item.id} }">
 <van-image width="50" height="50" :src="item.picture" />
 </router-link>
 </div>
 <!-- 商品信息 -->
 <div class="goods-info">
 <div>{{ item.name }}</div>
 <div class="bottom">
 <div class="price"><span>￥</span>{{ item.price }}</div>
 <van-stepper v-model="item.cart.num" theme="round" button-size="22" disable-input />
 </div>
 </div>
 <!-- 左滑删除 -->
 <template #right>
 <van-button square icon="delete" type="danger" class="delete-button" @click="onDelete(item)"/>
 </template>
 </van-swipe-cell>
 </div>
 </div>
 <!-- 结算 -->
 <van-submit-bar v-show="goodsList.length" :price="total * 100" button-text="去结算" button-type="primary" @submit="onSubmit" class="settlement">
  <van-checkbox v-model="allChecked" checked-color="#f11a27" @click="onCheckAll">全选</van-checkbox>
 </van-submit-bar>
 </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCartList } from '../api'
import useCart from '../stores/cart'
import { showToast } from 'vant'

const cartEmptyImage = '/images/cart_empty.png'
const { cart, removeCart } = useCart()// 购物车store
const goodsList = ref([])// 购物车商品列表（带详细信息）
const allChecked = ref(false)// 全选状态

// 去结算
const onSubmit = () => {
 showToast('暂无后续逻辑~')
}

onMounted(async() => {
  await loadCart() // 加载购物车数据
  onCheck()// 初始化全选状态
})

// 加载购物车数据
const loadCart = async () => {
  // 从cart store提取商品ID数组
  const ids = cart.map(item => item.id)
  console.log('商品ID列表:', ids)
  
  // 购物车为空处理
  if (ids.length === 0) {
    goodsList.value = []
    return
  }
  // 请求商品详情
  goodsList.value = await getCartList({ ids: ids.join(',') })
  
  // 确保每个商品都有 cart 对象
  // 合并购物车数据（数量、选中状态）
  goodsList.value.forEach(goods => {
     // 在cart store中查找对应商品
    const cartItem = cart.find(item => goods.id == item.id)
     // 创建cart对象，存储数量和选中状态
      // 使用可选链操作符(?.)和空值合并操作符(||)
    goods.cart = {
      checked: cartItem?.checked !== undefined ? cartItem.checked : true,// 默认选中
      num: cartItem?.num || 1// 默认数量1
    }
  })
  
  console.log('加载后的商品列表:', goodsList.value)
}

// 删除商品
const onDelete = item => {
 const id = item.id
 // 从本地列表移除
 goodsList.value.forEach((item, index) => {
 if (item.id == id) {
 goodsList.value.splice(index, 1)
 }
 })
 // 从store移除
 removeCart(id)
 showToast('删除成功')
}

// 总金额
const total = computed(() => {
  let sum = 0
  goodsList.value.forEach(item => {
    if (item.cart.checked) {
      sum += item.price * item.cart.num
    }
  })
  return sum
})

// 全选
const onCheckAll = () => {
  // 设置所有商品的选中状态
 goodsList.value.forEach(el => {
 el.cart.checked = allChecked.value
 })
}
// 商品都被选中时，全选按钮高亮
const onCheck = () => {
  // 检查全选：使用every方法
 allChecked.value = goodsList.value.every(el => el.cart.checked)
}

// 移除 onCheck 函数，因为它不再需要
</script>

<style lang="less" scoped>
.cart {
 margin: 0.3rem;
 padding: .05rem 0 3rem 0;/* 底部留出结算栏空间 */
 .cart-container {
 margin-top: 1rem;
 .list {
 position: relative;
 height: 5rem;
 border-radius: 10px;
 box-shadow: 0px 0px 5px #ccc;
 margin-bottom: 1rem;
 .checkbox {
 position: absolute;
 top: 1.7rem;
 left: .2rem;
 }
 .image {
 position: absolute;
 top: .7rem;
 left: 2rem;
 }
 .goods-info {
 height: 5rem;
 display: flex;
 justify-content: space-around;
 flex-direction: column;
 padding: 0 1rem 0 6rem;
 .bottom {
 display: flex;
 justify-content: space-between;
 align-items: center;
 .price {
 color: #c82519;
 font-size: .45rem;
 
 }
 }
 }
 .delete-button {
 width: 2rem;
 height: 100%;
 }
 }
 .bottom-button {
 width: 7rem;
 height: 2rem;
 }
 }
 .settlement {
 margin-bottom: -0.1rem;
 }
}
:deep(.van-submit-bar) {
 bottom: 3.5rem;
}
:deep(.van-swipe-cell) {
 width: 100%;
}
/* 在电脑端隐藏左滑指示 */
 @media (min-width: 769px) {
   :deep(.van-swipe-cell__right) {
     display: none;
   }
   
   /* 在电脑端添加固定的删除按钮 */
   .list {
     position: relative;
     
     .delete-btn-fixed {
       position: absolute;
       top: 0.5rem;
       right: 0.5rem;
       z-index: 10;
     }
   }
 }
</style>