<template>
  <div class="seek">
    <div class="com-mobile-header">
      <a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>
      <p>{{seekType === 'wait' ? '待报价' : '已报价'}}</p>
    </div>
    <div class="mobile-fix-content" id="mobileFixContent">
      <div class="search-content">
        <input type="text" v-model="seekKeyword" :placeholder="`型号/品牌${userType == 'buyer' ? '' : '/类目/规格/公司'}`" @keyup.13="onSearch">
        <span @click="onSearch"><i class="iconfont icon-sousuo"></i></span>
      </div>
      <seek-list :keyword="remindKeyword" :isSearch="isSearch" :userType="userType" :seekType="seekType" :purchaseManList="purchaseManListData"></seek-list>
      <pull-up :fixId="'mobileFixContent'" :searchMore="fetching" :allPage="allPage" :page="page" @pullUpAction="onPullUpAction"></pull-up>
    </div>
  </div>
</template>
<script>
  import SeekList from '~components/mobile/applyPurchase/SeekList.vue'
  import { PullUp, EmptyStatus } from '~components/mobile/common'
  export default {
    layout: 'mobileNoHeader',
    middleware: 'authenticated',
    data () {
      return {
        seekKeyword: '',
        purchaseManListData: [],
        page: 1,
        count: 10,
        isChange: false,
        isSearch: false,
        remindKeyword: ''
      }
    },
    props: ['userType'],
    components: {
      SeekList,
      PullUp,
      EmptyStatus
    },
    watch: {
      'purchase.data': {
        handler: function (val) {
          let list = val.content ? val.content.slice() : []
          if (this.isChange) {
            this.purchaseManListData = list
            this.isChange = false
          } else {
            this.purchaseManListData = this.purchaseManListData.concat(list)
          }
        },
        immediate: true
      }
    },
    computed: {
      seekType () {
        return this.$route.query.seekType
      },
      purchase () {
        return this.$store.state.applyPurchase.purchaseManList.purchaseManList
      },
      fetching () {
        return this.purchase.fetching
      },
      allPage () {
        return Math.floor(this.purchase.data.totalElements / this.purchase.data.size) + Math.floor(this.purchase.data.totalElements % this.purchase.data.size > 0 ? 1 : 0)
      }
    },
    methods: {
      onSearch: function () {
        this.isSearch = true
        this.remindKeyword = this.seekKeyword
        this.page = 1
        this.isChange = true
        this.reloadData()
      },
      reloadData: function () {
        this.$emit('reloadAction', this.page, this.count, this.seekKeyword, this.seekType)
      },
      onPullUpAction: function () {
        this.page++
        this.reloadData()
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
