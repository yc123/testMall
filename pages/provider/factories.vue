<template>
  <!-- 组件模板只能包含一个根元素，除非使用v-if 和 v-if-else -->
  <div>
    <!-- 轮播及店铺推荐 -->
    <recommend-store/>

    <img class="banner-img" src="/images/all/banner-original.jpg" alt="">

    <recommend-original/>

    <img class="banner-img" src="/images/all/banner-original2.jpg" style="margin: 15px auto;" alt="">

    <suppliers :types="'ORIGINAL_FACTORY'"/>
  </div>
</template>
<script>
import { RecommendStore, RecommendOriginal, Suppliers } from '~components/provider'

export default {
  layout: 'main',
  fetch ({ store }) {
    return Promise.all([
      store.dispatch('loadBanners', {type: 'Brand'}),
      store.dispatch('provider/loadSalesStore', { isOriginal: true }),
      store.dispatch('provider/loadNewStores', { types: 'ORIGINAL_FACTORY' }),
      store.dispatch('provider/loadRecommendOriginal', { types: 'ORIGINAL_FACTORY', num: 5 }),
      store.dispatch('provider/findStoreList', { page: 1, count: 10, types: 'ORIGINAL_FACTORY' }),
      store.dispatch('loadStoreStatus', { op: 'check' })
    ])
  },
  components: {
    RecommendStore,
    RecommendOriginal,
    Suppliers
  },
  data () {
    return {
      msg: 'hello vue'
    }
  }
}
</script>
