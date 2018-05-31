<template>
  <div class="mobile-modal" v-if="showSayPriceBox" @click="setShowCurrencyList(false)" @touchmove="preventTouchMove($event)">
    <div class="mobile-modal-box">
      <div class="mobile-modal-header">
        <i class="icon-guanbi iconfont" @click="cancel"></i>
      </div>
      <div class="publish-seek">
        <div class="content-line">
          <span><i>*</i>型号：</span>
          <input type="text" v-model="applyObj.code" @blur="checkCode" @input="onCodeChange" placeholder="请勿填中文符号">
          <ul class="similar" v-show="showSimilarCodeList && applyObj.code">
            <li v-for="sCode in similarCode" @click="setCode(sCode.code)">{{sCode.code}}</li>
          </ul>
        </div>
        <div class="content-line">
          <span><i>*</i>品牌：</span>
          <input type="text" v-model="applyObj.brand" @blur="checkBrand" @input="onBrandChange" placeholder="请勿填中文符号">
          <ul class="similar brand-similar-list" v-show="showSimilarBrandList && applyObj.brand">
            <li v-for="sBrand in similarBrand" @click="setBrand(sBrand.nameEn)">{{sBrand.nameEn}}</li>
          </ul>
        </div>
        <div class="content-line">
          <span><i>*</i>截止日期：</span>
          <input type="date" v-model="applyObj.deadline" :min="minDay" :max="maxDay" @blur="deadlineChange">
          <!--<el-date-picker-->
            <!--v-model="applyObj.deadline"-->
            <!--type="date"-->
            <!--:editable="false"-->
            <!--:clearable="true"-->
            <!--size="mini">-->
          <!--</el-date-picker>-->
        </div>
        <!--<div class="content-line">
          <span>币种：</span>
          <a v-text="applyObj.currency" @click="setShowCurrencyList(!showCurrencyList, $event)"></a>
          <img v-if="!showCurrencyList" src="/images/mobile/@2x/applyPurchase/currency-arrow-down.png" alt="">
          <img v-if="showCurrencyList" src="/images/mobile/@2x/applyPurchase/currency-arrow-up.png" alt="">
          <ul v-if="showCurrencyList">
            <li @click="setCurrency('不限')">不限</li>
            <li @click="setCurrency('RMB')">RMB</li>
            <li @click="setCurrency('USD')">USD</li>
          </ul>
        </div>-->
        <div class="content-line">
          <span>数量(PCS)：</span>
          <input type="text" v-model="applyObj.amount" @blur="checkAmount" @input="onAmountInput">
        </div>
        <!--<div class="content-line">
          <span>生产日期：</span>
          <input type="text" v-model="applyObj.produceDate" @input="onProduceDateChange">
        </div>-->
        <a @click="goPublish">确认发布</a>
      </div>
    </div>
  </div>
