<template>
  <div id="main">
    <header-view v-if="!isInFrame"></header-view>
    <main-header></main-header>
    <main-nav></main-nav>
    <nuxt/>
    <footer-view></footer-view>
    <right-bar></right-bar>
  </div>
</template>
<script>
  import { Header, Footer, RightBar } from '~components/default'
  import { MainHeader, MainNav } from '~components/main'
  export default {
    name: 'mainView',
    components: {
      HeaderView: Header,
      FooterView: Footer,
      RightBar,
      MainHeader,
      MainNav
    },
    head () {
      return {
        title: this.title || '【优软商城】IC电子元器件现货采购交易平台商城',
        meta: [
          {hid: 'description', name: 'description', content: this.description || '优软商城（usoftmall.com）是中国领先的IC电子元器件现货采购交易网上商城，提供上千万种电子元器件现货采购交易，采购电子元器件就上优软商城！'},
          {hid: 'keywords', name: 'keywords', content: this.keywords || '优软商城'}
        ]
      }
    },
    computed: {
      isMobile: function () {
        return this.$store.state.option.isMobile
      },
      title () {
        let path = this.$route.path
        if (path === '/product/kind/home') {
          return '电子元器件器件选型参数型号查询器件类别分类大全-优软商城'
        } else if (path.startsWith('/product/kind/')) {
          if (this.kinds[this.kinds.length - 1]) {
            return this.kinds[this.kinds.length - 1].nameCn + '产品品牌型号大全-优软商城'
          }
          return ''
        } else if (path.startsWith('/product/component/')) {
          if (this.componentDetail) {
            return this.componentDetail.brand.nameCn + this.componentDetail.code + '参数|供应商|数据手册中文资料|规格书-优软商城'
          } else {
            return ''
          }
        } else if (path.startsWith('/product/brand/brandList/')) {
          return 'IC电子元器件品牌中心品牌大全-优软商城'
        } else if (path.startsWith('/product/brand/')) {
          if (this.brandDetail.nameEn) {
            return this.brandDetail.nameEn + '(' + this.brandDetail.nameCn + ')产品分类及产品型号大全-优软商城'
          }
          return '【优软商城】IC电子元器件现货采购交易平台商城'
        } else if (path === '/provider/factories') {
          return 'IC电子元器件厂家原厂直销原厂专卖店大全-优软商城'
        } else if (path === '/provider/home') {
          return 'IC电子元器件代理商经销商专营店大全-优软商城'
        } else if (path === '/news') {
          return 'IC电子元器件行业市场资讯新闻-优软商城'
        } else if (path.startsWith('/news/')) {
          return this.newsDetail.title + '-电子元器件行业资讯-优软商城' || 'IC电子元器件行业市场资讯新闻-优软商城'
        } else if (path === '/search') {
          return this.$route.query.w + '-产品搜索-优软商城'
        } else if (path === '/searchStore') {
          return this.$route.query.w + '-店铺搜索-优软商城'
        } else {
          return '【优软商城】IC电子元器件现货采购交易平台商城'
        }
      },
      description () {
        let path = this.$route.path
        if (path === '/product/kind/home') {
          return '优软商城电子元器件器件型号查询器件类别分类大全,优软商城提供元器件智能选型服务,能让您完美的找到热门型号的替代型号产品，一键搜索功能让您快速找到您想要的型号。'
        } else if (path.startsWith('/product/kind/')) {
          if (this.kinds[this.kinds.length - 1]) {
            return '优软商城' + this.kinds[this.kinds.length - 1].nameCn + '产品品牌型号大全，能让您快速的找到' + this.kinds[this.kinds.length - 1].nameCn + '产品品牌型号。'
          }
          return ''
        } else if (path.startsWith('/product/component/')) {
          if (this.componentDetail) {
            return '优软商城提供' + this.componentDetail.brand.nameCn + this.componentDetail.code + '数据手册中文资料规格书下载，' + this.componentDetail.code + '供应商及参数报价。'
          } else {
            return ''
          }
        } else if (path.startsWith('/product/brand/brandList/')) {
          return 'IC电子元器件品牌中心品牌大全，优软商城品牌中心汇聚国内国际电子元器件品牌，全力打造国家级元器件电商品台。'
        } else if (path.startsWith('/product/brand/')) {
          if (this.brandDetail.brief) {
            return this.brandDetail.brief || '优软商城（usoftmall.com）是中国领先的IC电子元器件现货采购交易网上商城，提供上千万种电子元器件现货采购交易，采购电子元器件就上优软商城！'
          }
          return ''
        } else if (path === '/provider/factories') {
          return 'IC电子元器件厂家原厂直销原厂专卖店大全，优软商城原厂专区提供IC电子元器件厂家原厂直销原厂专卖店大全。'
        } else if (path === '/provider/home') {
          return 'IC电子元器件代理商经销商专营店大全，优软商城代理经销专区提供IC电子元器件代理商经销商专卖店大全。'
        } else if (path === '/news') {
          return '优软商城电子元器件采购网提供精准的电子快讯，电子资讯，电子元器件资讯。'
        } else if (path.startsWith('/news/')) {
          return this.newsDetail.summary
        } else {
          return '优软商城（usoftmall.com）是中国领先的IC电子元器件现货采购交易网上商城，提供上千万种电子元器件现货采购交易，采购电子元器件就上优软商城！'
        }
      },
      keywords () {
        let path = this.$route.path
        if (path === '/product/kind/home') {
          return '电子元器件分类,电子元器件参数,电子元器件型号,电子元器件类别'
        } else if (path.startsWith('/product/kind/')) {
          if (this.kinds[this.kinds.length - 1]) {
            return this.kinds[this.kinds.length - 1].nameCn
          }
          return ''
        } else if (path.startsWith('/product/component/')) {
          if (this.componentDetail) {
            return this.componentDetail.code + '供应商,' + this.componentDetail.code + '数据手册,' + this.componentDetail.code + '规格书'
          } else {
            return ''
          }
        } else if (path.startsWith('/product/brand/brandList/')) {
          return 'ic,元器件,品牌'
        } else if (path.startsWith('/product/brand/')) {
          if (this.brandDetail.nameEn) {
            return this.brandDetail.nameEn + '(' + this.brandDetail.nameCn
          }
          return '优软商城'
        } else if (path === '/provider/factories') {
          return '电子元器件原厂,电子元器件厂家'
        } else if (path === '/provider/home') {
          return 'ic代理商,ic经销商,电子元器件代理商 , 电子元器件经销商'
        } else if (path === '/news') {
          return '元器件新闻,电子资讯,电子元器件资讯'
        } else if (path.startsWith('/news/')) {
          return ''
        } else {
          return '优软商城'
        }
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
