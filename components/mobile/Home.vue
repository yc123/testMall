<template>
  <div>
    <div class="home" v-if="!showMainSearch">
      <div class="header">
        <div class="search-content">
          <input type="text" placeholder="请输入您要查找的型号或品牌" @click="onHomeSearchClick()">
          <span>
        <i class="iconfont icon-sousuo"></i>
      </span>
          <img src="/images/mobile/@2x/applyPurchase/home/phone.png" alt="" @click="showStoreInfo = true">
        </div>
      </div>
      <ul class="link-list">
        <li>
          <nuxt-link to="/mobile/shop">
            <img src="/images/mobile/@2x/applyPurchase/home/shop.png" alt="">
            <span>店铺列表</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/mobile/brand/brandCenter/ABCD">
            <img src="/images/mobile/@2x/applyPurchase/home/brand.png" alt="">
            <span>品牌列表</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/mobile/applyPurchase/list">
            <img src="/images/mobile/@2x/applyPurchase/home/seek.png" alt="">
            <span>求购询价</span>
          </nuxt-link>
        </li>
      </ul>
      <div class="seek-title">
        <img src="/images/mobile/@2x/applyPurchase/home/seek-title.png" alt="">
        <span>最新求购信息</span>
        <nuxt-link to="/mobile/applyPurchase/list">查看更多 <img src="/images/mobile/@2x/applyPurchase/home/arrow-right.png" alt=""></nuxt-link>
      </div>
      <seek-list :purchaseManList="purchaseManList"></seek-list>
    </div>
    <div class="mobile-modal" v-if="showStoreInfo">
      <div class="mobile-modal-box">
        <div class="mobile-modal-header">联系方式<i @click="showStoreInfo = false" class="icon-guanbi iconfont"></i></div>
        <div class="mobile-modal-content">
          <div>商家地址：深圳市南山区英唐大厦1楼</div>
          <!-- <div class="content-line link-url">在线咨询</div>-->
          <div>致电：<a href="tel:4008301818" target="_blank" class="content-line link-url">4008301818</a></div>
          <div>邮件：<a href="mailto:yrsc@usoftchina.com" target="_blank" class="content-line link-url">yrsc@usoftchina.com</a></div>
        </div>
      </div>
    </div>
    <main-search v-if="showMainSearch" @cancelSearchAction="onCancelSearch"></main-search>
  </div>
</template>
<script>
  import SeekList from './applyPurchase/SeekList.vue'
  import MainSearch from '~/components/mobile/search/MainSearch.vue'
  export default {
    data () {
      return {
        showStoreInfo: false,
        showMainSearch: false
      }
    },
    components: {
      SeekList,
      MainSearch
    },
    computed: {
      purchaseManList () {
        return this.$store.state.applyPurchase.purchaseManList.purchaseHomeList.data.content
      }
    },
    methods: {
      onHomeSearchClick () {
        this.showMainSearch = true
        this.$store.dispatch('searchData/getSearchHistory')
      },
      onCancelSearch: function () {
        this.showMainSearch = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .home {
    padding-bottom: 1rem;
    .header {
      background: url('/images/mobile/@2x/applyPurchase/home/home-bg.png') no-repeat;
      background-size: cover;
      height: 3.26rem;
    }
    .link-list {
      background: #f3f3f7;
      height: 1.36rem;
      li {
        display: inline-block;
        width: 33.3%;
        text-align: center;
        float: left;
        height: 1.36rem;
        img {
          width: .63rem;
          height: .63rem;
          margin-top: .2rem;
        }
        span {
          font-size: .22rem;
          color: #666;
          display: block;
          margin-top: .15rem;
        }
      }
    }
  }
</style>
