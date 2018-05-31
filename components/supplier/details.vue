<template>
  <div class="details_info">
    <div class="container">
      <div class="crumbs">
        <div class="container">
          <div class="menu-com row">
            <div class="menu-title col-md-12">
              <a href="/">首页 ></a>
              <a href="/supplier">供应商资源 ></a>
              <a :href="'/supplier/' + uuid">供应商物料库 ></a>
              <span>物料详情</span>
            </div>
          </div>
        </div>
      </div>
      <div class="top">
        <div class="img">
          <img :src="detail.cmpImg || '/images/store/common/default.png'">
        </div>
        <div class="right">
          <h4 v-text="detail.cmpCode">3</h4>
          <ul class="list-unstyled">
            <li class="item">
              <span>类目(产品名称)</span>
              <p v-if="detail.standard === 1" v-text="detail.kind ? spliceString(detail.kind, 135) : '暂无信息'">1</p>
              <p v-if="detail.standard !== 1" v-text="detail.prodName ? spliceString(detail.prodName, 135) : '暂无信息'">1</p>
            </li>
            <li class="item">
              <span>品牌</span>
              <p v-text="detail.standard !== 1 ? detail.brand : detail.pbranden">2</p>
            </li>
            <li class="item">
              <span>单位</span>
              <p v-text="detail.unit ? detail.unit : 'PCS'">32</p>
            </li>
            <li class="item">
              <span>规格</span>
              <p v-text="detail.spec ? detail.spec : '暂无信息'">32</p>
            </li>
          </ul>
          <a @click="immediatelyClick">立即询价</a>
        </div>
      </div>
      <div class="detail">
        <div class="info_title">
          <p>产品参数<span>（仅供参考，以实际产品为准）</span></p> <a v-if="detail.cmpUuId && cmpInfo.properties && cmpInfo.properties.length > 6" @click="hasDown = !hasDown">{{hasDown ? '更多' : '收起'}} <i class="el-icon-arrow-down" v-if="hasDown"></i> <i v-if="!hasDown" class="el-icon-arrow-up"></i></a>
        </div>
        <div class="empty" v-if="!detail.cmpUuId || (cmpInfo.properties && cmpInfo.properties.length === 0)">
          <img src="/images/supplier/icon/empty.png">
          <div class="info">
            <p>产品暂无参数</p>
            <a href="javascript:history.go(-1)"><i class="fa fa-reply" style="margin-right:5px;"></i>返回上一页</a>
          </div>
        </div>
        <ul class="list-unstyled" :style="hasDown ? height300 : heightAuto">
          <li v-if="detail.cmpUuId" v-for="item in cmpInfo.properties"><span v-text="item.property.labelCn"></span><span v-text="item.value ? item.value : '-'"></span></li>
        </ul>
      </div>
    </div>
    <el-dialog
      title="我要询价"
      :visible.sync="hasDialog ">
      <div class="form_dialog">
        <ul class="list-inline">
          <li class="form-item">
            <span>型号：</span>
            <p v-text="detail.cmpCode ? spliceString(detail.cmpCode, 90) : '-'">3</p>
          </li>
          <li class="form-item">
            <span>类目：</span>
            <p v-if="detail.standard === 1" v-text="detail.kind ? spliceString(detail.kind, 90) : '-'">1</p>
            <p v-if="detail.standard !== 1" v-text="detail.prodName ? spliceString(detail.prodName, 90) : '-'">1</p>
          </li>
          <li class="form-item">
            <span>品牌：</span>
            <p v-text="detail.standard !== 1 ? spliceString(detail.brand, 90) : spliceString(detail.pbranden, 90)">2</p>
          </li>
          <li class="form-item">
            <span>规格：</span>
            <p v-text="detail.spec ? spliceString(detail.spec, 90) : '-'">3</p>
          </li>
          <li class="form-item">
            <span><i>*</i>截止日期：</span>
            <el-date-picker
              :class="{'error': !validObj.deadline}"
              v-model="applyObj.deadline"
              type="date"
              :picker-options="pickerOptions"
              @change="setDeadLineValid"
              :editable="false"
              :clearable="true"
              size="mini">
            </el-date-picker>
          </li>
          <li class="form-item">
            <span>封装：</span>
            <input type="text" class="form-control" v-model="applyObj.encapsulation"/>
          </li>
          <li class="form-item">
            <span>单价预算：</span>
            <select v-model="applyObj.currency" class="form-control" style="width:40px;">
              <option value="RMB">¥</option>
              <option value="USD">$</option>
            </select>
            <input type="number" v-model="applyObj.unitPrice" class="form-control" :class="{'error': !validObj.unitPrice}"/>
          </li>
          <li class="form-item">
            <span>生产日期：</span>
            <input type="text" class="form-control" v-model="applyObj.produceDate"/>
          </li>
          <li class="form-item">
            <span>采购数量(PCS)：</span>
            <input type="number" class="form-control" v-model="applyObj.amount" :class="{'error': !validObj.amount}"/>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <button @click="goPublish" :disabled="isClick">询价提交</button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {spliceStr, formatDate} from '~utils/baseUtils.js'
  export default {
    name: 'DetailsView',
    data () {
      return {
        uuid: this.$route.params.uuid,
        isClick: false,
        hasDown: true,
        height300: {
          maxHeight: '204px'
        },
        heightAuto: {
          height: 'auto'
        },
        applyObj: {
          unitPrice: '',
          currency: 'RMB',
          encapsulation: '',
          produceDate: '',
          amount: '',
          deadline: ''
        },
        validObj: {
          unitPrice: true,
          amount: true,
          deadline: true
        },
        pickerOptions: {
          disabledDate (time) {
            // 大于等于今天 小于三个月后
            return time.getTime() < Date.now() - 1000 * 60 * 60 * 24 || time.getTime() > Date.now() + 1000 * 60 * 60 * 24 * 30 * 3
          }
        },
        hasDialog: false,
        searchCode: ''
      }
    },
    computed: {
      detail () {
        return this.$store.state.supplier.detail.detail.data
      },
      cmpInfo () {
        return this.$store.state.supplier.detail.cmpInfo.data
      },
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      spliceString (str, length) {
        return spliceStr(str, length)
      },
      // 弹出询价界面
      immediatelyClick () {
        if (!this.user.logged) {
          this.$router.push('/auth/login?returnUrl=' + window.location.href)
        } else {
          this.hasDialog = true
        }
      },
      // 时间格式化
      setDeadLineValid: function () {
        this.applyObj.deadline = formatDate(this.applyObj.deadline, 'yyyy-MM-dd hh:mm:ss')
        this.validObj.deadline = true
      },
      // 检查单价预算
      checkUnitPrice () {
        this.validObj.unitPrice = this.applyObj.unitPrice === '' ? true : this.applyObj.unitPrice > 0 && this.applyObj.unitPrice < 100000000
        if (!this.validObj.unitPrice && this.applyObj.unitPrice <= 0) {
          this.$message.error('单价必须是大于0的数字')
        }
        return this.validObj.unitPrice
      },
      // 检查采购数量
      checkAmount () {
        this.validObj.amount = this.applyObj.amount === '' ? true : this.applyObj.amount > 0 && this.applyObj.amount < 1000000000
        return this.validObj.amount
      },
      // 检查时间是否有输入
      checkDeadline () {
        this.validObj.deadline = Boolean(this.applyObj.deadline)
        return this.validObj.deadline
      },
      // 检查各个字段输入正常数据
      checkAll () {
        return this.checkDeadline() && this.checkUnitPrice() && this.checkAmount()
      },
      emptyForm () {
        for (let attr in this.applyObj) {
          this.applyObj[attr] = attr === 'currency' ? 'RMB' : ''
        }
      },
      // 请求询价信息
      goPublish () {
        let _this = this
        this.isClick = true
        setTimeout(function () {
          _this.isClick = false
        }, 1000)
        if (this.checkAll()) {
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
          inquiryItem.inbrand = this.detail.brand
          inquiryItem.currency = currency
          inquiryItem.cmpCode = this.detail.cmpCode.toUpperCase()
          inquiryItem.unitPrice = this.applyObj.unitPrice
          inquiryItem.produceDate = this.applyObj.produceDate
          inquiryItem.date = date
          inquiryItem.endDate = this.applyObj.deadline
          inquiryItem.encapsulation = this.applyObj.encapsulation
          inquiryItem.spec = this.detail.spec
          inquiryItem.prodTitle = this.detail.prodName
          let inquiryItems = []
          inquiryItems.push(inquiryItem)
          inquiry.inquiryItems = inquiryItems
          inquiry.currency = this.applyObj.unitPrice ? this.applyObj.currency : null
          this.$http.post('/inquiry/buyer/save', inquiry)
            .then(res => {
              this.$message.success('发布成功')
              this.hasDialog = false
              this.emptyForm()
            }, error => {
              console.log(error)
              this.$message.error('发布失败')
            })
        } else {
          if (!this.validObj.deadline) {
            this.$message.error('截止日期不能为空')
          } else if (!this.validObj.amount) {
            this.$message.error('请输入正确的数值')
          }
        }
      }
    }
  }
