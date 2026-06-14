import { defineStore } from 'pinia'
import { ref } from 'vue'
const useCart = defineStore('cart', () => {
 const cart = ref([])
 /**
   * 添加商品到购物车
   * @param {Object} goods - 商品信息 {id, num, checked}
   */
 const addToCart = goods => {
   // 查找购物车中是否已有该商品
 const item = cart.value.find(item => goods.id == item.id)
 if (item) {
  // 商品已存在，增加数量
 item.num += goods.num
 } else {
  // 商品不存在，添加到购物车
 cart.value.push(goods)
 }
 }
 /**
   * 从购物车移除商品
   * @param {string} id - 商品ID
   */
 const removeCart = id => {
 cart.value.forEach((item, index) => {
 if (item.id == id) {
 cart.value.splice(index, 1)// 删除指定商品
 }
 })
 }
  /**
   * 计算购物车商品总数量
   * @returns {number} 商品总数量
   */
 const cartCount = () => {
 let sum = 0
 cart.value.forEach(item => {
 sum += item.num
 })
 return sum 
 }
 return { cart, addToCart, removeCart, cartCount }
}, {
 persist: {
 enabled: true,// 启用持久化
 strategies: [
 {
 key: 'cart',// 存储键名
 storage: localStorage// 使用localStorage
 }
 ]
 }
})
export default useCart