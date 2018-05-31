<template>
  <div class="search-list mobile-content">
  <div class="search-item" v-if="(!productList.brands && brandList && brandList.length > 0) && productList.expose > 0 || activeType != 'store'">
      <span :class="activeType=='store'?'active':''" @click="clickType('store')">所有器件</span>
      <span :class="activeType=='support'?'active':''" @click="clickType('support')">仅看有货</span>
    </div>

    <div class="brand-list-content" v-if="(!productList.brands && brandList && brandList.length > 0) && productList.expose > 0">
      <div class="brand-list-top">
        <span>品牌墙</span>
        <span class="row-switch" @click="onclick()" v-if="brandList.length > 8">{{!isShow?'收起':'展开'}}<i :class="{'iconfont icon-arrow-down':isShow,'icon-icon-shang iconfont':!isShow}"></i></span>
      </div>
      <div class="brand-list-item" >
        <div v-for="item in isShow?brandList.slice(0, 8):brandList">
          <nuxt-link :to="'/mobile/brand/'+item.br_uuid">
            <img :src="item.logoUrl ||'/images/component/default.png'"/>
          </nuxt-link>
        </div>
      </div>
    </div>

    <div class="detail-brand-content" v-if="productList.brands" @click="goBrand(list.uuid)">
      <h4>主营产品 <img src="/images/mobile/@2x/search/search-brand.png" alt=""></h4>
      <div class="brand-list">
        <div class="list-left">
          <img :src="list.logoUrl || '/images/component/default.png'" :alt="list.nameEn"/>
          <span>{{list.nameCn}}</span>
        </div>
        <p>{{list.series | productDescFilter}}</p>
      </div>
    </div>

    <div v-if="searchLists && searchLists.length > 0" >
      <div class="detail-brand" v-for="(item, index) in searchLists" :style="index == 0 ? 'padding-top: .2rem;' : ''" v-if="item">
        <div class="brand-item" @click="goComponent(item.uuid)">
          <p>商家名称：<span>{{item.storeName || '-'}}</span></p>
          <p>型号：<span>{{item.code || '-'}}</span></p>
          <p>品牌：<span>{{item.brandEn || item.brand.nameCn || '-'}}</span></p>
          <p>产品描述：<span>{{item.description || '-'}}</span></p>
          <i class="iconfont icon-shoucang" :style="(item.isFocus)?'color:#ff7800':'color:#bbb'" @click="collect(item, $event)"></i>
        </div>
      </div>
    </div>

    <div class="none-state" v-if="!productList.components || productList.components.length === 0">
      <img :src="brandList && brandList.length > 0 ? '/images/mobile/@2x/car@2x.png':'/images/mobile/@2x/search-empty.png'">
      <p v-text="brandList && brandList.length > 0 ? '抱歉，暂无器件信息' : '抱歉，暂无搜索结果'"></p>
      <a @click="goLastPage">返回上一页</a>
    </div>
    <remind-box :title="collectResult" :timeoutCount="timeoutCount"></remind-box>
    <loading v-show="isSearchSearchingMore"></loading>
    <login-box @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox" :url="url"></login-box>
  </div>
</template>

