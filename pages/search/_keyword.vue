<template>
<div class="container" id="searchResult">
  <detail-brand></detail-brand>
  <result-title :keyword="key" :page="nowPage"></result-title>
    <kind @kindFilterEvent="listenKindFilter"
          @brandFilterEvent="listenBrandFilter"
          @typeFilterEvent="listenTypeFilter"
          @crnameFilterEvent="listenCrnameFilter"
          @crnameFlagEvent="listenCrnameFlag"
    ></kind>
  <good-list @pageEvent="listenPage"
             @sortEvent="listenSort"
             @filterPriceEvent="listenPriceFilter"
             :crname_click_flag="crname_click_flag"
  ></good-list>
</div>
</template>
<script>
  import { GoodList, Kind, ResultTitle } from '~components/search'
  import DetailBrand from '~components/search/DetailBrand.vue'
  export default{
    layout: 'main',
    data () {
      return {
        key: this.$route.query.w,
        pageSize: 15,
        nowPage: 1,
        sorting: {},
        filter: {},
        paramJSON: {},
        crname_click_flag: {
          rmb_click_flag: false,
          usd_click_flag: false
        }
      }
    },
    fetch ({store, route}) {
      return Promise.all([
        store.dispatch('searchData/searchForKinds', {collectList: 'goods_kind', keyword: route.query.w, paramJSON: {}}),
        store.dispatch('searchData/searchForBrands', {collectList: 'goods_brand', keyword: route.query.w, paramJSON: {}}),
        store.dispatch('searchData/searchForList', {count: 15, filter: {}, keyword: route.query.w, page: 1, sorting: {}}),
        store.dispatch('searchData/searchForStoreType', {collectList: 'goods_store_type', keyword: route.query.w, paramJSON: {}}),
        store.dispatch('searchData/searchForCrname', {collectList: 'goods_crname', keyword: route.query.w, paramJSON: {}})
      ])
    },
    components: {
      ResultTitle,
      Kind,
      GoodList,
      DetailBrand
    },
    methods: {
      reloadList: function () {
        if (this.sorting === {}) {
          this.sorting = {}
        }
        this.$store.dispatch('searchData/searchForList', {count: this.pageSize, filter: this.filter, keyword: this.$route.query.w, page: this.nowPage, sorting: this.sorting})
      },
      reloadKind: function () {
        if (!this.filter.goods_kindId) {
          this.$store.dispatch('searchData/searchForKinds', {collectList: 'goods_kind', keyword: this.$route.query.w, paramJSON: this.paramJSON})
        }
      },
      reloadBrand: function () {
        if (!this.filter.goods_brandId) {
          this.$store.dispatch('searchData/searchForBrands', {collectList: 'goods_brand', keyword: this.$route.query.w, paramJSON: this.paramJSON})
        }
      },
      reloadStoreType: function () {
        if (!this.filter.goods_store_type) {
          this.$store.dispatch('searchData/searchForStoreType', {collectList: 'goods_store_type', keyword: this.$route.query.w, paramJSON: this.paramJSON})
        }
      },
      reloadCrname: function () {
        if (!this.filter.goods_crname) {
          this.$store.dispatch('searchData/searchForCrname', {collectList: 'goods_crname', keyword: this.$route.query.w, paramJSON: this.paramJSON})
        }
      },
      listenPage: function (nPage) {
        this.nowPage = nPage
        this.reloadList()
      },
      listenSort: function (sortType) {
        this.sorting = sortType
        this.reloadList()
      },
      listenPriceFilter: function (filterType) {
        if (filterType.goods_minpricermb) {
          this.filter.goods_minpricermb = filterType.goods_minpricermb
        } else {
          delete this.filter.goods_minpricermb
        }
        if (filterType.goods_maxpricermb) {
          this.filter.goods_maxpricermb = filterType.goods_maxpricermb
        } else {
          delete this.filter.goods_maxpricermb
        }
        this.reloadList()
      },
      listenKindFilter: function (kindarr) {
        this.nowPage = 1
        if (kindarr.length === 0) {
          delete this.filter.goods_kindId
          delete this.paramJSON.goods_kindid
          this.reloadKind()
          this.reloadBrand()
          this.reloadList()
          this.reloadStoreType()
          this.reloadCrname()
        } else {
          this.filter.goods_kindId = kindarr
          this.paramJSON.goods_kindid = kindarr
          this.reloadBrand()
          this.reloadList()
          this.reloadStoreType()
          this.reloadCrname()
        }
      },
      listenBrandFilter: function (brandarr) {
        this.nowPage = 1
        if (brandarr.length === 0) {
          delete this.filter.goods_brandId
          delete this.paramJSON.goods_brandid
          this.reloadKind()
          this.reloadBrand()
          this.reloadList()
          this.reloadStoreType()
          this.reloadCrname()
        } else {
          this.filter.goods_brandId = brandarr
          this.paramJSON.goods_brandid = brandarr
          this.reloadKind()
          this.reloadList()
          this.reloadStoreType()
          this.reloadCrname()
        }
      },
      listenTypeFilter: function (typearr) {
        this.nowPage = 1
        if (typearr.length === 0) {
          delete this.filter.goods_store_type
          delete this.paramJSON.goods_store_type
          this.reloadKind()
          this.reloadBrand()
          this.reloadList()
          this.reloadCrname()
        } else {
          this.filter.goods_store_type = typearr
          this.paramJSON.goods_store_type = typearr
          this.reloadKind()
          this.reloadBrand()
          this.reloadList()
          this.reloadCrname()
        }
      },
      listenCrnameFilter: function (crnamearr) {
        this.nowPage = 1
        if (crnamearr.length === 0) {
          delete this.filter.goods_crname
          delete this.paramJSON.goods_crname
          this.reloadKind()
          this.reloadBrand()
          this.reloadList()
          this.reloadStoreType()
        } else {
          this.filter.goods_crname = crnamearr
          this.paramJSON.goods_crname = crnamearr
          this.reloadKind()
          this.reloadBrand()
          this.reloadList()
          this.reloadStoreType()
        }
      },
      listenCrnameFlag: function (obj) {
        if (obj.rmb_click_flag && obj.usd_click_flag) {
          this.crname_click_flag.rmb_click_flag = false
          this.crname_click_flag.usd_click_flag = false
        } else {
          this.crname_click_flag.rmb_click_flag = obj.rmb_click_flag
          this.crname_click_flag.usd_click_flag = obj.usd_click_flag
        }
      }
    }
  }
</script>

