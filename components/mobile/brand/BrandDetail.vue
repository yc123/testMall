<template>
  <div class="brand-detail mobile-content" @click="checkShowFilter()">
    <div class="brand-logo">
      <div class="brand-logo-box">
        <img :src="brandDetail.logoUrl || '/images/component/default.png'" :alt="brandDetail.nameEn"/>
      </div>
    </div>
    <div class="brand-switch-item">
      <span :class="activeType=='detail'?'mobile-switch-btn active':'mobile-switch-btn'" @click="setActiveType('detail')">品牌</span>
      <span :class="activeType=='product'?'mobile-switch-btn active':'mobile-switch-btn'" @click="setActiveType('product')">产品</span>
    </div>
    <div class="brand-param-list" v-if="activeType=='detail'">
      <div class="brand-param-item" v-if="brandDetail.series">
        <p class="remind-title">主营产品</p>
        <img class="remind-tag" src="/images/mobile/@2x/title-line.png" alt="">
        <div class="main-sell">{{brandDetail.series}}</div>
      </div>
      <div class="brand-param-item" v-if="applications.length>0">
        <p class="remind-title">应用领域</p>
        <img class="remind-tag" src="/images/mobile/@2x/title-line.png" alt="">
        <div class="main-sell">
          <span v-for="(item, index) in applications"><span>{{item}}</span><span v-show="index+1 < applications.length">|</span></span>
        </div>
      </div>
      <div class="brand-param-item" v-if="brandDetail.brief">
        <p class="remind-title">品牌介绍</p>
        <img class="remind-tag" src="/images/mobile/@2x/title-line.png" alt="">
        <div class="main-sell">{{brandDetail.brief | wordFilter}}</div>
      </div>
      <div class="brand-param-item" v-if="brandDetail.url">
        <p class="remind-title">官网地址</p>
        <img class="remind-tag" src="/images/mobile/@2x/title-line.png" alt="">
        <a class="brand-url" :href="brandDetail.url" v-text="brandDetail.url"></a>
      </div>
    </div>
    <div class="brand-product-list" v-if="activeType=='product'">
      <!--{{showKindList}}-->
      <div class="search-box" v-if="searchLists && searchLists.length > 0 || isSearch">
        <div class="kind-selecter" @click="onListClick($event)">
          <div @mouseenter="isInList = true" @mouseleave="isInList = false">
            <span v-text="selectedKind.substring(0, 4)"></span>
            <ul v-if="showKindList">
              <li @click="selectKind({nameCn: '全部分类', id: ''}, $event)" v-show="selectedKind !== '全部分类'">全部分类</li>
              <li v-for="kind in kindList" v-text="kind.nameCn" @click="selectKind(kind, $event)" v-show="selectedKind !== kind.nameCn"></li>
            </ul>
          </div>
        </div>
        <div class="kind-search">
          <input type="text" v-model="keyword" placeholder="请输入型号">
          <i @click="goodsSearch()" class="icon-sousuo iconfont"></i>
        </div>
      </div>
      <ul class="product-list" v-if="productList.totalElements > 0">
        <li v-for="product in searchLists">
          <nuxt-link class="text-left" :to="'/mobile/brand/componentDetail/' + product.uuid">{{product.code}}</nuxt-link>
          <a class="text-right" @click="toShowPdf(product.attach)" v-if="product.attach">规格书 <i class="icon-chakan iconfont"></i></a>
          <a class="text-right grey" v-if="!product.attach">规格书 <i>-</i></a>
        </li>
      </ul>
      <div class="no-product" v-if="!productList.totalElements || productList.totalElements == 0">
        <img :src="!isSearch?'/images/mobile/@2x/car@2x.png':'/images/mobile/@2x/search-empty.png'" alt="">
        <div>抱歉，暂无产品信息</div>
      </div>
    </div>
    <loading v-show="isSearchingMore"></loading>
    <login-box @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox"></login-box>
  </div>
