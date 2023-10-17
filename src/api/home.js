// 存放首頁相關接口請求
import request from '@/utils/request'

export const getHomeData = () => {
  return request.get('/page/detail', {
    params: {
      pageId: 0
    }
  })
}
