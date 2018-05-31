<template>
  <div class="supplier">
    <resource/>
  </div>
</template>

<script>
  import { Resource } from '~components/supplier'
  export default {
    name: 'SupplierResource',
    layout: 'main',
    fetch ({store, route}) {
      return Promise.all([
        store.dispatch('supplier/loadMaterialList', {page: 1, size: 20, vendUU: route.params.uuid}),
        store.dispatch('supplier/loadEnUser', {enUU: route.params.uuid, filter: 'enUU'}),
        store.dispatch('shop/findStoreInfoFromUuid', {enUU: route.params.uuid, filter: 'enUU'})
      ])
    },
    components: {
      Resource
    }
  }
</script>
