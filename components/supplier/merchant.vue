<template>
<div class="merchant">
  <div class="container">
    <div class="top clearfix">
      <div class="title">
        <p>High quality dealer</p>
        <h2>供应商列表</h2>
        <div class="count">
          <img src="/images/supplier/count.png" alt=""/>
          <div class="count_num">
            <span v-for="spCount in all" v-text="spCount"></span>
          </div>
        </div>
      </div>
      <div class="search">
        <div class="input-group">
          <input type="search" class="form-control" title="code" placeholder="名称/地址/行业"
                 v-model="searchCode" @keyup.13="goodsSearch(searchCode)" @search="goodsSearch(searchCode)"/>
          <span class="input-group-btn">
            <button type="button" class="btn" @click="goodsSearch(searchCode)">&nbsp;查 询</button>
          </span>
        </div>
      </div>
    </div>

    <div class="list_info">
      <div class="empty" v-if="!list.content || list.content.length === 0">
        <img src="/images/supplier/icon/empty.png">
        <div class="info">
          <p>暂无供应商信息</p>
          <a href="javascript:history.go(-1)"><i class="fa fa-reply" style="margin-right:5px;"></i>返回上一页</a>
        </div>
      </div>
      <ul class="list-inline">
        <li v-for="item in list.content" @click="jumpResource(item.enUU)">
          <div class="has_shop" v-if="item.isStore === 1">已开店</div>
          <div class="enterprise_name" v-text="item.enName">深圳英优软科技有限公司</div>
          <div class="select_btn" v-html="isInFrame ? '添加为<br/>供应商' : '查看<br/>更多'" @mouseleave="hasJump = false" @mouseenter="hasJump = true" @click="addResource(item.enUU)"></div>
          <div class="popups">
            <p>企业执照号：</p><p v-text="item.enBusinesscode ? item.enBusinesscode : '暂无信息'">1</p>
            <p>地址：</p><p v-text="item.enAddress ? item.enAddress : '暂无信息'">1</p>
            <p>邮箱：</p><p v-text="item.enEmail ? item.enEmail : '暂无信息'">h</p>
            <p>电话：</p><p v-text="item.enTel ? item.enTel : '暂无信息'">1</p>
            <p>行业：</p><p v-text="item.enIndustry ? item.enIndustry : '暂无信息'">1</p>
          </div>
        </li>
      </ul>
      <div style="float: right;">
        <page :total="list.totalElements" :page-size="pageParams.count"
              :current="pageParams.page" v-on:childEvent="handleCurrentChange">
        </page>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="hasDialog ">
      <div class="form_dialog">
        <p><span>供应商正在完善产品信息，</span>暂时不能查看更多。 </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <a type="button" @click="hasDialog=false">我知道了</a>
      </span>
    </el-dialog>
  </div>
</div>
</template>

