<template>
  <div class="container">
    <div v-if="storeInfoStore.id">
      <recommend-product/>
      <commodity-list :kinds="kinds"/>
    </div>
    <div v-else>
      <error-page :title="'店铺'"></error-page>
    </div>
  </div>
</template>
<script>
import axios from '~plugins/axios'
import { CommodityList, RecommendProduct } from '~components/store'
import { ErrorPage } from '~components/error'
export default {
//  validate ({ params }) {
//    return false
//  },
  layout: 'shop',
  data () {
    return {
      uuid: this.$route.params.uuid
    }
  },
  fetch ({ store, params, redirect }) {
    if (!params.uuid) {
      return redirect('/error')
    }
    return Promise.all([
      store.dispatch('shop/findStoreInfoFromUuid', params),
      store.dispatch('shop/findRecommendProducts', params),
      store.dispatch('shop/pageCommoditiesOfStore', params.uuid, { page: 1, count: 6 }),
      store.dispatch('loadStoreStatus', { op: 'check' })

    ])
  },
  async asyncData ({ params }) {
//  asyncData ({ params }) {
    let { data } = await axios.get('/api/commodity/components/kinds', { params: { StoreUuid: params.uuid } })
//    axios.get('/api/commodity/components/kinds', { params: { StoreUuid: params.uuid } })
//      .then(response => {
    return { kinds: data }
//      })
  },
  components: {
    RecommendProduct,
    CommodityList,
    ErrorPage
  },
  computed: {
    storeInfoStore() {
      return this.$store.state.shop.storeInfo.store.data
    }
  }
}
</script>
<style>
  #nav_fragment .el-dialog__wrapper .el-dialog--tiny{
    width: 320px !important;
  }
  #nav_fragment .el-dialog__wrapper .el-dialog__body{
    padding: 14px !important;
  }
</style>