</template>
<script>
  import { Loading, LoginBox } from '~components/mobile/common'
  export default {
    name: 'MobileBrandsDetail',
    data () {
      return {
        applications: [],
        activeType: 'detail',
        keyword: '',
        showKindList: false,
        parentid: 0,
        ids: null,
        pageParams: {
          page: 1,
          count: 10,
          filter: {}
        },
        selectedKind: '全部分类',
        isInList: false,
        isSearch: false,
        isSearchingMore: false,
        searchLists: [],
        isChange: false,
        isFilter: false,
        showLoginBox: false
      }
    },
    components: {
      Loading,
      LoginBox
    },
    filters: {
      wordFilter: function (str) {
        return str.length > 65 ? str.substring(0, 65) + '...' : str
      }
    },
    mounted: function () {
      let _this = this
      _this.$nextTick(function () {
        window.addEventListener('scroll', function () {
          _this.scroll()
        }, false)
        document.addEventListener('click', _this.checkShowFilter)
      })
    },
    watch: {
      keyword: function (val, oldVal) {
        this.isSearch = true
      }
    },
    computed: {
      brandDetail () {
        let list = this.$store.state.brandDetail.detail.data
        if (list.application && list.application !== '') {
          this.applications = list.application.split(',')
        }
        this.pageParams.filter.brandid = list.id
        return list
      },
      productList () {
        let list = this.$store.state.brandComponent.component.data
        if (this.isChange || this.isFilter) {
          this.searchLists = []
          this.pageParams.page = 1
          this.isChange = false
          this.isFilter = false
        } else {
          this.searchLists = this.searchLists.concat(list.content)
          this.isSearchingMore = false
        }
        return list
      },
      allPage () {
        return this.productList.totalPages || 0
      },
      kindList () {
        let brands = this.$store.state.brandCategories.categories.data
        if (!brands || brands.length === 0) {
          return []
        }
        // 初始化去除重复数据
        for (let i = 0; i < brands.length; i++) {
          for (let j = 0; j < brands[i].length; j++) {
            brands[i][j].children = []
          }
        }

        // 处理第1层
        if ((brands[0] && brands[0].length > 0) && (brands[1] && brands[1].length > 0)) {
          for (let i = 0; i < brands[1].length; i++) {
            for (let j = 0; j < brands[0].length; j++) {
              if (brands[0][j].id === brands[1][i].parentid) {
                if (!brands[0][j].children) {
                  brands[0][j].children = []
                }
                brands[0][j].children.push(brands[1][i])
                break
              }
            }
          }
        }

        // 处理第2层
        if ((brands[1] && brands[1].length > 0) && (brands[2] && brands[2].length > 0)) {
          for (let i = 0; i < brands[2].length; i++) {
            for (let j = 0; j < brands[1].length; j++) {
              if (brands[1][j].id === brands[2][i].parentid) {
                if (!brands[1][j].children) {
                  brands[1][j].children = []
                }
                brands[1][j].children.push(brands[2][i])
                break
              }
            }
          }
        }

        // 处理第3层
        if ((brands[2] && brands[2].length > 0) && (brands[3] && brands[3].length > 0)) {
          for (let i = 0; i < brands[3].length; i++) {
            for (let j = 0; j < brands[2].length; j++) {
              if (brands[2][j].id === brands[3][i].parentid) {
                if (!brands[2][j].children) {
                  brands[2][j].children = []
                }
                brands[2][j].children.push(brands[3][i])
                break
              }
            }
          }
        }
        let kindList = []
        if (brands[0]) {
          for (let i = 0; i < brands[0].length; i++) {
            this.getKinds(brands[0][i], kindList)
          }
        }
        return kindList
      },
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      onListClick: function ($event) {
        $event.stopPropagation()
        this.showKindList = !this.showKindList
//        alert(this.showKindList)
      },
      scroll: function () {
        let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (Math.ceil(scrolled + window.screen.availHeight) >= document.body.scrollHeight && !this.isSearchingMore && this.pageParams.page < this.allPage && this.activeType === 'product') {
          this.getMoreProduct()
        }
      },
      getMoreProduct: function () {
        if (!this.isSearchingMore) {
          this.pageParams.page++
          this.isSearchingMore = true
          this.pageCommodity(this.pageParams, this.ids)
        }
      },
      getKinds: function (list, kindList) {
        if (list.children && list.children.length > 0) {
          for (let i = 0; i < list.children.length; i++) {
            this.getKinds(list.children[i], kindList)
          }
        } else {
          kindList.push(list)
        }
      },
      selectKind: function (data, $event) {
        $event.stopPropagation()
        this.showKindList = false
        this.selectedKind = data.nameCn
        this.isFilter = true
        if (this.parentid === data.id) {
          this.parentid = 0
          this.ids = null
        } else {
          if (data.level === 1) {
            this.parentid = data.id
          }
        }
        this.pageParams.page = 1
        this.pageParams.filter.brandid = this.brandDetail.id
        if (data.id !== '') {
          this.pageParams.filter.kindid = data.id
        } else {
          delete this.pageParams.filter.kindid
        }
        this.pageCommodity(this.pageParams, this.ids)
      },
      goodsSearch () {
        this.pageParams.page = 1
        this.pageParams.filter.code = this.keyword
        this.isFilter = true
        this.pageCommodity(this.pageParams)
      },
      async pageCommodity (params) {
        try {
          let { data } = await this.$http.get('/api/product/component/list', { params })
          this.$store.commit('brandComponent/GET_COMPONENT_SUCCESS', data)
        } catch (err) {
          this.$store.commit('brandComponent/GET_COMPONENT_FAILURE', err)
        }
      },
      checkShowFilter: function () {
        if (!this.isInList) {
          this.showKindList = false
        }
      },
      toShowPdf: function (url) {
        if (this.user.logged) {
          if (url && url !== '1') {
            window.location.href = url
          }
        } else {
          this.showLoginBox = true
        }
      },
      setActiveType: function (type) {
//        if (type === 'product' && (this.pageParams.page !== 1 || this.isFilter)) {
//          this.pageParams = {
//            page: 1,
//            count: 10,
//            filter: {brandid: this.brandDetail.id}
//          }
//          this.selectedKind = '全部分类'
//          this.keyword = ''
//          this.isChange = true
//          this.$store.dispatch('loadBrandComponent', this.pageParams)
//          this.pageCommodity(this.pageParams)
//        }
        this.activeType = type
      }
    }
  }
