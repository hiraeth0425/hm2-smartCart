<template>
  <div class="order">
    <van-nav-bar title="我的訂單" left-arrow @click-left="$router.go(-1)" />
    <van-tabs v-model="active">
      <van-tab name="all" title="全部"></van-tab>
      <van-tab name="payment" title="待支付"></van-tab>
      <van-tab name="delivery" title="待發貨"></van-tab>
      <van-tab name="received" title="待收貨"></van-tab>
      <van-tab name="comment" title="待評價"></van-tab>
    </van-tabs>

    <OrderListItem v-for="item in list" :key="item.create_time" :item="item"></OrderListItem>
  </div>
</template>

<script>
import { getlistOrder } from '@/api/order'
import OrderListItem from '@/components/OrderListItem'
export default {
  name: 'OrderPage',
  components: {
    OrderListItem
  },
  data () {
    return {
      active: this.$route.query.dataType || 'all',
      page: 1,
      list: []
    }
  },
  created () {
    this.getMylistOrder()
  },
  methods: {
    async getMylistOrder () {
      const { data: { list } } = await getlistOrder(this.active, this.page)
      list.data.forEach((item) => {
        item.total_num = 0
        item.goods.forEach((goods) => {
          item.total_num += goods.total_num
        })
      })
      // console.log(list)
      this.list = list.data
    }
  },
  watch: {
    active: {
      immediate: true,
      handler () {
        this.getMylistOrder()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.order {
  background-color: #fafafa;
}
.van-tabs {
  position: sticky;
  top: 0;
}
</style>
