<template>
  <brand-detail></brand-detail>
</template>
<script>
  import BrandDetail from '~components/mobile/brand/BrandDetail.vue'
  export default {
    layout: 'mobile',
    components: {
      BrandDetail
    },
    fetch ({ store, params }) {
      return Promise.all([
        store.dispatch('loadBrandDetail', { id: params.code })
      ])
    }
  }
</script>
