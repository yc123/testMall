<template>
  <div>
    <ul class="seek-list">
      <li v-for="(item, index) in purchaseManList">
        <div class="top">
          <span v-if="item.inquiry.enterprise && item.inquiry.enterprise.enName">{{item.inquiry.enterprise.enName | enterpriseFilter}}</span>
          <span v-else>{{item.userName | userNameFilter}}</span>
        </div>
        <div>
          <div class="fl">
            <div>
              型号：<span>{{item.cmpCode || '-'}}</span>
            </div>
            <div>
              品牌：<span>{{item.inbrand || '-'}}</span>
            </div>
            <div>
              规格：<span>{{item.spec || '-'}}</span>
            </div>
            <div>
              截止日期：<span class="date">{{item.endDate | date}}</span>
            </div>
          </div>
          <div class="fr">
            <p v-if="item.remainingTime > 0">剩余&nbsp;:
              <span v-if="getDay(item.remainingTime) > 0" v-text="getDay(item.remainingTime)"></span>
              <i v-if="getDay(item.remainingTime) > 0">&nbsp;天&nbsp;</i>
              <span v-if="getDay(item.remainingTime) <= 0" v-text="getHours(item.remainingTime)"></span>
              <i v-if="getDay(item.remainingTime) <= 0" >&nbsp;小时</i>
            </p>
            <p v-else>已截止</p>
            <!--<a v-if="!userType && item.quoted == 1">已报价</a>-->
            <a v-if="!userType && item.remainingTime > 0 && (!item.quoted || item.quoted != 1) && (user.logged && ((item.inquiry.enterprise && user.data.enterprise && (item.inquiry.enterprise.uu === user.data.enterprise.uu)) || (!user.data.enterprise.uu && item.userUU == user.data.userUU  && !item.inquiry.enterprise)))" class="self-publish" @click="onRemind('此为贵公司的求购')">我要报价</a>
            <a v-if="!(userType == 'saler' && seekType  && seekType != 'wait') && (item.remainingTime > 0 && (!item.quoted || item.quoted != 1) && !(user.logged && ((item.inquiry.enterprise && user.data.enterprise && (item.inquiry.enterprise.uu === user.data.enterprise.uu)) || (!user.data.enterprise.uu && item.userUU == user.data.userUU  && !item.inquiry.enterprise))))"  @click="goSayPrice(item.id, index)">我要报价</a>
            <a v-if="((!userType || userType == 'buyer') && (seekType  && seekType != 'wait')) || (userType == 'saler' && seekType  && seekType != 'wait') || item.quoted == 1" @click="goSayPriceInfo(item.quteId || item.id, item.agreed, index)">查看报价</a>
          </div>
        </div>
      </li>
    </ul>
    <div class="none-state" v-if="!purchaseManList || !purchaseManList.length && !isDataChange">
      <img src="/images/mobile/@2x/car@2x.png">
      <p v-text="'抱歉，暂无求购信息'"></p>
    </div>
    <login-box @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox"></login-box>
    <say-price :showSayPriceBox="showSayPriceBox" @cancelSayPriceAction="onSayPriceCancel"></say-price>
    <say-price-info v-if="showSayPriceInfoBox" :agreed="agreed" @cancelSayPriceInfoAction="onSayPriceInfoCancel"></say-price-info>
    <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
  </div>
