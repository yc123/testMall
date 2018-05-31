<template>
  <div>
    <ul class="seek-list">
      <li v-for="(item, index) in purchaseManListData">
        <p>
          <span v-if="item.inquiry && (item.inquiry.enName || (item.inquiry.enterprise && item.inquiry.enterprise.enName))">{{[item.inquiry.enName || item.inquiry.enterprise.enName, user.logged] | enterpriseFilter}}</span>
          <span v-else>{{[item.userName, user.logged] | userNameFilter}}</span>
        </p>
        <div>
          <div class="fl">
            <div>
              类目(产品名称)：
              <span>{{item.title || item.prodTitle || '-'}}</span>
            </div>
            <div>
              型号：
              <span>{{item.cmpCode || '-'}}</span>
            </div>
            <div>
              品牌：
              <span>{{item.inbrand || '-'}}</span>
            </div>
            <div>
              规格：
              <span>{{item.spec || '-'}}</span>
            </div>
            <div>
              采购数量(PCS)：
              <span>{{item.needQty || item.needquantity || '-'}}</span>
            </div>
            <div>
              截止日期：
              <span class="date">{{item.endDate | date}}</span>
            </div>
          </div>
          <div class="fr" :class="{'no-btn': !isSelfSeek(item) && !canSayPrice(item) && !canSeeInfo(item)}">
            <p v-if="item.remainingTime > 0">剩余&nbsp;:
              <span v-if="getDay(item.remainingTime) > 0" v-text="getDay(item.remainingTime)"></span>
              <i v-if="getDay(item.remainingTime) > 0">&nbsp;天&nbsp;</i>
              <span v-if="getDay(item.remainingTime) <= 0" v-text="getHours(item.remainingTime)"></span>
              <i v-if="getDay(item.remainingTime) <= 0">&nbsp;小时</i>
            </p>
            <p class="over-deadline" v-else>已截止</p>
            <!--<a v-if="!userType && item.quoted == 1">已报价</a>-->
            <a v-if="isSelfSeek(item)" class="self-publish" @click="onRemind('此为贵公司的求购')">我要报价</a>
            <a v-if="canSayPrice(item)" @click="goSayPrice(item.itemId || item.id, index)">我要报价</a>
            <!--<a v-if="item.newId" class="self-publish" @click="onRemind('您已报价')">我要报价</a>-->
            <a v-if="canSeeInfo(item)" @click="goSayPriceInfo(item.newId || item.quteId || item.id, item.agreed, index)">查看报价</a>
          </div>
        </div>
      </li>
    </ul>
    <empty-status v-if="!purchaseManListData || purchaseManListData.length == 0 && !isDataChange" :type="isSearch ? 'search' : 'collect'" :text="isSearch ? `抱歉，暂无与“${keyword}”匹配的求购信息` : '抱歉，暂无求购信息'" :showLink="true"></empty-status>
    <login-box :url="url" @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox"></login-box>
    <say-price :showSayPriceBox="showSayPriceBox" @cancelSayPriceAction="onSayPriceCancel"></say-price>
    <say-price-info v-if="showSayPriceInfoBox" :agreed="agreed" @cancelSayPriceInfoAction="onSayPriceInfoCancel" :userType="userType"></say-price-info>
    <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
  </div>
