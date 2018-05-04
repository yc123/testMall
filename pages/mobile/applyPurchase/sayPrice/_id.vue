<template>
  <div class="mobile-content">
    <say-price></say-price>
  </div>
</template>
<script>
  import {SayPrice} from '~components/mobile'
  export default {
    layout: 'mobile',
    components: {
      SayPrice
    },
    fetch ({store, route}) {
      return Promise.all([
        store.dispatch('applyPurchase/loadPurchaseManDetail', {itemId: route.params.id, enuu: store.state.option.user.data.enterprise ? store.state.option.user.data.enterprise.uu : null})
      ])
    }
  }
</script>
