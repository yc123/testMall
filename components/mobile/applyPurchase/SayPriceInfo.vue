<template>
  <div class="mobile-modal" @touchmove="preventTouchMove($event)">
    <div class="mobile-modal-box">
      <div class="mobile-modal-header">{{purchaseDetail.agreed == 1 || agreed == 1 ? '已采纳' : '已报价'}}<i class="icon-guanbi iconfont" @click="cancel"></i></div>
      <div class="say-price-info" ref="mobileModalBox">
        <div>
          <div v-if="isBuyer">
            <div class="base-info">
              <div class="content-line">
                类目(产品名称)：<span>{{purchaseDetail.prodTitle || '-'}}</span>
              </div>
              <div class="content-line">
                型号：<span>{{purchaseDetail.cmpCode || '-'}}</span>
              </div>
              <div class="content-line">
                品牌：<span>{{purchaseDetail.inbrand || '-'}}</span>
              </div>
              <div class="content-line">
                规格：<span>{{purchaseDetail.spec || '-'}}</span>
              </div>
              <div class="content-line">
                采购数量(PCS)：<span>{{purchaseDetail.needquantity || '-'}}</span>
              </div>
              <!--<div class="content-line">
                币种：<span>{{purchaseDetail.custCurrency || '不限'}}</span>
              </div>
              <div class="content-line">
                生产日期：<span>{{purchaseDetail.produceDate || '-'}}</span>
              </div>-->
              <div class="content-line">
                截止日期：<span>{{purchaseDetail.endDate | date}}</span>
              </div>
            </div>
            <div class="base-info">
              <div class="content-line">
                买家：<span>{{purchaseDetail.inquiry && purchaseDetail.inquiry.enterprise ? purchaseDetail.inquiry.enterprise.enName : purchaseDetail.userName}}</span>
              </div>
              <div class="content-line">
                联系电话：<span>{{purchaseDetail.userTel || '-'}}</span>
              </div>
            </div>
            <div class="base-info say-info" v-for="(item, index) in purchaseDetail.qutations" @click="selectQutation(index)">
              <img v-if="agreed != 1 && (!item.agreed || item.agreed !== 1) && activeIndex == index" src="/images/mobile/@2x/applyPurchase/say-price-check.png" alt="">
              <img v-if="agreed != 1 && (!item.agreed || item.agreed !== 1) && activeIndex != index" src="/images/mobile/@2x/applyPurchase/say-price-default.png" alt="">
              <img v-if="item.agreed == 1" src="/images/mobile/@2x/applyPurchase/say-price-accept.png" alt="">
              <div class="content-line">
                {{item.vendName}}
              </div>
              <div class="content-line">
                报价人：<span v-if="item.user">{{item.user.userName}}</span>
                <span v-else>-</span>
              </div>
              <div class="content-line">
                电话：<span v-if="item.user">{{item.user.userTel}}</span>
                <span v-else>-</span>
              </div>
              <div class="content-line date">
                交期(天)：<span>{{item.leadtime}}</span>
              </div>
              <p>{{item.offerTime | date}}</p>
              <div class="price-level">
                <p>价格梯度：<span>(pcs)</span></p>
                <ul>
                  <li v-for="replie in item.replies">
                    <span>{{replie.lapQty ? replie.lapQty + '+' : '-'}}</span>
                    <span>{{replie.price ? (item.currency == 'USD' ? '$' : '¥') + replie.price : '-'}}</span>
                  </li>
                </ul>
              </div>
            </div>
            <a class="say-price-btn" v-if="purchaseDetail.agreed != 1" @click="acceptQutation">采纳报价</a>
          </div>
          <div v-if="!isBuyer">
          <div class="base-info">
            <div class="content-line">
              类目(产品名称)：<span>{{purchaseDetail.prodTitle || '-'}}</span>
            </div>
            <div class="content-line">
              型号：<span>{{purchaseDetail.cmpCode || '-'}}</span>
            </div>
            <div class="content-line">
              品牌：<span>{{purchaseDetail.inbrand || '-'}}</span>
            </div>
            <div class="content-line">
              规格：<span>{{purchaseDetail.spec || '-'}}</span>
            </div>
            <div class="content-line">
              采购数量(PCS)：<span>{{purchaseDetail.needquantity || '-'}}</span>
            </div>
            <!--<div class="content-line">
              币种：<span>{{purchaseDetail.custCurrency || '不限'}}</span>
            </div>
            <div class="content-line">
              生产日期：<span>{{purchaseDetail.produceDate || '-'}}</span>
            </div>-->
            <div class="content-line">
              截止日期：<span>{{purchaseDetail.endDate | date}}</span>
            </div>
            <div class="content-line">
              买家：<span>{{purchaseDetail.inquiry && purchaseDetail.inquiry.enterprise ? purchaseDetail.inquiry.enterprise.enName : purchaseDetail.userName}}</span>
            </div>
            <div class="content-line">
              联系电话：<span>{{purchaseDetail.userTel || '-'}}</span>
            </div>
          </div>
          <div class="base-info">
            <div class="content-line">
              报价人：<span v-if="purchaseDetail.user">{{purchaseDetail.user.userName}}</span>
              <span v-else>-</span>
            </div>
            <div class="content-line">
              联系电话：<span v-if="purchaseDetail.user">{{purchaseDetail.user.userTel || '-'}}</span>
              <span v-else>-</span>
            </div>
          </div>
          <div class="base-info say-info">
            <div class="content-line date">
              交期(天)：<span>{{purchaseDetail.leadtime}}</span>
            </div>
            <p>{{purchaseDetail.offerTime | date}}</p>
            <div class="price-level vendor">
              <p>价格梯度：<span>(pcs)</span></p>
              <ul>
                <li v-for="replie in purchaseDetail.replies">
                  <span>{{replie.lapQty ? replie.lapQty + '+' : '-'}}</span>
                  <span>{{replie.price ? (purchaseDetail.currency == 'USD' ? '$' : '¥') + replie.price : '-'}}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        </div>
        <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
      </div>
    </div>
  </div>