</template>
<script>
import { LoginBox, RemindBox, EmptyStatus } from '~components/mobile/common'
import { SayPrice, SayPriceInfo } from '~components/mobile/applyPurchase'
export default {
  data() {
    return {
      showLoginBox: false,
      showSayPriceBox: false,
      showSayPriceInfoBox: false,
      activeIndex: -1,
      remindText: '',
      timeoutCount: 0,
      agreed: 0,
      purchaseManListData: [],
      url: ''
    }
  },
  components: {
    LoginBox,
    SayPrice,
    RemindBox,
    SayPriceInfo,
    EmptyStatus
  },
  props: ['userType', 'seekType', 'purchaseManList', 'isDataChange', 'isSearch', 'keyword'],
  filters: {
    date: function(date) {
      if (date) {
        const d = new Date(Number(date))
        const year = d.getFullYear()
        const monthTemp = d.getMonth() + 1
        const month = monthTemp < 10 ? '0' + monthTemp : '' + monthTemp
        const day =
          d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate() + ' '
        return year + '-' + month + '-' + day
      } else {
        return '-'
      }
    },
    enterpriseFilter([str, logged]) {
      if (logged) {
        return str
      } else {
        return str && str.length > 4
          ? str.substring(0, 2) +
              '**' +
              str.substring(str.length - 2, str.length)
          : str || '-'
      }
    },
    userNameFilter([str, logged]) {
      if (logged) {
        return str
      } else {
        return str ? str.substring(0, 1) + '**' : '-'
      }
    }
  },
  watch: {
    'purchaseManList': {
      handler () {
        this.purchaseManListData = JSON.parse(JSON.stringify(this.purchaseManList))
      },
      immediate: true
    }
  },
  computed: {
    user() {
      return this.$store.state.option.user
    }
  },
  methods: {
    getDay: function(timeStamp) {
      return Math.floor(timeStamp / (1000 * 60 * 60 * 24))
    },
    getHours: function(timeStamp) {
      return Math.floor((timeStamp / (1000 * 60 * 60)) % 24)
    },
    goSayPrice: function(id, index) {
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
            this.activeIndex = index
          } else {
            this.onRemind('抱歉，您需开通卖家功能才可报价')
          }
        } else {
          this.onRemind('个人账户暂不可报价')
        }
      } else {
        this.url = this.$route.fullPath
        this.showLoginBox = true
      }
      return false
    },
    goSayPriceInfo: function(id, agreed, index) {
      if (this.userType === 'buyer') {
        this.$store.dispatch('applyPurchase/loadBuyerInquiryDetail', {
          id: id
        })
      } else {
        this.$store.dispatch('applyPurchase/loadVendorInquiryDetail', {
          id: id,
          enuu: this.user.data.enterprise.uu,
          useruu: this.user.data.userUU
        })
      }
      this.agreed = agreed
      this.showSayPriceInfoBox = true
      this.activeIndex = index
      //        '/mobile/applyPurchase/list/' + (userType ? (item.quteId || item.id) + '?type=' + userType : (item.quteId || item.id)) + (userType ? '&' : '?') + 'status=' + item.agreed
    },
    onSayPriceCancel: function(flag, quteId) {
      if (flag) {
        this.purchaseManListData[this.activeIndex].quoted = 1
        this.purchaseManListData[this.activeIndex].quteId = quteId
        this.onRemind('报价成功')
      }
      this.showSayPriceBox = false
    },
    onSayPriceInfoCancel: function(flag) {
      if (flag) {
        this.purchaseManListData[this.activeIndex].agreed = 1
        this.onRemind('采纳成功')
      }
      this.showSayPriceInfoBox = false
    },
    onRemind: function(str) {
      this.remindText = str
      this.timeoutCount++
    },
    isSelfSeek: function (item) {
      return !this.userType && item.remainingTime > 0 && (!item.quoted || item.quoted !== 1) && (this.user.logged && ((item.inquiry && item.inquiry.enterprise && this.user.data.enterprise && (item.inquiry.enterprise.uu === this.user.data.enterprise.uu)) || (!this.user.data.enterprise.uu && item.userUU === this.user.data.userUU && !item.inquiry.enterprise)))
    },
    canSayPrice: function (item) {
      return !item.newId && (!(this.userType === 'saler' && this.seekType && this.seekType !== 'wait') && (item.remainingTime > 0 && (!item.quoted || item.quoted !== 1) && !(this.user.logged && ((item.inquiry && item.inquiry.enterprise && this.user.data.enterprise && (item.inquiry.enterprise.uu === this.user.data.enterprise.uu)) || (!this.user.data.enterprise.uu && item.userUU === this.user.data.userUU)))))
    },
    canSeeInfo: function (item) {
      return ((!this.userType || this.userType === 'buyer') && (this.seekType && this.seekType !== 'wait')) || (this.userType === 'saler' && this.seekType && this.seekType !== 'wait') || item.quoted === 1 || item.newId
    }
  }
}
</script>
<style lang="scss" scoped>
  .seek-list {
    padding: .13rem .12rem 0;
    background: #f1f3f6;

    li {
      border: 1px solid #e0e0e4;
      height: 4.2rem;
      margin: auto;
      margin-bottom: .2rem;
      max-width: 7.3rem;
      background: #fff;
      > p {
        font-size: .28rem;
        color: #3a3a3a;
        font-weight: bold;
        /*background: #f8f7fa;*/
        height: .92rem;
        line-height: .92rem;

        span {
          display: block;
          width: 6.9rem;
          border-bottom: 1px solid #d3d3d3;
          margin: 0 auto;
        }

      }
      > div {
        font-size: .3rem;

        .fl {
          color: #666;
          width: 4.8rem;
          height: 2.62rem;
          margin: .27rem 0 .29rem .18rem;
          line-height: .46rem;
          border-right: 1px dashed #9f9f9f;

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
          padding: .9rem 0 0 0;

          &.no-btn {
            padding-top: 0;
            line-height: 3.18rem;
          }

          p {
            font-size: .28rem;
            text-align: center;

            &.over-deadline {
              text-align: center;
              padding-right: .2rem;
            }

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
            width: 1.7rem;
            height: .47rem;
            line-height: .47rem;
            text-align: center;
            font-size: .28rem;
            color: #fff;
            background: #008bf7;
            margin: .34rem auto 0;
            border-radius: .05rem;
            vertical-align: middle;

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
