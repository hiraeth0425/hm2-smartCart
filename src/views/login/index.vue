<template>
  <div>
    <!-- 頭部 -->
  <div class="login">
    <van-nav-bar title="會員登入" left-arrow @click-left="$router.go(-1)"></van-nav-bar>
  </div>
    <!-- 主體 -->
    <div class="container">
      <div class="title">
        <h3>手機號註冊</h3>
        <p>未註冊的手機號登入後將自動註冊</p>
      </div>
      <div class="form">
        <div class="form-item">
          <input v-model="mobile" class="inp" maxlength="11" placeholder="請輸入手機號碼" type="text">
        </div>
        <div class="form-item">
          <input v-model="picCode" class="inp" maxlength="5" placeholder="請輸入圖形驗證碼" type="text">
          <img @click="getPcode" v-if="picIMg" :src="picIMg" alt="">
        </div>
        <div class="form-item">
          <input v-model="msgCode" class="inp" placeholder="請輸入訊息驗證碼 預設:246810" type="text">
          <button  @click="getMcode">{{ totalSecond === seconed ? '獲取驗證碼' : seconed + '秒後重新發送'}}</button>
        </div>
      </div>
      <div @click="codeLogin" class="login-btn">登入</div>
    </div>
  </div>
</template>

<script>
import { getPcode, getMsgCode, codeLogin } from '@/api/login'

// import { Toast } from 'vant'

export default {
  data () {
    return {
      picIMg: '',
      picKey: '',
      totalSecond: 60,
      seconed: 60,
      timer: null,
      picCode: '',
      mobile: '',
      msgCode: ''
    }
  },
  name: 'LoginIndex',
  created () {
    this.getPcode()
  },
  methods: {
    // 獲取圖形驗證碼
    async getPcode () {
      const res = await getPcode()
      const { base64, key } = res.data
      this.picIMg = base64
      this.picKey = key
    },
    // 獲取短信驗證碼
    async getMcode () {
      if (!this.validFn()) {
        // 如果沒通過校驗, 不用往下走
        return
      }
      // 通過校驗,發請求獲取驗證碼
      await getMsgCode(this.picCode, this.picKey, this.mobile)
      this.$toast('簡訊已發送,注意查收')

      // 條件判斷 定時器重複啟動問題 , 定時器負值問題
      if (!this.timer && this.totalSecond === this.seconed) {
        this.timer = setInterval(() => {
          this.seconed--
          if (this.seconed <= 0) {
            clearInterval(this.timer)
            this.timer = null // 重置定時器ID
            this.seconed = this.totalSecond // 歸位
          }
        }, 1000)
      }
    },
    // 登入校驗
    async codeLogin () {
      if (!this.validFn()) return
      if ((!/^\d{6}$/.test(this.msgCode))) {
        this.$toast('請輸入正確手機驗證碼')
        return
      }
      const res = await codeLogin(this.mobile, this.msgCode)
      console.log('加載中')
      this.$store.commit('user/setUserInfo', res.data)
      console.log(res.data)
      this.$toast('登入成功')
      setTimeout(() => {
        // 進行判斷, 看地址欄有無攜帶回跳地址
        // 1. 如果有 -> 其他頁面跳轉過來, 需要回跳
        // 2. 如果沒有 -> 正常去首頁
        const url = this.$route.query.backUrl || '/'
        this.$router.replace(url)
      }, 1000)
    },

    // 校驗手機號碼跟圖形驗證碼
    validFn () {
      // 手機號碼
      if (!/^0[0-9]\d{8}$/.test(this.mobile)) {
        this.$toast('請輸入正確手機號碼')
        return false
      }
      // 圖形驗證碼
      if (!(/^\w{4}$/.test(this.picCode))) {
        this.$toast('請輸入正確圖形驗證碼')
        return false
      }
      return true
    }

  },
  destroyed () {
    // 離開頁面時清除定時器
    clearInterval(this.timer)
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0,0,0,.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
