<template>
  <div>
    <div class="modal-wrap" v-if="currentSayPriceIndex > -1">
      <div class="say-price-box" >
        <div class="title">
          <!--<div>型号：<span :title="purchaseManList.content[currentSayPriceIndex].cmpCode">{{purchaseManList.content[currentSayPriceIndex].cmpCode}}</span></div>-->
          <!--<div>品牌：<span :title="purchaseManList.content[currentSayPriceIndex].inbrand">{{purchaseManList.content[currentSayPriceIndex].inbrand}}</span></div>-->
          <div>我要报价</div>
          <i class="fa fa-close" @click="cancelSayPrice"></i>
        </div>
        <div class="content">
          <div class="content-line">
            <div class="form-item form-left text-line">
              <span>型号：</span><span class="text" :title="purchaseManList.content[currentSayPriceIndex].cmpCode">{{purchaseManList.content[currentSayPriceIndex].cmpCode}}</span>
            </div>
          </div>
          <div class="content-line">
            <div class="form-item form-left text-line">
              <span>品牌：</span><span class="text"  :title="purchaseManList.content[currentSayPriceIndex].inbrand">{{purchaseManList.content[currentSayPriceIndex].inbrand}}</span>
            </div>
          </div>
          <div class="content-line">
            <div class="form-item form-left">
              <span><i>*</i>交期：</span>
              <input type="number" class="form-control" placeholder="天数" @input="onLeadtimeInput" @blur="onLeadtimeBlur" v-model="sayPriceObj.leadtime">
              <!-- -
              <input type="text" class="form-control" placeholder="天数">-->
            </div>
            <!--<div class="form-item form-upload">
              <label>
                <span><i>+</i>添加附件</span>
                <input type="file">
              </label>
              &lt;!&ndash;<div>
                <span>我是Excel的名字111</span>
                <i class="fa fa-times-circle"></i>
                <a href="">更换</a>
              </div>&ndash;&gt;
            </div>-->
          </div>
          <div class="content-line" v-for="(reply, index) in sayPriceObj.replies">
            <div class="form-item form-left">
              <span><i>*</i>价格梯度：</span>
              <input type="number" class="form-control" @blur="onReplyLapQtyBlur(index)" @input="onReplyLapQtyInput(index)" v-model="reply.lapQty" placeholder="分段数量">
              <!-- -
               <input type="text" class="form-control" placeholder="数量">-->
            </div>
            <div class="form-item form-right">
              <span><i>*</i>单价<span v-if="purchaseManList.content[currentSayPriceIndex].currency" v-text="purchaseManList.content[currentSayPriceIndex].currency == 'USD' ? '($)' : '(¥)'"></span>：</span>
              <!--{{purchaseManList.content[currentSayPriceIndex].currency == 'USD' ? '$' : '¥'}})-->
              <select v-if="!purchaseManList.content[currentSayPriceIndex].currency" v-model="sayPriceObj.currency">
                <option value="RMB">¥</option>
                <option value="USD">$</option>
              </select>
              <input type="number" class="form-control" @input="onReplyPriceInput(index)" @blur="onReplyPriceBlur(index)" placeholder="分段单价" v-model="reply.price">
              <i class="fa fa-minus-circle" v-if="sayPriceObj.replies.length > 1" @click="setReplies('sub', index)"></i>
              <i class="fa fa-plus-circle" v-if="sayPriceObj.replies.length < 5" @click="setReplies('add', index)"></i>
            </div>
          </div>
        </div>
        <div class="operate">
          <span @click="commitSayPrice">确定</span>
          <span @click="cancelSayPrice">取消</span>
        </div>
      </div>
    </div>
    <loading v-show="showLoading"></loading>
  </div>
