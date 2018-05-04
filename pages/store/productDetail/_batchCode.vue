<template>
  <div class="container commodity">
    <commodity-info />
    <component-info />
  </div>
</template>
<script>
import { ComponentInfo, CommodityInfo } from '~components/store'

export default {
  layout: 'shop',
  fetch ({ store, route }) {
    return Promise.all([
//      store.dispatch('shop/findStoreInfoFromUuid', route.params),
      store.dispatch('shop/findCommodityOnBatchInfo', route.params)
    ])
  },
  components: {
    ComponentInfo,
    CommodityInfo
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
