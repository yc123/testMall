<template>
  <div>
    <div class="sl-title">
      供应商详情<i class="iconfont icon-fanhui" @click="goLast"></i>
    </div>
    <supplier-detail></supplier-detail>
  </div>
</template>
<script>
  import { SupplierDetail } from '~components/mobile/supplier'
  export default {
    layout: 'mobile',
    fetch ({ store, params, query }) {
      let promises = [
        store.dispatch('supplier/getSupplierEnInfo', {uu: params.uu}),
        store.dispatch('supplier/getSupplierProductList', { vendUU: params.uu, page: 1, size: 10 })
      ]
      if (query.isStore === '1') {
        promises.push(store.dispatch('shop/findStoreInfoFromEnUU', {enUU: params.uu, filter: 'enUU'}))
      }
      return Promise.all(promises)
    },
    components: {
      SupplierDetail
    },
    methods: {
      goLast: function () {
        window.history.back(-1)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .sl-title {
    position: relative;
    height: .72rem;
    font-size: .35rem;
    color: #fff;
    background: #3f84f6;
    text-align: center;
    line-height: .72rem;
    i {
      position: absolute;
      left: .32rem;
      top: 0;
    }
  }
</style>

