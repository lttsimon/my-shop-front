<template>
<div class="goods-list">
 <div class="goods-item" v-for="item in goodsList" :key="item.id">
 <router-link :to="{ name: 'goodsDetail', params: { id: item.id } }">
 <van-image
 width="150"
 height="150"
 :src="item.picture"
 />
 <h1 class="title">{{ item.name }}<span class="small">{{ item.spec}}</span></h1>
 <p class="info">
 <span class="price">¥{{ item.price }}</span>
 <span class="sell">剩余 {{ item.stock }} 件</span>
 </p>
 </router-link>
 </div>
 <!-- 添加“加载更多”按钮 -->
 <van-button class="more" :disabled="is_last" v-if="goodsList.length !== 0" size="large" type="primary" plain hairline @click="getMore">加载更多</van-button>
 </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { getGoodsList } from '../api'
import { showToast } from 'vant'
const goodsList = ref([])
//last_id 用于记录当前查询的商品列表中的最后一个商品的 id，用于在下次发送请求时，将 last_id 传给服务器，从而实现“加载更多”的功能
let last_id = '0'
const is_last = ref(false)
const props = defineProps({
 category_id: String
})
onMounted(() => {
 loadGoodList()
})
const loadGoodList = async () => {
 console.log(props.category_id)
 //请求接口返回的数据
 let params = {
  last_id,
 category_id: props.category_id,
 pagesize: 4
 }
 const data = await getGoodsList(params)
 if (data.length > 0) {
 goodsList.value = goodsList.value.concat(data)
 last_id = data[data.length - 1].id
 } else if (goodsList.value.length > 0) {
 // 已经到达底部
 showToast({
 message: '已经到达底部',
 type: 'fail'
 })
 is_last.value = true
 } else {
 // 列表为空
 showToast({
 message: '列表为空',
 type: 'fail'
 })
 }
}
const getMore = () => {
 loadGoodList()
}
</script>
<style lang="less" scoped>
.goods-list {
 display: flex;
 flex-wrap: wrap;
 padding-left: 10px;
 clear: both;
 .goods-item {
 width: calc(calc(100% / 2) - 12px);
 margin: 10px 10px 0 0;
 display: flex;
 flex-direction: column;
 justify-content: space-between;
 border-radius: 10px;
 border: 1px solid #efeff4;
 padding: 10px 0;
 clear: both;
 .title {
 text-align: left;
 font-size: 14px;
 color: #333;
 margin: 10px 0 0;
 padding: 0 5px;
 .small {
 font-size: 12px;
 padding-left: 2px;
 color: #999;
 }
 }
 .info {
 display: flex;
 justify-content: space-between;
 margin-bottom: 0;
 padding: 0 5px;
 .price {
 color: red;
 font-weight: bold;
 font-size: 16px;
 }
 .sell {
 font-size: 13px;
 color: #999;
 }
 }
 }
 .more {
 margin: 40px 20px 40px 10px;
 font-size: 14px;
 }
}
</style>