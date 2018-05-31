<template>
  <div>
    <store-detail></store-detail>
  </div>
</template>
<script>
  import StoreDetail from '~components/mobile/store/StoreDetail.vue'
  export default {
    layout: 'mobile',
    fetch ({ store, params }) {
      return Promise.all([
        store.dispatch('shop/findStoreInfoFromUuid', params),
        store.dispatch('shop/pageCommoditiesOfStore', params.uuid, { page: 1, count: 10 })
      ])
    },
    computed: {
      description () {
        return this.$store.state.shop.storeInfo.store.data
      }
    },
    components: {
      StoreDetail
    }
  }
</script>
<style scoped>
</style>
