<template>
  <div class="container" id="searchResult">
    <search-title :keyword="key" @showAction="showAction" @typeAction="onTypeChanged"></search-title>
    <store-content v-show="show" @pageAction="onPageChanged"></store-content>
  </div>
</template>
<script>
  import { SearchTitle, StoreContent } from '~components/searchStore'
  export default {
    layout: 'main',
    components: {
      SearchTitle,
      StoreContent
    },
    data () {
      return {
        key: this.$route.query.w,
        show: true,
        type: 'AGENCY-DISTRIBUTION-ORIGINAL_FACTORY'
      }
    },
    watch: {
      '$route.query.w': {
        handler: function (val) {
          this.key = val
          this.reloadAll()
        },
        immediate: false
      }
    },
    fetch ({store, route}) {
      return Promise.all([
        store.dispatch('searchStore/searchStoreDetail', {page: 1, count: 8, keyword: route.query.w, types: 'AGENCY-DISTRIBUTION-ORIGINAL_FACTORY', op: 'pageByType'})
      ])
    },
    methods: {
      reloadAll: function () {
        this.types = 'AGENCY-DISTRIBUTION-ORIGINAL_FACTORY'
        this.$store.dispatch('searchStore/searchStoreDetail', {page: 1, count: 8, keyword: this.key, types: 'AGENCY-DISTRIBUTION-ORIGINAL_FACTORY', op: 'pageByType'})
      },
      showAction: function (show) {
        this.show = show
      },
      onPageChanged: function (page) {
        this.$store.dispatch('searchStore/searchStoreDetail', {page: page, count: 8, keyword: this.$route.query.w, types: this.type, op: 'pageByType'})
      },
      onTypeChanged: function (type) {
        this.type = type
      }
    }
  }
</script>
<style>
  #search-store-content .el-dialog--tiny{
    width: 320px !important;
  }
  #search-store-content .el-dialog__body{
    padding: 12px !important;
  }
</style>
