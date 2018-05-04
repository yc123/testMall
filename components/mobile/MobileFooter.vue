<template>
  <div class="mobile-footer">
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
    <span class="seek" @click="goSayPrice">
      <a>
        <img src="/images/mobile/@2x/applyPurchase/home/seek-footer.png" alt="">
        <p>发布求购</p>
      </a>
    </span>
    <span :class="activeType=='user'?'active':''">
      <a @click="goCollect">
        <i :class="activeType=='user'?'iconfont icon-icon':'iconfont icon-wo'"></i><p>我</p>
      </a>
    </span>
    <a @click="toTop" v-show="!hideToTop"><i class="iconfont icon-arrow-up icon-xlg"></i></a>
    <login-box @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox"></login-box>
    <publish-seek :showSayPriceBox="showSayPriceBox" @cancelAction="showSayPriceBox = false" @reloadAction="onReload" @remindAction="onRemind"></publish-seek>
    <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
  </div>
</template>
<script>
  import { scrollTo } from '~utils/scroll'
  import {LoginBox, RemindBox} from '~components/mobile/common'
  import PublishSeek from './applyPurchase/PublishSeek.vue'
  export default{
    name: 'MobileFooter',
    data () {
      return {
        hideToTop: true,
        showLoginBox: false,
        showSayPriceBox: false,
        remindText: '',
        timeoutCount: 0
      }
    },
    components: {
      LoginBox,
      PublishSeek,
      RemindBox
    },
    computed: {
      activeType () {
        return this.$route.path === '/' ? 'home' : this.$route.path === '/mobile/shop' ? 'shops' : this.$route.path === '/mobile/user' ? 'user' : ''
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
      goCollect: function () {
        if (this.user.logged) {
          this.$router.push('/mobile/user?type=buyer')
        } else {
          this.showLoginBox = true
        }
      },
      onReload: function () {
        const path = this.$route.path
        if (path === '/') {
          this.$store.dispatch('applyPurchase/loadMobileHomeList', {pageNumber: 1, pageSize: 5, enUU: this.user.data.enterprise ? this.user.data.enterprise.uu : null})
        } else if (path === '/mobile/applyPurchase/list') {
          this.$store.dispatch('applyPurchase/loadPurchaseManList', {pageNumber: 1, pageSize: 10, enUU: this.user.data.enterprise ? this.user.data.enterprise.uu : null})
        }
      },
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
    border-top:.04rem solid #ccc;
    background: #ffffff;
    z-index: 10;
  }
  .mobile-footer > span{
    display: inline-block;
    width: 2rem;
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
