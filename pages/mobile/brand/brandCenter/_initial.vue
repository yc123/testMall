<template>
  <brand-center></brand-center>
</template>
<script>
  import BrandCenter from '~components/mobile/brand/BrandCenter.vue'
  export default {
    layout: 'mobileNoHeader',
    components: {
      BrandCenter
    },
    fetch ({store, route}) {
      return Promise.all([
        store.dispatch('product/loadBrandsPager', {'initial': route.params.initial, page: 1, count: 60})
      ])
    }
  }
</script>
