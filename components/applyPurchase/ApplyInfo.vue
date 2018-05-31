<template>
  <div class="apply-info">
    <div class="apply-info-title">
      <p>最新求购信息</p>
      <span>海量求购，一网打尽</span>
      <div>
        <input type="text" class="form-control" v-model="keyWord" @keyup.13="searchList" :placeholder="user.logged ? '型号/品牌/类目/规格/公司' : '型号/品牌/类目/规格'" />
        <span @click="searchList">查询</span>
      </div>
    </div>
    <div class="apply-info-list">
      <p class="list-title">
        <span class="list-title-item">买家/发布时间
          <!--<a href="javascript:void(0)" @click="sortListByParam('releaseDate')">
            <i class=" fa fa-long-arrow-up" :class="{active: sorting.releaseDate == 'ASC'}"></i>
            <i class=" fa fa-long-arrow-down" :class="{active: sorting.releaseDate == 'DESC'}"></i>
          </a>-->
        </span>
        <span class="list-title-item">类目/品牌</span>
        <span class="list-title-item">型号/规格</span>
        <span class="list-title-item">采购数量(PCS)</span>
        <span class="list-title-item">已报价
          <!--<a href="javascript:void(0)" @click="sortListByParam('offerAmount')">
            <i class=" fa fa-long-arrow-up" :class="{active: sorting.offerAmount == 'ASC'}"></i>
            <i class=" fa fa-long-arrow-down" :class="{active: sorting.offerAmount == 'DESC'}"></i>
          </a>-->
        </span>
        <span class="list-title-item">截止时间
          <!--<a href="javascript:void(0)" @click="sortListByParam('deadline')">
            <i class=" fa fa-long-arrow-up" :class="{active: sorting.deadline == 'ASC'}"></i>
            <i class=" fa fa-long-arrow-down" :class="{active: sorting.deadline == 'DESC'}"></i>
          </a>-->
        </span>
      </p>
      <ul v-if="purchaseManList.content && purchaseManList.content.length">
        <li v-for="(purchaseMan, index) in purchaseManList.content" :class="{'active': purchaseMan.active}" :key="index" ref="purchaseManList">
          <div class="il-item il-left">
            <div class="item" v-if="purchaseMan.inquiry.enterprise && purchaseMan.inquiry.enterprise.enName" :title="user.logged ? purchaseMan.inquiry.enterprise.enName : null">{{[purchaseMan.inquiry.enterprise.enName, user] | enterpriseFilter}}</div>
            <div class="item" v-else :title="user.logged ? purchaseMan.userName : null">{{[purchaseMan.userName, user] | userNameFilter}}</div>
            <div>{{purchaseMan.date| date}}</div>
          </div>
          <div class="il-item il-center">
            <div class="il-box-large il-box">
              <div :title="purchaseMan.prodTitle | nullFilter" class="fl item size-middle">
                <span>类目(产品名称)</span>
                <div class="content">{{(purchaseMan.prodTitle || '-') | nullFilter}}</div>
              </div>
              <div :title="purchaseMan.cmpCode" class="fl item">
                <span>型号</span>
                <div class="content">{{purchaseMan.cmpCode || '-'}}</div>
              </div>
              <div :title="purchaseMan.inbrand" class="fl item bottom size-middle">
                <span>品牌</span>
                <div class="content">{{purchaseMan.inbrand || '-'}}</div>
              </div>
              <div :title="purchaseMan.spec" class="fl item bottom">
                <span>规格</span>
                <div class="content">{{purchaseMan.spec || '-'}}</div>
              </div>
            </div>
            <div class="il-box-small il-box">
              <!--<div :title="purchaseMan.encapsulation" class="item">
                <span>封装：</span>{{purchaseMan.encapsulation || '-'}}
              </div>
              <div :title="purchaseMan.produceDate" class="item">
                <span>生产日期：</span>{{purchaseMan.produceDate || '-'}}
              </div>-->
              <div :title="purchaseMan.needquantity" class="item">
                {{purchaseMan.needquantity || '-'}}
              </div>
              <!--<div :title="purchaseMan.unitPrice ? (purchaseMan.currency == 'RMB' ? '￥' : '$') + purchaseMan.unitPrice : '-'" class="item">
                <span>单价预算：</span>{{purchaseMan.unitPrice ? (purchaseMan.currency == 'RMB' ? '￥' : '$') + purchaseMan.unitPrice : '-'}}
              </div>-->
            </div>
          </div>
          <div class="il-item number-content"><img src="/images/applyPurchase/hot-fire.png" alt="" v-if="purchaseMan.offerAmount > 10">
            <span :style="purchaseMan.offerAmount > 10 ? 'color: #ff9a00': ''">{{purchaseMan.offerAmount || 0}}</span>&nbsp;条</div>
          <div class="il-item il-right">
            <div class="date-content">
              <div v-if="purchaseMan.remainingTime > 0">
                <span>剩余&nbsp;</span>
                <span v-if="getDay(purchaseMan.remainingTime) > 0" v-text="getDay(purchaseMan.remainingTime)"></span>
                <i v-if="getDay(purchaseMan.remainingTime) > 0">&nbsp;天&nbsp;</i>
                <span v-if="getDay(purchaseMan.remainingTime) <= 0" v-text="getHours(purchaseMan.remainingTime)"></span>
                <i v-if="getDay(purchaseMan.remainingTime) <= 0">&nbsp;小时</i>
              </div>
              <span v-if="!purchaseMan.remainingTime || purchaseMan.remainingTime <= 0">已截止</span>
            </div>
            <div class="btn-content">
              <!--<a @click="setLinkBoxIndex(index)">联系买家</a>-->
              <!--判断该求购是自己的-->
              <div class="is-say-price" v-if="purchaseMan.remainingTime > 0 && purchaseMan.quoted == 1">已报价 <img src="/images/applyPurchase/green-check.png" alt=""></div>
              <div v-else>
                <a title="该求购已截止" v-if="!purchaseMan.remainingTime || purchaseMan.remainingTime <= 0" style="background: #cccbcb;" @click="sayPriceStop">我要报价</a>
                <a title="此为贵公司的求购" v-if="purchaseMan.remainingTime > 0 && (!purchaseMan.quoted || purchaseMan.quoted != 1) && (user.logged && ((purchaseMan.inquiry.enterprise && user.data.enterprise && (purchaseMan.inquiry.enterprise.uu === user.data.enterprise.uu)) || (!user.data.enterprise.uu && purchaseMan.userUU == user.data.userUU  && !purchaseMan.inquiry.enterprise)))" style="background: #cccbcb;" @click="sayPriceSeft">我要报价</a>
                <a v-if="purchaseMan.remainingTime > 0 && (!purchaseMan.quoted || purchaseMan.quoted != 1) && !(user.logged && ((purchaseMan.inquiry.enterprise && user.data.enterprise && (purchaseMan.inquiry.enterprise.uu === user.data.enterprise.uu)) || (!user.data.enterprise.uu && purchaseMan.userUU == user.data.userUU  && !purchaseMan.inquiry.enterprise)))" @click="sayPrice(purchaseMan, index)">我要报价</a>
              </div>
            </div>
            <div class="sharecode">
              <div class="sharecodeR"></div>
              <div class="sharecodeL" @mouseover="setShowShare(!showShare, index, purchaseMan.id)">
                <div class="sharecodeT">求<br/>购<br/>分<br/>享</div>
                <div class="sharecodeBtn" @mouseout="hideShowShare(!showShare, index, purchaseMan.id)">
                  <img src="/images/mobile/@2x/purChase/code.png" />
                </div>
              </div>

            </div>
            <div class="sharescancodekuang">
              <div class="sharescancode icon-style" ref="sharescancode" @mouseover="showShowShare(!showShare, index, purchaseMan.id)" @mouseout="hideShowShare(!showShare, index, purchaseMan.id)">
                <div class="share">
                  <div>
                    <div class="title">求购分享</div>
                    <canvas :class="'qrccode-canvas_'+index" width="98" height="98"></canvas>
                    <input :value="url" readonly>
                    <span :class="'copyLink_'+index" :data-clipboard-text="url">复制链接</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div class="empty" v-else>
        <img src="/images/all/empty-cart.png">
        <span>暂无搜索结果</span>
      </div>
    </div>

    <say-price :current="currentSayPriceIndex" :purchase="purchaseManList" @cancelSayPriceAction="cancelSayPrice" @resetListAction="resetList" @sayPriceIndexAction="setIndex(index)"></say-price>
    <page :total="totalCount" :page-size="pageSize" :current="nowPage" v-on:childEvent="listenPage"></page>
    <div class="com-del-box link-saler-box" v-if="linkBoxIndex > -1">
      <div class="title">
        <i @click="setLinkBoxIndex(-1)"></i>
      </div>
      <div class="content">
        <p>
          <i class="fa fa-exclamation-circle"></i>抱歉，暂时无法与买家在线沟通！</p>
        <p>买家联系电话：
          <span v-text="purchaseManList.content[linkBoxIndex].userTel"></span>
        </p>
        <div>
          <a @click="setLinkBoxIndex(-1)">我知道了</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Page from '~components/common/page/pageComponent.vue'
