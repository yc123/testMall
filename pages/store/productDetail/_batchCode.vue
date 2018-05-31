<template>
  <div class="container commodity">
    <div v-if="commodity">
      <commodity-info />
      <component-info />
    </div>
    <div v-else>
      <error-page :title="'产品'"></error-page>
    </div>
  </div>
</template>
<script>
import { ComponentInfo, CommodityInfo } from '~components/store'
import { ErrorPage } from '~components/error'
export default {
  layout: 'shop',
  fetch({ store, route }) {
    return Promise.all([
      //      store.dispatch('shop/findStoreInfoFromUuid', route.params),
      store.dispatch('shop/findCommodityOnBatchInfo', route.params)
    ])
  },
  components: {
    ComponentInfo,
    CommodityInfo,
    ErrorPage
  },
  computed: {
    commodity() {
      // console.log(this.$store.state.shop.storeInfo.commodity.data)
      return this.$store.state.shop.storeInfo.commodity.data
    }
  }
}
</script>
<style>
.container.commodity {
  width: 1190px;
  padding-left: 0px;
  padding-right: 0px;
}
</style>
