<template>
  <div class="supplier">
    <details-view/>
  </div>
</template>

<script>
  import { DetailsView } from '~components/supplier'
  export default {
    name: 'SupplierDetails',
    layout: 'main',
    fetch ({store, route}) {
      return Promise.all([
        store.dispatch('supplier/loadMaterialDetail', {id: route.params.id})
      ])
    },
    components: {
      DetailsView
    }
  }
</script>