</script>
<style lang="scss" scoped>
  .brand-detail {
    margin: 0 auto;
    margin-bottom: 1.2rem;
    text-align: center;
    background: #f7f7f7;
    .brand-logo {
      height: 3.17rem;
      width: 6.96rem;
      display: inline-block;
      margin: .28rem auto;
      line-height: 2.13rem;
      background: #fff;
      text-align: center;
      border-radius: .1rem;
      background: url('/images/mobile/@2x/brand-bg.png')no-repeat;
      background-size: 7.16rem 3.17rem;
      background-position: -.1rem 0;
      box-shadow: 0 0 .01rem .03rem #eee;
      .brand-logo-box {
        border: .04rem solid #c7e5fd;
        border-radius: .1rem;
        height: 2.21rem;
        width: 3.73rem;
        margin: .5rem auto 0;
        background: #fff;
        position: relative;
        img {
          max-height: 2.13rem;
          max-width: 3.63rem;
        }
      }
    }
    .brand-switch-item {
      text-align: center;
      background: #fff;
      margin-bottom: .28rem;
      .mobile-switch-btn {
        background: #fff;
        color: #666;
        display: inline-block;
        height: .64rem;
        font-size: .34rem;
        line-height: .64rem;
        width: 1.4rem;
        &:first-child {
          margin-right: 1.78rem;
        }
        &.active {
          color: #fc5708;
          border-bottom: .04rem solid #fc5708;
        }
      }
    }
    .brand-param-list {
      text-align: left;
      padding: .3rem .44rem .11rem;
      margin-top: .28rem;
      background: #fff;
      .brand-param-item {
        font-size: .3rem;
        margin-bottom: .48rem;
        .remind-tag {
          width: 1.18rem;
          float: left;
          margin-top: .05rem;
        }
        .remind-title {
          font-size: .3rem;
          color: #418bf6;
          margin: 0;
        }
        .main-sell {
          color: #666;
          line-height: .4rem;
          max-height: 1.2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          margin-top: .15rem;
        }
        .brand-url {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #01a44e;
          margin-left: .28rem;
          position: relative;
          bottom: .32rem;
          max-width: 5rem;
          display: inline-block;
          &:hover, &:active, &:focus, &:visited {
            text-decoration: underline!important;
          }
        }
      }
    }
    .brand-product-list {
      font-size: .28rem;
      background: #fff;
      ul.product-list {
        text-align: center;
        li {
          margin-left: .42rem;
          width: 6.66rem;
          height: .66rem;
          line-height: .66rem;
          border: {
            bottom: .04rem solid rgb(230,228,228);
          }
          &:nth-child(even) {
            background: #f9f9f9;
          }
          &:nth-child(1) {
            border-top: .04rem solid rgb(230,228,228);
          }
          &:active, &:hover {
            background: #eee;
          }
          .text-left {
            float: left;
            color: #333;
            width: 4.45rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .text-right {
            float: right;
            color: #333;
            i {
              font-size: .55rem;
              float: right;
              margin-right: .27rem;
              margin-left: .54rem;
              color: #6fcafe;
              width: .55rem;
              height: .65rem;
              display: inline-block;
              text-align: center;
              font-style: normal;
            }
            &.grey{
              i {
                color: #999;
              }
            }
          }
        }
      }
      .search-box {
        margin-bottom: .28rem;
        padding-top: .28rem;
        .kind-selecter {
          display: inline-block;
          position: relative;
          float: left;
          margin-left: .72rem;
          div {
            display: inline-block;
            span {
              width: 1.64rem;
              height: .6rem;
              line-height: .52rem;
              border: .04rem solid rgb(195,195,195);
              border-radius: .05rem;
              font-size: .28rem;
              display: inline-block;
              background: url('/images/mobile/@2x/productDetail/kind-narrow-down@2x.png')no-repeat;
              padding-right: .15rem;
              background-position: 1.35rem .25rem;
              background-size: .14rem .1rem;
              overflow: hidden;
            }
          }
        }
        .kind-search {
          display: inline-block;
          margin-right: .19rem;
          width: 4.36rem;
          height: .6rem;
          line-height: .6rem;
          vertical-align: middle;
          input[type = "text"] {
            display: inline-block;
            width: 3.61rem;
            height: .6rem;
            border: .04rem solid rgb(195,195,195);
            padding-left: .21rem;
            font-size: .24rem;
            float: left;
            border-radius: .05rem;
          }
          i {
            background: rgb(65,142,247);
            width: .73rem;
            height: .6rem;
            line-height: .6rem;
            font-size: .32rem;
            color: #fff;
            display: inline-block;
            margin-left: -.04rem;
          }
        }
        ul {
          position: absolute;
          top: 0.65rem;
          max-height: 3.15rem;
          overflow-y: auto;
          z-index: 1;
          &::-webkit-scrollbar {
            display: block;
            background: rgba(0,0,0,.6);
            width: 0.05rem;
          }
          &::-webkit-scrollbar-thumb {
            background-color: #999;
          }
          li {
            width: 1.64rem;
            height: .83rem;
            line-height: .83rem;
            padding: 0 .08rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
          }
        }
      }
      .no-product {
        background: #fff;
        padding-top: 1rem;
        img {
          display: block;
          text-align: center;
          margin: 0 auto;
          margin-bottom: .45rem;
          width: 4.11rem;
          height: 2.5rem;
        }
        div {
          width: 5.27rem;
          margin: 0 auto;
          text-align: center;
          line-height: .4rem;
          font-size: .32rem;
          color: #999;
        }
      }
    }
  }
</style>
