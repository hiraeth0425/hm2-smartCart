import { getInfo, setInfo } from '@/utils/storage'
export default {
  namespaced: true,
  state () {
    return {
      // 個人權證相關
      userInfo: getInfo()
    }
  },
  mutations: {
    setUserInfo (state, obj) {
      state.userInfo = obj
      setInfo(obj)
    }
  },
  actions: {
    logout (context) {
      // 個人信息要重置
      context.commit('setUserInfo', {})

      // 購物車信息要重置(跨模塊調用 mutation)
      context.commit('setCartList', [], { root: true })
    }
  },
  getters: {

  }
}