import SayPrice from './SayPrice.vue'
import { checkNullStr } from '~utils/baseUtils'
import Clipboard from 'clipboard'
let QRCode = require('qrcode')
export default {
  data() {
    return {
      pageSize: 10,
      nowPage: 1,
      keyWord: '',
      sorting: {},
      currentSayPriceIndex: -1,
      linkBoxIndex: -1,
      showShare: false,
      url: '',
      Timer: {}
    }
  },
  filters: {
    date: function(date) {
      const d = new Date(Number(date))
      const year = d.getFullYear()
      const monthTemp = d.getMonth() + 1
      const month = monthTemp < 10 ? '0' + monthTemp : '' + monthTemp
      const hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours()
      const minutes =
        d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes() + ' '
      const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate() + ' '
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes
    },
    phone: function(str) {
      return str ? str.substring(0, 3) + '****' + str.substring(7, 11) : '-'
    },
    enterpriseFilter([str, user]) {
      if (!user.logged) {
        return str
          ? str.length > 4
            ? str.substring(0, 2) +
              '**' +
              str.substring(str.length - 2, str.length)
            : str
          : '-'
      } else {
        return str || '-'
      }
    },
    userNameFilter([str, user]) {
      if (!user.logged) {
        return str ? str.substring(0, 1) + '**' : '-'
      } else {
        return str || '-'
      }
    },
    nullFilter(str) {
      return checkNullStr(str) ? str : '-'
    }
  },
  components: { Page, SayPrice },
  computed: {
    storeInfo() {
      return this.$store.state.shop.storeInfo.store.data
    },
    purchaseManList() {
      return JSON.parse(JSON.stringify(this.$store.state.applyPurchase.purchaseManList.purchaseManList.data))
    },
    totalCount() {
      return this.purchaseManList.totalElements
    },
    user() {
      return this.$store.state.option.user
    }
  },
  methods: {
    copyurl(index) {
      let _this = this
      _this.clipboard = new Clipboard('.copyLink_' + index)
      _this.clipboard.on('success', e => {
        // _this.clipboard.destroy()
        e.clearSelection()
        _this.$message.success('已复制到剪切板')
      })
      _this.clipboard.on('error', e => {
        _this.$message.error('浏览器不支持自动复制，请手动复制')
        _this.clipboard.destroy()
      })
    },
    loadQRcode: function(id, index) {
      let canvas = document.getElementsByClassName('qrccode-canvas_' + index)[0]
      var opts = {
        width: '122'
      }
      this.url =
        window.location.protocol +
        '//' +
        window.location.host +
        '/mobile/share/purChase/' +
        id
      QRCode.toCanvas(canvas, this.url, opts, error => {
        if (error) {
          console.log(error)
        } else {
          console.log('QRcode success')
        }
      })
      this.copyurl(index)
    },
    setShowShare: function(flag, index, id) {
      clearTimeout(this.Timer[index] ? this.Timer[index] : '')
      this.$refs.sharescancode[index].style.display = 'block'
      this.$refs.purchaseManList[index].onmouseout = () => {
        if (this.Timer[index] !== 'undefined') {
          clearTimeout(this.Timer[index])
        }
        this.Timer[index] = setTimeout(() => {
          this.$refs.sharescancode[index].style.display = 'none'
        }, 300)
      }

      this.loadQRcode(id, index)
      this.showShare = flag
    },
    showShowShare(flag, index, id) {
      clearTimeout(this.Timer[index] ? this.Timer[index] : '')
    },
    hideShowShare(flag, index, id) {
      clearTimeout(this.Timer[index] ? this.Timer[index] : '')
      this.Timer[index] = setTimeout(() => {
        this.$refs.sharescancode[index].style.display = 'none'
      }, 300)
    },
    setIndex: function(index) {
      this.currentSayPriceIndex = index
    },
    getDay: function(timeStamp) {
      return Math.floor(timeStamp / (1000 * 60 * 60 * 24))
    },
    getHours: function(timeStamp) {
      return Math.floor((timeStamp / (1000 * 60 * 60)) % 24)
    },
    listenPage: function(page) {
      this.nowPage = page
      this.resetList()
    },
    sayPrice: function(purchaseMan, index) {
      //        let _this = this
      //        for (let i = 0; i < this.purchaseManList.content.length; i++) {
      //          _this.purchaseManList.content[i].active = false
      //        }
      if (this.user.logged) {
        if (this.user.data.enterprise.uu) {
          if (
            this.user.data.enterprise.isVendor &&
            this.user.data.enterprise.isVendor !== '1690'
          ) {
            //              this.resetSayPrice()
            purchaseMan.active = true
            this.currentSayPriceIndex = index
          } else {
            this.$message.error('抱歉，您需开通卖家功能才可报价')
          }
        } else {
          this.$message.error('个人账户暂不可报价')
        }
      } else {
        this.$router.push('/auth/login?returnUrl=' + window.location.href)
      }
    },
    cancelSayPrice: function() {
      this.purchaseManList.content[this.currentSayPriceIndex].active = false
      this.currentSayPriceIndex = -1
    },
    resetList: function() {
      this.currentSayPriceIndex = -1
      this.$store.dispatch('applyPurchase/loadPurchaseManList', {
        pageNumber: this.nowPage,
        pageSize: this.pageSize,
        keyword: this.keyWord,
        isLogin: this.user.logged ? 1 : 0,
        sorting:
          !this.sorting || JSON.stringify(this.sorting) === '{}'
            ? { releaseDate: 'DESC' }
            : this.sorting,
        enUU: this.user.data.enterprise ? this.user.data.enterprise.uu : null
      })
    },
    searchList: function() {
      this.nowPage = 1
      this.resetList()
    },
    sayPriceStop: function() {
      this.$message.error('该求购已截止')
    },
    sayPriceSeft: function() {
      this.$message.error('此为贵公司的求购')
    },
    sortListByParam: function(param) {
      if (this.sorting[param]) {
        if (this.sorting[param] === 'ASC') {
          this.$set(this.sorting, param, 'DESC')
        } else {
          this.$delete(this.sorting, param)
        }
      } else {
        this.sorting = {}
        this.$set(this.sorting, param, 'ASC')
      }
      this.nowPage = 1
      this.resetList()
    },
    setLinkBoxIndex: function(index) {
      if (!this.user.logged) {
        this.$router.push('/auth/login?returnUrl=' + window.location.href)
      } else {
        this.linkBoxIndex = index
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .apply-info {
    width: 1190px;
    margin: 0 auto;
    .apply-info-title {
      border-bottom: 1px solid #3975f4;
      > p {
        display: inline-block;
        width: 156px;
        height: 33px;
        line-height: 33px;
        color: #fff;
        background: #3975f4;
        font-size: 18px;
        text-align: center;
        border: {
          top-left-radius: 3px;
          top-right-radius: 3px;
        }
        margin: 0;
      }
      > span {
        color: #999;
        margin-left: 16px;
      }
      > div {
        float: right;
        height: 32px;
        line-height: 32px;
        > input {
          width: 241px;
          height: 32px;
          line-height: 32px;
          font-size: 13px;
          border: {
            top-right-radius: 0;
            bottom-right-radius: 0;
          }
        }
        > span {
          display: inline-block;
          width: 69px;
          color: #fff;
          background: #3975f4;
          text-align: center;
          margin: 0 6px 0 -1px;
          /*vertical-align: middle;*/
          border: {
            top-right-radius: 3px;
            bottom-right-radius: 3px;
          }
          cursor: pointer;
        }
        > a {
          background: #ffa200;
          color: #fff;
          width: 79px;
          border-radius: 3px;
          text-align: center;
          display: inline-block;
        }
        > div {
          float: right;
          height: 33px;
          line-height: 33px;
          > input {
            width: 241px;
            height: 33px;
            line-height: 33px;
            font-size: 13px;
            border: {
              top-right-radius: 0;
              bottom-right-radius: 0;
            }
          }
          > span {
            display: inline-block;
            width: 69px;
            color: #fff;
            background: #3975f4;
            text-align: center;
            margin: 0 6px 0 -1px;
            height: 33px;
            /*vertical-align: middle;*/
            border: {
              top-right-radius: 3px;
              bottom-right-radius: 3px;
            }
            cursor: pointer;
          }
          &:nth-child(2) {
            width: 106px;
          }
          &:nth-child(3) {
            width: 200px;
          }
          &:nth-child(4) {
            width: 174px;
          }
          &:nth-child(5) {
            width: 152px;
          }
          &:nth-child(6) {
            width: 158px;
          }
          &:nth-child(7) {
            width: 180px;
            margin-left: 30px;
          }
        }
      }

      .empty {
        text-align: center;
        height: 200px;
        line-height: 200px;
        border: 1px solid #e8e8e8;
        margin-bottom: 10px;
        span {
          color: #999;
          margin-left: 10px;
        }
      }
    }
    .apply-info-list {
      .list-title {
        background: #e2ebff;
        height: 40px;
        line-height: 40px;
        margin: 9px 0 0 0;
        .list-title-item {
          display: inline-block;
          text-align: center;
          .fa {
            color: #333;
            &.active {
              color: #5078cb;
            }
          }
          &:nth-child(1) {
            margin-left: 22px;
          }
          &:nth-child(2) {
            margin-left: 150px;
          }
          &:nth-child(3) {
            margin-left: 220px;
          }
          &:nth-child(4) {
            margin-left: 175px;
          }
          &:nth-child(5) {
            margin-left: 55px;
          }
          &:nth-child(6) {
            margin-left: 100px;
          }
        }
      }
      > ul {
        margin-bottom: 29px;
        > li {
          position: relative;
          border: 1px solid #ededed;
          &.active {
            border: 1px solid #4290f7;
            box-shadow: 2px 4px 5px 0 rgb(205, 221, 252);
          }
          &:hover {
            border: 1px solid #4290f7;
            box-shadow: 2px 4px 5px 0 rgb(205, 221, 252);
            .il-item.il-right .sharecode {
              display: block;
            }
          }
          .il-item {
            height: 120px;
            display: inline-block;
            text-align: center;
            color: #3c3c3c;
            padding-top: 16px;
            vertical-align: middle;
            .item {
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              span {
                color: #999;
              }
            }
            &.il-left {
              width: 165px;
              padding: 16px 5px 0;
              div {
                display: block;
                &:last-child {
                  margin-top: 37px;
                  color: #666;
                }
              }
            }
            &.il-center {
              text-align: left;
              width: 740px;
              .il-box {
                display: inline-block;
                float: left;
                span {
                  color: #999;
                }
              }
              .il-box-large {
                width: 610px;
                margin-left:15px;
                .fl {
                  width: 320px;
                  line-height: 19px;
                  word-break: break-all;
                  white-space: unset;
                  &.bottom {
                    margin-top: 14px;
                  }
                  .content {
                    display: inline-block;
                    width: 213px;
                    overflow: hidden;
                    vertical-align: middle;
                    height: 38px;
                    margin-left:10px;
                  }
                  span {
                    float: left;
                    display:inline-block;
                    width:94px;
                    text-align:right;
                    color:#3c7cf5;
                  }
                  &.size-middle {
                    width: 260px;
                    margin-right: 10px;
                    .content {
                      width: 86px;
                    }
                  }
                }
              }
              .il-box-small {
                width: 100px;
                text-align: center;
                line-height: 90px;
                margin-left:-15px;
                .item {
                  color: #f71026;
                }
              }
            }
            &.il-right {
              width: 100px;
              .date-content {
                margin-top: 14px;
                margin-bottom: 17px;
                span {
                  &:first-child {
                    font-size: 12px;
                    color: #666;
                  }
                  color: #f71026;
                }
                i {
                  font-style: normal;
                }
              }
              .btn-content {
                > div a {
                  display: inline-block;
                  width: 71px;
                  height: 28px;
                  line-height: 28px;
                  color: #fff;
                  background: #3c7cf5;
                  border-radius: 3px;
                  cursor: pointer;
                  /*  &:first-child {
                        background: #ffa200;
                        float: left;
                        margin-top: 19px;
                      }*/
                }
                .is-say-price {
                  display: inline-block;
                  color: #39ae05;
                  margin-left: 11px;
                  img {
                    margin-bottom: 2px;
                  }
                }
              }
              .sharescancodekuang {
                // width: 100%;
                // height: 220px;
                // position: absolute;
                // top: 115px;
                // left: 0px;
                // background: rgba(0, 0, 0, 0);
              }
              .sharescancode {
                position: absolute;
                background: url('/images/mobile/@2x/purChase/codebg.png');
                width: 248px;
                height: 207px;
                top: 115px;
                right: 0;
                z-index: 98;
                display: none;
                line-height: 14px;
                canvas {
                  display: block;
                  text-align: center;
                  margin: 0 auto;
                  line-height: 14px;
                }
                .title {
                  color: #3c7cf5;
                  font-size: 16px;
                  margin: 21px auto;
                  margin-bottom: 0px;
                  text-align: center;
                  line-height: 14px;
                }
                div input {
                  display: inline-block;
                  width: 140px;
                  overflow: hidden;
                  height: 35px;
                  vertical-align: middle;
                  margin-left: 14px;
                  line-height: 35px;
                }
                div span {
                  display: inline-block;
                  color: #fff;
                  background: #4290f7;
                  height: 36px;
                  line-height: 36px;
                  width: 70px;
                  font-style: normal;
                  vertical-align: middle;
                  cursor: pointer;
                }
              }
              .sharecode {
                position: absolute;
                right: 0;
                top: 0;
                height: 120px;
                z-index: 99;
                display: none;
                .sharecodeR {
                  width: 4px;
                  height: 120px;
                  background: #4290f7;
                  float: right;
                }
                .sharecodeL {
                  float: right;
                  margin-right: 1px;
                }
                .sharecodeT {
                  padding-top: 5px;
                  margin-top: 10px;
                  width: 28px;
                  height: 68px;
                  background-color: #3c7cf5;
                  border-radius: 2px;
                  color: #ffffff;
                  font-size: 14px;
                  word-wrap: break-word;
                  white-space: pre-wrap;
                  line-height: 14px;
                }
                .sharecodeBtn {
                  width: 28px;
                  height: 28px;
                  margin-top: 4px;
                  &::after {
                    content: ' ';
                    clear: both;
                    display: inline;
                    visibility: hidden;
                  }
                  img {
                    float: left;
                  }
                }
              }
            }
            i {
              color: #e41515;
              position: relative;
              top: 0px;
              right: 3px;
            }
          }
          .number-content {
            margin-left: 10px;
            line-height: 120px;
            padding-top: 0;
            width: 100px;
            margin-right: 34px;
            span {
              color: #5392f9;
              &.active {
                color: #ff9a00;
              }
            }
            > img {
              margin-bottom: 5px;
              margin-right: 2px;
            }
          }
          /*.say-price {*/
          /*display: block;*/
          /*}*/
        }
      }
    }
    .page-wrap {
      text-align: right;
      float: none;
    }

    .link-saler-box {
      width: 289px;
      height: auto;
      min-height: auto;
      border-radius: 2px;
      .title {
        background-color: #4290f7;
        height: 22px;
        line-height: 22px;
        margin-bottom: 20px;
      }
      .content {
        p {
          line-height: 20px;
          padding-top: 0;
          i {
            color: #4290f7;
            margin-right: 4px;
          }
          span {
            color: #f62d37;
          }
        }
        div {
          a {
            width: 78px;
            background: #4290f7;
            margin: 18px 0 13px 0;
            border-radius: 2px;
          }
        }
      }
    }
  }
  .empty{
    text-align: center;
    height: 200px;
    line-height: 200px;
    border: 1px solid #e8e8e8;
    margin-bottom: 10px;
    span {
      color: #999;
      margin-left: 10px;
    }
  }
  .page-wrap {
    text-align: right;
    float: none;
  }
</style>
