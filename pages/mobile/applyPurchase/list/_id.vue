<template>
  <div class="mobile-content">
    <say-price-info></say-price-info>
  </div>
</template>
<script>
  import {SayPriceInfo} from '~components/mobile'
  export default {
    layout: 'mobile',
    components: {
      SayPriceInfo
    },
    fetch ({store, route}) {
      return Promise.all([
        route.query.type === 'buyer' ? store.dispatch('applyPurchase/loadBuyerInquiryDetail', {id: route.params.id}) : store.dispatch('applyPurchase/loadVendorInquiryDetail', {id: route.params.id, enuu: this.user.data.enterprise.uu, useruu: this.user.data.userUU})
      ])
    }
  }
</script>
