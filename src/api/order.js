import request from '@/utils/request'

// 訂單結算
// mode: cart   => obj {cartIds}
// mode: buyNow => obj {goodsId goodsNum goodsSkuId}
export const checkOrder = (mode, obj) => {
  return request.get('/checkout/order', {
    params: {
      mode, // cart buyNow
      delivery: 10, // 10 快遞配送 20 門店自提
      couponId: 0, // 優惠券ID 傳0 不使用優惠券
      isUsePoints: 0, // 積分 傳0 不使用積分
      ...obj // 將傳遞過來的參數對象 動態展開
    }
  })
}

// 提交訂單
// mode: cart   => obj {cartIds, remark}
// mode: buyNow => obj {goodsId goodsNum goodsSkuId, remark}
export const submitOrder = (mode, obj) => {
  return request.post('/checkout/submit', {
    mode,
    delivery: 10,
    couponId: 0,
    isUsePoints: 0,
    payType: 10,
    ...obj
  })
}

// 獲取訂單列表
// dataType 订单类型，all-全部，payment-待支付，delivery-待发货，received-待收货，comment-待评价
export const getlistOrder = (dataType, page) => {
  return request.get('/order/list', {
    params: {
      dataType,
      page // List
    }

  })
}
