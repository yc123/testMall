<template>
  <div class="shop mobile-content">
    <div class="shop-top">
      <p><i class="iconfont icon-dianpu1"></i><span>{{list.totalElements || 0}}</span>家店铺</p>
      <span @click="onClick()">{{downName}} <i class="iconfont icon-arrow-down"></i></span>
      <ul class="supdown" v-if="down">
        <li @click="onDown('ORIGINAL_FACTORY-DISTRIBUTION-AGENCY-CONSIGNMENT')" v-show="downName !== '全部'">全部</li>
        <li @click="onDown('ORIGINAL_FACTORY')" v-show="downName !== '原厂'">原厂</li>
        <li @click="onDown('AGENCY')" v-show="downName !== '代理'">代理</li>
        <li @click="onDown('DISTRIBUTION')" v-show="downName !== '经销'">经销</li>
        <li @click="onDown('CONSIGNMENT')" v-show="downName !== '寄售'">寄售</li>
      </ul>
    </div>
    <div class="shop-list" v-for="item in searchLists" @click="goStoreDetail(item.uuid)" v-if="item">
      <h3>{{item.storeName}}</h3>
      <div class="list-item">
        <div class="item-img">
          <i :style="'background:url(' + isType(item.type) + ')no-repeat 0 0/.65rem .33rem;'"></i>
          <img :src="item.logoUrl || '/images/component/default.png'">
        </div>
        <div class="list-item-phone">
          <p>电话：<span>{{item.enterprise.enTel}}</span></p>
          <p>传真：<span>{{item.enterprise.enFax}}</span></p>
          <!--<p>商家介绍： <nuxt-link :to="'/mobile/merchantDescription/'+item.uuid">点击查看</nuxt-link></p>-->
          <p>联系商家：<a @click="selectStoreInfo(item, $event)">点击查看</a></p>
          <i class="iconfont icon-shoucang" :style="item.isFocus=='true'?'color:#ff7800':'color:#bbb'" @click="focusStore(item, $event)"></i>
        </div>
      </div>
    </div>
    <remind-box :title="collectResult" :timeoutCount="timeoutCount"></remind-box>
    <loading v-show="isSearchingMore"></loading>
    <div class="mobile-modal" v-if="showStoreInfo">
      <div class="mobile-modal-box">
        <div class="mobile-modal-header">联系方式<i @click="showStoreInfo = false" class="icon-guanbi iconfont"></i></div>
        <div class="mobile-modal-content">
          <div v-if="checkInfo(enterpriseInfo.enAddress || enterpriseInfo.address)">商家地址：{{enterpriseInfo.enAddress || enterpriseInfo.address}}</div>
          <!--<div class="content-line link-url">在线咨询</div>-->
          <div v-if="checkInfo(enterpriseInfo.enTel)">致电：<a :href="'tel:' + enterpriseInfo.enTel" target="_blank" class="content-line link-url">{{enterpriseInfo.enTel}}</a></div>
          <div v-if="checkInfo(enterpriseInfo.enEmail)">邮件：<a :href="'mailto:' + enterpriseInfo.enEmail" target="_blank" class="content-line link-url">{{enterpriseInfo.enEmail}}</a></div>
        </div>
      </div>
    </div>
    <login-box @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox"></login-box>
  </div>
</template>

