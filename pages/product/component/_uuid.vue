<template>
  <div class="detail">
    <component-menu/>
    <component-detail/>
    <store-info/>
  </div>
</template>
<script>
  import { ComponentMenu, ComponentDetail, StoreInfo } from '~components/product'
  export default {
    layout: 'main',
    components: {
      ComponentMenu,
      ComponentDetail,
      StoreInfo
    },
    fetch ({ store, route }) {
      return Promise.all([
        store.dispatch('loadComponentDetail', {id: route.params.uuid}),
        store.dispatch('loadComponentStore', {uuid: route.params.uuid}),
        store.dispatch('loadComponentInformation',
          {
            count: 10,
            page: 1,
            sorting: {'minPriceRMB': 'ASC'},
            filter: {
              uuid: route.params.uuid,
              ignoreUMall: false,
              ignoreStore: false,
              storeIds: '',
              status: 601
            }}),
        store.dispatch('getUmallStoreId'),
        store.dispatch('product/saveStores'),
        store.dispatch('loadStoreStatus', { op: 'check' })
      ])
    },
    created () {
    }
  }
</script>
