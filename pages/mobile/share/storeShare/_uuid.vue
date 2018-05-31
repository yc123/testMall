<template>
  <div>
    <store-header></store-header>
    <commodity-list></commodity-list>
    <store-footer></store-footer>
  </div>
</template>
<script>
import {
  CommodityList,
  StoreHeader,
  StoreFooter
} from '~components/mobile/share'
export default {
  layout: 'mobileStore',
  fetch({ store, params, redirect }) {
    if (!params.uuid) {
      return redirect('/error')
    }
    return Promise.all([
      store.dispatch('shop/findStoreInfoFromUuid', params),
      store.dispatch('shop/mobilePageCommoditiesOfStore', {
        storeid: params.uuid,
        origin: 'store',
        page: 1,
        count: 10
      })
    ])
  },
  components: {
    CommodityList,
    StoreHeader,
    StoreFooter
  }
}
</script>
<style scoped lang="scss">
@import '~assets/scss/mobileCommon';
</style>
