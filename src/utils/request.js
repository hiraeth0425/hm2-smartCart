import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

// 創建axios實例, 將來對創建的實例,進行自定義配置
// 好處, 不會汙染原始的 axios 實例
const instance = axios.create({
  baseURL: 'http://cba.itlike.com/public/index.php?s=/api/',
  timeout: 5000
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 加載提示loading
  Toast.loading({
    message: '加載中...',
    forbidClick: true,
    loadingType: 'spinner', // 配置loading圖標
    duration: 0 // 不會自動消失
  })

  // 只要有token, 就在請求時攜帶, 便於請求需要授權的接口
  const token = store.getters.token
  if (token) {
    config.headers['Access-Token'] = token
    config.headers.platform = 'H5'
  }

  return config
},
function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么 (默認axios會多包裝一層data)
  const res = response.data
  if (res.status !== 200) {
    // 給錯誤提示, Toast 默認是單例模式, 後面的Toast調用了 會覆蓋前一個
    Toast(res.message)
    // 拋出一個錯誤的promise
    return Promise.reject(res.message)
  } else {
    // 正確情況走核心邏輯, 關閉加載提示 loading
    Toast.clear()
  }

  return res
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

// 導出配置好的實例
export default instance
