<template>
  <div id="main" class="uservendor">
    <header-view v-if="!isInFrame"></header-view>
    <vendor-header></vendor-header>
    <nuxt/>
    <footer-view></footer-view>
    <right-bar></right-bar>
  </div>
</template>
<script>
  import { Header, Footer, RightBar } from '~components/default'
  import { VendorHeader } from '~components/main'
  export default {
    name: 'mainView',
    components: {
      HeaderView: Header,
      FooterView: Footer,
      RightBar,
      VendorHeader
    },
    head () {
      return {
        title: this.title,
        meta: [
          {hid: 'description', name: 'description', content: this.description},
          {hid: 'keywords', name: 'keywords', content: this.keywords}
        ]
      }
    },
    computed: {
      title () {
        return '卖家中心-优软商城'
      },
      description () {
        return '优软商城，电子元器件搜索引擎'
      },
      keywords () {
        return '软商城，B2B，B2C，行业门户，网上贸易，电子商务，网上贸易，网上交易，交易市场，在线交易，供求信息，采购，求购信息，供应信息'
      },
      kinds () {
        return this.$store.state.product.kind.kindsParentWithBother.data
      },
      componentDetail () {
        return this.$store.state.componentDetail.detail.data
      },
      brandDetail () {
        return this.$store.state.brandDetail.detail.data
      },
      newsDetail () {
        return this.$store.state.newsData.detailNews.detailNews.data
      }
    }
  }
</script>

<style lang="scss" scoped>
.uservendor {
  background: #f7f7f7;
}
</style>