<script>
  import {RemindBox, Loading, LoginBox} from '~components/mobile/common'
  export default {
    layout: 'mobile',
    data () {
      return {
        page: 1,
        count: 10,
        types: 'ORIGINAL_FACTORY-DISTRIBUTION-AGENCY-CONSIGNMENT',
        down: false,
        downName: '全部',
        isFocus: true,
        collectResult: '收藏成功',
        timeoutCount: 0,
        isSearchingMore: false,
        searchLists: [],
        isChange: false,
        showStoreInfo: false,
        enterpriseInfo: {},
        showLoginBox: false
      }
    },
    components: {
      RemindBox,
      Loading,
      LoginBox
    },
    fetch ({ store }) {
      return Promise.all([
        store.dispatch('provider/findStoreListInMobil', { page: 1, count: 10, types: 'ORIGINAL_FACTORY-DISTRIBUTION-AGENCY-CONSIGNMENT' })
      ])
    },
    computed: {
      list () {
        let list = this.$store.state.provider.stores.storeList.data
        if (this.isChange) {
          this.searchLists = []
          this.page = 1
          this.isChange = false
        } else {
          this.searchLists = this.searchLists.concat(list.content)
          this.isSearchingMore = false
        }
        return list
      },
      allPage () {
        return this.list.totalPages
      },
      user () {
        return this.$store.state.option.user
      }
    },
    mounted: function () {
      let _this = this
      _this.$nextTick(function () {
        window.addEventListener('scroll', function () {
          _this.scroll()
        }, false)
      })
    },
    methods: {
      scroll: function () {
        let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (Math.ceil(scrolled + window.screen.availHeight) >= document.body.scrollHeight && !this.isSearchingMore && this.page < this.allPage) {
          this.getMoreStore()
        }
      },
      getMoreStore: function () {
        if (!this.isSearchingMore) {
          this.page++
          this.isSearchingMore = true
          this.$store.dispatch('provider/findStoreListInMobil', { page: this.page, count: this.count, types: this.types })
        }
      },
      isType (type) {
        let bgurl = ''
        if (type === 'ORIGINAL_FACTORY') {
          bgurl = '/images/mobile/@2x/shop/original_factory.png'
        } else if (type === 'DISTRIBUTION') {
          bgurl = '/images/mobile/@2x/shop/distribution.png'
        } else if (type === 'AGENCY') {
          bgurl = '/images/mobile/@2x/shop/agency.png'
        } else if (type === 'CONSIGNMENT') {
          bgurl = '/images/mobile/@2x/shop/consignment.png'
        }
        return bgurl
      },
      onClick () {
        this.down = !this.down
      },
      onDown (type) {
        this.isChange = true
        this.down = !this.down
        this.types = type
        if (type === 'ORIGINAL_FACTORY') {
          this.downName = '原厂'
        } else if (type === 'DISTRIBUTION') {
          this.downName = '经销'
        } else if (type === 'AGENCY') {
          this.downName = '代理'
        } else if (type === 'CONSIGNMENT') {
          this.downName = '寄售'
        } else if (type === 'ORIGINAL_FACTORY-DISTRIBUTION-AGENCY-CONSIGNMENT') {
          this.downName = '全部'
        }
        this.$store.dispatch('provider/findStoreListInMobil', { page: 1, count: 10, types: type })
      },
      focusStore: function (item, $event) {
//        item.isFocus = item.isFocus === 'false' ? 'true' : 'false'
        $event.stopPropagation()
        if (this.user.logged) {
          if (item.isFocus === 'false') {
            this.$http.post('/trade/storeFocus/save', {storeName: item.storeName, storeid: item.id})
              .then(response => {
                item.isFocus = 'true'
                this.collectResult = '收藏成功'
                this.timeoutCount++
              })
          } else {
            this.$http.post('/trade/storeFocus/delete/storeId', [item.id])
              .then(response => {
                item.isFocus = 'false'
                this.collectResult = '取消成功'
                this.timeoutCount++
              })
          }
        } else {
          this.showLoginBox = true
        }
      },
      goStoreDetail: function (uuid) {
        this.$router.push('/mobile/shop/' + uuid)
      },
      selectStoreInfo: function (store, $event) {
        $event.stopPropagation()
        this.enterpriseInfo = store.enterprise || {}
        this.showStoreInfo = true
      },
      checkInfo: function (str) {
        return str && str.trim() !== ''
      }
    }
  }
</script>

<style scoped lang="scss">
  .shop{
    margin-bottom: .98rem;
    background: #e2e4e6;
    .shop-top{
      width:100%;
      height:1.14rem;
      line-height: 1.14rem;
      padding:0 .3rem;
      position:relative;
      background:#fff;
      .supdown{
        position: absolute;
        top: .8rem;
        right: .1rem;
        z-index: 1;
        background: #616264;
        border-radius: .1rem;
        li{
          font-size: .28rem;
          color: #ffffff;
          line-height: .8rem;
          padding: 0 .4rem;
          height: .8rem;
        }
      }
      p{
        font-size:.24rem;
        color:#000;
        display: inline-block;
        i{
          font-size: .53rem;
          color:#418ef7;
        }
        span{
          font-size:.3rem;
          color:#f94f28;
          margin:0 .1rem;
        }
      }
      >span{
        font-size:.28rem;
        color:#53a0f7;
        float: right;
      }
    }
    .shop-list {
      background:#fff;
      margin-top:.1rem;
      border-bottom: .1rem solid #e2e4e6;
     /* padding-bottom:.1rem;*/
      box-shadow: 0 .03rem .01rem 0 #cdcbcb96;
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
          position:relative;
          width:2.42rem;
          height:1.69rem;
          display: inline-block;
          vertical-align: middle;
          i{
            display:block;
            position:absolute;
            width:.65rem;
            height:.33rem;
          }
          img{
            display:inline-block;
            width:100%;
            height:100%;
            border:.04rem solid #eee;
            background-color: #fff;
          }
        }
        .list-item-phone{
          width:3.95rem;
          padding:.18rem 0;
          position:relative;
          display: inline-block;
          vertical-align: middle;
          margin-left: .2rem;
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
            right: -.06rem;
            font-size:.5rem;
            color:#ff7800;
            width: .6rem;
            height: .6rem;
            text-align: center;
            line-height: .6rem;
          }
          i.active{
            color:#333;
          }
        }
      }
      &:active {
        background: #e1e1e1;
      }
    }
  }

</style>
