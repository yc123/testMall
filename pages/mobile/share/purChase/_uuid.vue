<template>
  <div class="purchase">
    <div class="purchase-top">
      <div class="purchase-top-bg">
        <div class="clearfix">
          <div class="title fl">
            <span v-if="purchaseDetail.inquiry && (purchaseDetail.inquiry.enName || (purchaseDetail.inquiry.enterprise && purchaseDetail.inquiry.enterprise.enName))">{{[purchaseDetail.inquiry.enName || purchaseDetail.inquiry.enterprise.enName, user.logged] | enterpriseFilter}}</span>
            <span v-else>{{[purchaseDetail.userName, user.logged] | userNameFilter}}</span>
          </div>
          <div class="time fr">{{purchaseDetail.endDate | date}}</div>
        </div>
        <div class="desc">{{purchaseDetail.cmpCode}}</div>
        <div class="size">类目(产品名称)：
          <span>{{purchaseDetail.prodTitle}}</span>
        </div>
        <div class="brand">品牌：
          <span>{{purchaseDetail.inbrand || '-'}}</span>
        </div>
        <div class="size">规格：
          <span>{{purchaseDetail.spec || '-'}}</span>
        </div>

        <div class="pmg-icon">
          <div class="Isend" v-if="purchaseDetail.remainingTime < 0">
            <img src="/images/mobile/@2x/purChase/Isend.png" />
          </div>
          <div class="Issend" v-else-if="((!userType || userType == 'buyer') && (seekType  && seekType != 'wait')) || (userType == 'saler' && seekType  && seekType != 'wait') || purchaseDetail.quoted == 1">
            <img src="/images/mobile/@2x/purChase/Issend.png" />
          </div>
        </div>
      </div>
      <div class="purchase-top-control clearfix" v-if="purchaseDetail.remainingTime > 0 || (((!userType || userType == 'buyer') && (seekType  && seekType != 'wait')) || (userType == 'saler' && seekType  && seekType != 'wait') || purchaseDetail.quoted == 1)">
        <div class="time fl">
          <template v-if="purchaseDetail.remainingTime > 0">
            <span class="icon"></span>剩余时间:
            <span class="timetext" v-if="getDay(purchaseDetail.remainingTime) > 0">
              <a class="number">{{getDay(purchaseDetail.remainingTime)}}</a>
              <a>天</a>
            </span>
            <span class="timetext" v-if="getDay(purchaseDetail.remainingTime) <= 0">
              <a class="number">{{getHours(purchaseDetail.remainingTime)}}</a>
              <a>小时</a>
            </span>
          </template>
          <!-- <span class="timetext" v-else>已截止</span> -->
          <!-- <span class="timetext">剩余时间：<a class="number">8</a><a>小时</a></span> -->
        </div>
        <div v-if="!userType && purchaseDetail.remainingTime > 0 && (!purchaseDetail.quoted || purchaseDetail.quoted != 1) && (user.logged && ((purchaseDetail.inquiry.enterprise && user.data.enterprise && (purchaseDetail.inquiry.enterprise.uu === user.data.enterprise.uu)) || (!user.data.enterprise.uu && purchaseDetail.userUU == user.data.userUU  && !purchaseDetail.inquiry.enterprise)))" class="goprice fr" @click="onRemind('此为贵公司的求购')">我要报价</div>
        <div class="goprice fr" v-if="!(userType == 'saler' && seekType  && seekType != 'wait') && (purchaseDetail.remainingTime > 0 && (!purchaseDetail.quoted || purchaseDetail.quoted != 1) && !(user.logged && ((purchaseDetail.inquiry.enterprise && user.data.enterprise && (purchaseDetail.inquiry.enterprise.uu === user.data.enterprise.uu)) || (!user.data.enterprise.uu && purchaseDetail.userUU == user.data.userUU  && !purchaseDetail.inquiry.enterprise))))" @click="goSayPrice(purchaseDetail.id)">我要报价</div>
        <div class="goprice fr" v-if="((!userType || userType == 'buyer') && (seekType  && seekType != 'wait')) || (userType == 'saler' && seekType  && seekType != 'wait') || purchaseDetail.quoted == 1" @click="goSayPriceInfo(purchaseDetail.quteId || purchaseDetail.id, purchaseDetail.agreed)">查看报价</div>
      </div>
    </div>
    <div class="purcharse_banner">
      <div class="banner"></div>
    </div>
    <div class="seek-title">
      <img src="/images/mobile/@2x/applyPurchase/home/seek-title.png" alt="">
      <span>最新求购信息</span>
    </div>
    <div class="purcharseListContent">
      <seek-list :purchaseManList="purchaseManListData" :isDataChange="true"></seek-list>

      <div @click="toMore()" class="purchase_btn_look">查看更多</div>
      <div class="purchse_btn_more_title">
        <nuxt-link :to="'/'">优软商城首页</nuxt-link>
        <!-- <a href="https://www.usoftmall.com"></a> -->
      </div>
    </div>

    <div class="mobile_footer company">
      <div class="hr"></div>
      <img src="/images/mobile/@2x/shareStore/logo.png" alt="">
      <div class="hr right"></div>
      <p>此页面由深圳市优软商城科技有限公司提供</p>
      <nuxt-link :to="'/'">www.usoftmall.com</nuxt-link>
      <!-- <a href="https://www.usoftmall.com">www.usoftmall.com</a> -->
    </div>

    <div class="purcharse_kong"></div>
    <div class="purcharse_fixed " @click="sendApplyPurchase()">
      <div class="clearfix">
        <div class="money_icon fl"></div>
        <span class="fl">发布求购</span>
      </div>
    </div>
    <login-box @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox"></login-box>
    <say-price :showSayPriceBox="showSayPriceBox" @cancelSayPriceAction="onSayPriceCancel"></say-price>
    <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
    <say-price-info v-if="showSayPriceInfoBox" :agreed="agreed" @cancelSayPriceInfoAction="onSayPriceInfoCancel"></say-price-info>
    <publish-seek :showSayPriceBox="showsendApplyBox" @cancelAction="showsendApplyBox = false" @reloadAction="onReload" @remindAction="onRemind"></publish-seek>
  </div>
