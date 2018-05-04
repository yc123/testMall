<template>
  <div class="user-content mobile-content">
    <div class="user-name">
      <img src="/images/component/default.png"/>
      <div class="user-info">
        <p v-text="userInfo.data.userName"></p>
        <p v-text="enterpriseInfo.enName"></p>
      </div>
      <a v-if="isVendor" v-text="userType === 'saler' ? '切换至买家中心' : '切换至卖家中心'" @click="switchType"></a>
    </div>
    <ul class="switch-list" v-if="userType !== 'saler'">
      <li :class="{active: activeType == 'seek'}" @click="activeType = 'seek'" v-text="userType === 'saler' ? '求购询价' : '我的求购'"></li>
      <li :class="{active: activeType == 'comp'}" @click="activeType = 'comp'">器件收藏</li>
      <li :class="{active: activeType == 'store'}" @click="activeType = 'store'">店铺关注</li>
    </ul>
    <div class="seek" v-if="activeType == 'seek'">
      <ul class="seek-type">
        <li :class="{active: seekType == 'wait'}" @click="switchSeek('wait')"><div>待报价</div></li>
        <li :class="{active: seekType == 'done'}" @click="switchSeek('done')"><div>已报价</div></li>
        <!--<li :class="{active: seekType == 'accept'}" @click="switchSeek('accept')"><div>已采纳</div></li>-->
      </ul>
      <div class="search-content">
        <input type="text" placeholder="请输入您要查找的型号或品牌" v-model="seekKeyword" @keyup.13="searchSeek">
        <span @click="searchSeek">
        <i class="iconfont icon-sousuo"></i>
        </span>
      </div>
      <seek-list :userType="userType" :seekType="seekType" :purchaseManList="purchaseManListData" :isDataChange="isDataChange"></seek-list>
    </div>
    <div class="shop-list" v-bind:key="item" v-if="activeType == 'store'" v-for="item in focusPage.content" @click="goStoreDetail(item.storeInfo.uuid)">
      <h3>{{item.storeName}}</h3>
      <div class="list-item">
        <div class="item-img">
          <img :src="getBackground(item.storeInfo.type)" />
          <img :src="item.storeInfo.logoUrl || '/images/component/default.png'">
        </div>
        <div class="list-item-phone">
          <p>电话：<span>{{item.storeInfo.enterprise ? item.storeInfo.enterprise.enTel : '-'}}</span></p>
          <p>传真：<span>{{item.storeInfo.enterprise ? item.storeInfo.enterprise.enFax : '-'}}</span></p>
          <p>联系商家：<a @click="selectStoreInfo(item, $event)">点击查看</a></p>
          <i class="iconfont icon-shoucang" @click="cancelFocus('store', item, $event)"></i>
        </div>
      </div>
    </div>
    <div class="detail-brand" v-bind:key="index" v-for="(item, index) in collectSave.content" v-if="activeType == 'comp'" @click="goComponentDetail(item.componentinfo.uuid)">
      <a>
        <div class="brand-item">
          <p>型号：<span>{{item.componentinfo.code}}</span></p>
          <p>品牌：<span>{{item.componentinfo.brand.nameCn}}</span></p>
          <p>产品描述：<span>{{item.componentinfo.kind.nameCn}}</span></p>
          <i class="iconfont icon-shoucang" @click="cancelFocus('product', item, $event)"></i>
        </div>
      </a>
    </div>
    <div class="none-state" v-if="(activeType != 'seek') && ((collectSave.totalElements == 0 && activeType == 'comp') || (focusPage.totalElements == 0 && activeType == 'store') || (collectSave.totalElements == 0 && focusPage.totalElements == 0))">
      <img src="/images/mobile/@2x/empty-collect.png">
      <p v-text="getRemindText()"></p>
      <nuxt-link to="/">返回首页</nuxt-link>
    </div>
    <remind-box :title="collectResult" :timeoutCount="timeoutCount"></remind-box>
    <div class="mobile-modal" v-if="showStoreInfo">
      <div class="mobile-modal-box">
        <div class="mobile-modal-header">联系方式<i @click="showStoreInfo = false" class="icon-guanbi iconfont"></i></div>
        <div class="mobile-modal-content">
          <div v-if="checkInfo(storeInfo.enAddress || storeInfo.address)">商家地址：{{storeInfo.enAddress || storeInfo.address}}</div>
          <!--<div class="content-line link-url">在线咨询</div>-->
          <div v-if="checkInfo(storeInfo.enTel)">致电：<a :href="'tel:' + storeInfo.enTel" target="_blank" class="content-line link-url">{{storeInfo.enTel}}</a></div>
          <div v-if="checkInfo(storeInfo.enEmail)">邮件：<a :href="'mailto:' + storeInfo.enEmail" target="_blank" class="content-line link-url">{{storeInfo.enEmail}}</a></div>
        </div>
      </div>
    </div>
    <page-loading v-show="showLoading"></page-loading>
    <loading v-show="isSearchSearchingMore"></loading>
    <div v-if="purchaseManList && false"></div>
    <div v-if="purchaseManListFetching && false"></div>
  </div>
