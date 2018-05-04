<template>
  <div class="mobile-modal" v-if="showSayPriceBox">
    <div class="mobile-modal-box">
      <div class="mobile-modal-header">编辑报价<i class="icon-guanbi iconfont" @click="cancel"></i></div>
      <div class="say-price">
        <div class="base-info">
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
            采购数量：<span>{{purchaseDetail.needquantity || '-'}}</span>
          </div>
          <div class="content-line">
            币种：<span>{{purchaseDetail.currency || '不限'}}</span>
          </div>
          <div class="content-line">
            截止日期：<span>{{purchaseDetail.endDate | date}}</span>
          </div>
        </div>
        <div class="form-list">
          <div class="form-title">
            <span class="fl">价格梯度<span>(PCS)</span></span>
            <span class="fr">
          <!--<span v-text="sayPriceObj.currency" @click="setShowCurrencyList($event)"></span>-->
          <span v-if="!purchaseDetail.currency" v-text="sayPriceObj.currency" @click="setShowCurrencyList($event)"></span>
          <span v-if="purchaseDetail.currency" v-text="purchaseDetail.currency"></span>
          <img v-if="!purchaseDetail.currency && !showCurrencyList" src="/images/mobile/@2x/applyPurchase/currency-arrow-down.png" alt="">
          <img v-if="!purchaseDetail.currency && showCurrencyList" src="/images/mobile/@2x/applyPurchase/currency-arrow-up.png" alt="">
          <ul v-if="showCurrencyList">
            <li @click="setCurrency('RMB')">RMB</li>
            <li @click="setCurrency('USD')">USD</li>
          </ul>
        </span>
          </div>
          <div class="form-item" v-for="(reply, index) in sayPriceObj.replies">
            <input type="text" placeholder="梯度" class="fl" @blur="onReplyLapQtyBlur(index)" @input="onReplyLapQtyInput(index)" v-model="reply.lapQty">
            <input type="text" placeholder="单价" class="fr" @input="onReplyPriceInput(index)" @blur="onReplyPriceBlur(index)" v-model="reply.price">
            <i class="iconfont icon-minus" v-if="index > 0" @click="setReplies('sub', index)"></i>
            <i class="iconfont icon-add" v-if="index == 0 && sayPriceObj.replies.length < 5" @click="setReplies('add', index)"></i>
          </div>
          <div class="date">
            <span>交期(天)</span>
            <input type="text" placeholder="最大值" @input="onLeadtimeInput" @blur="onLeadtimeBlur" v-model="sayPriceObj.leadtime" class="fr">
          </div>
          <a class="say-price-btn" @click="commitSayPrice">确定</a>
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
        showCurrencyList: false,
        sayPriceObj: {
          currency: 'RMB',
          leadtime: '',
          replies: [
            {
              lapQty: '',
              price: ''
            }
          ]
        },
        validSayPrice: {
          leadtime: false,
          repliesPrice: false,
          repliesLapQty: false
        },
        remindText: '',
        timeoutCount: 0
      }
    },
    props: ['showSayPriceBox'],
    components: {
      RemindBox
    },
    watch: {
      showSayPriceBox: function (val, old) {
        if (val) {
          document.body.style.position = 'fixed'
          document.body.style.left = '0'
          document.body.style.right = '0'
        } else {
          document.body.style.position = 'relative'
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        document.addEventListener('click', this.checkCurrencySelect)
      })
    },
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
      }
    },
    computed: {
      purchaseDetail () {
        return this.$store.state.applyPurchase.purchaseManList.purchaseManDetail.data
      },
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      cancel: function () {
        this.$emit('cancelSayPriceAction', false)
      },
      checkCurrencySelect: function () {
        this.showCurrencyList = false
      },
      setShowCurrencyList: function (event) {
        event.stopPropagation()
        this.showCurrencyList = !this.showCurrencyList
      },
      setCurrency: function (type) {
        this.sayPriceObj.currency = type
        this.showCurrencyList = false
      },
      resetSayPrice: function () {
        this.sayPriceObj = {
          currency: 'RMB',
          leadtime: '',
          replies: [
            {
              lapQty: '',
              price: ''
            }
          ]
        }
      },
      setReplies: function (type, index) {
        if (type === 'add' && this.sayPriceObj.replies.length < 5) {
          this.sayPriceObj.replies.splice(this.sayPriceObj.replies.length, 0, {
            lapQty: '',
            price: ''
          })
        } else if (type === 'sub' && this.sayPriceObj.replies.length > 1) {
          this.sayPriceObj.replies.splice(index, 1)
        }
      },
      commitSayPrice: function () {
        if (this.checkValid()) {
          let purchaseMan = JSON.parse(JSON.stringify(this.purchaseDetail))
//          this.showLoading = true
          purchaseMan.leadtime = this.sayPriceObj.leadtime
          purchaseMan.replies = this.sayPriceObj.replies
          purchaseMan.vendUU = this.user.data.enterprise.uu
          purchaseMan.vendUserUU = this.user.data.userUU
          purchaseMan.qutoApp = 'MALL'
          if (!purchaseMan.currency) {
            purchaseMan.currency = this.sayPriceObj.currency
          }
          this.$http.post('/inquiry/sale/item/save', purchaseMan).then(response => {
            this.showLoading = false
            if (response.data.success === false) {
              this.onRemind('response.data.message')
            } else {
//              this.onRemind('报价成功')
              this.resetSayPrice()
              this.$emit('cancelSayPriceAction', true, JSON.parse(response.data).quteId)
            }
          }, error => {
            console.log(error)
            this.onRemind('请勿重复报价或报价自己的求购')
//            this.showLoading = false
          })
        } else {
          this.onRemind('请输入正确的报价信息')
        }
      },
      onLeadtimeInput: function () {
        this.sayPriceObj.leadtime = this.sayPriceObj.leadtime.replace(/[^\-?\d.]/g, '')
        if (this.sayPriceObj.leadtime.length > 3) {
          this.sayPriceObj.leadtime = this.sayPriceObj.leadtime.substring(0, 3)
        }
      },
      onLeadtimeBlur: function () {
        if (!this.sayPriceObj.leadtime || this.sayPriceObj.leadtime < 1 || this.sayPriceObj.leadtime >= 1000 || this.sayPriceObj.leadtime.toString().indexOf('.') !== -1) {
          this.validSayPrice.leadtime = false
          this.onRemind('交期请填写1-999之间的正整数')
        } else {
          this.validSayPrice.leadtime = true
        }
      },
      onReplyPriceInput: function (index) {
        this.sayPriceObj.replies[index].price = this.sayPriceObj.replies[index].price.replace(/[^\-?\d.]/g, '')
        let price = this.sayPriceObj.replies[index].price
        if (price >= 10000) {
          this.sayPriceObj.replies[index].price = price.substring(0, 4)
        } else if (price.indexOf('.') > -1) {
          let arr = price.split('.')
          if (arr[0].length > 4) {
            this.sayPriceObj.replies[index].price = Number(arr[0].substring(0, 4) + '.' + arr[1])
          } else if (arr[1].length > 6) {
            this.sayPriceObj.replies[index].price = Number(arr[0] + '.' + arr[1].substring(0, 6))
          }
        }
      },
      onReplyPriceBlur: function (index) {
        let price = this.sayPriceObj.replies[index].price
        if (!price) {
          this.sayPriceObj.replies[index].price = ''
          this.onRemind('价格不能为空')
          this.validSayPrice.repliesPrice = false
        } else if (price <= 0) {
          this.sayPriceObj.replies[index].price = ''
          this.onRemind('输入值必须为正整数')
          this.validSayPrice.repliesPrice = false
        } else {
          this.validSayPrice.repliesPrice = true
        }
      },
      onReplyLapQtyBlur: function (index) {
        let lapQty = Number(this.sayPriceObj.replies[index].lapQty)
        let limitDownObj = this.getLimitDownQty()
        if (!lapQty || lapQty < 1) {
          this.sayPriceObj.replies[index].lapQty = ''
          this.onRemind('输入值必须为正整数')
          this.validSayPrice.repliesLapQty = false
        } else if (limitDownObj.index !== index && limitDownObj.lapQty > lapQty) {
          this.onRemind('输入值必须大于#该梯度的下限#')
          this.sayPriceObj.replies[index].lapQty = ''
          this.validSayPrice.repliesLapQty = false
        } else if ((index - 1 >= 0 && this.sayPriceObj.replies[index - 1].lapQty && this.sayPriceObj.replies[index - 1].lapQty >= lapQty) || (index + 1 < this.sayPriceObj.replies.length && this.sayPriceObj.replies[index + 1].lapQty && this.sayPriceObj.replies[index + 1].lapQty <= lapQty)) {
          this.onRemind('输入值会导致梯度重叠，请重新修改')
          this.sayPriceObj.replies[index].lapQty = ''
          this.validSayPrice.repliesLapQty = false
        } else {
          this.validSayPrice.repliesLapQty = true
        }
      },
      onReplyLapQtyInput: function (index) {
        this.sayPriceObj.replies[index].lapQty = this.sayPriceObj.replies[index].lapQty.replace(/[^\-?\d.]/g, '')
        let lapQty = this.sayPriceObj.replies[index].lapQty
        if (lapQty.length > 9) {
          this.sayPriceObj.replies[index].lapQty = lapQty.substring(0, 9)
        }
      },
      getLimitDownQty: function () {
        for (let i = 0; i < this.sayPriceObj.replies.length; i++) {
          if (this.sayPriceObj.replies[i].lapQty) {
            return {
              lapQty: this.sayPriceObj.replies[i].lapQty,
              index: i
            }
          }
        }
        return {index: -1}
      },
      checkValid: function () {
        for (let i = 0; i < this.sayPriceObj.replies.length; i++) {
          if (!this.sayPriceObj.replies[i].lapQty || !this.sayPriceObj.replies[i].price) {
            return false
          }
        }
        return this.validSayPrice.leadtime && this.validSayPrice.repliesLapQty && this.validSayPrice.repliesPrice
      },
      onRemind: function (str) {
        this.remindText = str
        this.timeoutCount ++
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mobile-modal {
    .mobile-modal-box {
      top: 5%;
      left: 3%;
      right: 3%;
      width: auto;
      bottom: 3%;
      .say-price {
        background: #f3f3f3;
        padding: .18rem 0;
        width: 100%;
        overflow-y: auto;
        height: 90%;
        .form-list {
          height: 7.53rem;
          background: #fff;
          padding-top: .2rem;
          > div {
            height: .7rem;
            line-height: .7rem;
            width: 6.12rem;
            font-size: .28rem;
            margin: 0 auto .2rem;
            input {
              height: .7rem;
              text-align: center;
              border: .02rem solid #666;
              border-radius: .05rem;
            }
            &.form-title {
              border: .02rem solid #666;
              border-radius: .05rem;
              padding: 0 .07rem 0 .17rem;
              .fl {
                span {
                  color: #666;
                }
              }
              .fr {
                position: relative;
                img {
                  width: .12rem;
                  height: .06rem;
                  margin-left: .04rem;
                }
                > ul {
                  position: absolute;
                  top: .6rem;
                  right: -.4rem;
                  z-index: 1;
                  width: 1.75rem;
                  background: #fff;
                  text-align: center;
                  border-radius: .1rem;
                  border: .02rem solid #dfdfdf;
                  -webkit-box-shadow: 0 0 .12rem .02rem #e2d9d975;
                  -moz-box-shadow:  0 0 .12rem .02rem #e2d9d975;
                  box-shadow:  0 0 .12rem .02rem #e2d9d975;
                  li {
                    height: .52rem;
                    line-height: .52rem;
                    border-bottom: .02rem solid #dfdfdf;
                    &:hover, &:active {
                      background: #dedede;
                    }
                  }
                }
              }
            }
            &.form-item {
              position: relative;
              input {
                width: 2.93rem;
              }
              i {
                position: absolute;
                right: -.42rem;
                top: 0;
                font-size: .36rem;
                &.icon-add {
                  color: #4768f3;
                }
                &.icon-minus {
                  color: #8d8d8d;
                }
              }
            }
            &.date {
              input {
                width: 4.8rem;
              }
            }
          }
        }
      }
    }
  }
</style>
