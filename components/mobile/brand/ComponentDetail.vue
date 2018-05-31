<template>
  <div class="component-detail mobile-content">
    <div class="base-detail">
      <div class="base-detail-item" v-if="component.kind.nameCn">
        <span>类&nbsp;&nbsp;&nbsp;&nbsp;目：</span>
        <span>{{component.kind.nameCn}}</span>
      </div>
      <div class="base-detail-item" v-if="component.brand.nameCn">
        <span>品&nbsp;&nbsp;&nbsp;&nbsp;牌：</span>
        <span>{{component.brand.nameCn}}</span>
      </div>
      <div class="base-detail-item attach" @click="goAttach(component.attach)">
        <span v-if="component.attach">规格书：<img src="/images/mobile/@2x/productDetail/pdf.png" alt=""><span>查看</span></span>
        <span v-else>规格书：-</span>
      </div>
      <div class="base-detail-item product-description" v-if="component.description">
        <span class="description">产品描述：{{component.description}}</span>
      </div>
      <i class="iconfont icon-shoucang" :style="isCollect?'color:#ff7800':'color: #ddd'" @click="collectComponent"></i>
    </div>
    <div class="product-switch-item">
      <span :class="activeType=='store'?'mobile-switch-btn active':'mobile-switch-btn'" @click="activeType='store'">商家</span>
      <span :class="activeType=='param'?'mobile-switch-btn active':'mobile-switch-btn'" @click="activeType='param'">参数</span>
    </div>
    <div class="product-params" v-if="activeType == 'param'">
      <div class="param-item" v-if="prop.value && prop.value!=''" v-for="prop in component.properties">
        <span class="prop-name">{{prop.property.labelCn}}</span>
        <span class="prop-value">{{prop.value}}</span>
      </div>
    </div>
    <div class="product-store" v-if="activeType == 'store'">
      <table v-if="searchLists&&searchLists.length > 0">
        <thead id="product-head">
          <tr>
            <th style="width: 1.55rem;">商家</th>
            <th style="width: 1.59rem;">生产日期</th>
            <th style="width: 2.58rem;">价格梯度</th>
            <th style="width: 1.77rem;">交期(天)</th>
          </tr>
        </thead>
        <thead class="active" v-show="isScrollOverTab">
          <tr>
            <th style="width: 1.55rem;">商家</th>
            <th style="width: 1.59rem;">生产日期</th>
            <th style="width: 2.58rem;">价格梯度</th>
            <th style="width: 1.77rem;">交期(天)</th>
          </tr>
        </thead>
        <tbody id="product-body">
          <tr v-for="store in searchLists">
            <td class="store-name">
              <nuxt-link :to="'/mobile/shop/' + store.storeid">
                {{store.storeName || '-' | storeNameFilter}}
              </nuxt-link>
            </td>
            <td>
              <div v-if="!store.packaging && !store.breakUp && !store.produceDate">-</div>
              <div>{{store.produceDate}}</div>
              <div>{{store.packaging}}</div>
              <div>{{store.breakUp?'可拆卖':'不可拆卖'}}</div>
            </td>
            <td class="price-level-wrap">
              <div v-if="!store.prices || store.prices.length == 0">-</div>
              <div class="price-number fl">
                <div v-for="price in store.prices">{{price.start}}+</div>
              </div>
              <div class="price-number fr">
                <div v-for="price in store.prices" class="price-level">
                  <span v-if="store.currencyName.indexOf('RMB')!==-1">￥{{price.rMBPrice | currency}}</span>
                  <span v-if="store.currencyName.indexOf('USD')!==-1">${{price.uSDPrice | currency}}</span>
                </div>
              </div>
            </td>
            <td class="push-date">
              <div v-if="store.b2cMinDelivery">
                <span>{{store.b2cMinDelivery}}</span>
                <span v-if="store.b2cMaxDelivery && store.b2cMaxDelivery !== store.b2cMinDelivery">-</span>
                <span v-if="store.b2cMaxDelivery && store.b2cMaxDelivery !== store.b2cMinDelivery">{{store.b2cMaxDelivery}}</span>
              </div>
              <div v-if="store.minBuyQty"><span class="order-tag">订</span>{{store.minBuyQty}}起订</div>
              <div v-if="store.reserve"><span class="order-tag reserve-tag">库</span>{{store.reserve}}</div>
              <div v-if="!store.b2cMinDelivery">
                <span>—</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="(storeList.totalElements == 0 && activeType == 'store') || (component.properties && component.properties.length == 0 && activeType == 'param')" class="no-store">
      <img src="/images/mobile/@2x/car@2x.png" alt="">
      <div v-if="activeType == 'store'">抱歉，暂无商家出售此型号！</div>
      <div v-if="activeType == 'store'">您可前往<strong>www.usoftmall.com</strong>网页版进行<strong>“发布求购”</strong>或<strong>“产品上架”</strong>操作！</div>
      <div v-if="activeType == 'param'">抱歉，暂无参数信息！</div>
    </div>
    <remind-box :title="collectResult" :timeoutCount="timeoutCount"></remind-box>
    <loading v-show="isSearchingMore"></loading>
    <login-box @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox" :url="url"></login-box>
  </div>
