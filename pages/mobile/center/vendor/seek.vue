<template>
  <seek :userType="'saler'" @reloadAction="reloadData"></seek>
</template>
<script>
  import { Seek } from '~components/mobile/center'
  export default {
    layout: 'mobileNoHeader',
    middleware: 'authenticated',
    fetch ({ store, query }) {
      let user = store.state.option.user.data
      let params = {
        pageNumber: 1,
        pageSize: 10
      }
      if (query.seekType === 'wait') {
        params.enuu = user.enterprise.uu
        params.useruu = user.userUU
        return Promise.all([
          store.dispatch('applyPurchase/loadVendorPushList', params)
        ])
      } else {
        params._state = 'done'
        params.filter = {
          vendUU: user.enterprise.uu,
          fromDate: null,
          endDate: null,
          keyword: null
        }
        params.overdue = 1
        return Promise.all([
          store.dispatch('applyPurchase/loadVendorPurchaseManList', params)
        ])
      }
    },
    components: {
      Seek
    },
    computed: {
      seekType () {
        return this.$route.query.seekType
      }
    },
    methods: {
      reloadData: function (page = 1, count = 10, keyword) {
        let store = this.$store
        let user = store.state.option.user.data
        let params = {
          pageNumber: page,
          pageSize: count
        }
        if (this.seekType === 'wait') {
          params.enuu = user.enterprise.uu
          params.useruu = user.userUU
          params.keyword = keyword
          return Promise.all([
            store.dispatch('applyPurchase/loadVendorPushList', params)
          ])
        } else {
          params._state = 'done'
          params.filter = {
            vendUU: user.enterprise.uu,
            fromDate: null,
            endDate: null,
            keyword: keyword
          }
          params.overdue = 1
          return Promise.all([
            store.dispatch('applyPurchase/loadVendorPurchaseManList', params)
          ])
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .search-content {
    text-align: center;
    padding: .25rem 0 0 0;
    input {
      border: 1px solid #376ff3;
    }
    span {
      height: .46rem;
      line-height: .46rem;
    }
  }
</style>
