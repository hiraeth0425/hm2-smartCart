<template>
  <div class="pay">
    <van-nav-bar fixed title="訂單結算台" left-arrow @click-left="$router.go(-1)" />
    <!-- 地址相关 -->
    <div class="address">

      <div class="left-icon">
        <van-icon name="logistics" />
      </div>

      <div class="info" v-if="selectAddress.address_id">
        <div class="info-content">
          <span class="name">{{ selectAddress.name }}</span>
          <span class="mobile">{{ selectAddress.phone}}</span>
        </div>
        <div class="info-address">
          {{ longAddress }}
        </div>
      </div>

      <div class="info" v-else>
        請選擇配送地址
      </div>

      <div class="right-icon">
        <van-icon name="arrow" />
      </div>
    </div>

    <!-- 订单明细 -->
    <div class="pay-list" v-if="order.goodsList">
      <div class="list">
        <div class="goods-item" v-for="item in order.goodsList" :key="item.delivery_id">
            <div class="left">
              <img :src="item.goods_image" alt="" />
            </div>
            <div  class="right">
              <p class="tit text-ellipsis-2">
                 {{item.goods_name }}
              </p>
              <p class="info">
                <span class="count">x{{ item.total_num}}</span>
                <span class="price">¥{{ item.goods_price_min}}</span>
              </p>
            </div>
        </div>
      </div>

      <div class="flow-num-box">
        <span>共 {{ order.orderTotalNum}} 件商品，合計：</span>
        <span class="money">￥{{ order.orderPrice}}</span>
      </div>

      <div class="pay-detail">
        <div class="pay-cell">
          <span>訂單總金額：</span>
          <span class="red">￥{{ order.orderPrice}}</span>
        </div>

        <div class="pay-cell">
          <span>優惠券：</span>
          <span>無優惠券用</span>
        </div>

        <div class="pay-cell">
          <span>配送費用：</span>
          <span v-if="false">请請先選擇配送地址</span>
          <span v-else class="red">+￥0.00</span>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="pay-way">
        <span class="tit">支付方式</span>
        <div class="pay-cell">
          <span><van-icon name="balance-o" />餘額支付（可用 ¥ {{ personal.balance}} 元）</span>
          <!-- <span>请先选择配送地址</span> -->
          <span class="red"><van-icon name="passed" /></span>
        </div>
      </div>

      <!-- 买家留言 -->
      <div class="buytips">
        <textarea placeholder="选填：买家留言（50字内）" name="" id="" cols="30" rows="10"></textarea>
      </div>
    </div>

    <!-- 底部提交 -->
    <div class="footer-fixed">
      <div class="left">實付款：<span>￥{{ order.orderTotalPrice}}</span></div>
      <div class="tipsbtn" @click="submitOrder">提交訂單</div>
    </div>
  </div>
</template>