</template>
<script>
  import {RemindBox, Loading, LoginBox} from '~components/mobile/common'
  export default {
    data () {
      return {
        activeType: 'store',
        collectResult: '收藏成功',
        timeoutCount: 0,
        storeIds: [],
        UmallExist: false,
        storeExist: false,
        params: {
          count: 10,
          page: 1,
          sorting: {'minPriceRMB': 'ASC'},
          filter: {
            uuid: this.$route.params.uuid,
            ignoreUMall: false,
            ignoreStore: false,
            storeIds: ''
          }
        },
        isSearchingMore: false,
        searchLists: [],
        showLoginBox: false,
        isScrollOverTab: false,
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
    computed: {
      component () {
        return this.$store.state.componentDetail.detail.data
      },
      storeList () {
        let storeList = this.$store.state.componentInformation.information.data
        let _self = this
        if (storeList.content) {
          storeList.content.forEach(function (item) {
            _self.storeIds.push(item.storeid)
          })
        }
        if (this.storeIds.length > 0) {
          if (this.storeIds.indexOf(this.storeId) === -1) {
            this.storeExist = true
          } else {
            this.storeIds.splice(this.storeIds.indexOf(this.storeId), 1)
            if (this.storeIds.length > 0) {
              this.storeExist = true
            }
            this.UmallExist = true
          }
        }
        this.searchLists = this.searchLists.concat(storeList.content)
        this.isSearchingMore = false
        return storeList
      },
      allPage () {
        return this.storeList.totalPages
      },
      colList () {
        return this.$store.state.product.common.collectList.data
      },
      isCollect () {
        let id = this.component.id
        let store = this.colList
        if (store) {
          for (let i = 0; i < store.length; i++) {
            if (store[i].componentid === id) {
              return true
            }
          }
        } else {
          return false
        }
      },
      user () {
        return this.$store.state.option.user
      }
    },
    filters: {
      currency: function (num) {
        if (typeof num === 'number') {
          if (num <= 0.000001) {
            num = 0.000001
          } else {
            if (num.toString().indexOf('.') === -1) {
              num += '.00'
            } else {
              let inputStr = num.toString()
              let arr = inputStr.split('.')
              let floatNum = arr[1]
              if (floatNum.length > 6) {
                num = inputStr.substring(0, arr[0].length + 7)
                if (Number(floatNum.charAt(6)) > 4) {
                  num = (Number(num) * 1000000 + 1) / 1000000
                }
              } else if (floatNum.length === 1) {
                num = num + '0'
              }
            }
          }
        }
        return num
      },
      storeNameFilter: function (str) {
        if (str === '') {
          return str
        }
        let len = 0
        let index = 0
        for (let i = 0; i < str.length; i++) {
          if (index === 0 && str.charAt(i).charCodeAt(0) > 255) {
            len = len + 2
          } else {
            len++
          }
          if (len > 22) {
            index = i
            break
          }
        }
        if (index > 0) {
          return str.substring(0, index) + '...'
        } else {
          return str
        }
      }
    },
    methods: {
      scroll: function () {
        let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (Math.ceil(scrolled + window.screen.availHeight) >= document.body.scrollHeight && !this.isSearchingMore && this.params.page < this.allPage) {
          this.getMoreStore()
        }
        let tbodyObj = document.getElementById('product-body')
        let theadObj = document.getElementById('product-head')
        if (theadObj) {
          this.isScrollOverTab = tbodyObj.getBoundingClientRect().top - theadObj.getBoundingClientRect().height - 5 <= theadObj.getBoundingClientRect().height
        }
      },
      getMoreStore: function () {
        if (!this.isSearchingMore) {
          this.params.page++
          this.isSearchingMore = true
          this.$store.dispatch('loadComponentInformation', this.params)
        }
      },
      goAttach: function (url) {
        if (this.user.logged) {
          if (url && url !== '1') {
            window.location.href = url
          }
        } else {
          this.url = this.$route.fullPath
          this.showLoginBox = true
        }
      },
      collectComponent: function () {
        if (this.user.logged) {
          if (!this.isCollect) {
            this.$store.dispatch('product/saveEntity', {componentid: this.component.id, kind: 2})
            this.collectResult = '收藏成功'
            this.timeoutCount++
          } else {
            this.$http.post('/trade/collection/delete/cmpId', [this.component.id]).then(response => {
              this.collectResult = '取消成功'
              this.timeoutCount++
              this.$store.dispatch('product/saveStores')
            })
          }
        } else {
          this.url = this.$route.fullPath
          this.showLoginBox = true
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .component-detail {
    font-size: .28rem;
    margin-bottom: 1.2rem;
    background: #f7f7f7;
    padding-top: .2rem;
    .base-detail {
      margin: 0 .27rem .2rem .27rem;
      padding: .18rem .36rem 0 .36rem;
      border-radius: .1rem;
      background: url('/images/mobile/@2x/productDetail/component-desc-bg.png')no-repeat;
      background-size: cover;
      max-height: 3.17rem;
      position: relative;
      .base-detail-item {
        margin-top: .2rem;
        position: relative;
        color: #fff;
        &:nth-child(1) {
          margin-top: 0;
        }
        &:nth-last-child(1) {
          color: #999;
        }
        &.attach {
          display: inline-block;
          img {
            background-color: #fff;
            width: .36rem;
            height: .4rem;
            position: relative;
            bottom: .05rem;
          }
          >span >span {
            margin-left: .1rem;
            color: #418bf6;
          }
        }
        &:last-child {
          margin-bottom: 0;
        }
        &.product-description {
          height: 1.58rem;
        }
        .description {
          line-height: .4rem;
          max-height: 1.2rem;
          word-break: break-all;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          color: #999;
        }
      }
      >i {
        position: absolute;
        font-size: .4rem;
        background: #fff;
        width: .6rem;
        height: .6rem;
        line-height: .6rem;
        border-radius: 100%;
        box-shadow: 0 0 .05rem #aaa;
        right: .28rem;
        top: .55rem;
        text-align: center;
      }
    }
    .product-switch-item {
      text-align: center;
      background: #fff;
      .mobile-switch-btn {
        background: #fff;
        color: #666;
        display: inline-block;
        height: .64rem;
        line-height: .64rem;
        font-size: .34rem;
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
    .product-params {
      line-height: .28rem;
      margin-top: .2rem;
      .param-item {
        padding: .19rem .4rem;
        border-bottom: 0.04rem solid #eee;
        &:nth-child(1) {
          border-top: 0.04rem solid #eee;
        }
        &:nth-child(even) {
          background: #f9f9f9;
        }
        &:nth-child(odd) {
          background: #fff;
        }
        .prop-name {
          width: 3.72rem;
          display: inline-block;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .prop-value {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
          width: 2.69rem;
          float: right;
          text-align: right;
        }
      }
    }
    .product-store {
      margin: .2rem 0;
      table {
        width: 100%;
        font-size: .28rem;
        thead {
          background: #d5e5fb;
          &.active {
            position: fixed;
            top: .88rem;
            z-index: 2;
          }
          tr {
            th {
              font-weight: bold;
              text-align: center;
              height: .78rem;
              line-height: .78rem;
              >span {
               font-size: .22rem;
              }
            }
          }
        }
        tbody {
          background: #fff;
          tr {
            border-bottom: 0.2rem solid #f7f7f7;
            td {
              padding: .2rem .1rem;
              &.store-name {
                color: #418bf6;
                a {
                  padding: 0;
                  display: block;
                  width: 1.2rem;
                  overflow: hidden;
                  margin-left: .16rem;
                }
              }
              &.price-level-wrap {
                text-align: center;
              }
              > div {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 1.58rem;
              }
              .price-number {
                display: inline-block;
                vertical-align: middle;
                margin-bottom: 0;
                width: .9rem;
              }
              div {
                margin-bottom: .2rem;
                text-align: left;
                &:last-child {
                  margin-bottom: 0;
                }
              }
              &.push-date {
              text-align: left;
                div {
                  text-align: left;
                }
            }
              .price-level:last-child {
                color: #fc5708;
              }
              .order-tag {
                display: inline-block;
                font-size: .18rem;
                color: #fff;
                font-weight: bold;
                background: #ee1717;
                height: .27rem;
                width: .27rem;
                line-height: .27rem;
                text-align: center;
                border-radius: .05rem;
                position: relative;
                top: -.05rem;
                margin-right: .05rem;
                &.reserve-tag {
                  background: #07bb1c;
                }
              }
            }
          }
        }
      }
    }
    .no-store {
      background: #fff;
      padding-top: 1rem;
      img {
        display: block;
        text-align: center;
        margin: 0 auto;
        margin-bottom: .45rem;
        width: 3.31rem;
        height: 2.13rem;
      }
      div {
        width: 5.27rem;
        margin: 0 auto;
        text-align: center;
        line-height: .4rem;
        color: #999;
        .link-url {
          color: #01a44e;
        }
      }
    }
  }

</style>
