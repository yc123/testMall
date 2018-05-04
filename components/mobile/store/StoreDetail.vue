<template>
  <div class="store-detail mobile-content">
    <div class="store-logo">
      <div class="store-logo-box">
        <img :src="store.logoUrl || '/images/component/default.png'"/>
        <i class="iconfont icon-shoucang" :style="isFocus === 'true'?'color:#ff7800':'color: #ddd'" @click="collectStore"></i>
      </div>
    </div>
    <div class="store-switch-item">
      <span :class="activeType=='product'?'mobile-switch-btn active':'mobile-switch-btn'" @click="activeType='product'">产品</span>
      <span :class="activeType=='detail'?'mobile-switch-btn active':'mobile-switch-btn'" @click="activeType='detail'">介绍</span>
    </div>
    <div class="store-description" v-if="activeType=='detail'">
      <p>
        {{store.description}}
      </p>
    </div>
    <div class="product-store" v-if="activeType == 'product'">
      <table v-if="commodities.content&&commodities.content.length > 0">
        <thead id="product-head" :class="{'active': isScrollOverTab}">
        <tr>
          <th style="width: 1.77rem;">型号/品牌</th>
          <th style="width: 1.75rem;">包装</th>
          <th style="width: 2.2rem;">价格梯度</th>
          <th style="width: 1.77rem;">交期(天)</th>
        </tr>
        </thead>
        <tbody id="product-body">
        <tr v-for="commodity in searchLists" @click="goProductDetail(commodity.uuid)">
          <td class="store-name">
            <div>{{commodity.code}}</div>
            <div>{{commodity.brandNameCn}}</div>
          </td>
          <td>
            <div v-if="!commodity.packaging && !commodity.breakUp && !commodity.produceDate">-</div>
            <div>{{commodity.packaging}}</div>
            <div>{{commodity.breakUp?'可拆卖':'不可拆卖'}}</div>
            <div>{{commodity.produceDate}}</div>
          </td>
          <td class="price-level-wrap">
            <div v-if="!commodity.prices || commodity.prices.length == 0">-</div>
            <div class="price-number fl">
              <div v-for="price in commodity.prices">{{price.start}}+</div>
            </div>
            <div class="price-number fr">
              <div v-for="price in commodity.prices" class="price-level">
                <span v-if="commodity.currencyName.indexOf('RMB')!==-1">¥{{price.rMBPrice | currency}}</span>
                <span v-if="commodity.currencyName.indexOf('USD')!==-1">${{price.uSDPrice | currency}}</span>
              </div>
            </div>
          </td>
          <td>
            <div v-if="commodity.b2cMinDelivery">
              <span>{{commodity.b2cMinDelivery}}</span>
              <span v-if="commodity.b2cMaxDelivery && commodity.b2cMaxDelivery !== commodity.b2cMinDelivery">-</span>
              <span v-if="commodity.b2cMaxDelivery && commodity.b2cMaxDelivery !== commodity.b2cMinDelivery">{{commodity.b2cMaxDelivery}}</span>
            </div>
            <div v-if="commodity.minBuyQty"><span class="order-tag">订</span>{{commodity.minBuyQty}}起订</div>
            <div v-if="commodity.reserve"><span class="order-tag reserve-tag">库</span>{{commodity.reserve}}</div>
            <div v-if="!commodity.b2cMinDelivery">
              <span>—</span>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-if="!commodities.content || commodities.content.length == 0" class="no-product">
        <img src="/images/mobile/@2x/car@2x.png" alt="">
        <div>抱歉，暂无产品信息</div>
      </div>
    </div>
    <remind-box :title="collectResult" :timeoutCount="timeoutCount"></remind-box>
    <loading v-show="isSearchingMore"></loading>
    <login-box @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox"></login-box>
  </div>
