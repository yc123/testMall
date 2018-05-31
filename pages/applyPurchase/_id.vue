<template>
  <div>
    <batch-publish></batch-publish>
  </div>
</template>
<script>
  import { BatchPublish } from '~components/applyPurchase'
  export default {
    middleware: 'authenticated',
    components: {
      BatchPublish
    },
    fetch ({store, route}) {
      return Promise.all([
        store.dispatch('applyPurchase/loadBOMMaterialList', {bomId: route.params.id, page: 1, count: 10}),
        store.dispatch('applyPurchase/loadBOMNumber', {bomId: route.params.id})
      ])
    }
  }
</script>
