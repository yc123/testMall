<template>
  <div>
    <!-- 轮播及店铺推荐 -->
    <recommend-store/>

    <img class="banner-img" src="/images/all/banner-agency.jpg" alt="">

    <excellent-suppliers :isShowMore="true"/>

    <hot-commodity/>

    <img class="banner-img" src="/images/all/banner-agency2.jpg" alt="" style="margin: 63px auto 43px;">

  </div>
</template>
<script>
import { RecommendStore, ExcellentSuppliers, HotCommodity } from '~components/provider'

export default{
  layout: 'main',
  fetch ({ store }) {
    return Promise.all([
      store.dispatch('loadBanners', {type: 'Agent'}),
      store.dispatch('provider/loadSalesStore', { isOriginal: false }),
      store.dispatch('provider/loadNewStores', { types: 'AGENCY-DISTRIBUTION' }),
      store.dispatch('provider/loadRecommendStores', { types: 'AGENCY-DISTRIBUTION', num: 5 }),
      store.dispatch('provider/loadHotComponents'),
      store.dispatch('loadStoreStatus', { op: 'check' })
    ])
  },
  components: {
    RecommendStore,
    ExcellentSuppliers,
    HotCommodity
  }
}
</script>
<style scoped>
  .container{
    padding:0;
  }
  .banner-img {
    margin-bottom: -8px;
  }
</style>