<script>
import { checkOrder, submitOrder } from '@/api/order'
// import Request from '@/utils/request'
import { getAddress } from '@/api/address'
export default {
  name: 'PayIndex',
  data () {
    return {
      addressList: [],
      order: {},
      personal: {},
      remark: ''
    }
  },
  created () {
    this.getAddressList()
    // this.addAddress() // 添加收貨地址(不要動, 怕地址為空無法測試)
    this.getOrderList()
  },
  computed: {
    selectAddress () {
      // 直接獲取第一個項, 做為選中的地址
      return this.addressList[0] || {}
    },
    longAddress () {
      const { region } = this.selectAddress
      return region.province + region.city + region.region + this.selectAddress.detail
    },
    getMode () {
      return this.$route.query.mode
    },
    getCartIds () {
      return this.$route.query.cartIds
    },
    getgoodsId () {
      return this.$route.query.goodsId
    },
    getGoodsNum () {
      return this.$route.query.goodsNum
    },
    getGoodsSkuId () {
      return this.$route.query.goodsSkuId
    }
  },
  methods: {
    async getAddressList () {
      const { data: { list } } = await getAddress()
      // console.log(list)
      this.addressList = list
      // console.log(this.addressList[0])
      // console.log(this.selectAddress)
    },
    // 添加收貨地址(不要動, 怕地址為空無法測試)
    // async addAddress () {
    //   await Request.post('/address/add', {
    //     form: {
    //       name: '张小二',
    //       phone: '18999292929',
    //       region: [
    //         {
    //           value: 782,
    //           label: '上海'
    //         },
    //         {
    //           value: 783,
    //           label: '上海市'
    //         },
    //         {
    //           value: 785,
    //           label: '徐汇区'
    //         }
    //       ],
    //       detail: '北京路1号楼8888室'
    //     }
    //   })
    //   // console.log(res)
    // },
    async getOrderList () {
      // 訂單結算 調用接口
      if (this.getMode === 'cart') {
        const { data: { personal, order } } = await checkOrder(this.getMode, {
          cartIds: this.getCartIds
        })
        this.order = order
        this.personal = personal
      }
      // 立即購買結算
      if (this.getMode === 'buyNow') {
        const { data: { personal, order } } = await checkOrder(this.getMode,
          {
            goodsId: this.getgoodsId,
            goodsSkuId: this.getGoodsSkuId,
            goodsNum: this.getGoodsNum
          })
        this.order = order
        this.personal = personal
      }
    },
    async submitOrder () {
      if (this.getMode === 'buyNow') {
        await submitOrder(this.getMode, {
          goodsId: this.getgoodsId,
          goodsSkuId: this.getGoodsSkuId,
          goodsNum: this.getGoodsNum,
          remark: this.remark
        }
        )
      }
      if (this.getMode === 'cart') {
        await submitOrder(this.getMode, {
          cartIds: this.getCartIds,
          remark: this.remark
        })
      }
      this.$toast('支付成功')
      this.$router.replace('/myorder')
    }

  }
}
</script>

<style lang="less" scoped>
.pay {
  padding-top: 46px;
  padding-bottom: 46px;
  ::v-deep {
    .van-nav-bar__arrow {
      color: #333;
    }
  }
}
.address {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  font-size: 14px;
  color: #666;
  position: relative;
  background: url(@/assets/border-line.png) bottom repeat-x;
  background-size: 60px auto;
  .left-icon {
    margin-right: 20px;
  }
  .right-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-7px);
  }
}
.goods-item {
  height: 100px;
  margin-bottom: 6px;
  padding: 10px;
  background-color: #fff;
  display: flex;
  .left {
    width: 100px;
    img {
      display: block;
      width: 80px;
      margin: 10px auto;
    }
  }
  .right {
    flex: 1;
    font-size: 14px;
    line-height: 1.3;
    padding: 10px;
    padding-right: 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    color: #333;
    .info {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      .price {
        color: #fa2209;
      }
    }
  }
}

.flow-num-box {
  display: flex;
  justify-content: flex-end;
  padding: 10px 10px;
  font-size: 14px;
  border-bottom: 1px solid #efefef;
  .money {
    color: #fa2209;
  }
}

.pay-cell {
  font-size: 14px;
  padding: 10px 12px;
  color: #333;
  display: flex;
  justify-content: space-between;
  .red {
    color: #fa2209;
  }
}
.pay-detail {
  border-bottom: 1px solid #efefef;
}

.pay-way {
  font-size: 14px;
  padding: 10px 12px;
  border-bottom: 1px solid #efefef;
  color: #333;
  .tit {
    line-height: 30px;
  }
  .pay-cell {
    padding: 10px 0;
  }
  .van-icon {
    font-size: 20px;
    margin-right: 5px;
  }
}

.buytips {
  display: block;
  textarea {
    display: block;
    width: 100%;
    border: none;
    font-size: 14px;
    padding: 12px;
    height: 100px;
  }
}

.footer-fixed {
  position: fixed;
  background-color: #fff;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 46px;
  line-height: 46px;
  border-top: 1px solid #efefef;
  font-size: 14px;
  display: flex;
  .left {
    flex: 1;
    padding-left: 12px;
    color: #666;
    span {
      color:#fa2209;
    }
  }
  .tipsbtn {
    width: 121px;
    background: linear-gradient(90deg,#f9211c,#ff6335);
    color: #fff;
    text-align: center;
    line-height: 46px;
    display: block;
    font-size: 14px;
  }
}
</style>
