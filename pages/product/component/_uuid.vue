<template>
  <div class="detail">
    <div v-if="componentDetail">
      <component-menu/>
      <component-detail/>
      <store-info/>
    </div>
    <div v-else>
      <error-page :title="'器件'"></error-page>
    </div>
  </div>
</template>
<script>
import { ComponentMenu, ComponentDetail, StoreInfo } from '~components/product'
import { ErrorPage } from '~components/error'
export default {
  // validate({ params, redirect }) {
  //   window.location.href = '/error'
  // },
  layout: 'main',
  components: {
    ComponentMenu,
    ComponentDetail,
    StoreInfo,
    ErrorPage
  },
  fetch({ store, route }) {
    return Promise.all([
      store.dispatch('loadComponentDetail', { id: route.params.uuid }),
      store.dispatch('loadComponentStore', { uuid: route.params.uuid }),
      store.dispatch('loadComponentInformation', {
        count: 10,
        page: 1,
        sorting: { minPriceRMB: 'ASC' },
        filter: {
          uuid: route.params.uuid,
          ignoreUMall: false,
          ignoreStore: false,
          storeIds: '',
          status: 601
        }
      }),
      store.dispatch('getUmallStoreId'),
      store.dispatch('product/saveStores'),
      store.dispatch('loadStoreStatus', { op: 'check' })
    ])
  },
  computed: {
    componentDetail() {
      return this.$store.state.componentDetail.detail.data
    }
  },
  mounted() {
    this.$nextTick(() => {
      // if (!this.$store.state.componentDetail.detail.data) {
      //   this.$router.replace('/error')
      // }
    })
  }
}
</script>