</script>

<style type="text/scss" lang="scss">
.details_info{
  background: #fff;
  .el-dialog{
    width: 680px!important;
    .el-dialog__header{
      background: #4290f7;
      line-height: 40px;
      padding: 0 20px 0;
      .el-dialog__title{
        color:#fff;
      }
      .el-dialog__headerbtn:hover .el-dialog__close, .el-dialog__headerbtn:focus .el-dialog__close{
        color:#fff;
      }
    }
    .el-dialog__body{
      padding: 10px 20px;
    }
    .el-dialog__footer{
      text-align: center;
      button{
        display:inline-block;
        border:0;
        box-shadow: none;
        background: #3c7cf5;
        color:#fff;
        font-size: 14px;
        line-height: 30px;
        height:30px;
        padding:0 10px;
        border-radius:5px;
      }
    }
  }
  .form_dialog{
    .el-date-editor--date {
      width: 230px;
      &.error {
        input {
          border: 1px solid #f4645f !important;
        }
      }
    }
    ul{
      li{
        width:50%;
        font-size: 14px;
        color:#666;
        vertical-align: top;
        margin-bottom:15px;
        &.form-item {
          position: relative;
          p{
            margin:0;
            margin-left:80px;
            word-break: break-all;
            word-wrap: break-word;
          }
          span {
            float:left;
            width: 80px;
            text-align: right;
            display: inline-block;
            color:#3c7cf5;
            i {
              position: relative;
              top: 2px;
              right: 5px;
              color: #e41515;
            }
          }
          ul {
            line-height: normal;
            position: absolute;
            top: 19px;
            left: 79px;
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
            width: 40px;
            position: absolute;
            height: 20px;
            background: url('/images/applyPurchase/select.png')no-repeat right;
            background-position-x: 23px;
            padding: 0 0 0 7px;
            border-radius: 0;
            & + input {
              padding-left: 45px;
            }
          }
          .el-input {
            width: 230px;
          }
          input {
            font-size: 14px;
            width: 230px;
            height: 20px;
            line-height: 20px;
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
    }
  }
  .crumbs{
    background: #fff;
    .menu-com{
      margin: 0;
      .menu-title{
        line-height: 40px;
        font-size: 14px;
        padding-left: 0;
        margin:0;
        a{
          color: #5078cb;
          font-size: 14px;
        }
      }
    }
  }
  .top{
    margin-bottom:20px;
    .img{
      float:left;
      width:350px;
      height:350px;
      vertical-align: top;
      padding:36px;
      border:1px solid #bababa;
      img{
        width:100%;
        height:100%;
      }
    }
    .right{
      position:relative;
      height:350px;
      margin-left:370px;
      h4{
        width:800px;
        font-size: 25px;
        line-height: 25px;
        font-weight: bold;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space:nowrap;
        border-bottom:1px solid #3c7cf5;
        margin:0;
        padding-bottom:20px;
      }
      a{
        display:inline-block;
        position:absolute;
        bottom:0;
        left: 0;
        background: #3c7cf5;
        color:#fff;
        font-size: 14px;
        line-height: 30px;
        height:30px;
        padding:0 10px;
        border-radius:5px;
      }
      ul{
        padding-top:35px;
        li{
          margin-bottom:25px;
          span{
            display: inline-block;
            width: 100px;
            float: left;
            color: #3c7cf5;
            vertical-align: top;
            text-align: right;
            margin-right: 15px;
          }
          p{
            width:365px;
            font-size: 14px;
            color:#333;
            margin:0;
            margin-left:90px;
            word-wrap: break-word;
            word-break: normal;
          }
        }
      }
    }
  }
  .detail{
    margin-bottom:90px;
    border:1px solid #e5e5e5;
    .empty {
      padding:75px 0;
      text-align: center;
      img {
        vertical-align: top;
        margin-right: 15px;
      }
      .info {
        display: inline-block;
        padding-top: 10px;
      }
    }
    .info_title{
      position:relative;
      line-height: 34px;
      font-weight: bold;
      color:#fff;
      background: #3c7cf5;
      padding-left:15px;
      text-align: left;
      p{
        font-size: 16px;
        margin:0;
        span{
          font-size: 12px;
        }
      }
      a{
        position:absolute;
        top:0;
        right:20px;
        color:#fff;
      }
    }
    ul{
      margin-left:0;
      overflow: hidden;
      li{
        line-height: 34px;
        text-align: center;
        overflow: hidden;
        > span{
          display:inline-block;
          width:50%;
        }
        &:nth-child(odd){
          background: #fff;
        }
        &:nth-child(even){
          background: #f5f6f8;
        }
        &.empty{
          padding: 100px 0;
          font-size: 24px;
        }
      }
    }
  }
}
</style>
