<template>
  <div class="store-detail mobile-content">
    <div class="store-logo">
      <div class="store-logo-box">
        <img :src="store.logoUrl || '/images/component/default.png'"/>
        <i v-if="showIcon" class="iconfont icon-shoucang" :style="isFocus === 'true'?'color:#ff7800':'color: #ddd'" @click="collectStore"></i>
      </div>
    </div>
    <div class="store-switch-item">
      <span :class="activeType=='product'?'mobile-switch-btn active':'mobile-switch-btn'" @click="activeType='product'">产品</span>
      <span :class="activeType=='detail'?'mobile-switch-btn active':'mobile-switch-btn'" @click="activeType='detail'">介绍</span>
    </div>
    <div class="store-info" v-if="activeType=='detail'">
      <div class="store-description">
        <h4>主营产品</h4>
        <p class="content" v-if="store.description">
          {{store.description}}
        </p>
        <div class="com-none-state" v-else>
          <p>抱歉，主营产品</p>
        </div>
      </div>
     <div class="contact-info">
      <h4>联系我们</h4>
      <ul class="list-unstyled clearfix">
        <li>
          <div>电&nbsp;&nbsp;话：</div>
          <div v-if="store.enterprise.enTel"><a :href="'tel:' + store.enterprise.enTel" @click="clickTel = true" :class="{'click-tel': clickTel}">{{store.enterprise.enTel}}</a></div>
          <div v-else><span>-</span></div>
        </li>
        <li>
          <div>传&nbsp;&nbsp;真：</div>
          <div v-if="store.enterprise.enFax"> {{store.enterprise.enFax}}</div>
          <div v-else><span>-</span></div>
        </li>
        <li>
          <div>手&nbsp;&nbsp;机：</div>
          <div v-if="store.enterprise.enPhone"> <a :href="'tel:' + store.enterprise.enPhone" @click="clickPhone = true" :class="{'click-phone': clickPhone}">{{store.enterprise.enPhone}}</a></div>
          <div v-else><span>-</span></div>
        </li>
        <li>
          <div>微&nbsp;&nbsp;信：</div>
          <div v-if="store.enterprise.enWeixin"> {{store.enterprise.enWeixin}}</div>
          <div v-else><span>-</span></div>
        </li>
        <li>
          <div>Q&nbsp;&nbsp;&nbsp;Q：</div>
          <div v-if="store.enterprise.enQQ"> {{store.enterprise.enQQ}}</div>
          <div v-else><span>-</span></div>
        </li>
        <li>
          <div>店铺地址：</div>
          <div v-if="store.enterprise.address">{{store.enterprise.address}}</div>
          <div v-else><span>-</span></div>
        </li>
      </ul>
     </div>
      <div class="store-description">
        <h4>企业简介</h4>
        <p class="content" v-if="store.enterprise.description">
          {{store.enterprise.description}}
        </p>
        <div class="com-none-state" v-else>
          <p>抱歉，暂无企业简介</p>
        </div>
      </div>
    </div>
  <!--  <div class="com-none-state" v-if="activeType=='detail'">
      <img src="/images/mobile/@2x/empty-collect.png">
      <p>抱歉，暂无店铺简介</p>
      <nuxt-link to="/">返回首页</nuxt-link>
    </div>-->
    <div class="product-store" v-if="activeType == 'product'">
      <table v-if="commodities.content&&commodities.content.length > 0">
        <thead id="product-head" >
          <tr>
            <th style="width: 1.77rem;">型号/品牌</th>
            <th style="width: 1.75rem;">包装</th>
            <th style="width: 2.2rem;">价格梯度</th>
            <th style="width: 1.77rem;">交期(天)</th>
          </tr>
        </thead>
        <thead class="active" v-show="isScrollOverTab">
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
        <div>抱歉，暂无上架产品信息</div>
      </div>
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
        activeType: 'product',
        collectResult: '收藏成功',
        timeoutCount: 0,
        clickTel: false,
        clickPhone: false,
        isSearchingMore: false,
        searchLists: [],
        page: 1,
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
    created () {
      this.clickTel = false
      this.clickPhone = false
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
      },
      showIcon() {
        return this.store.uuid !== this.$store.state.option.storeStatus.data.uuid
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
        if (theadObj) {
          this.isScrollOverTab = tbodyObj.getBoundingClientRect().top - theadObj.getBoundingClientRect().height - 5 <= theadObj.getBoundingClientRect().height
        }
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
          this.url = this.$route.fullPath
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
    .store-info {
      background: #f7f7f7;
      width: 100%;
      h4{
        width: 100%;
        text-align: left;
        font-size: 0.3rem;
        line-height: 0.6rem;
        height: 0.6rem;
        letter-spacing: 0px;
        color: #333;
        font-weight: normal;
        border-bottom: 1px solid #efeded;
        padding-left: 0.11rem;
        &:before{
          content: '';
          display: inline-block;
          width: 0.08rem;
          height: 0.26rem;
          background-color: #145dee;
          margin-right: 0.13rem;
          position: relative;
          top: 0.02rem;
        }
      }
      .contact-info{
        background: #fff;
        width: 6.96rem;
        margin: .2rem auto;
        border-radius: .1rem;
        ul{
          padding: 0.22rem 0rem;
          li{
            div{
              float: left;
              font-size: .28rem;
              color: #666;
              line-height: .53rem;
              width:80%;
              text-align: left;
              &:first-child{
                width: 20%;
                padding-left: 0.36rem;
                text-align: justify;
              }
              a{
                color: #145dee;
              }
              .click-tel, .click-phone{
                color: #f44336;
              }
            }
            &:last-child{
              div{
                width: 74%;
                padding-right:.34rem;
                word-wrap: break-word;
                &:first-child{
                  text-align: left;
                  padding: 0rem 0rem 0rem .36rem;
                  width: 26%;
                }
              }
            }
          }
        }
      }
      .store-description{
        background: #fff;
        width: 6.96rem;
        margin: .2rem auto;
        border-radius: .1rem;
        .content {
          text-indent:2em;
          background: #fff;
          margin: .2rem auto 0;
          padding: .04rem .34rem .4rem .34rem;
          width: 100%;
          font-size: .28rem;
          color: #666;
          text-align: left;
          height: 95%;
          /*box-shadow: 0 .03rem .01rem 0 #cdcbcb96;*/
          line-height: .5rem;
          word-break: break-all;
        }
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
