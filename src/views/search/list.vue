<template>
  <div class="search">
    <van-nav-bar fixed title="商品列表" left-arrow @click-left="$router.go(-1)" />

    <van-search
      readonly
      shape="round"
      background="#ffffff"
      :value="querySearch || '搜索商品'"
      show-action
      @click="$router.push('/search')"
    >
      <template #action>
        <van-icon class="tool" name="apps-o" />
      </template>
    </van-search>

    <!-- 排序选项按钮 -->
    <div class="sort-btns">
      <div class="sort-item">綜合</div>
      <div class="sort-item">銷量</div>
      <div class="sort-item">價格</div>
    </div>

    <div class="goods-list">
      <GoodsItem v-for="item in proList" :key="item.goods_id" :item="item"></GoodsItem>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { proList } from '@/api/product'
export default {
  name: 'ListIndex',
  data () {
    return {
      page: 1,
      proList: []
    }
  },
  components: {
    GoodsItem
  },
  async created () {
    const { data: { list } } = await proList({
      categoryId: this.$route.query.categoryId,
      goodsName: this.$route.query.search,
      page: this.page

    })
    console.log(list)
    this.proList = list.data
    // console.log(this.proList)
  },
  computed: {
    // 獲取地址欄的搜索關鍵字
    querySearch () {
      return this.$route.query.search
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .tool {
    font-size: 24px;
    height: 40px;
    line-height: 40px;
  }

  .sort-btns {
    display: flex;
    height: 36px;
    line-height: 36px;
    .sort-item {
      text-align: center;
      flex: 1;
      font-size: 16px;
    }
  }
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>
