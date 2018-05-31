<template>
  <div class="seek">
    <publish-apply></publish-apply>
    <apply-info></apply-info>
    <!--<apply-footer></apply-footer>-->
    <business-opportunities id="opportunities"></business-opportunities>
    <div class="footer"><img  class="img" src="/images/applyPurchase/apply-footer.png"></div>
  </div>
</template>
<script>
  import { ApplyInfo, PublishApply, ApplyFooter, BusinessOpportunities } from '~components/applyPurchase'
  export default {
    layout: 'main',
    components: {
      ApplyInfo,
      PublishApply,
      ApplyFooter,
      BusinessOpportunities
    },
    fetch ({store}) {
      return Promise.all([
        store.dispatch('applyPurchase/loadPurchaseManList', {pageNumber: 1, pageSize: 10, enUU: store.state.option.user.data.enterprise ? store.state.option.user.data.enterprise.uu : null}),
        store.dispatch('applyPurchase/loadPurchaseApplyRank'),
        store.dispatch('applyPurchase/loadGoodPurchaseManList'),
        store.dispatch('loadStoreStatus', { op: 'check' })
      ])
    }
  }
</script>
<style>
  .seek {
    position: relative;
  }
  .footer {
    text-align: center;
    background: #e0f2ff;
  }
</style>