</template>

<script>
  import SeekList from '~components/mobile/applyPurchase/SeekList.vue'
  import {RemindBox, Loading} from '~components/mobile/common'
  import PageLoading from '~components/common/loading/PageLoading.vue'
  export default {
    layout: 'mobile',
    data () {
      return {
        userName: '',
        count: '',
        page: '',
        type: '',
        activeType: 'seek',
        collectResult: '取消成功',
        timeoutCount: 0,
        showStoreInfo: false,
        storeInfo: {},
        seekType: 'wait',
        showLoading: false,
        seekKeyword: '',
        isSearchSearchingMore: false,
        isChange: false,
        seekPage: 1,
        seekSize: 10,
        purchaseManListData: [],
        isDataChange: false
      }
    },
    components: {
      RemindBox,
      SeekList,
      PageLoading,
      Loading
    },
    fetch ({ store, route }) {
      return Promise.all([
        store.dispatch('product/saveStores', { count: 100, page: 1, type: 'component' }),
        store.dispatch('shop/StoreFocusPage', { count: 100, page: 1 }),
        store.dispatch(route.query.type === 'saler' ? 'applyPurchase/loadPurchaseManList' : 'applyPurchase/loadBuyerUnSayPricePurchaseManList', {pageNumber: 1, pageSize: 10, enUU: store.state.option.user.data.enterprise ? store.state.option.user.data.enterprise.uu : store.state.option.user.data.userUU, state: (!route.query.type || route.query.type === 'buyer') ? 'todo' : null})
      ])
    },
    mounted: function () {
      this.$nextTick(() => {
        window.addEventListener('scroll', this.scroll, false)
      })
    },
    methods: {
      cancelFocus: function (type, item, event) {
        event.stopPropagation()
        if (type === 'store') {
          this.$http.post('/trade/storeFocus/delete/storeId', [item.storeid])
            .then(response => {
              this.$store.dispatch('shop/StoreFocusPage', { count: 100, page: 1 })
              this.timeoutCount++
            })
        } else {
          // /trade/collection/
          this.$http.delete('/trade/collection/' + item.id)
            .then(response => {
              this.$store.dispatch('product/saveStores', { count: 100, page: 1, type: 'component' })
              this.timeoutCount++
            })
        }
      },
      getBackground: function (type) {
        let url = ''
        if (type === 'AGENCY') {
          url += '/images/mobile/@2x/shop/agency.png'
        } else if (type === 'DISTRIBUTION') {
          url += '/images/mobile/@2x/shop/distribution.png'
        } else if (type === 'ORIGINAL_FACTORY') {
          url += '/images/mobile/@2x/shop/original_factory.png'
        } else if (type === 'CONSIGNMENT') {
          url = '/images/mobile/@2x/shop/consignment.png'
        }
        return url
      },
      goStoreDetail: function (uuid) {
        this.$router.push('/mobile/shop/' + uuid)
      },
      goComponentDetail: function (uuid) {
        this.$router.push('/mobile/brand/componentDetail/' + uuid)
      },
      getRemindText: function () {
        if (this.activeType === 'comp') {
          return '抱歉，暂无器件收藏'
        } else if (this.activeType === 'store') {
          return '抱歉，暂无店铺关注'
        }
      },
      selectStoreInfo: function (store, event) {
        event.stopPropagation()
        this.storeInfo = store.storeInfo.enterprise || {}
        this.showStoreInfo = true
      },
      checkInfo: function (str) {
        return str && str.trim() !== ''
      },
      switchSeek: function (type) {
        this.seekType = type
        this.showLoading = true
        this.seekKeyword = ''
        this.isChange = true
        this.seekPage = 1
        this.reloadData()
      },
      switchType: function () {
        this.seekType = 'wait'
        this.seekKeyword = ''
        this.$router.push('/mobile/user' + (this.userType === 'saler' ? '?type=buyer' : '?type=saler'))
      },
      searchSeek: function () {
        this.isChange = true
        this.reloadData()
      },
      reloadData: function () {
        let type = this.seekType
        if (this.userType !== 'saler') {
          if (type === 'wait') {
            this.$store.dispatch('applyPurchase/loadBuyerUnSayPricePurchaseManList', {pageNumber: this.seekPage, pageSize: this.seekSize, enUU: this.$store.state.option.user.data.enterprise ? this.$store.state.option.user.data.enterprise.uu : null, keyword: this.seekKeyword, state: 'todo'})
          } else if (type === 'done') {
            this.$store.dispatch('applyPurchase/loadBuyerPurchaseManList', {pageNumber: this.seekPage, pageSize: this.seekSize, enUU: this.$store.state.option.user.data.enterprise ? this.$store.state.option.user.data.enterprise.uu : null, _state: 'done', keyword: this.seekKeyword})
          } else {
            this.$store.dispatch('applyPurchase/loadBuyerPurchaseManList', {pageNumber: this.seekPage, pageSize: this.seekSize, enUU: this.$store.state.option.user.data.enterprise ? this.$store.state.option.user.data.enterprise.uu : null, _state: 'done', keyword: this.seekKeyword})
          }
        } else {
          if (type === 'wait') {
            this.$store.dispatch('applyPurchase/loadPurchaseManList', {pageNumber: this.seekPage, pageSize: this.seekSize, enUU: this.$store.state.option.user.data.enterprise.uu, keyword: this.seekKeyword})
          } else if (type === 'done') {
            this.$store.dispatch('applyPurchase/loadVendorPurchaseManList', {pageNumber: this.seekPage, pageSize: this.seekSize, _state: 'done', filter: {vendUU: this.$store.state.option.user.data.enterprise.uu, fromDate: null, endDate: null, keyword: this.seekKeyword}})
          } else {
            this.$store.dispatch('applyPurchase/loadVendorPurchaseManList', {pageNumber: this.seekPage, pageSize: this.seekSize, _state: 'done', filter: {vendUU: this.$store.state.option.user.data.enterprise.uu, fromDate: null, endDate: null, keyword: this.seekKeyword}})
          }
        }
      },
      scroll: function () {
        let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (Math.ceil(scrolled + window.screen.availHeight) >= document.body.scrollHeight && !this.isSearchSearchingMore && this.seekPage < this.allPage) {
          this.getMoreSearch()
        }
      },
      getMoreSearch: function () {
        this.seekPage++
        this.isSearchSearchingMore = true
        this.reloadData()
      }
    },
    computed: {
      collectSave () {
        return this.$store.state.product.common.collectList.data
      },
      userInfo () {
        return this.$store.state.option.user
      },
      enterpriseInfo () {
        let ens = this.userInfo.data.enterprises
        if (ens && ens.length) {
          for (let i = 0; i < ens.length; i++) {
            if (ens[i].current) {
              return ens[i]
            }
          }
        }
        return {enName: this.userInfo.data.userName + '（个人账户）'}
      },
      isVendor () {
        return this.enterpriseInfo.isVendor === 313
      },
      userType () {
        return this.$route.query.type
      },
      focusPage () {
        return this.$store.state.shop.storeInfo.focusPage.data
      },
      purchase () {
        return this.$store.state.applyPurchase.purchaseManList.purchaseManList
      },
      purchaseManList () {
        let list = this.purchase.data.content
        if (this.isChange) {
          this.purchaseManListData = []
          this.seekPage = 1
          this.isChange = false
          this.isDataChange = true
        } else {
          this.purchaseManListData = this.purchaseManListData.concat(list)
          this.isSearchSearchingMore = false
          this.isDataChange = false
        }
//        console.log(this.purchaseManListData)
        return this.purchase.data.content
      },
      allPage () {
        return Math.floor(this.purchase.data.totalElements / this.purchase.data.size) + Math.floor(this.purchase.data.totalElements % this.purchase.data.size > 0 ? 1 : 0)
      },
      purchaseManListFetching () {
        this.showLoading = false
        return this.purchase.fetching
      }
    }
  }