</template>

<script>
import { SayPrice, SayPriceInfo } from '~components/mobile/applyPurchase'
import { LoginBox, RemindBox } from '~components/mobile/common'
import SeekList from '~components/mobile/applyPurchase/SeekList.vue'
import PublishSeek from '~components/mobile/applyPurchase/PublishSeek.vue'
// var flg = true
export default {
  layout: 'mobileStore',
  props: ['userType', 'seekType', 'purchaseManList'],
  fetch({ store, params, redirect }) {
    if (!params.uuid) {
      return redirect('/error')
    }
    return Promise.all([
      store.dispatch('applyPurchase/loadPurchaseManDetail', {
        itemId: params.uuid,
        enuu: store.state.option.user.data.enterprise
          ? store.state.option.user.data.enterprise.uu
          : null
      }),
      store.dispatch('applyPurchase/loadPurchaseManList', {
        pageNumber: 1,
        pageSize: 10,
        sorting: { releaseDate: 'DESC' },
        keyword: '',
        enUU: store.state.option.user.data.enterprise
          ? store.state.option.user.data.enterprise.uu
          : null
      })
    ])
  },
  data() {
    return {
      showLoginBox: false,
      showSayPriceBox: false,
      showSayPriceInfoBox: false,
      remindText: '',
      timeoutCount: 0,
      agreed: 0,
      showsendApplyBox: false,
      purchaseDetail: {
        inquiry: {
          enName: ''
        }
      }
    }
  },
  components: {
    SayPrice,
    SayPriceInfo,
    LoginBox,
    RemindBox,
    SeekList,
    PublishSeek
  },
  computed: {
    // purchaseDetail() {
    //   // if (flg === true) {
    //   //   flg = false

    //   // }
    // },
    purchaseManListData() {
      return this.$store.state.applyPurchase.purchaseManList.purchaseManList
        .data.content
    }
  },
  created() {
    this.purchaseDetail = this.$store.state.applyPurchase.purchaseManList.purchaseManDetail.data
  },
  methods: {
    toMore() {
      if (
        /(iPhone|iPad|Opera Mini|Android.*Mobile|NetFront|PSP|BlackBerry|Windows Phone)/gi.test(
          window.navigator.userAgent
        )
      ) {
        this.$router.push({ path: '/mobile/applyPurchase/list' })
      } else {
        this.$router.push({ path: '/applyPurchase' })
      }
    },
    getDay(timeStamp) {
      return Math.floor(timeStamp / (1000 * 60 * 60 * 24))
    },
    getHours(timeStamp) {
      return Math.floor((timeStamp / (1000 * 60 * 60)) % 24)
    },
    onSayPriceCancel(flag, quteId) {
      if (flag) {
        this.purchaseDetail.quoted = 1
        this.purchaseDetail.quteId = quteId
        this.onRemind('报价成功')
      }
      this.showSayPriceBox = false
    },
    onRemind(str) {
      this.remindText = str
      this.timeoutCount++
    },
    onSayPriceInfoCancel(flag) {
      flag && ((this.purchaseDetail.agreed = 1), this.onRemind('采纳成功'))
      this.showSayPriceInfoBox = false
    },
    goSayPriceInfo(id, agreed) {
      this.userType === 'buyer'
        ? this.$store.dispatch('applyPurchase/loadBuyerInquiryDetail', {
            id: id
          })
        : this.$store.dispatch('applyPurchase/loadVendorInquiryDetail', {
            id: id,
            enuu: this.user.data.enterprise.uu,
            useruu: this.user.data.userUU
          })
      this.agreed = agreed
      this.showSayPriceInfoBox = true
    },
    goSayPrice(id) {
      if (this.user.logged) {
        if (this.user.data.enterprise.uu) {
          if (
            this.user.data.enterprise.isVendor &&
            this.user.data.enterprise.isVendor !== '1690'
          ) {
            this.$store.dispatch('applyPurchase/loadPurchaseManDetail', {
              itemId: id,
              enuu: this.$store.state.option.user.data.enterprise
                ? this.$store.state.option.user.data.enterprise.uu
                : null
            })
            this.showSayPriceBox = true
            // this.activeIndex = index
          } else {
            this.onRemind('抱歉，您需开通卖家功能才可报价')
          }
        } else {
          this.onRemind('个人账户暂不可报价')
        }
      } else {
        this.showLoginBox = true
      }
      return false

      // if (this.user.logged) {
      //   this.$store.dispatch('applyPurchase/loadPurchaseManDetail', {
      //     itemId: id,
      //     enuu: this.$store.state.option.user.data.enterprise
      //       ? this.$store.state.option.user.data.enterprise.uu
      //       : null
      //   })
      //   this.showSayPriceBox = true
      // } else {
      //   this.showLoginBox = true
      // }
    },
    sendApplyPurchase() {
      if (this.user.logged) {
        this.showsendApplyBox = true
      } else {
        this.showLoginBox = true
      }
    },
    onReload() {
      // const path = this.$route.path
      // if (path === '/') {
      //   this.$store.dispatch('applyPurchase/loadMobileHomeList', {
      //     pageNumber: 1,
      //     pageSize: 5,
      //     enUU: this.user.data.enterprise ? this.user.data.enterprise.uu : null
      //   })
      // } else if (path === '/mobile/share/purChase') {
      this.$store.dispatch('applyPurchase/loadPurchaseManList', {
        pageNumber: 1,
        pageSize: 10,
        enUU: this.user.data.enterprise ? this.user.data.enterprise.uu : null
      })
      // }
    }
  }
}
</script>

