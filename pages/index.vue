<template>
  <div class="index">
    <div v-if="isMobile">
      <Home></Home>
    </div>
    <div v-if="!isMobile">
     <!-- <christmas v-if="isOpen" @listenopen="listenOpen" :hasNewYear="hasNewYear"></christmas>-->
     <!-- <new-year></new-year>-->
      <carousel>
        <kind-category @loadchild="loadProductKinds"></kind-category>
        <display-card></display-card>
      </carousel>
      <advert></advert>
      <floor-list></floor-list>
      <img class="banner-img" src="/images/all/banner-home2.jpg" style="margin: 44px auto 24px;" alt="">
      <news></news>
      <partner></partner>
    </div>
  </div>
</template>
<script>
  import { KindCategory, displayCard, Carousel, Advert, FloorList, Partner, News } from '~components/home'
//  import { Christmas, NewYear } from '~components/default'
  import { Home } from '~components/mobile'

  export default {
    name: 'index',
    middleware: 'wechatInfo',
    layout (context) {
      return context.store.state.option.isMobile ? 'mobile' : 'main'
    },
    data () {
      return {
        isOpen: false,
        hasNewYear: false,
        defaultFloorsData: [
//        'BT2018012500000141',
//        'BT2018012500000126',
//        'BT2018012500000131',
//        'BT2018012500000152',
//        'BT2018012500000124',
//        'BT2018012500000164',
//        'BT2018012500000167',
//        'BT2018012500000145',
//        'BT2018012500000151',
//        'BT2018012500000161',
//        'BT2018012500000149',
//        'BT2018012500000162'
          'BT2018012900002056',
          'BT2018012900002056',
          'BT2018012900002056',
          'BT2018012900002056',
          'BT2018012900002056',
          'BT2018012900002056',
          'BT2018012900002056',
          'BT2018012900002056',
          'BT2018012900002056',
          'BT2018012900002056',
          'BT2018012900002056',
          'BT2018012900002056'
        ]
      }
    },
    components: {
      KindCategory,
      displayCard,
      Carousel,
      Advert,
      FloorList,
      Partner,
      News,
//      Christmas,
//      NewYear,
      Home
    },
    fetch ({store}) {
      return !store.state.option.isMobile ? Promise.all([
        store.dispatch('loadFloors'),
        store.dispatch('loadBanners', {type: 'home'}),
        store.dispatch('loadProductKinds', { id: 0 }),
        store.dispatch('loadNewsSnapshot', { page: 1, pageSize: 10 }),
        store.dispatch('supplier/loadVendorAll', {page: 1, size: 20}),
        store.dispatch('loadAllCount', {_status: 'actived', usedFor: 'mall_home_banner'}),
        store.dispatch('loadInquirySheet'),
        store.dispatch('loadBatchCommodities', {batchCodeList: store.state.option.url === 'http://www.usoftmall.com' ? [
          'BT2018013000000043',
          'BT2018013000000026',
          'BT2018013000000030',
          'BT2018013000000052',
          'BT2018013000000025',
          'BT2018013000000053',
          'BT2018013000000033',
          'BT2018013000000047',
          'BT2018013000000057',
          'BT2018013000000048',
          'BT2018013000000051',
          'BT2018013000000020'] : [
            'BT2018012900002056',
            'BT2018012900002056',
            'BT2018012900002056',
            'BT2018012900002056',
            'BT2018012900002056',
            'BT2018012900002056',
            'BT2018012900002056',
            'BT2018012900002056',
            'BT2018012900002056',
            'BT2018012900002056',
            'BT2018012900002056',
            'BT2018012900002056']
        }),
        store.dispatch('applyPurchase/loadPurchaseManList', {pageNumber: 1, pageSize: 50, enUU: store.state.option.user.data.enterprise ? store.state.option.user.data.enterprise.uu : null}),
        store.dispatch('loadStoreStatus', { op: 'check' })
      ]) : Promise.all([
        store.dispatch('applyPurchase/loadMobileHomeList', {pageNumber: 1, pageSize: 5, enUU: store.state.option.user.data.enterprise ? store.state.option.user.data.enterprise.uu : null})
      ])
    },
    computed: {
      user () {
        return this.$store.state.option.user
      },
      isMobile: function () {
        return this.$store.state.option.isMobile
      }
    },
    methods: {
      listenOpen () {
        this.isOpen = false
      },
      loadProductKinds (id) {
        this.$store.dispatch('loadAllProductKinds', {id})
      }
    }
  }
</script>
