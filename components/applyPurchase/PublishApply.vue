<template>
  <div class="publish-apply">
    <div class="good-purchaser">
      <p class="good-purchaser-title">
        <img src="/images/applyPurchase/good-purchaser-title.png" alt="">
      </p>
      <ul>
        <li v-for="(goodMan, index) in goodPurchaseMan.content">
          <i v-text="index + 1" :style="'background: url(/images/applyPurchase/level-' + getRankBg(index)  + '.png) center no-repeat;'"></i>
          <span v-text="goodMan.name"></span>
        </li>
      </ul>
    </div>
    <div class="publish-area">
      <div class="publish-form-area">
        <p>单个求购</p>
        <div>
          <div class="form-item">
            <span>
              <i>*</i>型号：
            </span>
            <input type="text" class="form-control" :class="{'error': !validObj.code}" v-model="applyObj.code" @blur="checkCode" @input="onCodeChange" placeholder="请勿填中文符号"/>
            <ul v-show="showSimilarCodeList && applyObj.code">
              <li v-for="sCode in similarCode" @click="setCode(sCode.code)">{{sCode.code}}</li>
            </ul>
          </div>
          <div class="form-item">
            <span>
              <i>*</i>品牌：
            </span>
            <input type="text" class="form-control" :class="{'error': !validObj.brand}" v-model="applyObj.brand" @blur="checkBrand" @input="onBrandChange" placeholder="请勿填中文符号" />
            <ul class="brand-similar-list" v-show="showSimilarBrandList && applyObj.brand">
              <li v-for="sBrand in similarBrand" @click="setBrand(sBrand.nameEn)">{{sBrand.nameEn}}</li>
            </ul>
          </div>
          <div class="form-item">
            <span>
              <i>*</i>截止日期：
            </span>
            <!--<input type="text" class="form-control" readonly :class="{'error': !validObj.deadline}" v-model="applyObj.deadline" @blur="checkDeadline" />-->
            <el-date-picker
              v-model="applyObj.deadline"
              type="date"
              :picker-options="pickerOptions"
              :class="{'error': !validObj.deadline}"
              @change="setDeadLineValid"
              :editable="false"
              :clearable="true"
              size="mini">
            </el-date-picker>
          </div>
          <!--<div class="form-item">
            <span>
              单价预算：
            </span>
            <select v-model="applyObj.currency" class="form-control">
              <option value="RMB">¥</option>
              <option value="USD">$</option>
            </select>
            <input type="number" class="form-control" :class="{'error': !validObj.unitPrice}" v-model="applyObj.unitPrice" @blur="checkUnitPrice" @input="onUnitPriceInput" />
          </div>-->
          <div class="form-item">
           <span>
              类目(产品名称)：
            </span>
            <input type="text" class="form-control" v-model="applyObj.prodTitle" @input="onProdTitleInput"/>
          </div>
          <div class="form-item">
           <span>
              规格：
            </span>
            <input type="text" class="form-control" :class="{'error': !validObj.spec}" v-model="applyObj.spec" @blur="checkSpec" @input="onSpecInput"/>
          </div>
          <!--<div class="form-item">
           <span>
              封装：
            </span>
            <input type="text" class="form-control" v-model="applyObj.encapsulation" @input="onEncapsulationChange" />
          </div>-->
          <div class="form-item">
            <span>
              采购数量(PCS)：
            </span>
            <input type="text" class="form-control" :class="{'error': !validObj.amount}" v-model="applyObj.amount" @blur="checkAmount" @input="onAmountInput" />
          </div>
          <!--<div class="form-item">
            <span>
              生产日期：
            </span>
            <input type="text" class="form-control" v-model="applyObj.produceDate" @input="onProduceDateChange" />
          </div>-->
        </div>
        <a @click="goPublish()">发布求购</a>
      </div>
      <div class="publish-upload">
        <h1>批量求购</h1>
        <h2>3秒一键配单采购</h2>
        <label>
          <img src="/images/applyPurchase/upload.png" alt="" />
          <!--<input type="file" accept="*.xls, *.xlsx" @change="upload">-->
          <el-upload
            drag
            action="/seek/importBom"
            accept="*.xls, *.xlsx"
            :show-file-list="false"
            :on-success="onSuccess"
            :on-error="onError">
          </el-upload>
        </label>
        <h3>把Excel格式的BOM拖放到框中</h3>
        <img @click="downloadTemplate()" class="download-line" src="/images/applyPurchase/download.png" alt="">
        <img class="apply-logo" src="/images/applyPurchase/publish-apply.png" alt="">
      </div>
    </div>
    <div class="apply-rank">
      <table>
        <thead>
          <tr>
            <th width="62">排名</th>
            <th width="160">型号</th>
            <th width="92">求购次数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rank, index) in purchaseRank">
            <td><div>NO.<span>{{index + 1}}</span><i>|</i></div></td>
            <td>
              <div>
                <span v-if="rank.id_cmpcode" :title="rank.id_cmpcode">{{rank.id_cmpcode}}</span>
                <span v-if="!rank.id_cmpcode">-</span>
                <i>|</i>
              </div>
            </td>
            <td><div>{{rank.seekAmount || 0}}</div></td>
          </tr>
        </tbody>
      </table>
    </div>
    <!--提示框-->
    <div class="apply-del-box" v-if="showRemindBox">
      <div class="title">
        <a @click="showRemindBox = false"><i class="fa fa-close fa-lg"></i></a>
      </div>
      <div class="content">
        <!--<p style="line-height: 20px;margin-top: 10px;padding:0 10px">非常抱歉，目前暂无此品牌！<br>若直接前往“品牌申请”，我们将为您先开通寄售功能，待申请通过后再提交开店申请。</p>-->
        <!--<p style="line-height: 20px;">前往<a @click="goBrandApply()"  target="_blank" style="color: #5078CB">品牌申请&nbsp;<i class="fa fa-arrow-right"></i></a></p>-->
        <p><img src="/images/applyPurchase/check.png" alt="">发布成功</p>
        <p>其中 <span>100</span>个求购型号有现货在售，您可前往“<span>买家中心-我的求购</span>”查询并直接购买</p>
        <div>
          <a @click="showRemindBox = false">我知道了</a>
          <a href="/user#/seekPurchase">前往我的求购</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { getRealLen, cutOutString, formatDate, checkNullStr } from '~utils/baseUtils'
  export default {
    data () {
      return {
        applyObj: {
          code: '',
          brand: '',
          unitPrice: '',
          currency: 'RMB',
          prodTitle: '',
          spec: '',
          encapsulation: '',
          produceDate: '',
          amount: '',
          deadline: ''
        },
        validObj: {
          code: true,
          brand: true,
          unitPrice: true,
//          encapsulation: true,
//          produceDate: true,
          amount: true,
          deadline: true,
          spec: true
        },
        pickerOptions: {
          disabledDate (time) {
            // 大于等于今天 小于三个月后
            return time.getTime() < Date.now() - 1000 * 60 * 60 * 24 || time.getTime() > Date.now() + 1000 * 60 * 60 * 24 * 30 * 3
          }
        },
        showRemindBox: false,
        showSimilarCodeList: false,
        showSimilarBrandList: false,
        similarCode: [],
        similarBrand: []
      }
    },
    computed: {
      goodPurchaseMan () {
        return this.$store.state.applyPurchase.goodPurchaseMan.goodPurchaseMan.data
      },
      purchaseRank () {
        return this.$store.state.applyPurchase.purchaseApplyRank.purchaseApplyRank.data
      },
      user () {
        return this.$store.state.option.user
      }
    },
    filters: {
      enterpriseFilter (str) {
        return str.length > 4 ? str.substring(0, 2) + '**' + str.substring(str.length - 2, str.length) : str
      },
      userNameFilter (str) {
        return str.substring(0, 1) + '**'
      }
    },
    mounted () {
      document.getElementsByClassName('el-upload-dragger')[0].onclick = function (event) {
        event.stopPropagation()
      }
      let _this = this
      document.body.onclick = function () {
        _this.showSimilarCodeList = false
        _this.showSimilarBrandList = false
      }
    },
    methods: {
      emptyForm: function () {
        for (let attr in this.applyObj) {
          this.applyObj[attr] = attr === 'currency' ? 'RMB' : ''
        }
      },
      getRankBg: function (index) {
        return index === 0 ? 1 : index < 3 ? 2 : 3
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
        let currency = this.applyObj.unitPrice ? this.applyObj.currency : null
        inquiry.recorderUU = this.user.data.userUU
        inquiry.code = 'MALL' + date.getTime()
        inquiry.date = date
        inquiry.recorder = this.user.data.userName
        inquiry.endDate = this.applyObj.deadline
        inquiry.sourceapp = 'MALL'
        inquiry.amount = 1
        inquiryItem.userUU = this.user.data.userUU
        inquiryItem.source = 'MALL'
        inquiryItem.userName = this.user.data.userName
        inquiryItem.userTel = this.user.data.userTel
        inquiryItem.needquantity = this.applyObj.amount
        inquiryItem.inbrand = this.applyObj.brand
        inquiryItem.currency = currency
        inquiryItem.cmpCode = this.applyObj.code.trim().toUpperCase()
        inquiryItem.unitPrice = this.applyObj.unitPrice
        inquiryItem.produceDate = this.applyObj.produceDate
        inquiryItem.date = date
        inquiryItem.endDate = this.applyObj.deadline
        inquiryItem.encapsulation = this.applyObj.encapsulation
        inquiryItem.spec = this.applyObj.spec
        inquiryItem.prodTitle = prodTitle || this.applyObj.prodTitle || '其他'
        let inquiryItems = []
        inquiryItems.push(inquiryItem)
        inquiry.inquiryItems = inquiryItems
        inquiry.currency = this.applyObj.unitPrice ? this.applyObj.currency : null
        this.$http.post('/inquiry/buyer/save', inquiry)
          .then(response => {
            this.$message.success('发布成功')
//                this.showRemindBox = true
            this.emptyForm()
//                this.validObj.deadline = true
            this.$store.dispatch('applyPurchase/loadPurchaseManList', {pageNumber: 1, pageSize: 10, enUU: this.user.data.enterprise ? this.user.data.enterprise.uu : null})
          }, error => {
            console.log(error)
            this.$message.error('发布失败')
          })
      },
      goPublish: function () {
        if (this.user.logged) {
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
              this.$message.error('截止日期不能为空')
            } else if (!this.validObj.amount) {
              this.$message.error('请输入正确的数值')
            }
          }
        } else {
          this.$router.push('/auth/login?returnUrl=' + window.location.href)
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
      checkCode: function () {
        let code = this.applyObj.code.trim()
        let nullStrFlag = checkNullStr(code)
        this.validObj.code = code && code !== '' && nullStrFlag
        if (!this.validObj.code) {
          if (!nullStrFlag) {
            this.$message.error('型号输入不合法')
          } else {
            this.$message.error('型号不能为空')
          }
        }
        return this.validObj.code
      },
      checkBrand: function () {
        let nullStrFlag = checkNullStr(this.applyObj.brand)
        this.validObj.brand = this.applyObj.brand && this.applyObj.brand !== '' && nullStrFlag
        if (!this.validObj.brand) {
          if (!nullStrFlag) {
            this.$message.error('品牌输入不合法')
          } else {
            this.$message.error('品牌不能为空')
          }
        }
        return this.validObj.brand
      },
      checkUnitPrice: function () {
        this.validObj.unitPrice = this.applyObj.unitPrice === '' ? true : this.applyObj.unitPrice > 0 && this.applyObj.unitPrice < 100000000
        if (!this.validObj.unitPrice && this.applyObj.unitPrice <= 0) {
          this.$message.error('单价必须是大于0的数字')
        }
        return this.validObj.unitPrice
      },
      checkSpec: function () {
        let nullStrFlag = checkNullStr(this.applyObj.spec)
        this.validObj.spec = nullStrFlag
        if (!nullStrFlag) {
          this.$message.error('规格输入不合法')
        }
        return this.validObj.spec
      },
      checkAmount: function () {
        this.validObj.amount = this.applyObj.amount === '' ? true : this.applyObj.amount > 0 && this.applyObj.amount < 1000000000
        return this.validObj.amount
      },
      checkAll: function () {
        return this.checkCode() && this.checkBrand() && this.checkDeadline() && this.checkUnitPrice() && this.checkAmount() && this.checkSpec()
      },
      checkDeadline: function () {
        this.validObj.deadline = Boolean(this.applyObj.deadline)
        return this.validObj.deadline
      },
      setDeadLineValid: function () {
        this.applyObj.deadline = formatDate(this.applyObj.deadline, 'yyyy-MM-dd hh:mm:ss')
        this.validObj.deadline = true
      },
      onUnitPriceInput: function () {
        let price = this.applyObj.unitPrice
        if (price >= 10000) {
          this.applyObj.unitPrice = price.substring(0, 4)
        } else if (price.indexOf('.') > -1) {
          let arr = price.split('.')
          if (arr[0].length > 4) {
            this.applyObj.unitPrice = Number(arr[0].substring(0, 4) + '.' + arr[1])
          } else if (arr[1].length > 6) {
            this.applyObj.unitPrice = Number(arr[0] + '.' + arr[1].substring(0, 6))
          }
        }
      },
      onProduceDateChange: function () {
        if (this.applyObj.produceDate && getRealLen(this.applyObj.produceDate) > 12) {
          this.applyObj.produceDate = cutOutString(this.applyObj.produceDate, 12)
        }
      },
      onEncapsulationChange: function () {
        if (this.applyObj.encapsulation && getRealLen(this.applyObj.encapsulation) > 20) {
          this.applyObj.encapsulation = cutOutString(this.applyObj.encapsulation, 20)
        }
      },
      onProdTitleInput: function () {
        if (this.applyObj.prodTitle && getRealLen(this.applyObj.prodTitle) > 40) {
          this.applyObj.prodTitle = cutOutString(this.applyObj.prodTitle, 40)
        }
      },
      onSpecInput: function () {
        if (this.applyObj.spec && getRealLen(this.applyObj.spec) > 100) {
          this.applyObj.spec = cutOutString(this.applyObj.spec, 100)
        }
      },
      onCodeChange: function () {
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
      onSuccess: function (data) {
        if (!this.user.logged) {
          this.$router.push('/auth/login?returnUrl=' + window.location.href)
        } else if (data.success) {
          window.location.href = '/applyPurchase/' + data.data
        } else {
          this.$message.error(data.message)
        }
      },
      onError: function () {
        if (!this.user.logged) {
          this.$router.push('/auth/login?returnUrl=' + window.location.href)
        } else {
          this.$message.error('上传失败, 系统错误')
        }
      },
      downloadTemplate: function () {
        window.location.href = '/seek/release/template'
      },
      setCode: function (code) {
        this.applyObj.code = code
        this.showSimilarCodeList = false
      },
      setBrand: function (brand) {
        this.applyObj.brand = brand
        this.showSimilarBrandList = false
      }
//      upload: function (e) {
//        let file = e.target.files[0]
//        let param = new FormData()
//        param.append('file', file, file.name)
//        let config = {
//          headers: {'Content-Type': file.type}
//        }
//        this.$http.post('/seek/importBom', param, config).then(response => {
//          if (response.data.success) {
//            window.open('/applyPurchase/' + response.data.data)
//          } else {
//            this.$message.error('上传失败')
//          }
//        }, err => {
//          console.log(err)
//          this.$message.error('系统错误')
//        })
//      }
    }
  }
</script>
<style lang="scss">
  .publish-apply {
    background: url('/images/applyPurchase/banner.png') center center/cover no-repeat;
    height: 583px;
    padding-top: 290px;
    width: 1190px;
    margin: 0 auto;
    padding-left: 44px;
    >div {
      display: inline-block;
      border: 1px solid #3975f4;
      height: 267px;
      margin-right: 6px;
      vertical-align: middle;
      background: #fff;
      float: left;
      text-align: center;
    }
    .good-purchaser {
      width: 225px;
      .good-purchaser-title {
        height: 55px;
        line-height: 55px;
        background: #3975f4;
        margin: 0;
      }
      ul {
        padding: 0 22px 0 10px;
        li {
          line-height: 42px;
          span {
            float: right;
            display: inline-block;
            width: 152px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
          }
          i {
            display: inline-block;
            float: left;
            width: 25px;
            color: #fff;
            font-size: 16px;
            font-style: normal;
          }
        }
      }
    }
    .publish-area {
      width: 549px;
      text-align: center;
      .publish-form-area {
        width: 243px;
        float: left;
        height: 100%;
        p {
          padding-top: 8px;
          font-size: 22px;
          color: #3975f4;
          margin-bottom: 4px;
        }
        >div {
          text-align: left;
          margin-left: 3px;
          .form-item {
            margin-bottom: 14px;
            position: relative;
            span {
              width: 109px;
              text-align: right;
              display: inline-block;
              i {
                position: relative;
                top: 2px;
                right: 3px;
                color: #e41515;
              }
            }
            ul {
              line-height: normal;
              position: absolute;
              top: 19px;
              left: 108px;
              background: #fff;
              border: 1px solid #b5b5b5;
              z-index: 1;
              max-height: 120px;
              overflow-y: auto;
              overflow-x: hidden;
              border-radius: 3px;
              width: 114px;
              font-size: 12px;
              li {
                height: 24px;
                line-height: 24px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 0 5px;
                &:hover {
                  background: #ddd;
                }
              }
            }
            select {
              width: 32px;
              position: absolute;
              height: 20px;
              background: url('/images/applyPurchase/select.png')no-repeat right;
              background-position-x: 15px;
              padding: 0 0 0 3px;
              border-radius: 0;
              & + input {
                padding-left: 34px;
              }
            }
            .el-input {
              width: 111px;
              .el-input__inner {
              }
            }
            input {
              font-size: 12px;
              width: 111px;
              height: 18px;
              line-height: 18px;
              border-radius: 2px;
              padding: 0 3px;
              box-shadow: none;
              -webkit-box-shadow: none;
              -moz-box-shadow: none;
              &.error {
                border-color: #f4645f!important;
              }
            }
          }
        }
        >a {
          width: 90px;
          height: 25px;
          line-height: 25px;
          background: #3975f4;
          color: #fefefe;
          font-size: 16px;
          display: block;
          margin: 0 auto;
          border-radius: 3px;
          cursor: pointer;
        }
      }
      .publish-upload {
        background: url('/images/applyPurchase/publish-apply-bg.png')no-repeat;
        background-size: cover;
        width: 304px;
        height: 100%;
        padding-left: 22px;
        float: right;
        color: #fff;
        position: relative;
        h1 {
          font-size: 22px;
          margin: 11px 0 0 0;
        }
        h2 {
          font-size: 16px;
          margin: 10px 0 23px 0;
        }
        h3 {
          font-size: 16px;
          margin: 20px 0 13px 0;
        }
        label {
          position: relative;
          /*input {
            display: none;
          }*/
          > div {
            position: absolute;
            .el-upload {
              input {
                display: none;
              }
              .el-upload-dragger {
                width: 247px;
                height: 216px;
                position: absolute;
                bottom: -37px;
                right: -166px;
                opacity: 0;
              }
            }
          }
        }
        .download-line {
          cursor: pointer;
          color: #b47200;
        }
        .apply-logo {
          position: absolute;
          left: -20px;
          top: 86px;
        }
      }
    }
    .apply-rank {
      width: 317px;
      margin-right: 0;
      background: url('/images/applyPurchase/rank-title.png') no-repeat;
      background-color: #fff;
      background-size: 319px 74px;
      background-position: -3px -2px;
      table {
        margin: 76px auto 0;
        width: 98%;
        thead {
          background: #e0e0e0;
          height: 26px;
          line-height: 26px;
          border-radius: 3px;
          tr {
            th {
              font-size: 16px;
              font-weight: bold;
              text-align: center;
            }
          }
        }
        tbody {
          tr {
            height: 25px;
            line-height: 25px;
            &:first-child {
              td {
                padding-top: 10px;
              }
            }
            td {
              color: #666;
              &:nth-child(1) {
                color: #f6682f;
                font-size: 12px;
                >div {
                  width: 62px;
                  span {
                    font-size: 16px;
                  }
                }
              }
              &:nth-child(2) {
                >div {
                  width: 160px;
                }
              }
              &:nth-child(3) {
                >div {
                  width: 92px;
                }
              }
              >div {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 0 8px;
                position: relative;
                height: 30px;
                i {
                  font-style: normal;
                  float: right;
                  color: #8b8b8b;
                  font-size: 14px;
                  position: absolute;
                  right: 0;
                }
              }
            }
          }
        }
      }
    }
    .apply-del-box{
      position: fixed;
      z-index: 1000;
      height: auto;
      opacity: 1;
      background-color: white;
      width: 310px;
      -webkit-box-shadow: 0 5px 15px rgba(0,0,0,.5);
      -moz-box-shadow: 0 5px 15px rgba(0,0,0,.5);
      -o-box-shadow: 0 5px 15px rgba(0,0,0,.5);
      box-shadow: 0 5px 15px rgba(0,0,0,.5);
      margin: -155px 0 0 -75px;
      top: 55%;
      left: 43%;
      .title{
        height: 24px;
        background-color: #007aff;
        text-align: right;
        padding-right: 15px;
        line-height: 24px;
        a{
          color: white;
          font-size: 12px;
        }
      }
      .content{
        width: 100%;
        text-align: center;
        margin: 0 auto;
        p{
          padding: 12px 31px;
          margin: 0;
          i{
            color: #5078cb;
            font-size: 16px;
            margin-right: 10px;
          }
          span {
            color: #007aff;
          }
          &:last-child {
            font-size: 12px;
          }
        }
        div{
          width: 100%;
          text-align: center;
          margin: 0 auto 20px;
          a{
            padding: 0 19px;
            height: 26px;
            line-height: 26px;
            display: inline-block;
            text-align: center;
            font-size: 14px;
            color: #fff;
            &:first-child{
              background: #c8c6c6;
              margin-right: 10px;
            }
            &:last-child{
              background: #007aff;
            }
          }
        }
      }
    }
  }
  .el-date-editor--date{
    width: 110px;
    &.error {
      input {
        border: 1px solid #f4645f !important;
      }
    }
  }
  .el-icon-date {
    display: none;
  }
  .el-input__inner {
    height: 20px;
    border-radius: 0;
    border: 1px solid #c9c9c9;
  }
</style>
