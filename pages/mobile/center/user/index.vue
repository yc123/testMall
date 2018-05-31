<template>
  <div class="mobile-center">
    <div class="com-mobile-header">
      <a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>
      <p>买家中心</p>
    </div>
    <div class="mobile-fix-content">
      <div class="seek-banner block-wrap">
        <img src="/images/mobile/center/user/adv.jpg" alt="">
      </div>
      <div class="block-wrap seek-operation">
        <p><i></i>我的求购</p>
        <ul>
          <nuxt-link to="/mobile/center/user/seek?seekType=wait" tag="li">
            <img src="/images/mobile/center/user/wait.png" alt="">
            <p>待报价</p>
          </nuxt-link>
          <nuxt-link to="/mobile/center/user/seek?seekType=done" tag="li">
            <img src="/images/mobile/center/user/done.png" alt="">
            <p>已报价</p>
          </nuxt-link>
          <li @click="showPublishBox = true">
            <img src="/images/mobile/center/user/pub.png" alt="">
            <p>发布求购</p>
          </li>
        </ul>
      </div>
      <div class="block-wrap collect-block">
        <nuxt-link tag="div" to="/mobile/center/user/collect/component" class="content-line">
          <img src="/images/mobile/center/user/comp-collect.png" alt="">
          <span>器件收藏<span class="text">({{compCount.data || 0}})</span></span>
          <i class="iconfont icon-xiangyou"></i>
        </nuxt-link>
        <nuxt-link tag="div" to="/mobile/center/user/collect/store" class="content-line">
          <img src="/images/mobile/center/user/store-focus.png" alt="">
          <span>店铺关注<span class="text">({{storeCount.data || 0}})</span></span>
          <i class="iconfont icon-xiangyou"></i>
        </nuxt-link>
      </div>
    </div>
    <publish-seek :showSayPriceBox="showPublishBox" @cancelAction="showPublishBox = false" @remindAction="onRemind"></publish-seek>
    <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
  </div>
</template>
<script>
  import { RemindBox } from '~components/mobile/common'
  import { PublishSeek } from '~components/mobile/applyPurchase'
  export default {
    layout: 'mobileNoHeader',
    middleware: 'authenticated',
    data () {
      return {
        showPublishBox: false,
        remindText: '',
        timeoutCount: 0
      }
    },
    fetch ({store}) {
      return Promise.all([
        store.dispatch('product/loadCompCollectInfo'),
        store.dispatch('shop/loadStoreCollectInfo')
      ])
    },
    components: {
      RemindBox,
      PublishSeek
    },
    computed: {
      compCount () {
        return this.$store.state.product.component.collectCount.data
      },
      storeCount () {
        return this.$store.state.shop.storeInfo.collectCount.data
      }
    },
    methods: {
      onRemind: function (str) {
        this.remindText = str
        this.timeoutCount++
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/mobileCenter';
</style>
