import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/views/layout'
import store from '@/store'
import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'

const Login = () => import('@/views/login')
const Search = () => import('@/views/search')
const SearchList = () => import('@/views/search/list.vue')
const Prodetail = () => import('@/views/prodetail')
const Pay = () => import('@/views/pay')
const Myorder = () => import('@/views/myorder')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/',
      component: Layout,
      redirect: './home',
      children: [
        { path: '/home', component: Home },
        { path: '/category', component: Category },
        { path: '/cart', component: Cart },
        { path: '/user', component: User }
      ]
    },
    { path: '/search', component: Search },
    { path: '/searchlist', component: SearchList },
    // 動態路由傳參,確認將來是哪個商品, 路由參數中攜帶id
    { path: '/prodetail/:id?', component: Prodetail },
    { path: '/pay', component: Pay },
    { path: '/myorder', component: Myorder }
  ]
})

// 全局前置導航守衛
// next():是否放行
//  1.next() 直接放行,放行到to要去的路徑
//  2.next(路徑) 直接攔截,攔截到next裡面配置的路徑

const authUrls = ['/pay', '/myorder']
router.beforeEach((to, from, next) => {
  // 看 to.path 是否在 authUrls 中出現過
  if (!authUrls.includes(to.path)) {
    // 非權限頁面直接放行
    next()
    return
  }
  // 是權限頁面, 需要判斷token
  const token = store.getters.token
  console.log(token)
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
