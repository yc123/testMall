<template>
  <div class="mobile-content">
    <div class="mobile-header">
      <a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>
      <div class="search-content">
        <input type="text" v-model="seekKeyword" :placeholder="user.logged ? '型号/品牌/类目/规格/公司' : '型号/品牌/类目/规格'" @keyup.13="searchSeek">
        <span @click="searchSeek">
        <i class="iconfont icon-sousuo"></i>
        </span>
      </div>
    </div>
    <div class="seek-title">
      <img src="/images/mobile/@2x/applyPurchase/home/seek-title.png" alt="">
      <span>最新求购信息</span>
    </div>
    <seek-list :isSearch="isSearch" :keyword="remindKeyword" :purchaseManList="purchaseManListData" :isDataChange="isDataChange"></seek-list>
    <!--<loading v-show="isSearchSearchingMore"></loading>-->
    <div v-if="purchaseManList && false"></div>
  </div>
</template>
<script>
  import SeekList from '~components/mobile/applyPurchase/SeekList.vue'
  import {Loading} from '~components/mobile/common'
  export default {
    layout: 'mobile',
    components: {
      SeekList,
      Loading
    },
    data () {
      return {
        isSearchSearchingMore: false,
        page: 1,
        size: 10,
        purchaseManListData: [],
        showSeekSearch: true,
        seekKeyword: '',
        isChange: false,
        isDataChange: false,
        isSearch: false,
        remindKeyword: ''
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        window.addEventListener('scroll', this.scroll, false)
      })
    },
//    watch: {
//      $route: function (val, oldVal) {
//        window.removeEventListener('scroll', this.scroll, false)
//      }
//    },
    fetch ({store}) {
      return Promise.all([
        store.dispatch('applyPurchase/loadPurchaseManList', {pageNumber: 1, pageSize: 10, sorting: {'releaseDate': 'DESC'}, keyword: this.seekKeyword, enUU: store.state.option.user.data.enterprise ? store.state.option.user.data.enterprise.uu : null})
      ])
    },
    computed: {
      purchaseManList () {
        let list = this.$store.state.applyPurchase.purchaseManList.purchaseManList.data
        if (this.isChange) {
          this.purchaseManListData = []
          this.page = 1
          this.isChange = false
          this.isDataChange = true
        } else {
          this.purchaseManListData = this.purchaseManListData.concat(list.content)
          this.isSearchSearchingMore = false
          this.isDataChange = false
        }
        return this.$store.state.applyPurchase.purchaseManList.purchaseManList.data
      },
      allPage () {
        return Math.floor(this.purchaseManList.totalElements / this.purchaseManList.size) + Math.floor(this.purchaseManList.totalElements % this.purchaseManList.size > 0 ? 1 : 0)
      }
    },
    methods: {
      scroll: function () {
        let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (Math.ceil(scrolled + window.screen.availHeight) >= document.body.scrollHeight && !this.isSearchSearchingMore && this.page < this.allPage) {
          this.getMoreSearch()
        }
        if (this.$refs.searchSeekInput && this.$store.state.mobile.InputGetFocus) {
          this.$refs.searchSeekInput.blur()
        }
      },
      getMoreSearch: function () {
        this.page++
        this.isSearchSearchingMore = true
        this.reloadData()
      },
      reloadData: function () {
        this.$store.dispatch('applyPurchase/loadPurchaseManList', {pageNumber: this.page, pageSize: this.size, sorting: {'releaseDate': 'DESC'}, keyword: this.seekKeyword, enUU: this.$store.state.option.user.data.enterprise ? this.$store.state.option.user.data.enterprise.uu : null, isLogin: this.user.logged ? '1' : '0'})
      },
      searchSeek: function () {
        this.isSearch = true
        this.remindKeyword = this.seekKeyword
        this.page = 1
        this.isChange = true
        this.reloadData()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mobile-content {
    .mobile-header {
      position: fixed;
      top: 0;
      z-index: 10;
      width:100%;
      height:.88rem;
      line-height: .88rem;
      background: #3e82f5;
      padding:0 .2rem 0 .1rem;
      color:#fff;
      > a {
        font-size:.28rem;
        color:#fff;
        position: absolute;
        i {
          font-size: .48rem;
          margin-right: -.1rem;
        }
      }
      .search-content {
        margin-left: .5rem;
        line-height: normal;
        padding-top: .14rem;
        input {
          color: #333;
          width: 6.48rem;
          line-height: normal;
        }
        span {
          height: .46rem;
          line-height: .46rem;
        }
      }
    }
  }
</style>