</template>
<script>
  import {RemindBox} from '~components/mobile/common'
  export default {
    data () {
      return {
        activeIndex: -1,
        remindText: '',
        timeoutCount: 0
      }
    },
    components: {
      RemindBox
    },
    props: ['agreed', 'userType'],
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
      userNameFilter (str) {
        return str ? str.substring(0, 1) + '**' : '-'
      }
    },
    computed: {
      purchaseDetail () {
        return this.isBuyer ? this.$store.state.applyPurchase.purchaseManList.buyerInquiryDetail.data : this.$store.state.applyPurchase.purchaseManList.vendorInquiryDetail.data
      },
      user () {
        return this.$store.state.option.user
      },
      isBuyer () {
        return this.$route.query.type === 'buyer' || this.userType === 'buyer'
      }
    },
    methods: {
      cancel: function () {
        this.$emit('cancelSayPriceInfoAction', false)
      },
      selectQutation: function (index) {
        this.activeIndex = this.activeIndex === index ? -1 : index
      },
      acceptQutation: function () {
        if (this.activeIndex > -1) {
          let obj = this.purchaseDetail.qutations[this.activeIndex]
          this.$http.post('/inquiry/buyer/decide?id=' + obj.id + '&status=1')
            .then(response => {
//              this.$message.success('采纳成功')
//              this.onRemind('采纳成功')
              this.$emit('cancelSayPriceInfoAction', true)
//              this.$route.query.type === 'saler' ? this.$store.dispatch('applyPurchase/loadVendorInquiryDetail', {id: this.$route.params.id}) : this.$store.dispatch('applyPurchase/loadBuyerInquiryDetail', {id: this.$route.params.id})
            }, err => {
              console.log(err)
//              this.$message.success('系统错误')
              this.onRemind('系统错误')
            })
        } else {
//          this.$message.success('请选择报价信息')
          this.onRemind('请选择报价信息')
        }
      },
      onRemind: function (str) {
        this.remindText = str
        this.timeoutCount ++
      }
    },
    mounted() {
      this.$nextTick(() => {
        this._initscroll()
      })
    }
  }
</script>
<style lang="scss" scoped>
  .mobile-modal {
    .mobile-modal-box {
      top: 10%;
      left: 3%;
      right: 3%;
      width: 7rem;
      bottom: 10%;
      margin: 0 auto;
      .say-price-info {
        background: #f3f3f3;
        padding: .18rem 0 0 0;
        width: 100%;
        overflow-y: auto;
        max-height: 90%;
        .base-info {
          &:last-child {
            margin-bottom: 0;
          }
          &.say-info {
            /*height: 4.54rem;*/
            position: relative;
            > img {
              position: absolute;
              right: 0;
              top: 0;
              width: 1rem;
              height: 1rem;
            }
            .content-line {
              width: 4.55rem;
              span {
                color: #333;
              }
              &.date {
                span {
                  color: #ef5042;
                }
              }
            }
            > p {
              font-size: .24rem;
              color: #999;
            }
            .price-level {
              font-size: .26rem;
              /*position: absolute;*/
              /*top: 1.3rem;*/
              /*right: .3rem;*/
              position: relative;
              bottom: .3rem;
              width: 4.4rem;
              text-align: center;
              margin-left: 2rem;
              p {
                margin-bottom: .1rem;
                span {
                  color: #666;
                }
              }
              ul {
                li {
                  height: .52rem;
                  span {
                    height: .52rem;
                    line-height: .52rem;
                    padding-left: .22rem;
                    text-align: left;
                    display: inline-block;
                    border-top: .02rem solid #7e7e7e;
                    border-left: .02rem solid #7e7e7e;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 50%;
                    &:last-child {
                      border-right: .02rem solid #7e7e7e;
                    }
                  }
                  &:last-child {
                    border-bottom: .02rem solid #7e7e7e;
                  }
                }
              }
              &.vendor {
                margin: .15rem auto 0;
              }
            }
          }
        }
        .say-price-btn {
          margin: .37rem auto .7rem;
        }
      }
    }
  }
</style>
