import { getCartList, getCartCount, delSelect } from '@/api/cart'
import { Toast } from 'vant'

export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    setCartList (state, newList) {
      state.cartList = newList
    },
    toggleCheck (state, goodsId) {
      // 讓對應id的item 狀態取反
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    toggleAllcheck (state, flag) {
      // 讓所有的小選框 同步設置
      state.cartList.forEach(item => { item.isChecked = flag })
    },
    setChangeCount (state, obj) {
      const { goodsNum, goodsId } = obj
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.goods_num = goodsNum
    }
  },
  actions: {
    async getCartAction (context) {
      const { data } = await getCartList()
      // 後台的返回數據中, 不包含複選框狀態, 為了實現將來的功能 手動添加
      data.list.forEach(item => { item.isChecked = true })
      context.commit('setCartList', data.list)
    },
    // 更新購物車商品數量
    async changeCountAction (context, obj) {
      const { goodsNum, goodsId, goodsSkuId } = obj
      // 先本地修改數量
      context.commit('setChangeCount', { goodsNum, goodsId })
      // 再同步到後台
      await getCartCount(goodsId, goodsNum, goodsSkuId)
    },
    // 刪除購物車商品
    async delSelectAction (context) {
      const selCartList = context.getters.cartChecked
      const cartIds = selCartList.map(item => item.id)
      await delSelect(cartIds)
      Toast('刪除成功')

      // 重新最新購物車數據 (重新渲染)
      context.dispatch('getCartAction')
    }
  },
  getters: {
    // 所有商品數量總計
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },

    // 已勾選數量總計
    cartChecked (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    checkedTotal (state, getters) {
      return getters.cartChecked.reduce((sum, item) => sum + item.goods_num, 0)
    },

    // 已勾選 總價
    cartPrice (state, getters) {
      return getters.cartChecked.reduce((sum, item) => sum + item.goods_num * item.goods.goods_price_min, 0).toFixed(2)
    },

    // 是否全選
    isAllchecked (state) {
      return state.cartList.every(item => item.isChecked)
    }
  }
}
