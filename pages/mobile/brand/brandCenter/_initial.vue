<template>
  <brand-center></brand-center>
</template>
<script>
  import BrandCenter from '~components/mobile/brand/BrandCenter.vue'
  export default {
    layout: 'mobile',
    components: {
      BrandCenter
    },
    fetch ({store, route}) {
      return Promise.all([
        store.dispatch('product/loadBrands', {'keyword': route.params.initial})
      ])
    }
  }
</script>
<style>

</style>
