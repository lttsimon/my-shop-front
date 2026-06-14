import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
 history: createWebHistory(), // 使用History模式
 routes: [
 {
  path: '/', 
 redirect: '/home', 
 //meta：用于在路由规则中保存一些附加信息，从而控制页面标题和标签栏等。
 meta: { title: '首页' } 
 },
 { 
 path: '/home', 
 component: () => import('../pages/Home.vue'),
 name: 'home',
    // 路由元数据说明：
      // title: 页面标题
      // isTab: 是否显示底部TabBar（true显示，false不显示）
      // isShowNav: 是否显示顶部导航栏
      // isShowBack: 是否显示返回按钮
 meta: { title: '首页', isTab: true }
 },
 { 
 path: '/category', 
 component: () => import('../pages/Category.vue'), 
 name: 'category',
// isTab：是否显示底部 Tabbar 标签栏，true 表示显示，false 表示不显示。
// isShowNav：是否显示 NavBar 导航栏，true 表示显示，false 表示不显示。
// isShowBack： 是否显示导航栏中的返回箭头，true 表示显示，false 表示不显示。
 meta: { title: '分类', isTab: true, isShowNav: true }
 },
 {
 path: '/message',
 component: () => import('../pages/Message.vue'),
 name: 'message',
 meta: { title: '消息', isTab: true, isShowNav: true }
 },
 {
 path: '/cart',
 component: () => import('../pages/Cart.vue'),
 name: 'cart',
 meta: { title: '购物车', isTab: true, isShowNav: true, isShowBack: true }
 },
 { 
 path: '/user', 
 component: () => import('../pages/User.vue'), 
 name: 'user', 
 meta: { title: '我的', isTab: true }
 },
 {
 path: '/login',
 component: () => import('../pages/Login.vue'), 
 name: 'login', 
 meta: { title: '登录', isTab: true, isShowNav: true, isShowBack: true
} 
 },
 //注册页面的路由
 { 
 path: '/register', 
 component: () => import('../pages/Register.vue'), 
 name: 'register', 
 meta: { title: '注册', isTab: true, isShowNav: true, isShowBack: true
} 
 },
 //“props: true”用于将路由参数作为组件的 props 传递，使得在组件中可以通过 props 接收路由参数
{ 
 path: '/goodsList/:category_id', // 动态路由参数
 component: () => import('../pages/GoodsList.vue'), 
 props: true, // 重要：将路由参数作为props传递给组件
 name: 'goodsList', 
 meta: { title: '商品列表', isTab: true, isShowNav: true, isShowBack: true } 
 },
 //添加商品详情页的路由
 {
 path: '/goodsDetail/:id',  // 商品详情页，接收商品ID
 component: () => import('../pages/GoodsDetail.vue'), 
 props: true, // 自动将路由参数转换为组件props
 name: 'goodsDetail', 
 meta: { title: '商品详情', isTab: false, isShowNav: true, isShowBack: true } 
 },
 ]
})
// 全局路由守卫
router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title
if (title) {
document.title = title + ' - 微商城' // 动态设置页面标题
}
next() 
})
export default router