</template>
<script>
  import Loading from '~components/common/loading/PageLoading.vue'
  export default {
    props: {
      purchase: Object,
      current: Number
    },
    data () {
      return {
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
        showLoading: false
      }
    },
    components: {
      Loading
    },
    computed: {
      purchaseManList () {
        return this.purchase || []
      },
      currentSayPriceIndex () {
        this.resetSayPrice()
        return this.current
      },
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      setIndex: function (index) {
        this.$emit('sayPriceIndexAction', index)
      },
      sayPrice: function (purchaseMan, index) {
        if (this.user.logged) {
          if (this.user.data.enterprise.uu) {
            if (this.user.data.enterprise.isVendor && this.user.data.enterprise.isVendor !== '1690') {
              this.resetSayPrice()
//              purchaseMan.active = true
              this.setIndex(index)
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
      cancelSayPrice: function () {
        this.$emit('cancelSayPriceAction')
      },
      commitSayPrice: function () {
        if (this.checkValid()) {
          let purchaseMan = JSON.parse(JSON.stringify(this.purchaseManList.content[this.currentSayPriceIndex]))
          this.showLoading = true
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
              this.$message.error(response.data.message)
            } else {
              this.$message.success('报价成功')
              this.resetSayPrice()
              this.resetList()
            }
          }, error => {
            console.log(error)
            this.$message.error('请勿重复报价或报价自己的求购')
            this.showLoading = false
          })
        } else {
          this.$message.error('请输入正确的报价信息')
        }
      },
      resetList: function () {
        this.$emit('resetListAction')
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
      onLeadtimeInput: function () {
        if (this.sayPriceObj.leadtime.length > 3) {
          this.sayPriceObj.leadtime = this.sayPriceObj.leadtime.substring(0, 3)
        }
      },
      onLeadtimeBlur: function () {
        if (!this.sayPriceObj.leadtime || this.sayPriceObj.leadtime < 1 || this.sayPriceObj.leadtime >= 1000 || this.sayPriceObj.leadtime.toString().indexOf('.') !== -1) {
          this.validSayPrice.leadtime = false
          this.$message.error('交期请填写1-999之间的正整数')
        } else {
          this.validSayPrice.leadtime = true
        }
      },
      onReplyPriceInput: function (index) {
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
          this.$message.error('价格不能为空')
          this.validSayPrice.repliesPrice = false
        } else if (price <= 0) {
          this.sayPriceObj.replies[index].price = ''
          this.$message.error('输入值必须为正整数')
          this.validSayPrice.repliesPrice = false
        } else {
          this.validSayPrice.repliesPrice = true
        }
      },
      onReplyLapQtyBlur: function (index) {
        let lapQty = Number(this.sayPriceObj.replies[index].lapQty)
        let limitDownObj = Number(this.getLimitDownQty())
        if (!lapQty || lapQty < 1) {
          this.sayPriceObj.replies[index].lapQty = ''
          this.$message.error('输入值必须为正整数')
          this.validSayPrice.repliesLapQty = false
        } else if (limitDownObj.index !== index && limitDownObj.lapQty > lapQty) {
          this.$message.error('输入值必须大于#该梯度的下限#')
          this.sayPriceObj.replies[index].lapQty = ''
          this.validSayPrice.repliesLapQty = false
        } else if ((index - 1 >= 0 && this.sayPriceObj.replies[index - 1].lapQty && this.sayPriceObj.replies[index - 1].lapQty >= lapQty) || (index + 1 < this.sayPriceObj.replies.length && this.sayPriceObj.replies[index + 1].lapQty && this.sayPriceObj.replies[index + 1].lapQty <= lapQty)) {
          this.$message.error('输入值会导致梯度重叠，请重新修改')
          this.sayPriceObj.replies[index].lapQty = ''
          this.validSayPrice.repliesLapQty = false
        } else {
          this.validSayPrice.repliesLapQty = true
        }
      },
      onReplyLapQtyInput: function (index) {
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
      setReplies: function (type, index) {
        if (type === 'add' && this.sayPriceObj.replies.length < 5) {
          if (this.sayPriceObj.replies[index].lapQty && this.sayPriceObj.replies[index].price) {
            this.sayPriceObj.replies.splice(index + 1, 0, {
              lapQty: '',
              price: ''
            })
          } else {
            this.$message.error('请填完整信息')
          }
        } else if (type === 'sub' && this.sayPriceObj.replies.length > 1) {
          this.sayPriceObj.replies.splice(index, 1)
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .say-price-box {
    position: fixed;
    width: 476px;
    top: 30%;
    left: 33%;
    bottom: 3%;
    overflow-y: auto;
    /*-webkit-box-shadow: 0 5px 15px rgba(0,0,0,.5);*/
    /*-moz-box-shadow: 0 5px 15px rgba(0,0,0,.5);*/
    /*box-shadow: 0 5px 15px rgba(0,0,0,.5);*/
    z-index: 1;
    .title {
      position: relative;
      height: 38px;
      background: #4290f7;
      line-height: 38px;
      color: #fff;
      border: {
        top-right-radius: 5px;
        top-left-radius: 5px;
      }
      padding-left: 20px;
      font-weight: bold;
      /*> div {*/
        /*display: inline-block;*/
        /*padding-left: 57px;*/
        /*width: 47%;*/
        /*overflow: hidden;*/
        /*text-overflow: ellipsis;*/
        /*white-space: nowrap;*/
      /*}*/
      i {
        position: absolute;
        right: 10px;
        top: 8px;
        cursor: pointer;
      }
    }
    .content {
      padding: 9px 0 0 0;
      background: #fff;
      .content-line {
        padding: 0 0 14px 0;
        .form-item {
          display: inline-block;
          width: 49%;
          > span {
            i {
              color: #fd2637;
              margin-right: 4px;
            }
          }
          input {
            border: 1px solid #bfbfbf;
            border-radius: 2px;
            height: 28px;
            padding: 0 8px;
          }
          &.form-left {
            span {
              display: inline-block;
              width: 104px;
              text-align: right;
            }
            input {
              width: 104px;
              padding: 0 8px;
            }
            &.text-line {
              width: 100%;
              span {
                &.text {
                  width: 300px;
                  text-align: left;
                  color: #4290f7;
                }
              }
            }
          }
          &.form-upload {
            text-align: center;
            label {
              margin-bottom: 0;
              cursor: pointer;
              input {
                display: none;
              }
              span {
                display: block;
                width: 94px;
                height: 23px;
                line-height: 18px;
                font-weight: normal;
                color: #4290f7;
                text-align: center;
                border: 1px dashed #4290f7;
                border-radius: 11px;
                i {
                  font-weight: bold;
                  font-style: normal;
                  font-size: 18px;
                  margin-right: 5px;
                }
              }
            }
            div {
              i {
                cursor: pointer;
                color: #eb222c;
                font-size: 16px;
                margin-right: 10px;
              }
              span {
                display: inline-block;
                max-width: 128px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          &.form-right {
            position: relative;
            input {
              width: 104px;
              padding: 0 8px;
            }
            select {
              position: absolute;
              top: 0;
              width: 32px;
              height: 28px;
              background: url(/images/applyPurchase/arrow-down.png) no-repeat right center;
              border: {
                left: none;
                top: none;
                bottom: none;
                right: 1px solid #bfbfbf;
                bottom-left-radius: 4px;
                top-left-radius: 4px;
              }
              color: #5392f9;
              font: small-caption;
              padding-left: 8px;
              outline: none;
              & + input {
                padding-left: 36px;
                width: 133px;
              }
            }
            > i {
              margin-left: 4px;
            }
          }
        }
      }
    }
    .operate {
      background: #fff;
      height: 52px;
      text-align: center;
      padding-top: 12px;
      border: {
        top: 1px solid #e4e5e6;
        bottom-left-radius: 5px;
        bottom-right-radius: 5px;
      }
      span {
        display: inline-block;
        width: 64px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        background: #4290f7;
        color: #fff;
        cursor: pointer;
        border-radius: 2px;
        &:last-child {
          margin-left: 15px;
          background: #acabab;
        }
      }
    }
  }
</style>
