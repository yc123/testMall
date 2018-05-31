<template>
  <seek :userType="'buyer'" @reloadAction="reloadData"></seek>
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
      if (user.enterprise.uu) {
        params.enUU = user.enterprise.uu
      } else {
        params.userUU = user.userUU
      }
      if (query.seekType === 'wait') {
        params.state = 'todo'
        return Promise.all([
          store.dispatch('applyPurchase/loadBuyerUnSayPricePurchaseManList', params)
        ])
      } else {
        params._state = 'done'
        return Promise.all([
          store.dispatch('applyPurchase/loadBuyerPurchaseManList', params)
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
        let params = {
          pageNumber: page,
          pageSize: count,
          keyword: keyword
        }
        if (this.user.data.enterprise.uu) {
          params.enUU = this.user.data.enterprise.uu
        } else {
          params.userUU = this.user.data.userUU
        }
        if (this.seekType === 'done') {
          params._state = 'done'
          this.$store.dispatch('applyPurchase/loadBuyerPurchaseManList', params)
        } else {
          params.state = 'todo'
          this.$store.dispatch('applyPurchase/loadBuyerUnSayPricePurchaseManList', params)
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