</template>
<script>
  import { formatDate, getRealLen, cutOutString } from '~utils/baseUtils'
  export default {
    props: ['showSayPriceBox'],
    data () {
      return {
        applyObj: {
          code: '',
          brand: '',
          unitPrice: '',
          currency: '不限',
          encapsulation: '',
          produceDate: '',
          amount: '',
          deadline: ''
        },
        validObj: {
          code: true,
          brand: true,
          unitPrice: true,
          amount: true,
          deadline: true
        },
        showCurrencyList: false,
        showSimilarCodeList: false,
        showSimilarBrandList: false,
        similarCode: [],
        similarBrand: []
      }
    },
    computed: {
      user () {
        return this.$store.state.option.user
      },
      minDay: function () {
        return formatDate(new Date(), 'yyyy-MM-dd')
      },
      maxDay: function () {
        let deadDate = new Date().getTime() + 1000 * 60 * 60 * 24 * 90
        deadDate = formatDate(new Date(deadDate), 'yyyy-MM-dd')
        return deadDate
      }
    },
    watch: {
      showSayPriceBox: function (val, old) {
        this.emptyForm()
//        if (val) {
//          document.body.style.position = 'fixed'
//          document.body.style.left = '0'
//          document.body.style.right = '0'
//        } else {
//          document.body.style.position = 'static'
//        }
      }
    },
    mounted () {
      let _this = this
      document.body.onclick = function () {
        _this.showSimilarCodeList = false
        _this.showSimilarBrandList = false
      }
    },
    methods: {
      cancel: function () {
        this.$emit('cancelAction')
      },
      emptyForm: function () {
        for (let attr in this.applyObj) {
          this.applyObj[attr] = attr === 'currency' ? '不限' : ''
        }
      },
      setRemindText: function (str) {
        this.$emit('remindAction', str)
      },
      setShowCurrencyList: function (flag, e) {
        if (e) {
          e.stopPropagation()
        }
        this.showCurrencyList = flag
      },
      getMaterialKind: function (code, brand) {
        return this.$http.get('/productuser/match/getKind', {params: {cmpCode: code, brand: brand}})
      },
      goPublish: function () {
        if (this.checkAll()) {
          this.getMaterialKind(this.applyObj.code, this.applyObj.brand).then(response => {
            let inquiry = {}
            let inquiryItem = {}
            if (this.user.data.enterprise) {
              inquiry.enUU = this.user.data.enterprise.uu
            }
            let date = new Date()
            let endDate = formatDate(this.applyObj.deadline, 'yyyy-MM-dd hh:mm:ss')
            //          let currency = this.applyObj.currency === '不限' ? null : this.applyObj.currency
            let currency = null
            inquiry.recorderUU = this.user.data.userUU
            inquiry.code = 'MALL' + date.getTime()
            inquiry.date = date
            inquiry.recorder = this.user.data.userName
            inquiry.endDate = endDate
            inquiry.sourceapp = 'MALL'
            inquiry.amount = 1
            inquiryItem.prodTitle = response.data && response.data.length ? response.data : '其他'
            inquiryItem.userUU = this.user.data.userUU
            inquiryItem.source = 'MALL'
            inquiryItem.userName = this.user.data.userName
            inquiryItem.userTel = this.user.data.userTel
            inquiryItem.needquantity = this.applyObj.amount
            inquiryItem.inbrand = this.applyObj.brand
            inquiryItem.custCurrency = currency
            inquiryItem.cmpCode = (this.applyObj.code).toUpperCase()
            inquiryItem.unitPrice = this.applyObj.unitPrice
            inquiryItem.produceDate = null
            inquiryItem.date = date
            inquiryItem.endDate = endDate
            inquiryItem.encapsulation = this.applyObj.encapsulation
            let inquiryItems = []
            inquiryItems.push(inquiryItem)
            inquiry.inquiryItems = inquiryItems
            inquiry.currency = currency
            this.$http.post('/inquiry/buyer/save', inquiry)
              .then(response => {
                //              this.$message.success('发布成功')
                this.setRemindText('发布成功')
                //                this.showRemindBox = true
                this.emptyForm()
                //                this.validObj.deadline = true
                this.$emit('reloadAction')
                this.cancel()
              }, error => {
                console.log(error)
                //              this.$message.error('发布失败')
                this.setRemindText('发布失败')
              })
          })
        } else {
          if (!this.validObj.code) {
            this.setRemindText('型号不能为空')
          } else if (!this.validObj.brand) {
            this.setRemindText('品牌不能为空')
          } else if (!this.validObj.deadline) {
            this.setRemindText('截止日期不能为空')
          } else if (!this.validObj.amount) {
            this.setRemindText('请输入正确的数值')
          }
        }
      },
      setCurrency: function (type) {
        this.applyObj.currency = type
      },
      isValidDate: function (date) {
        let now = new Date(formatDate(new Date(), 'yyyy-MM-dd')).getTime()
        let time = new Date(date).getTime()
        return !time || (time >= now && time <= now + 1000 * 60 * 60 * 24 * 90)
      },
      deadlineChange: function () {
        if (!this.isValidDate(this.applyObj.deadline)) {
          this.setRemindText('日期需不小于今天且在90天以内')
          this.applyObj.deadline = ''
          this.validObj.deadline = false
        } else {
          this.validObj.deadline = true
        }
      },
      checkAll: function () {
        return this.checkCode() && this.checkBrand() && this.checkDeadline() && this.checkAmount()
      },
      checkCode: function () {
        this.validObj.code = this.applyObj.code && this.applyObj.code !== ''
        if (!this.validObj.code) {
          this.setRemindText('型号不能为空')
        }
        return this.validObj.code
      },
      checkBrand: function () {
        this.validObj.brand = this.applyObj.brand && this.applyObj.brand !== ''
        if (!this.validObj.brand) {
          this.setRemindText('品牌不能为空')
        }
        return this.validObj.brand
      },
      checkAmount: function () {
        this.validObj.amount = this.applyObj.amount === '' ? true : this.applyObj.amount > 0 && this.applyObj.amount < 1000000000
        return this.validObj.amount
      },
      checkDeadline: function () {
        this.validObj.deadline = Boolean(this.applyObj.deadline)
        return this.validObj.deadline
      },
      onProduceDateChange: function () {
        if (this.applyObj.produceDate && getRealLen(this.applyObj.produceDate) > 12) {
          this.applyObj.produceDate = cutOutString(this.applyObj.produceDate, 12)
        }
      },
      getSimilarCode: function () {
        if (this.applyObj.code) {
          this.$http.get('/search/similarComponents', {params: {keyword: this.applyObj.code}})
            .then(response => {
              this.similarCode = response.data
              this.showSimilarCodeList = response.data.length > 0
            })
        } else {
          this.showSimilarCodeList = false
        }
      },
      getSimilarBrand: function () {
        if (this.applyObj.brand) {
          this.$http.get('/search/similarBrands', {params: {keyword: this.applyObj.brand}})
            .then(response => {
              this.similarBrand = response.data
              this.showSimilarBrandList = response.data.length > 0
            })
        } else {
          this.showSimilarBrandList = false
        }
      },
      onCodeChange: function () {
        this.applyObj.code = this.applyObj.code.trim()
        if ((/[^\x00-\xff]/g).test(this.applyObj.code)) {
          let chineseIndex = -1
          for (let i = 0; i < this.applyObj.code.length; i++) {
            if ((/[^\x00-\xff]/g).test(this.applyObj.code.charAt(i))) {
              chineseIndex = i
              break
            }
          }
          this.applyObj.code = cutOutString(this.applyObj.code, chineseIndex)
        } else if (this.applyObj.code && getRealLen(this.applyObj.code) > 100) {
          this.applyObj.code = cutOutString(this.applyObj.code, 100)
        } else {
          this.getSimilarCode()
        }
      },
      onBrandChange: function () {
        this.applyObj.brand = this.applyObj.brand.trim()
        if ((/[^\x00-\xff]/g).test(this.applyObj.brand)) {
          let chineseIndex = -1
          for (let i = 0; i < this.applyObj.brand.length; i++) {
            if ((/[^\x00-\xff]/g).test(this.applyObj.brand.charAt(i)) && !(/[\u4e00-\u9fa5]/).test(this.applyObj.brand.charAt(i))) {
              chineseIndex = i
              break
            }
          }
          if (chineseIndex > -1) {
            this.applyObj.brand = this.applyObj.brand.substring(0, chineseIndex)
          }
        } else if (this.applyObj.brand && getRealLen(this.applyObj.brand) > 50) {
          this.applyObj.brand = cutOutString(this.applyObj.brand, 50)
        } else {
          this.getSimilarBrand()
        }
      },
      onAmountInput: function () {
        if (!(/^[0-9]*$/).test(this.applyObj.amount)) {
          let chineseIndex = -1
          for (let i = 0; i < this.applyObj.amount.length; i++) {
            if (!(/^[0-9]*$/).test(this.applyObj.amount.charAt(i))) {
              chineseIndex = i
              break
            }
          }
          this.applyObj.amount = cutOutString(this.applyObj.amount, chineseIndex)
        } else if (this.applyObj.amount.length > 9) {
          this.applyObj.amount = cutOutString(this.applyObj.amount, 9)
        }
      },
      setCode: function (code) {
        this.applyObj.code = code
        this.showSimilarCodeList = false
      },
      setBrand: function (brand) {
        this.applyObj.brand = brand
        this.showSimilarBrandList = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mobile-modal {
    .mobile-modal-box {
      position: fixed;
      width: 5.92rem;
      font-size: .28rem;
      top: 50%;
      left: 50%;
      right: 11%;
      z-index: 1000;
      margin-top: -3.7rem;
      margin-left: -2.96rem;
      background: #fff;
      .mobile-modal-header {
        font-size: .38rem;
        background: #fff;
        background: url(/images/mobile/@2x/applyPurchase/pub.png) no-repeat;
        background-size: cover;
        height: 1.51rem;
        i {
          top: -.36rem;
        }
      }
      .publish-seek {
        background: #fff;
        padding-top: .1rem;
        padding-bottom: .4rem;
        .content-line {
          position: relative;
          height: .8rem;
          line-height: .8rem;
          font-size: .26rem;
          text-align: left;
          input {
            width: 3.49rem;
            height: .52rem;
            line-height: normal;
            padding: .1rem .19rem;
            border: 1px solid #7e7e7e;
            font-size: .26rem;
            vertical-align: middle;
            background: #fff;
            border-radius: 0;
          }
          > span {
            display: inline-block;
            width: 1.76rem;
            text-align: right;
            i {
              color: #ff0000;
              margin-right: .05rem;
              font-style: normal;
            }
          }
          > a {
            font-size: .26rem;
            color: #666;
          }
          > img {
            width: .12rem;
            height: .06rem;
            margin-left: .04rem;
          }
          .similar {
            position: absolute;
            width: 3.52rem;
            max-height: 2.5rem;
            overflow-y: auto;
            z-index: 12;
            border: 1px solid #7e7e7e;
            border-radius: .05rem;
            left: 1.75rem;
            top: .7rem;
            background: #fff;
            li {
              height: .5rem;
              line-height: .5rem;
              font-size: .26rem;
              color: #999;
              padding-left: .19rem;
              &:focus, &:active, &:hover {
                background: #999;
                color: #fff;
              }
            }
          }
          /*> ul {
            position: absolute;
            top: .6rem;
            left: 1.16rem;
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
          }*/
        }
        > a {
          display: block;
          width: 5.19rem;
          height: .84rem;
          text-align: center;
          line-height: .84rem;
          font-size: .38rem;
          margin: .3rem auto 0;
          background: #3f84f6;
          color: #fff;
          border-radius: .08rem;
        }
      }
    }
  }
  .datepicker-overlay {
    z-index: 9999;
    .cov-date-body {
      width: 4rem;
      font-size: .16rem;
      .cov-date-monthly {
        height: 1.5rem;
        div {
          height: 1.5rem;
        }
        .cov-date-caption {
          font-size: .24rem;
          padding: .5rem 0 !important;
        }
        .cov-date-next {
          text-indent: -3rem;
        }
      }
      .cov-date-box {
        .cov-picker-box {
          padding: .25rem;
          width: 4rem;
          height: 2.8rem;
          .week {
            ul {
              margin: 0 0 .08rem;
            }
          }
          .day {
            height: .34rem;
            line-height: .34rem;
          }
        }
      }
    }
    .button-box {
      height: .5rem;
      line-height: .5rem;
      padding-right: .2rem;
      span {
        padding: .1rem .2rem;
      }
    }
  }
</style>