</script>

<style scoped lang="scss">
  .user-content{
    margin-bottom: .98rem;
    .none-state{
      text-align: center;
      padding:1.5rem 0;
      background: #fff;
      margin-top:.1rem;
      width:100%;
      img{
        margin:0 auto;
        width: 4.08rem;
        height: 2.62rem;
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
    .user-name{
      padding:.14rem 0 .2rem .34rem;
      background:#fff;
      width:100%;
      position:relative;
      img{
        display: inline-block;
        width:1.25rem;
        height:1.25rem;
        border:.04rem solid #c5dbfc;
        border-radius: .05rem;
        vertical-align: middle;
      }
      .user-info {
        margin-left:.25rem;
        display: inline-block;
        vertical-align: middle;
        p{
          font-size:.3rem;
          margin:0;
          font-weight: bold;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 3.92rem;
          &:nth-child(2) {
            font-weight: normal;
            margin-top: .3rem;
          }
        }
      }
      > a {
        font-size: .24rem;
        position: absolute;
        top: .45rem;
        right: .1rem;
        color: #3f84f6;
        border: .02rem solid #3f84f6;
        border-radius: .2rem;
        padding: .06rem .12rem;
      }
    }
    .shop-list {
      background:#fff;
      border-bottom: .1rem solid #dfe2e4;
      padding: .14rem 0 .14rem 0;
      h3{
        font-size: .32rem;
        line-height: .4rem;
        margin: 0 0 0 .27rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-top: .1rem;
        position: relative;
        top: .1rem;
      }
      .list-item{
        width:6.77rem;
        margin-left:.39rem;
        .item-img{
          width:2.4rem;
          vertical-align: middle;
          display: inline-block;
          img{
            &:nth-child(2) {
              width:2.4rem;
              height:1.69rem;
              border: .04rem solid #eee;
            }
            &:nth-child(1) {
              position:absolute;
              width:.65rem;
              height:.33rem;
            }
          }
        }
        .list-item-phone{
          width:3.95rem;
          padding:.18rem 0;
          position:relative;
          display: inline-block;
          vertical-align: middle;
          margin-left: .26rem;
          p{
            font-size:.28rem;
            line-height: .67rem;
            margin:0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 3.2rem;
          }
          i{
            display:block;
            position:absolute;
            top: -.06rem;
            right: -.18rem;
            font-size:.5rem;
            color:#ff7800;
            width: .6rem;
            height: .6rem;
            text-align: center;
            line-height: .6rem;
          }
        }
      }
      &:active {
        background: #e1e1e1;
      }
    }
    .detail-brand{
      background: #fff;
      width:100%;
      min-height:1.5rem;
      padding:.2rem 0;
      border-bottom: .1rem solid #dfe2e4;
      &:nth-child(1) {
        margin-top:.1rem;
      }
      .brand-item{
        width:7rem;
        margin:0 auto;
        border-radius:.1rem;
        background: #fff;
        padding:.2rem;
        position:relative;
        &:active{
          background: #e1e1e1;
        }
        p{
          font-size:.28rem;
          line-height:.4rem;
          color:#333;
          margin:0;
        }
        i{
          display:block;
          position:absolute;
          top:.2rem;
          right:.1rem;
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
    .collect-list-type {
      background: #fff;
      border-bottom: .04rem solid #acacac;
      p {
        font-size: .32rem;
        margin: 0 0 0 .13rem;
        width: .92rem;
        text-align: center;
        line-height: .5rem;
        border-bottom: .06rem solid #418bf6;
      }
    }
    ul.switch-list {
      li {
        display: inline-block;
        width: 2.5rem;
        height: .63rem;
        line-height: .63rem;
        text-align: center;
        font-size: .28rem;
        color: #666;
        background: #fff;
        border: .02rem solid #b4b4b4;
        border-right: none;
        &.active {
          background: #0067e7;
          border: .02rem solid #0067e7;
          color: #fff;
        }
        &:first-child {
          border-left: none;
        }
        &:last-child {
          border-right: none;
        }
      }
    }
    .seek {
      ul.seek-type {
        margin-top: .06rem;
        li {
          font-size: .28rem;
          color: #666;
          display: inline-block;
          width: 50%;
          text-align: center;
          div {
            width: 2rem;
            border-bottom: .02rem solid #c1c4c9;
            margin: 0 auto;
            height: .6rem;
            line-height: .6rem;
          }
          &.active {
            color: #3f84f6;
            div {
              border-color: #3f84f6;
            }
          }
        }
      }
      .search-content {
        text-align: center;
        padding: .25rem 0 0 0;
        input {
          border: .02rem solid #376ff3;
        }
      }
    }
  }
</style>
