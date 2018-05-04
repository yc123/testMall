<template>
  <div class="become-store">
    <div class="all-content">
      <reg-header></reg-header>
      <register></register>
    </div>
  </div>
</template>
<script>
  import { RegHeader, Register } from '~components/register-saler'
  export default {
    name: 'index',
    middleware: 'authenticated',
    components: {
      RegHeader,
      Register
    },
    computed: {
      user () {
        return this.$store.state.option.user
      }
    }
//    mounted () {
//      if (!this.user.logged) {
//        this.$http.get('/login/page', {params: {returnUrl: window.location.href}}).then(response => {
//          if (response.data) {
//            window.location.href = response.data.content + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
//          }
//        })
//      }
//    }
  }
</script>
<style>
  /* 公共模块 */
  .become-store{
    width: 100%;
    margin: 0 auto;
    background: #F5F5F5;
  }
  .become-store .all-content{
    width: 1026px;
    margin: 0 auto;
    background: #fff;
    padding-bottom: 40px;
    border: #e8e8e8 1px solid;
  }
  .become-store .all-content .h3{
    font-size: 24px;
    line-height: 80px;
    text-align: center;
    font-weight: bold;
  }
  .become-store .all-content .header-title{
    width: 70%;
    margin: 0 auto;
    margin-bottom: 40px;
  }
  .become-store .all-content .header-title .col-md-6{
    padding: 0 45px;
  }
  .become-store .all-content .header-title .col-md-6 img {
    margin-left: 95px;
  }
  .become-store .all-content .header-title h4{
    font-size: 18px;
    line-height: 30px;
    text-align: center;
    margin-top: 5px;
    margin-bottom: 10px;
  }
  .become-store .all-content .header-title p{
    font-size: 14px;
    line-height: 25px;
    color: #666;
    margin-bottom: 30px;
  }
  .step-menu{
    width: 100%;
    margin: 0 auto;
    height: 34px;
    background: #e8e8e8;
    line-height: 34px;
  }
  .step-menu ul{
    width: 100%;
    margin: 0 auto;
  }
  .step-menu ul li{
    width: 33.33333333%;
    float: left;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    color: #555;
    text-align: center;
    position: relative;
    cursor: default!important;
  }
  .step-menu ul li:hover{
    cursor: pointer;
    /*background: #0099ff;
    color: #fff;*/
  }
  .step-menu ul li.active{
    background: #5078cb;
    color: #fff;
  }
  .become-store .section{
    width: 100%;
    margin: 0 auto;
  }
  .become-store .section .register{
    width: 95%;
    margin: 0 auto;
    padding-top: 30px;
  }
  .become-store .section .register .row{
    line-height: 34px;
    padding-bottom: 15px;
    margin: 0 auto;
  }
  .become-store .section .register .row p{
    margin-bottom: 0;
  }
  .become-store .section .register .row .form-control{
    border-color: #ccc;
    border-radius: 0;
    box-shadow: none;
  }
  .x-form-set-header {
    position: relative;
    margin-bottom: 45px;
  }
  .x-form-set-header h4 {
    font-size: 20px;
    font-weight: 400;
    color: #888;
    margin-top: 0;
    padding-bottom: 14px;
    text-align: center;
  }
  .x-form-set-header:after {
    content: "";
    width: 120px;
    height: 2px;
    background: #5078cb;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    bottom: 0;
  }
  .x-required:before {
    position: relative;
    bottom: -5px;
    content: "* ";
    font-size: 18px;
    color: #f4645f;
  }
  .register label{
    font-size: 14px;
    color: #555;
    text-align: right;
    padding-right: 10px;
  }
  .next-btn{
    width: 100%;
    margin: 0 auto;
    text-align: center;
    padding-top: 30px !important;
  }
  .next-btn button{
    width: 175px;
    padding: 0;
    height: 35px;
    line-height: 35px;
    border-radius: 0;
    background: #5078cb;
    color: #fff;
    letter-spacing: 4px;
    margin-right: 20px;
  }
  .no-apply{
    width: 150px;
    height: 34px;
    line-height: 34px;
    background: #0099ff;
    text-align: center;
    border: none;
    font-size: 14px;
    color: #fff;
    margin-top: 30px;
    margin: 0 20px;
    float: right;
    border-radius: 3px;
  }
  .next-btn button:hover, .next-btn button:focus {
    background: #3765cb;
    color: #fff;
  }
  .agreement{
    width: 100%;
    margin: 0 auto;
  }
  .step-last{
    width: 92%;
    margin: 0 auto;
  }
  .step-last .h4{
    font-size: 18px;
    line-height: 40px;
    margin: 20px 0 0 0;
  }
  .step-last p.title{
    font-size: 14px;
    color: #666;
    line-height: 30px;
    text-align: left;
    width: 100% !important;
  }
  .apply-include{
    width: 100%;
    margin: 0 auto;
    height: 300px;
    border: #e8e8e8 1px solid;
    line-height: 300px;
    font-size: 18px;
    text-align: center;
  }
  /*服务协议*/
  .join_xieyi
  {
    width:703px;
    height: 356px;
    margin-top: 40px;
    margin-left: 190px;
  }
  .join_xieyi div.article-flag {
    width: 26px;
    display: inline-block;
  }
  .join_xieyi div.article-flag span {
    display: block;
    height: 176px;
    border: 1px solid;
    text-align: center;
    padding-top: 23px;
    cursor: pointer;
    background: #e5e5e5;
    color: #a0a0a0;
  }
  .join_xieyi div.article-flag span:first-child {
    border-bottom: none;
  }
  /*.join_xieyi div.article-flag span:hover {
    color: #708ed2;
    border-color: #708ed2;
    background: #fff;
  }*/
  .join_xieyi div.article-flag span.active {
    color: #708ed2;
    border-color: #708ed2;
    background: #fff;
  }

  .join_xieyi div.text-area {
    display: inline-block;
    float: right;
    width: 677px;
    height: 352px;
    overflow: auto;
    word-break: break-all;
    outline: none;
    border: 2px solid #eee;
    border-left: none;
  }
  .x-btn-blank{
    border: 1px solid #ccc;
    background: #fff;
    color: #888;
    position: relative;
    overflow: hidden;
    text-align: left;
    display: block;
    height: 34px;
    line-height: 31px;
  }
  .file-input{
    position: absolute;
    font-size: 14px;
    top: 0;
    left: 0;
    opacity: 0;
  }
  .x-btn-blank i{
    margin-left: 5px;
    color: #888;
    font-size: 16px;
    position: relative;
    top: 2px;
  }
  .register .col-sm-5 i.fa-info-circle{
    font-size: 16px;
    color: #888;
    position: relative;
    top: 2px;
    margin-right: 5px;
  }
  .register .col-sm-5 p, .register .col-sm-5 p i{
    color: red !important;
  }
  .register .col-sm-5 span.fa-map-marker, .register .col-sm-5 span.web{
    position: absolute;
    top: 1px;
    z-index: 2;
    display: block;
    width: 34px;
    height: 34px;
    line-height: 34px;
    text-align: center;
    color: #999;
    font-size: 16px;
    left: 12px;
  }
  .register .col-sm-5 span.web{
    font-size:14px;
    left:25px;
  }
  /* 开店申请模块 */
  .com-input{
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    opacity: 0;
    display: inline-block !important;
  }
  .el-upload-list--picture-card .el-upload-list__item{
    width: 160px;
    height: 120px;
    top: 69px;
  }
  div.vendor_store_apply {
    margin: 0 auto;
    width: 1026px;
    background-color: #FFFFFF;
    margin-bottom: 20px;
    margin-top: 20px;
  }

  div.vendor_store_apply .com_row {
    padding: 0 40px;
    min-height: 40px;
  }

  div.vendor_store_apply .title_row {
    margin-bottom: 20px;
    border-bottom: #e8e8e8 1px solid;
  }

  div.vendor_store_apply .custom_col {
    margin: 0;
    padding: 0;
  }

  div.vendor_store_apply .custom_col img.previewImage {
    max-width: 160px;
    max-height: 120px;
    cursor: pointer;
    /*padding: 0 30px;*/
  }

  div.vendor_store_apply .row h2 {
    padding: 10px 0;
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }

  div.vendor_store_apply .row span {
    display: block;
    padding: 10px 0;
    font-size: 14px;
    color: #000000;
  }

  div.vendor_store_apply #file_upload {
    width: 100px;
    height: 100px;
    border:1px solid #CDCDCD;
    /*background: url("static/img/vendor/images/upload.png");*/
  }

  div.vendor_store_apply #upload_qualification {
    width: 100px;
    height: 100px;
    opacity: 0;
  }

  div.vendor_store_apply .custom_tab {
    margin: 0 15px;
    width: 90px;
    text-align: center;
  }

  div.vendor_store_apply .nav li.custom_tab.active>a,
  div.vendor_store_apply .nav li.custom_tab.active>a:focus,
  div.vendor_store_apply .nav li.custom_tab.active>a:hover {
    border: 1px solid #5078CB;
    border-bottom-color: transparent;
    color: #5078cb;
  }

  div.vendor_store_apply .uploadify-button {
    display: block;
  }

  div.vendor_store_apply .custom_col .show_image_area {
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .nav-tabs{
    height: 41px;
    background: none;
    padding: 0 40px;
  }
  .nav-tabs>li>a{
    border-radius: 0;
    color: #333;
  }
  div.vendor_store_apply .btn-primary{
    background: #5078cb;
    border-radius: 0;
  }
  div.vendor_store_apply .btn-primary:hover{
    background: #3f7ae3;
  }
  div.vendor_store_apply .com_row .col-md-2{
    width: 120px;
  }
  div.vendor_store_apply .com_row .col-md-10 span{
    color: #666;
  }

  /*修改的样式*/
  div.vendor_store_apply .custom_col .show_image_area{
    position: relative;
    overflow: hidden;
  }
  .hover-show{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 120px;
    left: 0;
    background: rgba(0,0,0,.5);
  }
  div.vendor_store_apply .custom_col .show_image_area .hover-show{
    top: 0;
  }
  .hover-show .delete{
    padding: 0;
    width: 30px;
    height: 30px;
    float: right;
    text-align: center;
  }
  .hover-show .delete:hover{
    cursor: pointer;
  }
  .hover-show .delete i{
    color: #fff;
    font-size: 18px;
  }
  .hover-show a{
    display: inline-block;
    width: 100%;
    height: 60px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 60px;
  }
  .hover-show a i{
    margin-right: 5px;
    font-size: 16px;
  }
  .brand-type{
    line-height: 34px;
    font-size: 14px;
    margin: 20px 20px 5px 20px;
  }
  .brand-type .brand-small-img{
    position: relative;
    width: 84px;
    height: 84px;
    overflow: hidden;
    text-align: center;
    border: #e8e8e8 1px solid;
  }
  .brand-type .brand-small-img .preview img{
    max-width: 84px;
    max-height: 84px;
  }
  .brand-type em{
    color: #ff0000;
  }
  .brand-type .col-md-7,.brand-type .col-md-1{
    margin-top: 25px;
  }
  .brand-small-upload .file-text,.brand-type .brand-small-img{
    float: left;
  }
  .brand-small-upload .file-text{
    width: 120px;
    margin-left: 10px;
    line-height: 20px;
    margin-top: 6%;
  }
  .brand-small-upload .delete{
    float: right;
    text-align: center;
    line-height: 84px;
  }
  .brand-small-upload .delete i{
    font-size: 18px;
    color: #5078cb;
  }
  .brand-small-upload .delete:hover{
    cursor: pointer;
  }
  .brand-small-upload .delete:hover i{
    color: #f00;
  }
  .brand-small-upload .brand-small-img .hover-show{
    top: 0;
  }
  .brand-small-upload .brand-small-img .hover-show{
  }
  .brand-small-upload .brand-small-img .hover-show span i{
    color: #fff;
  }
  .brand-small-upload .brand-small-img .hover-show span.delete{
    line-height: 30px;
    padding: 0;
  }
  .brand-small-upload .brand-small-img .hover-show a{
    line-height: 30px;
    height: 30px;
  }
  .tab-content .com_row{
    margin:40px 0 0;
    border-bottom: #ccc 1px dashed;
    padding-bottom: 40px !important;
  }
  .tab-content .com_row .col-md-12{
    color: #999;
    margin-top: 20px;
    font-size: 12px;
    padding-left: 50px;
  }
  .brand-small-upload .col-md-12{
    color: #999;
    font-size: 12px;
    padding-left: 0;
  }
  .tab-content .com_row .col-md-12 em,.brand-small-upload .col-md-12 em{
    color: #f00;
  }
  .add-brand{
    text-align: center;
    border-bottom: #ccc 1px dashed;
    margin: 0 0 20px 0;
    height: 34px;
  }
  .add-brand a{
    font-size: 14px;
    color: #5078cb;
    width: 200px;
    height: 15px;
    display: inline-block;
    border: #ccc 1px dashed;
    border-top: 0;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    margin-top: 31px;
    background: #fff;
    line-height: 15px;
    text-decoration: none;
  }
  .add-brand a i{
    margin-right: 5px;
    font-size: 20px;
    vertical-align: middle;
  }
  .add-brand a em{
    position: relative;
    top: -10px;
    font-weight: bold;
    font-style: inherit;
  }
  .add-brand a:hover em{
    color: #d32526;
    text-decoration: none;
  }
  .unpass-reason {
    margin: 0 40px;
    line-height: 34px;
  }

  /* 预览框 end */

  .brand-type .dropdown-menu {
    width: 95%;
  }
  .brand-type .dropdown-menu li {
    font-size: 14px;
  }
  .com-del-box{
    position: fixed;
    z-index: 2;
    height: 152px;
    opacity: 1;
    background-color: white;
    width: 310px;
    -webkit-box-shadow: 0 5px 15px rgba(0,0,0,.5);
    box-shadow: 0 5px 15px rgba(0,0,0,.5);
    margin: -155px 0 0 -75px;
    top: 55%;
    left: 50%;
  }
  .com-del-box .title{
    height: 30px;
    background-color: #5078cb;
    text-align: right;
    padding-right: 15px;
    line-height: 30px;
  }
  .com-del-box .title a{
    color: white;
    font-size: 16px;
  }
  .com-del-box .content{
    width: 100%;
    text-align: center;
    margin: 0 auto;
  }
  .com-del-box .content p{
    line-height: 50px;
    font-size: 14px;
    padding-top: 10px;
  }
  .com-del-box .content p i{
    color: #5078cb;
    font-size: 16px;
    margin-right: 10px;
  }
  .com-del-box .content div{
    width: 100%;
    text-align: center;
    margin: 0 auto;
  }
  .com-del-box .content div a{
    width: 55px;
    height: 26px;
    line-height: 26px;
    display: inline-block;
    text-align: center;
    font-size: 14px;
  }
  .com-del-box .content div a:first-child{
    background: #b4b5b9;
    color: #333;
    margin-right: 10px;
  }
  .com-del-box .content div a:last-child{
    background: #5078cb;
    color: #fff;
  }
  .com-del-box .content div a:hover{
    background: #3f7ae3;
    color: #fff;
  }
  div.vendor_store_apply .custom_col .show_image_area{
    width: 160px;
    border: #dcdcdc 1px solid;
    margin: 0 10px 0 0;
    padding: 0;
  }
  div.vendor_store_apply .tab-content .custom_col{
    width: 280px;
  }
  div.vendor_store_apply .tab-content .custom_col:first-child{
    margin-left: 50px;
  }
  div.vendor_store_apply .custom_col .row .col-md-5:last-child{
    width: 110px;
  }
  div.vendor_store_apply .custom_col .row .col-md-5:last-child span{
    margin-top: 85% !important;
    padding-bottom: 0 !important;
  }
  .hoverShow{
    position: absolute;
    width: 30px;
    height: 30px;
    top: 0px;
    right: 0;
    background: rgba(0,0,0,.4);
    display: none;
  }

  div.vendor_store_apply .custom_col .show_image_area:hover .hoverShow{
    display: block;
  }
  div.vendor_store_apply .custom_col .show_image_area .deleteImg{
    position: absolute;
    right: 7px;
    top: 0;
    display: inline-block;
    padding: 0;
    margin-top: 6px;
    font-size: 18px;
    color: #fff;
  }
  .hover-show a{
    color: #fff;
    text-decoration: none;
  }
  .hover-show a:hover, .hover-show a:active, .hover-show a:focus{
    color: #fff;
    text-decoration: none;
  }
</style>