</template>
<script>
  import {LoginBox, RemindBox} from '~components/mobile/common'
  import {SayPrice, SayPriceInfo} from '~components/mobile/applyPurchase'
  export default {
    components: {
      LoginBox,
      SayPrice,
      RemindBox,
      SayPriceInfo
    },
    data () {
      return {
        showLoginBox: false,
        showSayPriceBox: false,
        showSayPriceInfoBox: false,
        activeIndex: -1,
        remindText: '',
        timeoutCount: 0,
        agreed: 0
      }
    },
    props: ['userType', 'seekType', 'purchaseManList', 'isDataChange'],
    filters: {
      date: function (date) {
        if (date) {
          const d = new Date(Number(date))
          const year = d.getFullYear()
          const monthTemp = d.getMonth() + 1
          const month = monthTemp < 10 ? '0' + monthTemp : '' + monthTemp
          const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate() + ' '
          return year + '-' + month + '-' + day
        } else {
          return '-'
        }
      },
      enterpriseFilter (str) {
        return str && str.length > 4 ? str.substring(0, 2) + '**' + str.substring(str.length - 2, str.length) : str || '-'
      },
      userNameFilter (str) {
        return str ? str.substring(0, 1) + '**' : '-'
      }
    },
    computed: {
//      purchaseManList () {
//        return this.$store.state.applyPurchase.purchaseManList.purchaseManList.data
//      },
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      getDay: function (timeStamp) {
        return Math.floor(timeStamp / (1000 * 60 * 60 * 24))
      },
      getHours: function (timeStamp) {
        return Math.floor((timeStamp / (1000 * 60 * 60)) % 24)
      },
      goSayPrice: function (id, index) {
        if (this.user.logged) {
//          this.$router.push('/mobile/applyPurchase/sayPrice/' + path)
          this.$store.dispatch('applyPurchase/loadPurchaseManDetail', {itemId: id, enuu: this.$store.state.option.user.data.enterprise ? this.$store.state.option.user.data.enterprise.uu : null})
          this.showSayPriceBox = true
          this.activeIndex = index
        } else {
          this.showLoginBox = true
        }
      },
      goSayPriceInfo: function (id, agreed, index) {
        this.userType === 'buyer' ? this.$store.dispatch('applyPurchase/loadBuyerInquiryDetail', {id: id}) : this.$store.dispatch('applyPurchase/loadVendorInquiryDetail', {id: id})
        this.agreed = agreed
        this.showSayPriceInfoBox = true
        this.activeIndex = index
//        '/mobile/applyPurchase/list/' + (userType ? (item.quteId || item.id) + '?type=' + userType : (item.quteId || item.id)) + (userType ? '&' : '?') + 'status=' + item.agreed
      },
      onSayPriceCancel: function (flag, quteId) {
        if (flag) {
          this.purchaseManList[this.activeIndex].quoted = 1
          this.purchaseManList[this.activeIndex].quteId = quteId
          this.onRemind('报价成功')
        }
        this.showSayPriceBox = false
      },
      onSayPriceInfoCancel: function (flag) {
        if (flag) {
          this.purchaseManList[this.activeIndex].agreed = 1
          this.onRemind('采纳成功')
        }
        this.showSayPriceInfoBox = false
      },
      onRemind: function (str) {
        this.remindText = str
        this.timeoutCount ++
      }
    }
  }
</script>
<style lang="scss" scoped>
  .seek-list {
    width: 7.26rem;
    margin: .13rem auto 0;
    li {
      border: .04rem solid #e0e0e4;
      height: 3.32rem;
      margin-bottom: .2rem;

      >
      div.top {
        font-size: .32rem;
        color: #3a3a3a;
        background: #f8f7fa;
        height: .92rem;
        line-height: .92rem;

        span {
          display: block;
          width: 6.9rem;
          border-bottom: .04rem dashed #9f9f9f;
          margin: 0 auto;
        }

      }
      >
      div {
        font-size: .3rem;
        // display: inline-block;
        &::after {
          clear: both;
          visibility: hidden;
          zoom: 1;
          display: block;
          content: ' ';
        }
        .fl {
          color: #666;
          width: 4.8rem;
          height: 1.74rem;
          margin: .27rem 0 .29rem .18rem;
          line-height: .46rem;
          border-right: .04rem dashed #9f9f9f;

          > div {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            span {
              color: #333;

              &.date {
                color: #e6353d;
              }

            }

          }

        }
        .fr {
          width: 2.2rem;
          padding: .66rem 0 0 .2rem;

          p {
            font-size: .28rem;

            span {
              font-size: .35rem;
              color: #ff3208;
            }

            i {
              font-style: normal;
            }

          }
          a {
            display: block;
            width: 1.64rem;
            height: .58rem;
            line-height: .58rem;
            text-align: center;
            font-size: .32rem;
            color: #e62f36;
            border: .02rem solid #ea494f;
            margin-top: .34rem;
            border-radius: .06rem;

            &.self-publish {
              background: rgb(204, 203, 203);
              color: #fff;
              border-color: #fff;
            }
          }

        }
      }
    }

  }
  .none-state {
    text-align: center;
    margin-top: 1.1rem;
    img {
      width: 4.08rem;
      height: 2.62rem;
    }
    p {
      font-size: .32rem;
      color: #999;
      margin: 1.19rem 0 0 0;
    }
  }
</style>
