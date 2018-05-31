<template>
  <div class="mobile-center">
    <div class="com-mobile-header">
      <a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>
      <p>店铺关注</p>
    </div>
    <div class="mobile-content">
      <div v-if="storeList.length" class="shop-list" v-bind:key="item.id" v-for="item in storeList" @click="goStoreDetail(item.storeInfo.uuid)">
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
            <i class="iconfont icon-shoucang" @click="cancelFocus(item, $event)"></i>
          </div>
        </div>
      </div>
      <empty-status v-if="!storeList.length" :type="'collect'" :showLink="true" :text="'抱歉，暂无店铺关注'"></empty-status>
    </div>
    <div class="mobile-modal" v-if="showStoreInfo" @touchmove="preventTouchMove($event)">
      <div class="mobile-modal-box">
        <div class="mobile-modal-header">联系方式<i @click="showStoreInfo = false" class="icon-guanbi iconfont"></i></div>
        <div class="mobile-modal-content">
          <div>商家地址：{{storeInfo.enAddress || storeInfo.address || '-'}}</div>
          <!--<div class="content-line link-url">在线咨询</div>-->
          <div>致电：<a :href="'tel:' + storeInfo.enTel" target="_blank" class="content-line link-url">{{storeInfo.enTel || '-'}}</a></div>
          <div>邮件：<a :href="'mailto:' + storeInfo.enEmail" target="_blank" class="content-line link-url">{{storeInfo.enEmail || '-'}}</a></div>
        </div>
      </div>
    </div>
    <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
    <pull-up :searchMore="fetching" :allPage="allPage" :page="page" @pullUpAction="onPullUpAction"></pull-up>
  </div>
</template>
<script>
  import { RemindBox, PullUp, EmptyStatus } from '~components/mobile/common'
  export default {
    middleware: 'authenticated',
    layout: 'mobileNoHeader',
    data () {
      return {
        remindText: '',
        timeoutCount: 0,
        page: 1,
        count: 10,
        isChange: false,
        storeList: [],
        showStoreInfo: false,
        storeInfo: {}
      }
    },
    watch: {
      'storeCollectList.data': {
        handler: function (val) {
          if (this.isChange) {
            this.storeList = val.content
            this.isChange = false
          } else {
            this.storeList = [...this.storeList, ...val.content]
          }
        },
        immediate: true
      }
    },
    computed: {
      storeCollectList () {
        return this.$store.state.shop.storeInfo.focusPage
      },
      fetching () {
        return this.storeCollectList.fetching
      },
      allPage () {
        return Math.floor(this.storeCollectList.data.totalElements / this.storeCollectList.data.size) + Math.floor(this.storeCollectList.data.totalElements % this.storeCollectList.data.size > 0 ? 1 : 0)
      }
    },
    fetch ({ store }) {
      return Promise.all([
        // 获取店铺关注列表
        store.dispatch('shop/StoreFocusPage', { count: 10, page: 1 })
      ])
    },
    components: {
      RemindBox,
      PullUp,
      EmptyStatus
    },
    methods: {
      onRemind: function (str) {
        this.remindText = str
        this.timeoutCount++
      },
      cancelFocus: function (item, event) {
        event.stopPropagation()
        this.$http.post('/trade/storeFocus/delete/storeId', [item.storeid])
          .then(response => {
            this.onRemind('取消收藏成功')
            this.isChange = true
            this.page = 1
            this.reloadList()
          }, err => {
            this.onRemind(err.response.data || '取消收藏失败')
          })
      },
      reloadList: function () {
        this.$store.dispatch('shop/StoreFocusPage', { count: this.count, page: this.page })
      },
      onPullUpAction: function () {
        this.page++
        this.reloadList()
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
      selectStoreInfo: function (store, event) {
        event.stopPropagation()
        this.storeInfo = store.storeInfo.enterprise || {}
        this.showStoreInfo = true
      },
      checkInfo: function (str) {
        return str && str.trim() !== ''
      }
    }
  }
</script>
<style lang="scss" scoped>
  .shop-list {
    background:#fff;
    border-bottom: .1rem solid #dfe2e4;
    padding: .14rem 0 .14rem 0;
    &:first-child {
      border-top: .1rem solid #dfe2e4;
    }
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
            border: 1px solid #eee;
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
</style>
