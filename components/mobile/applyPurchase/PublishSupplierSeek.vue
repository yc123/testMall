<template>
  <div class="mobile-modal" v-if="showPublishBox" @touchmove="preventTouchMove($event)">
    <div class="mobile-modal-box">
      <div class="mobile-modal-header">我要询价<i class="icon-guanbi iconfont" @click="cancel"></i></div>
      <div class="props">
        <div class="prop">型号：{{applyObj.code || '-'}}</div>
        <div class="prop">品牌：{{applyObj.brand || '-'}}</div>
        <div class="prop">类目(产品名称)：{{applyObj.prodTitle || '-'}}</div>
        <div class="prop">规格：{{applyObj.spec || '-'}}</div>
      </div>
      <div class="publish-seek">
        <div class="content-line">
          <span><i>*</i>截止日期：</span>
          <input type="date" v-model="applyObj.deadline" :min="minDay" :max="maxDay" @blur="deadlineChange">
        </div>
        <div class="content-line">
          <span>数量(PCS)：</span>
          <input type="text" v-model="applyObj.amount" @blur="checkAmount" @input="onAmountInput">
        </div>
        <a @click="goPublish">确认</a>
      </div>
    </div>
  </div>
</template>
<script>
  import { formatDate, cutOutString } from '~utils/baseUtils'
  export default {
    props: ['showPublishBox', 'product'],
    data () {
      return {
        applyObj: {
          code: '',
          brand: '',
          amount: '',
          deadline: '',
          prodTitle: ''
        },
        validObj: {
          amount: true,
          deadline: true
        }
      }
    },
    computed: {
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
//      showPublishBox: function (val, old) {
//        if (val) {
//          document.body.style.position = 'fixed'
//          document.body.style.left = '0'
//          document.body.style.right = '0'
//        } else {
//          document.body.style.position = 'relative'
//        }
//      },
      product: {
        handler (val, oldVal) {
          if (val) {
            let isStandard = val.standard === 1
            this.applyObj.code = val.cmpCode
            this.applyObj.brand = isStandard ? val.pbranden : val.brand
            this.applyObj.spec = val.spec
//            this.applyObj.unit = val.unit || 'PCS'
            this.applyObj.prodTitle = isStandard ? val.kind : val.prodName
          }
        },
        immediate: true
      }
    },
    methods: {
      cancel: function () {
        this.$emit('cancelAction')
      },
      emptyForm: function () {
        for (let attr in this.applyObj) {
          this.applyObj[attr] = ''
        }
      },
      setRemindText: function (str) {
        this.$emit('remindAction', str)
      },
      getMaterialKind: function (code, brand) {
        return this.$http.get('/productuser/match/getKind', {params: {cmpCode: code, brand: brand}})
      },
      startPublish: function (prodTitle) {
        let inquiry = {}
        let inquiryItem = {}
        if (this.user.data.enterprise) {
          inquiry.enUU = this.user.data.enterprise.uu
        }
        let date = new Date()
        let endDate = formatDate(this.applyObj.deadline, 'yyyy-MM-dd hh:mm:ss')
        inquiry.recorderUU = this.user.data.userUU
        inquiry.code = 'MALL' + date.getTime()
        inquiry.date = date
        inquiry.recorder = this.user.data.userName
        inquiry.endDate = endDate
        inquiry.sourceapp = 'MALL'
        inquiryItem.userUU = this.user.data.userUU
        inquiryItem.source = 'MALL'
        inquiryItem.userName = this.user.data.userName
        inquiryItem.userTel = this.user.data.userTel
        inquiryItem.needquantity = this.applyObj.amount
        inquiryItem.inbrand = this.applyObj.brand
        inquiryItem.cmpCode = (this.applyObj.code).toUpperCase()
        inquiryItem.prodTitle = prodTitle || this.applyObj.prodTitle || '其他'
        inquiryItem.date = date
        inquiryItem.endDate = endDate
        let inquiryItems = []
        inquiryItems.push(inquiryItem)
        inquiry.inquiryItems = inquiryItems
        this.$http.post('/inquiry/buyer/save', inquiry)
          .then(response => {
            //              this.$message.success('发布成功')
            this.setRemindText('发布成功')
            //                this.showRemindBox = true
            this.emptyForm()
            //                this.validObj.deadline = true
//              this.$emit('reloadAction')
            this.cancel()
          }, error => {
            console.log(error)
            //              this.$message.error('发布失败')
            this.setRemindText('发布失败')
          })
      },
      goPublish: function () {
        if (this.checkAll()) {
          if (!this.applyObj.prodTitle || this.applyObj.prodTitle.length === 0) {
            this.getMaterialKind(this.applyObj.code, this.applyObj.brand).then(response => {
              this.startPublish(response.data && response.data.length ? response.data : '其他')
            })
          } else {
            this.startPublish()
          }
        } else {
          if (!this.validObj.deadline) {
            this.setRemindText('截止日期不能为空')
          } else if (!this.validObj.amount) {
            this.setRemindText('请输入正确的数值')
          }
        }
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
        return this.checkDeadline() && this.checkAmount()
      },
      checkAmount: function () {
        this.validObj.amount = this.applyObj.amount === '' ? true : this.applyObj.amount > 0 && this.applyObj.amount < 1000000000
        return this.validObj.amount
      },
      checkDeadline: function () {
        this.validObj.deadline = Boolean(this.applyObj.deadline)
        return this.validObj.deadline
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
      background: #f3f3f3;
      .mobile-modal-header {
        border-radius: 0;
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
      .props {
        font-size: .28rem;
        background: #fff;
        margin: .2rem 0;
        padding-left: .29rem;
        .prop {
          padding-top: .2rem;
          &:last-child {
            padding-bottom: .2rem;
          }
          span {
            color: #666;
          }
        }
      }
    }
  }
</style>
