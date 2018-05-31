<template>
  <div class="mobile-footer" :class="InputGetFocus ? 'active': ''">
    <span :class="activeType=='home'?'active':''">
      <nuxt-link to="/">
        <i :class="activeType=='home'?'iconfont icon-shouye':'iconfont icon-shouye1'"></i><p>首页</p>
      </nuxt-link>
    </span>
    <!--<span :class="activeType=='shops'?'active':''">
      <nuxt-link to="/mobile/shop">
        <i :class="activeType=='shops'?'iconfont icon-dianpu':'iconfont icon-dianpu1'"></i><p>店铺</p>
      </nuxt-link>
    </span>-->
    <!--<span class="seek" @click="goSayPrice">
      <a>
        <img src="/images/mobile/@2x/applyPurchase/home/seek-footer.png" alt="">
        <p>发布求购</p>
      </a>
    </span>-->
    <span :class="{'active': activeType == 'userCenter'}">
      <a @click="goWithLogin('/mobile/center/user')">
        <img :src="`/images/mobile/@2x/home/userCenter${activeType === 'userCenter' ? '-active' : ''}.png`" alt="">
        <p>买家中心</p>
      </a>
    </span>
    <span :class="{'active': activeType == 'vendorCenter'}">
      <a @click="goWithLogin('/mobile/center/vendor', true)">
        <img :src="`/images/mobile/@2x/home/vendorCenter${activeType === 'vendorCenter' ? '-active' : ''}.png`" alt="">
        <p>卖家中心</p>
      </a>
    </span>
    <span :class="activeType=='user'?'active':''">
      <a @click="goWithLogin('/mobile/user')">
        <i :class="activeType=='user'?'iconfont icon-icon':'iconfont icon-wo'"></i><p>我</p>
      </a>
    </span>
    <a @click="toTop" v-show="!hideToTop"><i class="iconfont icon-arrow-up icon-xlg"></i></a>
    <login-box :url="url" @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox"></login-box>
    <!--<publish-seek :showSayPriceBox="showSayPriceBox" @cancelAction="showSayPriceBox = false" @reloadAction="onReload" @remindAction="onRemind"></publish-seek>-->
    <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
  </div>
</template>
<script>
  import { scrollTo } from '~utils/scroll'
  import {LoginBox, RemindBox} from '~components/mobile/common'
  import { startWith } from '~utils/baseUtils'
//  import PublishSeek from './applyPurchase/PublishSeek.vue'
  export default{
    name: 'MobileFooter',
    data () {
      return {
        hideToTop: true,
        showLoginBox: false,
//        showSayPriceBox: false,
        remindText: '',
        timeoutCount: 0,
        url: ''
      }
    },
    components: {
      LoginBox,
//      PublishSeek,
      RemindBox
    },
    computed: {
      InputGetFocus() {
        return this.$store.state.mobile.InputGetFocus
      },
      activeType () {
        let path = this.$route.path
        if (path === '/') {
          return 'home'
        } else if (path === '/mobile/shop') {
          return 'shops'
        } else if (path === '/mobile/user') {
          return 'user'
        } else if (startWith(path, '/mobile/center/user')) {
          return 'userCenter'
        } else if (startWith(path, '/mobile/center/vendor')) {
          return 'vendorCenter'
        } else {
          return ''
        }
      },
      user () {
        return this.$store.state.option.user
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        window.addEventListener('scroll', this.onScroll)
      })
    },
    methods: {
      onScroll () {
        let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (scrolled > window.screen.availHeight) {
          this.hideToTop = false
        } else {
          this.hideToTop = true
        }
      },
      toTop () {
        scrollTo('body', 300)
      },
      goWithLogin: function (url, isSelf) { // 是否拦截个人
        this.url = url
        if (this.user.logged) {
          if (isSelf && (!this.user.data.enterprise.uu || this.user.data.enterprise.isVendor !== 313)) {
            this.onRemind('请先前往pc端开通卖家中心')
          } else {
            this.$router.push(url)
          }
        } else {
            this.showLoginBox = true
          }
        },
      //      onReload: function () {
//        const path = this.$route.path
//        if (path === '/') {
//          this.$store.dispatch('applyPurchase/loadMobileHomeList', {pageNumber: 1, pageSize: 5, enUU: this.user.data.enterprise ? this.user.data.enterprise.uu : null})
//        } else if (path === '/mobile/applyPurchase/list') {
//          this.$store.dispatch('applyPurchase/loadPurchaseManList', {pageNumber: 1, pageSize: 10, enUU: this.user.data.enterprise ? this.user.data.enterprise.uu : null})
//        }
//      },
      goSayPrice: function () {
        if (this.user.logged) {
          this.showSayPriceBox = true
        } else {
          this.showLoginBox = true
        }
      },
      onRemind: function (str) {
        this.remindText = str
        this.timeoutCount ++
      }
    }
  }

</script>
<style scoped lang="scss">
  .mobile-footer{
    position:fixed;
    bottom:0;
    width:100%;
    height:.98rem;
    text-align: center;
    border-top:.02rem solid #ccc;
    background: #ffffff;
    z-index: 10;
    &.active{
      position: relative;
    }
  }
  .mobile-footer > span{
    display: inline-block;
    width: 25%;
    font-size:.32rem;
    color:#b0b0b0;
    padding-top:.1rem;
  }

  .mobile-footer > span a{
    color:#b0b0b0;
  }

  .mobile-footer > span a i{
    font-size:.45rem;
  }
  .mobile-footer > span a p{
    font-size:.22rem;
  }
  .mobile-footer > span a img{
    width: .46rem;
  }

  .mobile-footer > span.active a{
    color:#3976f4;
  }
  .mobile-footer > a {
    position: absolute;
    right: .1rem;
    top: -1rem;
    background: rgba(0,0,0,.4);
    color: #fff;
    width: .88rem;
    height: .88rem;
    line-height: .88rem;
    border-radius: 100%;
  }
  .mobile-footer >a i{
    font-size: .46rem;
  }
  .mobile-footer > span.seek {
    width: 3.5rem;
    position: relative;
  }
  .mobile-footer > span.seek img {
    position: absolute;
    width: 1.3rem;
    height: 1.3rem;
    top: -1.3rem;
    right: 1.1rem;
  }
</style>
