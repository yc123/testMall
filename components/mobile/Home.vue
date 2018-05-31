<template>
  <div class="home">
    <div v-if="!showMainSearch">
      <div class="header">
        <div v-swiper:mySwiper="swiperOption">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <img class="home-bg" src="/images/mobile/@2x/applyPurchase/home/app-banner_01.jpg" alt="">
            </div>
            <div class="swiper-slide">
              <img class="home-bg" src="/images/mobile/@2x/applyPurchase/home/app-banner_02.jpg" alt="">
            </div>
          </div>
          <div class="swiper-pagination swiper-pagination-bullets"></div>
        </div>
        <div class="search-content">
          <input type="text" placeholder="请输入您要查找的型号、品牌或店铺" @click="onHomeSearchClick()">
          <span>
          <i class="iconfont icon-sousuo"></i>
        </span>
          <img src="/images/mobile/@2x/applyPurchase/home/phone.png" alt="" @click="showStoreInfo = true">
        </div>
      </div>
      <ul class="link-list">
        <li>
          <nuxt-link to="/mobile/supplier">
            <img src="/images/mobile/@2x/home/supplier.png" alt="">
            <span>供应商</span>
          </nuxt-link>
        </li>
        <li>
          <a @click="goOpportunity">
            <img src="/images/mobile/@2x/home/seek.png" alt="">
            <span>我的商机</span>
          </a>
        </li>
        <li>
          <nuxt-link to="/mobile/shop">
            <img src="/images/mobile/@2x/home/store.png" alt="">
            <span>店铺列表</span>
            <!-- <i></i>-->
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/mobile/brand/brandCenter/A">
            <img src="/images/mobile/@2x/home/brand.png" alt="">
            <span>品牌墙</span>
          </nuxt-link>
        </li>
      </ul>
      <div class="seek-title">
        <img src="/images/mobile/@2x/applyPurchase/home/seek-title.png" alt="">
        <span>最新求购信息</span>
        <nuxt-link to="/mobile/applyPurchase/list">查看更多 <img src="/images/mobile/@2x/applyPurchase/home/arrow-right.png" alt=""></nuxt-link>
      </div>
      <seek-list :purchaseManList="purchaseManListData" :isDataChange="isDataChange"></seek-list>
    </div>
    <div class="mobile-modal" v-if="showStoreInfo" @touchmove="preventTouchMove($event)">
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
    <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
    <login-box @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox" :url="url"></login-box>
    <pull-up :searchMore="fetching" :allPage="allPage" :page="page" @pullUpAction="getMoreSearch" :isValid="isValid"></pull-up>
  </div>
