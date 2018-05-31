<template>
  <div class="supplier">
    <!--<carousel>-->
      <!--<kind-category @loadchild="loadProductKinds"></kind-category>-->
    <!--</carousel>-->
    <banner/>
    <merchant-view/>
  </div>
</template>

<script>
  import { KindCategory, Carousel } from '~components/home'
  import { MerchantView, Banner } from '~components/supplier'
  export default {
    name: 'SupplierView',
    layout: 'main',
    fetch ({store}) {
      return Promise.all([
        store.dispatch('supplier/loadVendorList', {page: 1, size: 20}),
        store.dispatch('supplier/loadVendorAll', {page: 1, size: 20}),
        store.dispatch('loadBanners', {type: 'home'}),
        store.dispatch('loadProductKinds', { id: 0 })
      ])
    },
    components: {
      KindCategory,
      Carousel,
      MerchantView,
      Banner
    },
    methods: {
      loadProductKinds (id) {
        this.$store.dispatch('loadAllProductKinds', {id})
      }
    }
  }
</script>