<script>
  import {RemindBox, Loading, LoginBox} from '~components/mobile/common'
  export default {
    layout: 'mobile',
    data () {
      return {
        activeType: 'store',
        count: '',
        filter: {},
        page: 1,
        sorting: {'RESERVE': 'DESC'},
        paramJSON: {},
        isShow: true,
        isMove: '',
        isFocus: false,
        isClickCollect: false,
        collectResult: '收藏成功',
        timeoutCount: 0,
        searchLists: [],
        isSearchSearchingMore: false,
        showLoginBox: false,
        isChange: false,
        url: ''
      }
    },
    components: {
      RemindBox,
      Loading,
      LoginBox
    },
    mounted: function () {
      let _this = this
      _this.$nextTick(function () {
        window.addEventListener('scroll', function () {
          _this.scroll()
        }, false)
      })
    },
    watch: {
      '$route.query.w': {
        handler: function (val) {
          this.isChange = true
          this.page = 1
          this.reloadData()
        },
        immediate: false
      }
    },
    fetch ({store, route}) {
      return Promise.all([
        store.dispatch('searchData/searchForListInMobile', {count: 15, filter: {}, keyword: route.query.w, page: 1, sorting: {'RESERVE': 'DESC'}}),
        store.dispatch('searchData/searchForBrands', {collectList: 'goods_brand', keyword: route.query.w, paramJSON: {}})
      ])
    },
    filters: {
      productDescFilter: function (str) {
        return str.length > 50 ? str.substring(0, 50) + '...' : str
      }
    },
    computed: {
      productList () {
        let list = JSON.parse(JSON.stringify(this.$store.state.searchData.searchList.lists.data))
        if (this.isChange) {
          this.searchLists = []
          this.page = 1
          this.isChange = false
        } else {
          this.searchLists = this.searchLists.concat(list.components)
          this.isSearchSearchingMore = false
        }
        return list
      },
      allPage () {
        return Math.floor(this.productList.total / this.productList.size) + Math.floor(this.productList.total % this.productList.size > 0 ? 1 : 0)
      },
      brandList () {
        return this.$store.state.searchData.searchBrands.brands.data
      },
      brandDetail () {
        return this.$store.state.searchData.searchList.lists.data.brands
      },
      list () {
        let list = this.$store.state.searchData.searchDetail.detail.data
        if (list.application && list.application !== '') {
          this.applications = list.application.split(',')
        }
        return list
      },
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      onclick () {
        this.isShow = !this.isShow
      },
      clickType (type) {
//        this.searchLists = []
        this.isChange = true
        if (type === 'store') {
          this.activeType = 'store'
          delete this.filter.goods_status
          delete this.paramJSON.goods_status
          this.reloadData()
        } else if (type === 'support') {
          this.activeType = 'support'
          this.filter.goods_status = 601
          this.paramJSON.goods_status = 601
          this.reloadData()
        }
      },
      goBrand: function (uuid) {
        this.$router.push('/mobile/brand/' + uuid)
      },
      collect: function (item, $event) {
        this.isClickCollect = true
        if (this.user.logged) {
          if (!item.isFocus) {
            this.$http.post('/trade/collection/save', {componentid: item.cmpId, kind: 2})
              .then(response => {
                item.isFocus = true
                this.collectResult = '收藏成功'
                this.timeoutCount++
              })
          } else {
            this.$http.post('/trade/collection/delete/cmpId', [item.cmpId]).then(response => {
              item.isFocus = false
              this.collectResult = '取消成功'
              this.timeoutCount++
            })
          }
        } else {
          this.url = this.$route.fullPath
          this.showLoginBox = true
        }
      },
      goComponent: function (uuid) {
        if (!this.isClickCollect) {
          if (uuid) {
            this.$router.push('/mobile/brand/componentDetail/' + uuid)
          } else {
            this.collectResult = '卖家上传的产品暂无参数，请联系卖家了解具体详情。'
            this.timeoutCount++
          }
        } else {
          this.isClickCollect = false
        }
      },
      goLastPage: function () {
        window.history.back(-1)
      },
      getMoreSearch: function () {
        this.page++
        this.isSearchSearchingMore = true
        this.$store.dispatch('searchData/searchForListInMobile', {count: 15, filter: this.filter, keyword: this.$route.query.w, page: this.page, sorting: this.sorting})
      },
      reloadData: function () {
        this.$store.dispatch('searchData/searchForListInMobile', {count: 15, filter: this.filter, keyword: this.$route.query.w, page: 1, sorting: this.sorting})
        this.$store.dispatch('searchData/searchForBrands', {collectList: 'goods_brand', keyword: this.$route.query.w, paramJSON: this.paramJSON})
      },
      scroll: function () {
        let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (Math.ceil(scrolled + window.screen.availHeight) >= document.body.scrollHeight && !this.isSearchSearchingMore && this.page < this.allPage) {
          this.getMoreSearch()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .search-list{
    width:100%;
    padding-bottom: 1rem;
    .none-state{
      text-align: center;
      margin-top:2rem;
      width:100%;
      img{
        margin:0 auto;
        width: 3.31rem;
        height: 2.13rem;
      }
      p {
        font-size: .32rem;
        color: #999;
        margin: 1.19rem 0 0 0;
      }
      a {
        display: block;
        font-size: .28rem;
        color: #fff;
        width: 1.88rem;
        height: .54rem;
        line-height: .54rem;
        background: #418bf6;
        margin: .7rem auto 0;
        border-radius: .05rem;
      }
    }
    .search-item{
      text-align: center;
      span{
        display:inline-block;
        width:1.41rem;
        line-height: .76rem;
        font-size:.32rem;
        color:#666;
        &:first-child {
          margin-right: 2rem;
        }
      }
      span.active{
        color:#3976f4;
        border-bottom:.04rem solid #3976f4;
      }
    }

    .brand-list-content{
      margin:0 auto;
      border-top:.04rem solid #dedfdf;
      border-bottom:.04rem solid #dedfdf;
      width:7.1rem;
      min-height:1.51rem;
      overflow: hidden;
      text-align: left;
      padding-top:.33rem;
      padding-bottom:.33rem;
      .brand-list-top{
        span:first-child{
          font-size:.32rem;
          float: left;
          margin: 0 0 .1rem .2rem;
        }
        span.row-switch{
          font-size:.28rem;
          color:#53a0f7;
          float: right;
          margin: 0 .2rem 0 0;
          i {
            font-size: .16rem;
          }
        }
      }
      .brand-list-item{
        overflow: hidden;
        margin: .1rem .2rem 0;
        text-align: center;
        clear: both;
        >div {
          display: inline-block;
          margin-right: .14rem;
          float: left;
          &:nth-child(4n) {
            margin-right: 0;
          }
          a {
            width: 1.57rem;
            height: .77rem;
            display: inline-block;
            margin: .1rem 0;
            border: .04rem solid #53a0f7;
            border-radius: .1rem;
            line-height: .77rem;
            img{
              max-width:1.07rem;
              max-height:.57rem;
            }
          }
        }
      }
    }

    .detail-brand-content{
      margin:0 auto;
      border-top:.04rem solid #dedfdf;
      border-bottom:.04rem solid #dedfdf;
      width:7.1rem;
      height:3.02rem;
      padding-top:.18rem;
      h4{
        font-size:.32rem;
        line-height: .6rem;
        margin:0 0 0 3.97rem;
        position: relative;
        img {
          position: absolute;
          left: -1.28rem;
          top: .24rem;
          width: 3.8rem;
          height: .11rem;
        }
      }
      .brand-list{
        margin:0 .15rem;
        .list-left{
          border:.02rem solid #418ef7;
          border-radius: .05rem;
          width:2.03rem;
          height:1.73rem;
          display: inline-block;
          img{
            display:block;
            width:100%;
            height:1.25rem;
          }
          span{
            display: block;
            font-size: .24rem;
            color:#fff;
            text-align: center;
            width:100%;
            background: #418ef7;
            line-height: .45rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        p{
          width:4.3rem;
          font-size:.28rem;
          line-height: .4rem;
          padding:.12rem .46rem 0 .05rem;
          float: right;
        }
      }
    }

    .detail-brand{
      background: #f8fcff;
      width:100%;
      min-height:1.5rem;
      padding-bottom: .2rem;
      .brand-item{
        width:7rem;
        margin:0 auto;
        border-radius:.1rem;
        background: #fff;
        padding:.2rem;
        position:relative;
        -webkit-box-shadow: 0 .03rem .01rem 0 #cdcbcb96;
        -moz-box-shadow: 0 .03rem .01rem 0 #cdcbcb96;
        box-shadow: 0 .03rem .01rem 0 #cdcbcb96;
        &:active{
          background: #e1e1e1;
        }
        p{
          font-size:.28rem;
          line-height:.5rem;
          color:#333;
          margin:0;
          width: 5.8rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        i{
          display:block;
          position:absolute;
          top:.1rem;
          right:.22rem;
          font-size:.5rem;
          color:#ff7800;
          width: .6rem;
          height: .6rem;
          line-height: .6rem;
          text-align: center;
        }
      }
      div.active{
        background: #d4d;
      }
    }
  }

</style>