</template>
<script>
  import {RemindBox, Loading, LoginBox} from '~components/mobile/common'
  export default {
    data () {
      return {
        activeType: 'product',
        collectResult: '收藏成功',
        timeoutCount: 0,
        isSearchingMore: false,
        searchLists: [],
        page: 1,
        showLoginBox: false,
        isScrollOverTab: false
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
      }
    },
    computed: {
      store () {
        return this.$store.state.shop.storeInfo.store.data
      },
      commodities () {
        let list = this.$store.state.shop.storeInfo.storeCommodity.data
        this.searchLists = this.searchLists.concat(list.content)
        this.isSearchingMore = false
        return list
      },
      allPage () {
        return this.commodities.totalPages
      },
      isFocus () {
        return this.$store.state.shop.storeInfo.focusList.data
      },
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      scroll: function () {
        let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (Math.ceil(scrolled + window.screen.availHeight) >= document.body.scrollHeight && !this.isSearchingMore && this.page < this.allPage && this.activeType === 'product') {
          this.getMoreCom()
        }
        let tbodyObj = document.getElementById('product-body')
        let theadObj = document.getElementById('product-head')
        this.isScrollOverTab = tbodyObj.getBoundingClientRect().top <= theadObj.getBoundingClientRect().height
      },
      getMoreCom: function () {
        if (!this.isSearchingMore) {
          this.page++
          this.isSearchingMore = true
          this.pageCommodity({ page: this.page, count: 6 })
        }
      },
      async pageCommodity (pageParams, kindId, keyword) {
        let params = { storeid: this.$route.params.uuid, origin: 'store', kindUuid: kindId, code: keyword }
        params.page = pageParams.page
        params.count = pageParams.count
        try {
          let { data } = await this.$http.get('/api/commodity/commodities', { params })
          this.$store.commit('shop/storeInfo/GET_STORE_COMMODITY_SUCCESS', data)
        } catch (err) {
          this.$store.commit('shop/storeInfo/GET_STORE_COMMODITY_FAILURE', err)
        }
      },
      goProductDetail: function (uuid) {
        if (uuid) {
          this.$router.push('/mobile/brand/componentDetail/' + uuid)
        } else {
          this.collectResult = '卖家上传的产品暂无参数，请联系卖家了解具体详情。'
          this.timeoutCount ++
        }
      },
      collectStore: function () {
        if (this.user.logged) {
          if (this.isFocus === 'false') {
            this.$store.dispatch('shop/StoreFocus', {storeName: this.store.storeName, storeid: this.store.id})
              .then(response => {
                this.$store.dispatch('shop/StoreFocusList', {id: this.store.id})
                this.collectResult = '收藏成功'
                this.timeoutCount++
              })
          } else if (this.isFocus === 'true') {
            this.$http.post('/trade/storeFocus/delete/storeId', [this.store.id])
              .then(response => {
                this.$store.dispatch('shop/StoreFocusList', {id: this.store.id})
                this.collectResult = '取消成功'
                this.timeoutCount++
              })
          }
        } else {
          this.showLoginBox = true
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .store-detail {
    margin: 0 auto;
    margin-bottom: 1.2rem;
    text-align: center;
    background: #f7f7f7;
    height: 100%;
    .store-logo {
      height: 3.17rem;
      width: 6.96rem;
      display: inline-block;
      margin: .2rem auto;
      line-height: 2.13rem;
      background: #fff;
      text-align: center;
      border-radius: .1rem;
      background: url('/images/mobile/@2x/brand-bg.png') no-repeat;
      background-size: cover;
      .store-logo-box {
        border: .04rem solid #c7e5fd;
        border-radius: .1rem;
        height: 2.21rem;
        width: 3.73rem;
        margin: .5rem auto 0;
        background: #fff;
        position: relative;
        img {
          max-height: 2.1rem;
          max-width: 3.6rem;
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
          right: -1.44rem;
          top: .75rem;
          text-align: center;
        }
      }
    }
    .store-switch-item {
      text-align: center;
      background: #fff;
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
    .store-description {
      background: #f7f7f7;
      width: 100%;
      p {
        background: #fff;
        margin: .2rem auto 0;
        padding: .4rem .34rem;
        width: 100%;
        font-size: .3rem;
        color: #666;
        text-align: left;
        height: 95%;
        box-shadow: 0 .03rem .01rem 0 #cdcbcb96;
        line-height: .5rem;
      }
    }
    .product-store {
      margin: .2rem 0 0 0;
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
            }
          }
        }
        tbody {
          tr {
            background: #fff;
            border-bottom: 0.2rem solid #f7f7f7;
            td {
              padding: .2rem .1rem;
              text-align: left;
              &.price-level-wrap {
                text-align: center;
              }
              div {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: .2rem;
                max-width: 1.58rem;
                &:last-child {
                  margin-bottom: 0;
                }
              }
              .price-level:last-child {
                color: #fc5708;
              }
              .price-number {
                display: inline-block;
                vertical-align: middle;
                margin-bottom: 0;
                width: .9rem;
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
            &:active {
              background: #e1e1e1;
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
    .no-product {
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
        font-size: .32rem;
        color: #999;
      }
    }
  }
</style>
