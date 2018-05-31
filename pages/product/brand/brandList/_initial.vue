<template>
  <brand-list></brand-list>
</template>

<script>
  import { BrandList } from '~components/product'

  export default {
    name: 'brandListDetail',
    fetch ({store, route}) {
      return Promise.all([
        store.dispatch('product/loadBrands', {'keyword': route.params.initial})
      ])
    },
    components: {
      BrandList
    }
  }
</script>
