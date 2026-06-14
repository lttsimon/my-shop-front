<template>
 <div class="home-grid">
 <van-grid :column-num="5" square :gutter="5">
 <van-grid-item v-for="list in menulist" :key="list">
 <van-image :src="list.url" />
 <span>{{ list.text }}</span>
 </van-grid-item>
 </van-grid>
 </div>
</template>
<script setup>
import menu1 from '/images/menu1.jpg'
import menu2 from '/images/menu2.jpg'
import menu3 from '/images/menu3.jpg'
import menu4 from '/images/menu4.jpg'
import menu5 from '/images/menu5.jpg'
import menu6 from '/images/menu6.jpg'
import menu7 from '/images/menu7.jpg'
import menu8 from '/images/menu8.jpg'
import menu9 from '/images/menu9.jpg'
import menu10 from '/images/menu10.jpg'
const menulist = [
 { text: '今日爆款', url: menu1 },
 { text: '好物分享', url: menu2 },
 { text: '推荐购买', url: menu3 },
 { text: '购物心得', url: menu4 },
 { text: '直播专区', url: menu5 },
 { text: '签到中心', url: menu6 },
 { text: '值得购买', url: menu7 },
 { text: '每日优惠', url: menu8 },
 { text: '充值中心', url: menu9 },
 { text: '我的客服', url: menu10 }
]
</script>
<style lang="less" scoped> 
.home-grid {
 .van-image {
 width: 55%;
 }
 span {
 font-size: 12px;
 }
}
</style>