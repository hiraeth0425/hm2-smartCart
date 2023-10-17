export default {
  // 此處編寫的就是 Vue組件實例的配置項, 通過一定語法, 可以直接混到組件內部

  // 加入購物車 token 判斷
  // 1.token 不存在,彈確認框
  // 2.token存在, 繼續請求操作
  methods: {
    loginConfirm () {
      if (!this.$store.getters.token) {
        // console.log('彈確認框')
        this.$dialog.confirm({
          title: '溫馨提示',
          message: '此時需要先登入才能繼續操作哦',
          confirmButtonText: '去登入',
          cancelButtonText: '再逛逛'
        }).then(() => {
          //  on confirm
          // 如果希望, 跳轉到登入 -> 登入後再跳回來, 跳轉需要攜帶參數(當前路徑地址)
          // this.$route.fullPath (會包含查詢參數)
          this.$router.replace({
            path: '/login',
            query: {
              backUrl: this.$route.fullPath
            }
          })
        }).catch(() => {
          // on cancel
        })
        return true
      }
      return false
    }
  }
}
