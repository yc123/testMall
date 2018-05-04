<template>
  <div id="main">
    <header-view v-if="!isInFrame"></header-view>
    <store-header/>
    <store-title/>
    <img v-if="isConsignment" class="banner-img" src="/images/all/banner-consignment.png" alt="">
    <!--<img v-if="isConsignment" class="cuxiao-banner" src="/images/all/banner-cuxiao.png" alt="">-->
    <nuxt/>
    <img v-if="isConsignment && !isInDetail" class="banner-img" src="/images/all/banner-consignment2.jpg" alt="" style="margin: 10px auto 30px;">
    <footer-view></footer-view>
    <right-bar></right-bar>
  </div>
</template>
<script>
  import { Header, Footer, RightBar } from '~components/default'
  import { StoreHeader, StoreTitle } from '~components/store'

  function getCount (str, char) {
    return str.split(char).length - 1
  }
  export default {
    name: 'shop',
    components: {
      HeaderView: Header,
      FooterView: Footer,
      RightBar,
      StoreHeader,
      StoreTitle
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
      isInFrame () {
        if (this.$route.query.type === 'erp') {
          this.$store.commit('option/ADD_COOKIES', 'type=erp;')
          return true
        } else {
          let cookies = this.$store.state.option.cookies
          let cookieArr = cookies.split(';')
          let cookieObj = {}
          for (let i = 0; i < cookieArr.length; i++) {
            if (cookieArr[i].indexOf('=') > -1) {
              let tmpArr = cookieArr[i].split('=')
              cookieObj[tmpArr[0].trim()] = tmpArr[1].trim()
            }
          }
          return cookieObj.type === 'erp'
        }
      },
      title () {
        let path = this.$route.path
        if ((path.startsWith('/store/') && getCount(path, '/') === 2) || path.endsWith('/description')) {
          if (!this.isConsignment) {
            return this.storeInfo.storeName + this.getStoreType(this.storeInfo.type) + '专卖店-优软商城'
          } else {
            return 'IC电子元器件库存寄售呆滞尾料空闲库存商城自营现货寄售-优软商城'
          }
        } else if (path.startsWith('/store/') && getCount(path, '/') === 3) {
          return this.commodity.brandNameEn + this.commodity.code + '价格|现货库存|报价|产品参数-优软商城'
        } else {
          return '【优软商城】IC电子元器件现货采购交易平台商城'
        }
      },
      description () {
        let path = this.$route.path
        if ((path.startsWith('/store/') && getCount(path, '/') === 2) || path.endsWith('/description')) {
          if (!this.isConsignment) {
            return this.storeInfo.storeName + '官方' + this.getStoreType(this.storeInfo.type) + '专卖店，提供最新IC电子元器件现货在线销售。'
          } else {
            return '优软商城为您提供IC电子元器件库存寄售呆滞尾料空闲库存现货寄售服务，商城自营现货寄售让您更放心更省心。'
          }
        } else if (path.startsWith('/store/') && getCount(path, '/') === 3) {
          return this.commodity.enterpriseName + '提供' + this.commodity.brandNameEn + this.commodity.code + '价格和' + this.commodity.code + '现货库存，并且内容还包含' + this.commodity.code + '产品参数、' + this.commodity.code + '规格书数据手册等。'
        } else {
          return '优软商城（usoftmall.com）是中国领先的IC电子元器件现货采购交易网上商城，提供上千万种电子元器件现货采购交易，采购电子元器件就上优软商城！'
        }
      },
      keywords () {
        let path = this.$route.path
        if ((path.startsWith('/store/') && getCount(path, '/') === 2) || path.endsWith('/description')) {
          if (!this.isConsignment) {
            return '电子元器件' + this.getStoreType(this.storeInfo.type) + '专卖店'
          } else {
            return '优软商城,ic芯片库存寄售,电子元器件寄售'
          }
        } else if (path.startsWith('/store/') && getCount(path, '/') === 3) {
          return this.commodity.code + '价格,' + this.commodity.code + '现货,' + this.commodity.code + '报价,' + this.commodity.code + '产品参数'
        } else {
          return '优软商城'
        }
      },
      storeInfo () {
        return this.$store.state.shop.storeInfo.store.data
      },
      isConsignment () {
        return this.storeInfo.type === 'CONSIGNMENT'
      },
      isInDetail () {
        return this.$route.path.indexOf('/store/productDetail/') !== -1
      },
      commodity () {
        return this.$store.state.shop.storeInfo.commodity.data
      }
    },
    methods: {
      getStoreType: function (type) {
        if (type === 'ORIGINAL_FACTORY') {
          return '原厂'
        } else if (type === 'AGENCY') {
          return '代理'
        } else if (type === 'DISTRIBUTION') {
          return '经销'
        } else if (type === 'CONSIGNMENT') {
          return '寄售'
        }
        return ''
      }
    }
  }
</script>
<style scoped>
  .banner-img {
    margin-top: -10px;
  }
  .cuxiao-banner {
    margin: 15px auto 20px ;
    display: block;
  }
</style>
