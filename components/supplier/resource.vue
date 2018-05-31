<template>
<div class="resource_info">
  <div class="container">
    <div class="crumbs">
      <div class="container">
        <div class="menu-com row">
          <div class="menu-title col-md-12">
            <a href="/">首页 ></a>
            <a href="/supplier">供应商资源 ></a>
            <span>供应商物料库</span>
          </div>
        </div>
      </div>
    </div>
    <div class="user_info">
      <div class="user_title">
        <div class="user_name">
          <span>{{enUser.enName ? enUser.enName : '企业名称'}}&nbsp;&nbsp;<i class="fa fa-angle-down"></i></span>
          <a :href="/store/+ storeInfo.uuid" target="_blank" v-if="storeInfo.uuid">进入店铺</a>
        </div>
        <div class="user_mes">
          <div class="mes-list">
            <p>
              <span><i class="supplier_icon1"></i>企业执照号：{{enUser.enBussinessCode ? enUser.enBussinessCode : '暂无信息'}}</span>
              <span><i class="supplier_icon2"></i> 地址：{{enUser.enAddress ? enUser.enAddress : '暂无信息'}}</span>
            </p>
            <p>
              <span><i class="supplier_icon3"></i> 邮箱：{{enUser.enEmail ? enUser.enEmail : '暂无信息'}}</span>
              <span><i class="supplier_icon4"></i> 电话：{{enUser.enTel ? enUser.enTel : '暂无信息'}}</span>
              <span><i class="supplier_icon5"></i> 行业：{{enUser.enIndustry ? enUser.enIndustry : '暂无信息'}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="search">
        <div class="input-group">
          <input type="search" class="form-control" placeholder="请输入要查找的内容"
                 v-model="searchCode" @keyup.13="goodsSearch(searchCode)" @search="goodsSearch(searchCode)"/>
          <span class="input-group-btn">
            <button type="button" class="btn" id="search_btn" @click="goodsSearch(searchCode)">
              搜索 <i class="fa fa-search"></i>
            </button>
        </span>
        </div>
      </div>
    </div>
    <div class="info_list">
      <table>
        <thead>
        <tr>
          <th width="66">序号</th>
          <th width="1008">
            <span>原厂型号 / 品牌</span>
            <span>类目（名称） / 单位</span>
            <span>规格</span>
          </th>
          <th width="116">操作</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in list.content" @click="jumpDetail(item.id)">
            <td v-text="index + 1">12</td>
            <td>
              <ul class="list-inline">
                <li class="item">
                  <span class="fl">原厂型号</span>
                  <p v-text="item.cmpCode ? spliceString(item.cmpCode, 95) : '暂无信息'">2</p>
                </li>
                <li class="item">
                  <span class="fl">类目（产品名称）</span>
                  <p v-if="item.standard === 1" v-text="item.kind ? spliceString(item.kind, 95) : '暂无信息'">1</p>
                  <p v-if="item.standard !== 1" v-text="item.prodName ? spliceString(item.prodName, 95) : '暂无信息'">1</p>
                </li>
                <li class="item">
                  <span class="fl">规格</span>
                  <p v-text="item.spec ? spliceString(item.spec, 95) : '暂无信息'">1</p>
                </li>
                <li class="item">
                  <span class="fl">品牌</span>
                  <p v-text="item.standard !== 1 ? spliceString(item.brand, 95) : spliceString(item.pbranden, 95)">2</p>
                </li>
                <li class="item">
                  <span class="fl">单位</span>
                  <p v-text="item.unit ? item.unit : 'PCS'">1</p>
                </li>
              </ul>
            </td>
            <td>
              <a @click="immediatelyClick(item)" @mouseleave="hasClick = false" @mouseenter="hasClick = true">立即询价</a>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="empty" v-if="!list.content || list.content.length === 0">
        <img src="/images/supplier/icon/empty.png">
        <div class="info">
          <p>暂无物料信息</p>
          <a href="javascript:history.go(-1)"><i class="fa fa-reply" style="margin-right:5px;"></i>返回上一页</a>
        </div>
      </div>
      <div style="float: right;background: #ecf1f1;">
        <page :total="list.totalElements" :page-size="pageParams.count"
              :current="pageParams.page" v-on:childEvent="handleCurrentChange">
        </page>
      </div>
    </div>
    <el-dialog
      title="我要询价"
      :visible.sync="hasDialog">
      <div class="form_dialog">
        <ul class="list-inline">
          <li class="form-item">
            <span>型号：</span>
            <p v-text="applyObj.cmpCode ? spliceString(applyObj.cmpCode, 90) : '-'">32432</p>
          </li>
          <li class="form-item">
            <span>类目：</span>
            <p v-text="applyObj.prodName ? spliceString(applyObj.prodName, 90) : '-'">32</p>
          </li>
          <li class="form-item">
            <span>品牌：</span>
            <p v-text="applyObj.brand ? spliceString(applyObj.brand, 90) : '-'">32432</p>
          </li>
          <li class="form-item">
            <span>规格：</span>
            <p v-text="applyObj.spec ? spliceString(applyObj.spec, 90) : '-'">32432</p>
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
</div>
</template>

<script>
  import {spliceStr, formatDate} from '~utils/baseUtils.js'
  import Page from '~/components/common/page/pageComponent.vue'
  export default {
    name: 'ResourceView',
    data () {
      return {
        isClick: false,
        applyObj: {
          cmpCode: '',
          brand: '',
          unitPrice: '',
          currency: 'RMB',
          prodName: '',
          spec: '',
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
        hasClick: false,
        searchCode: '',
        pageParams: {
          count: 20,
          page: 1
        }
      }
    },
    components: {
      Page
    },
    computed: {
      list () {
        return this.$store.state.supplier.material.material.data
      },
      enUser () {
        return this.$store.state.supplier.material.enUser.data
      },
      storeInfo () {
        return this.$store.state.shop.storeInfo.store.data
      },
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      // 格式化字符串长度
      spliceString (str, length) {
        return str && str.length ? spliceStr(str, length) : '暂无信息'
      },
      // 跳转到器件详情页面
      jumpDetail (id) {
        if (!this.hasClick) {
          this.$router.push(this.$route.path + '/' + id)
        }
      },
      // 获取分页数据
      handleCurrentChange (type) {
        this.pageParams.page = type
        this.$store.dispatch('supplier/loadMaterialList', {page: type, size: this.pageParams.count, vendUU: this.$route.params.uuid, keyword: this.searchCode})
      },
      // 根据搜索信息获取数据
      goodsSearch (type) {
        this.pageParams.page = 1
        this.$store.dispatch('supplier/loadMaterialList', {
          page: this.pageParams.page,
          size: this.pageParams.count,
          vendUU: this.$route.params.uuid,
          keyword: type
        })
      },
      // 弹出询价界面
      immediatelyClick (type) {
        if (!this.user.logged) {
          this.$router.push('/auth/login?returnUrl=' + window.location.href)
        } else {
          this.hasDialog = true
          this.applyObj.cmpCode = type.cmpCode
          this.applyObj.brand = (type.standard === 1 ? type.pbranden : type.brand)
          this.applyObj.spec = type.spec
          this.applyObj.prodName = (type.standard === 1 ? type.kind : type.prodName)
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
          inquiryItem.inbrand = this.applyObj.brand
          inquiryItem.currency = currency
          inquiryItem.cmpCode = this.applyObj.cmpCode.toUpperCase()
          inquiryItem.unitPrice = this.applyObj.unitPrice
          inquiryItem.produceDate = this.applyObj.produceDate
          inquiryItem.date = date
          inquiryItem.endDate = this.applyObj.deadline
          inquiryItem.encapsulation = this.applyObj.encapsulation
          inquiryItem.spec = this.applyObj.spec
          inquiryItem.prodTitle = this.applyObj.prodName
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
.resource_info{
  background: #ecf1f1;
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
        background: #3c7cf5;
        color:#fff;
        font-size: 14px;
        line-height: 30px;
        height:30px;
        padding:0 10px;
        box-shadow: none;
        border: 0;
        border-radius:5px;
      }
    }
  }
  .form_dialog{
    .el-date-editor--date{
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
    background: #ecf1f1;
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
  .user_info{
    margin-bottom:5px;
    .user_title{
      display:inline-block;
      position:relative;
      padding-bottom:13px;
      margin-right:330px;
      &:hover{
        .user_mes{
          display:block;
        }
      }
      .user_name{
        span{
          font-size: 20px;
          color:#666;
          font-weight: bold;
          margin-right:10px;
        }
        a{
          display:inline-block;
          padding:0 10px;
          border-radius:3px;
          font-size: 12px;
          height:24px;
          line-height: 24px;
          color:#fff;
          background: #ffa200;
        }
      }
      .user_mes{
        display:none;
        position:absolute;
        top:100%;
        left:0;
        z-index: 200;
        height:10px;
        &:before{
          content: '';
          display:block;
          position:absolute;
          bottom:5px;
          left:20px;
          z-index: 100;
          border: 5px solid rgba(0,0,0,.7);
          -webkit-transform: rotate(45deg);
          -moz-transform: rotate(45deg);
          -o-transform:rotate(45deg);
          -ms-transform: rotate(45deg);
          transform:rotate(45deg);
        }
        .mes-list{
          padding:10px 10px;
          background: rgba(0,0,0,.7);
          color:#fff;
          p{
            max-width:1183px;
            min-width:118px;
            margin:0;
            line-height: 20px;
            font-size: 12px;
            color:#fff;
            overflow: hidden;
            white-space: nowrap;
            span{
              margin: 0 5px;
              .supplier_icon1{
                display:inline-block;
                position: relative;
                top: 5px;
                width:20px;
                height:18px;
                background: url(/images/supplier/icon/supplier_icon.png)no-repeat 0 0;
              }
              .supplier_icon2{
                display:inline-block;
                position: relative;
                top: 5px;
                width:20px;
                height:18px;
                background: url(/images/supplier/icon/supplier_icon.png)no-repeat -20px 0;
              }
              .supplier_icon3{
                display:inline-block;
                position: relative;
                top: 5px;
                width:20px;
                height:18px;
                background: url(/images/supplier/icon/supplier_icon.png)no-repeat -40px 0;
              }
              .supplier_icon4{
                display:inline-block;
                position: relative;
                top: 5px;
                height:18px;
                width:22px;
                background: url(/images/supplier/icon/supplier_icon.png)no-repeat -60px 0;
              }
              .supplier_icon5{
                display:inline-block;
                position: relative;
                top: 5px;
                width:20px;
                height:18px;
                background: url(/images/supplier/icon/supplier_icon.png)no-repeat -85px 0;
              }
            }
          }
        }
      }
    }
    .search{
      width:310px;
      margin:0;
      float:right;
      .btn{
        background: #3c7cf5;
        color:#fff;
      }
    }
  }
  .info_list{
    padding-bottom:200px;
    .empty{
      background: #ffffff;
      text-align: center;
      padding: 80px 0;
      img{
        vertical-align: top;
        margin-right:15px;
      }
      .info{
        display: inline-block;
        padding-top:10px;
      }
    }
    table {
      table-layout: fixed;
      thead{
        tr{
          line-height: 32px;
          vertical-align: middle;
          th{
            font-size: 14px;
            color:#fff;
            text-align: center;
            background: #3975f4;
            span{
              display:inline-block;
              width:33%;
            }
          }
        }
      }
      tbody{
        tr{
          border:1px solid #dadada;
          &:nth-child(odd){
            background: #fff;
          }
          &:nth-child(even){
            background: #f8f8f8;
          }
          &:hover{
            cursor:pointer;
            background: #f8fafe;
            td{
              &:first-child{
                border-left:1px solid #3975f4;
              }
              &:last-child{
                border-right:1px solid #3975f4;
              }
              border-top:1px solid #3975f4;
              border-bottom:1px solid #3975f4;
            }
          }
          td{
            vertical-align: middle;
            margin:0 auto;
            padding:10px 0;
            &:first-child, &:last-child{
              color:#ed791c;
              text-align: center;
            }
            a{
              display:inline-block;
              padding:0 10px;
              margin:0 auto;
              line-height: 24px;
              border-radius:3px;
              height:24px;
              font-size: 12px;
              color:#fff;
              background: #3c7cf5;
              text-align: center;
            }
            ul{
              margin-left:5px;
            }
            .item{
              font-size: 12px;
              line-height: 18px;
              padding: 10px 0;
              vertical-align: top;
              width:33%;
              span{
                display: inline-block;
                width: 96px;
                text-align: right;
                margin-right: 10px;
                color: #3c7cf5;
              }
              p{
                display:block;
                width:210px;
                margin-left:100px;
                margin-bottom:0;
                color:#333;
                word-break: break-all;
                word-wrap:break-word;
              }
            }
          }
        }
      }
    }
  }
}
</style>