<style scoped lang="scss">
.clearfix {
  &::after {
    clear: both;
    visibility: hidden;
    zoom: 1;
    display: block;
    content: ' ';
  }
}
.purchase {
  background: rgb(246, 245, 248);
  .purchase-top {
    background: #fff;
    padding: 0.28rem 0.32rem 0.28rem 0.32rem;
    margin-bottom: 0.18rem;
    .purchase-top-bg {
      background: url('/images/mobile/@2x/purChase/purChase_bg.png');
      background-size: 100%;
      width: 6.82rem;
      height: 3rem;
      margin: 0 auto;
      position: relative;
      color: #fff;
      padding-left: 0.35rem;
      padding-top: 0.32rem;
      padding-bottom: 0.32rem;
      .title {
        font-size: 0.3rem;
        max-width: 4.6rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .time {
        font-size: 0.26rem;
        margin-right: 0.2rem;
        margin-top: 0.05rem;
      }
      .desc {
        font-size: 0.4rem;
        margin: 0.2rem 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .brand,
      .size {
        font-size: 0.3rem;
        margin-bottom: 0.14rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 4.5rem;
      }
      .pmg-icon {
        position: absolute;
        right: 0.36rem;
        bottom: 0.17rem;
        img {
          width: 1.28rem;
          height: 1.33rem;
        }
      }
    }
    .purchase-top-control {
      max-width: 520px;
      margin: 0 auto;
      margin-top: 0.32rem;
      .time {
        margin-top: 0.2rem;
        margin-left: 0.38rem;
        .icon {
          background-image: url('/images/mobile/@2x/purChase/time.png');
          background-size: 100%;
          width: 0.28rem;
          height: 0.28rem;
          display: inline-block;
          vertical-align: middle;
          margin-right: 0.05rem;
        }
        .timetext {
          color: #09061e;
          font-size: 0.24rem;
          margin-left: 0.1rem;
          a {
            font-size: 0.24rem;
            color: #fa7701;
            &.number {
              font-size: 0.36rem;
            }
          }
        }
      }
      .goprice {
        font-size: 0.28rem;
        width: 1.78rem;
        height: 0.68rem;
        background: linear-gradient(to right, #fb9400, #fb6d03);
        color: #fff;
        line-height: 0.68rem;
        text-align: center;
        border-radius: 4px;
      }
    }
  }
  .purcharse_banner {
    background: #fff;
    margin: 0 auto;
    text-align: center;
    padding: 0.24rem 0 0.36rem 0;
    margin-bottom: 0.18rem;
    .banner {
      background: url('/images/mobile/@2x/purChase/banner.png');
      background-size: 100%;
      width: 6.8rem;
      margin: 0 auto;
      height: 0.84rem;
    }
  }
  .purcharse_kong {
    width: 100%;
    height: 1rem;
    position: relative;
  }
  .purcharse_fixed {
    background: linear-gradient(
      to right,
      rgba(113, 136, 255, 0.97),
      rgba(79, 68, 253, 0.97)
    );
    width: 100%;
    height: 0.88rem;
    line-height: 0.88rem;
    text-align: center;
    color: #fff;
    font-size: 0.32rem;
    position: fixed;
    bottom: 0px;
    .money_icon {
      background: url('/images/mobile/@2x/purChase/money_icon.png');
      width: 0.39rem;
      height: 0.39rem;
      background-size: 100%;
      margin-top: 0.26rem;
      margin-right: 0.2rem;
      // margin-left: 2.8rem;
    }
    .clearfix {
      transform: translate3d(-50%, -50%, 0);
      left: 50%;
      top: 50%;
      position: absolute;
    }
  }
  .purcharseListContent {
    padding-top: 0.3rem;
    padding-bottom: 0.37rem;
    background: #fff;
    .seek-title {
      background: #fff;
    }
    .purchase_btn_look {
      font-size: 0.26rem;
      color: #6a63ea;
      width: 1.37rem;
      height: 0.48rem;
      text-align: center;
      border-radius: 4px;
      text-align: center;
      border: 1px solid #6a63ea;
      line-height: 0.48rem;
      margin: 0.31rem auto;
    }
    .purchse_btn_more_title {
      font-size: 0.22rem;
      color: #6a63ea;
      text-align: center;
      a {
        color: #6a63ea;
      }
    }
  }
  .company {
    position: relative;
    height: 1.36rem;
    background: #f4f4f4;
    text-align: center;
    img {
      width: 1.15rem;
      height: 0.23rem;
      margin-top: 0.24rem;
    }
    p {
      font-size: 0.21rem;
      color: #aaa;
      margin: 0.13rem 0 0 0;
    }
    a {
      margin-top: 0.12rem;
      font-size: 0.18rem;
      color: #bbb;
    }
    .hr {
      width: 1.09rem;
      height: 0.02rem;
      background: #d9d9d9;
      position: absolute;
      left: 1.94rem;
      top: 0.35rem;
      &.right {
        right: 1.94rem;
        left: auto;
      }
    }
  }
}
</style>