</template>
<script>
  import SeekList from './applyPurchase/SeekList.vue'
  import MainSearch from '~/components/mobile/search/MainSearch.vue'
  import { RemindBox, LoginBox, PullUp } from '~components/mobile/common'
  export default {
    data () {
      return {
        showStoreInfo: false,
        showMainSearch: false,
        swiperOption: {
          autoplay: 3000,
          initialSlide: 0,
          pagination: '.swiper-pagination',
          // 解决点击分页器后图片就不能轮播的问题
          autoplayDisableOnInteraction: false,
          paginationClickable: true,
          mousewheelControl: false,
          effect: 'fade',
          lazyLoading: true,
          loop: true,
          prevButton: '.swiper-button-prev',
          nextButton: '.swiper-button-next'
        },
        remindText: '',
        timeoutCount: 0,
        showLoginBox: false,
        isSearchSearchingMore: false,
        page: 1,
        size: 5,
        purchaseManListData: [],
        isChange: false,
        isDataChange: false,
        url: '',
        isValid: true
      }
    },
    components: {
      SeekList,
      MainSearch,
      RemindBox,
      LoginBox,
      PullUp
    },
    watch: {
      '$store.state.applyPurchase.purchaseManList.purchaseHomeList.data': {
        handler: function (val) {
          if (this.isChange) {
            this.purchaseManListData = []
            this.page = 1
            this.isChange = false
            this.isDataChange = false
          } else {
            this.purchaseManListData = this.purchaseManListData.concat(val.content)
            this.isSearchSearchingMore = false
            this.isDataChange = true
          }
        },
        immediate: true
      }
//      $route: {
//        handler: function (val) {
//          window.removeEventListener('scroll', this.scroll)
//        }
//      }
    },
    computed: {
      purchaseManList () {
        return this.$store.state.applyPurchase.purchaseManList.purchaseHomeList.data
      },
      allPage () {
        return Math.floor(this.purchaseManList.totalElements / this.purchaseManList.size) + Math.floor(this.purchaseManList.totalElements % this.purchaseManList.size > 0 ? 1 : 0)
      },
      fetching () {
        return this.$store.state.applyPurchase.purchaseManList.purchaseHomeList.fetching
      }
    },
    methods: {
//      scroll: function () {
//         let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
//         if (Math.ceil(scrolled + window.screen.availHeight) >= document.body.scrollHeight && !this.isSearchSearchingMore && this.page < this.allPage) {
//           this.getMoreSearch()
//         }
//      },
      onHomeSearchClick () {
        this.isValid = false
        this.showMainSearch = true
        this.$store.dispatch('searchData/getSearchHistory')
      },
      onCancelSearch: function () {
        this.isValid = true
        this.showMainSearch = false
      },
      goOpportunity () {
        if (this.user.logged) {
          if (this.user.data.enterprise.uu) {
            this.$router.push('/mobile/applyPurchase/list/businessOpportunity')
          } else if (this.user.data.enterprise.isVendor !== 313) {
            this.onRemind('抱歉，您暂未开通卖家中心，可前往PC端开通')
          }
        } else {
          this.url = '/mobile/applyPurchase/list/businessOpportunity'
          this.showLoginBox = true
        }
      },
      onRemind: function (str) {
        this.remindText = str
        this.timeoutCount ++
      },
      reloadData: function () {
        this.$store.dispatch('applyPurchase/loadMobileHomeList', {pageNumber: this.page, pageSize: this.size, sorting: {'releaseDate': 'DESC'}, enUU: this.$store.state.option.user.data.enterprise ? this.$store.state.option.user.data.enterprise.uu : null, isLogin: this.user.logged ? '1' : '0'})
      },
      getMoreSearch: function () {
        this.page++
        this.isSearchSearchingMore = true
        this.reloadData()
      }
    },
    mounted() {
      this.$nextTick(() => {
//        window.addEventListener('scroll', this.scroll, false)
        if (this.$route.query.code) {
          let ua = window.navigator.userAgent.toLowerCase()
          if (ua.match(/micromessenger/i)[0] === 'micromessenger') {
            let info = localStorage.getItem('USOFTMALLWECHATINFO')
            if (info) {
              this.$store.commit('option/REQUEST_WECHATINFO_STATUS_SUCCESS', JSON.parse(info))
            }
            this.$store.dispatch('GerWechatInfo', {code: this.$route.query.code})
          }
        }
      })
    }
  }
</script>
<style lang="scss">
  .home {
    padding-bottom: 1rem;
    background: #f3f3f7;
    .header {
      height: 3.26rem;
      position: relative;
      .home-bg {
        height: 3.26rem;
        width: 100%;
      }
      .search-content {
        position: absolute;
        top: 0;
        width: 100%;
      }
      .swiper-container {
        height: 3.26rem;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 0;
      }
      .swiper-pagination-fraction, .swiper-pagination-custom, .swiper-container-horizontal > .swiper-pagination-bullets {
        bottom: .1rem !important;
      }
      .swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {
        width: .16rem !important;
        height: .16rem !important;
        margin: 0 .2rem;
      }
    }
    .link-list {
      background: #fff;
      height: 1.56rem;
      margin-bottom: .2rem;
      li {
        position: relative;
        display: inline-block;
        width: 25%;
        text-align: center;
        float: left;
        height: 1.56rem;
        img {
          width: .7rem;
          height: .7rem;
          margin-top: .2rem;
        }
        span {
          font-size: .26rem;
          color: #666;
          display: block;
          margin-top: .15rem;
        }
        i {
          height: 0.9rem;
          width: .01rem;
          background: #ddd;
          display: block;
          position: absolute;
          right: 0;
          top: .2rem;
        }
      }
    }
  }
</style>
