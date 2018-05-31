<template>
  <div class="mobile-center">
    <div class="com-mobile-header">
      <a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>
      <p>卖家中心</p>
    </div>
    <div class="mobile-fix-content">
      <div class="seek-banner block-wrap">
        <img src="/images/mobile/center/vendor/adv.jpg" alt="">
      </div>
      <div class="block-wrap seek-operation">
        <p><i></i>产品管理</p>
        <ul>
          <nuxt-link tag="li" to="/mobile/center/vendor/product?providerType=enterprise">
            <img src="/images/mobile/center/vendor/material.png" alt="">
            <p>企业产品库</p>
          </nuxt-link>
          <nuxt-link tag="li" to="/mobile/center/vendor/product?providerType=person">
            <img src="/images/mobile/center/vendor/material-person.png" alt="">
            <p>个人产品库</p>
          </nuxt-link>
          <nuxt-link tag="li" to="/mobile/center/vendor/product?providerType=onLine">
            <img src="/images/mobile/center/vendor/onsale.png" alt="">
            <p>在售产品</p>
          </nuxt-link>
        </ul>
      </div>
      <div class="block-wrap seek-operation">
        <p><i></i>我的商机</p>
        <ul>
          <nuxt-link to="/mobile/center/vendor/seek?seekType=wait" tag="li">
            <img src="/images/mobile/center/vendor/all.png" alt="">
            <p>我的商机</p>
          </nuxt-link>
          <nuxt-link to="/mobile/center/vendor/seek?seekType=done" tag="li">
            <img src="/images/mobile/center/vendor/seek-done.png" alt="">
            <p>已报价</p>
          </nuxt-link>
        </ul>
      </div>
      <div class="block-wrap collect-block">
        <div class="content-line" @click="goStore">
          <img src="/images/mobile/center/vendor/shop.png" alt="">
          <span>我的店铺</span>
          <i class="iconfont icon-xiangyou"></i>
        </div>
      </div>
    </div>
    <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
  </div>
</template>
<script>
  import { RemindBox } from '~components/mobile/common'
  export default {
    middleware: 'authenticated',
    layout: 'mobileNoHeader',
    data () {
      return {
        remindText: '',
        timeoutCount: 0
      }
    },
    fetch ({ store }) {
      return Promise.all([
        store.dispatch('loadStoreStatus', { op: 'check' })
      ])
    },
    components: {
      RemindBox
    },
    computed: {
      storeInfo () {
        return this.$store.state.option.storeStatus.data
      }
    },
    methods: {
      goStore: function () {
        if (this.storeInfo.uuid) {
          this.$router.push(`/mobile/shop/${this.storeInfo.uuid}`)
        } else {
          this.onRemind('请先前往pc端开通店铺')
        }
      },
      onRemind: function (str) {
        this.remindText = str
        this.timeoutCount++
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/mobileCenter';
  .mobile-center{
    .collect-block {
      height: 1.16rem;
      .content-line {
        border-bottom: none !important;
      }
    }
  }
</style>
