import request from '@/utils/request'

// 獲取收貨地址列表
export const getAddress = () => {
  return request.get('/address/list')
}
