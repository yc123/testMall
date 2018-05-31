<template>
  <component-detail></component-detail>
</template>
<script>
  import ComponentDetail from '~components/mobile/brand/ComponentDetail.vue'
  export default {
    layout: 'mobile',
    components: {
      ComponentDetail
    },
    fetch ({ store, params }) {
      return Promise.all([
        store.dispatch('loadComponentDetail', {id: params.uuid}),
//        store.dispatch('loadComponentStore', {uuid: params.uuid}),
        store.dispatch('loadComponentInformation',
          {
            count: 10,
            page: 1,
            sorting: {'minPriceRMB': 'ASC'},
            filter: {
              uuid: params.uuid,
              ignoreUMall: false,
              ignoreStore: false,
              storeIds: ''
            }}),
        store.dispatch('product/saveStores')
      ])
    }
  }
</script>