<script>
  import Page from '~components/common/page/pageComponent.vue'
  export default {
    name: 'MerchantView',
    data () {
      return {
        hasDialog: false,
        hasJump: false,
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
        return this.$store.state.supplier.merchant.merchant.data
      },
      all () {
        let count = this.$store.state.supplier.merchant.merchantAll.data
        let supplierCount = count.content ? count.totalElements + '' : '00000'
        return this.formatNumber(supplierCount, 5)
      }
    },
    methods: {
      // 供应商数字格式转换
      formatNumber (num, key) {
        let count = ('00000' + num).substr(-key)
        let _arr = []
        for (var i = 0; i < count.length; i++) {
          _arr.push(count[i])
        }
        return _arr
      },
      addResource (id) {
        if (this.isInFrame) {
          this.$http.get(`/basic/enterprise /${id}/info`)
            .then(res => {
              if (res.data) {
                window.open(this.$route.query.localPath + this.$route.query.erpPath + '?b2bdata=' + encodeURIComponent(JSON.stringify(res.data)))
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.isVaildSupplier(id)
        }
      },
      jumpResource (id) {
        if (!this.hasJump) {
          this.isVaildSupplier(id)
        }
      },
      // 判断是否有有效物料信息
      isVaildSupplier (id) {
        this.$http.get('vendor/introduction/product/count', {params: {vendUU: id}})
          .then(res => {
            if (res.data.count !== 0) {
              this.$router.push('supplier/' + id)
            } else {
              this.hasDialog = true
            }
          }, err => {
            console.log(err)
          })
      },
      goodsSearch (type) {
        this.pageParams.page = 1
        this.$store.dispatch('supplier/loadVendorList', {page: this.pageParams.page, size: this.pageParams.count, keyword: type})
      },
      handleCurrentChange (type) {
        this.pageParams.page = type
        this.$store.dispatch('supplier/loadVendorList', {page: type, size: this.pageParams.count, keyword: this.searchCode})
      }
    }
  }
</script>

<style type="text/scss" lang="scss">
.merchant{
  background: #ecf1f1 url(/images/supplier/banner.jpg)no-repeat;
  border-top:3px solid #000;
  padding-bottom:25px;
  margin-top:-1.5em;
  .el-dialog{
    width: 290px!important;
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
      a{
        display:inline-block;
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
    p{
      width:200px;
      font-size: 14px;
      color:#666666;
      margin:0 auto;
      padding-top:5px;
      line-height: 20px;
      span{
        color:#eb6054;
      }
    }
  }
  .top{
    padding-top:30px;
    margin-bottom:40px;
    .title{
      margin:0 auto;
      text-align: center;
      width:215px;
      border-bottom:1px solid #ff5151;
      color:#fff;
      p{
        margin:0;
      }
      h2{
        font-size: 32px;
        margin:0;
        line-height: 46px;
      }
      div.count{
        position: relative;
        .count_num {
          position:absolute;
          top:4px;
          left:3px;
          span {
            display:inline-block;
            width:29px;
            text-align: center;
            font-size: 28px;
            color:#4a2f01;
          }
        }
      }
      &:before{
        content: '';
        display:block;
        position:relative;
        left:55px;
        top:61px;
        width:105px;
        height:1px;
        background: #ff8a00;
      }
      &:after{
        content: '';
        display:block;
        position:relative;
        left:55px;
        top:4px;
        width:105px;
        height:1px;
        background: #fff600;
      }
    }
    .search{
      float:right;
      width:310px;
      text-align: right;
      margin-right:10px;
      .btn{
        width:68px;
        background: #ffa200;
        color:#fff;
      }
    }
  }
  .list_info{
    padding: 0 10px;
    min-height:300px;
    margin-bottom:100px;
    .empty{
      height:418px;
      border:15px solid #c4e9f9;
      background: #eef9fd;
      padding-top:165px;
      text-align: center;
      img{
        vertical-align: top;
        margin-right:15px;
      }
      .info{
        display: inline-block;
        padding-top:10px;
      }
    }
    > ul{
      margin-left:5px;
      li{
        position:relative;
        vertical-align: top;
        width:267px;
        height:115px;
        border-radius:5px;
        margin-right:32px;
        margin-bottom:60px;
        background: #ffffff;
        box-shadow: 0 3px 10px rgba(0,0,0,.8);
        &:nth-child(4n) {
          margin-right:0;
        }
        &:after{
          content: '';
          display:block;
          position:absolute;
          top:99%;
          left:50%;
          z-index:200;
          width:88px;
          height:22px;
          margin-left:-44px;
          background: url(/images/supplier/icon/bottom_center_img.png)no-repeat;
        }
        .has_shop {
          position:absolute;
          right:0;
          top:0;
          width:68px;
          height:22px;
          background: url(/images/supplier/icon/top_right_img.png)no-repeat;
          color:#fff;
          font-weight: bold;
          text-align: center;
          line-height: 22px;
        }
        .enterprise_name{
          padding-top:15px;
          width:98%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space:nowrap;
          border-bottom:1px solid #b9def7;
          font-weight: bold;
          color:#1891e4;
          font-size: 18px;
          line-height: 48px;
          text-align: center;
        }
        .select_btn{
          position:absolute;
          bottom:-10px;
          left:50%;
          z-index:250;
          width:56px;
          height:56px;
          padding:10px 0;
          margin-left:-28px;
          text-align: center;
          line-height: 18px;
          background: #1891e4;
          border-radius:50%;
          color:#fff;
        }
        &:hover{
          cursor:pointer;
          .popups{
            top:99%;
            opacity:1;
            z-index:100;
          }
        }
        .popups{
          position:absolute;
          top:50px;
          left:0;
          background: #6c6c6c;
          width:267px;
          min-height:20px;
          padding:20px 15px 5px 10px;
          transition: all .5s ease;
          opacity: 0;
          color:#fff;
          overflow: hidden;
          p{
            float:left;
            margin: 0 !important;
            line-height: 18px;
            max-height:18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &:nth-child(2n-1){
              width:42px;
            }
            &:first-child{
              width:85px;
            }
            &:nth-child(2n){
              width:200px;
            }
            &:nth-child(2){
              width:155px;
            }
            &:nth-child(4){
              max-height:38px;
              overflow: hidden;
              white-space:pre-wrap;
              word-wrap:break-word;
            }
            &:last-child{
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
      }
    }
  }
}
</style>
