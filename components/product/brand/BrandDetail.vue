<template>
  <div class="brandDetail container">
    <div class="menu-com row">
      <div class="menu-title col-md-12">
        <a href="/product/brand/brandList/ABC">品牌中心</a> > <span>{{list.nameEn}}</span></div>
    </div>
    <div id="brand">
      <div class="brand-logo">
        <img :src="list.logoUrl || '/images/component/default.png'" :alt="list.nameEn"/>
      </div>
      <div class="brand-message">
        <div class="brand-name"><span>{{list.nameEn}}</span><span v-if="list.nameCn && list.nameEn!=list.nameCn">(<span>{{list.nameCn}}</span>)</span></div>
        <div class="brand-main" v-show="list.series">主营产品：<span>{{list.series}}</span></div>
        <div class="apply-area" v-show="applications.length>0">
          应用领域：<span v-for="(item, index) in applications"><span>{{item}}</span><span v-show="index+1 < applications.length">|</span></span>
        </div>
        <div class="brand-description" v-show="list.brief">品牌介绍：<div class="txt-description">{{list.brief}}</div></div>
        <div style="margin-top: 5px;color:#666;" v-show="list.url">官网地址：<a class="office-address" :href="list.url">{{list.url}}</a></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'BrandsDetail',
    data () {
      return {
        applications: []
      }
    },
    computed: {
      list () {
        let list = this.$store.state.brandDetail.detail.data
        if (list.application && list.application !== '') {
          this.applications = list.application.split(',')
        }
        return list
      }
    }
  }
</script>
<style scoped>
  .brandDetail {
    margin-bottom: 60px;
    width: 1190px;
    padding: 0;
    overflow: hidden;
  }
  .menu-com{
    margin: 0;
  }
  .menu-title{
    line-height: 40px;
    font-size: 14px;
  }
  .menu-title a{
    color: #5078cb;
    font-size: 14px;
  }
  i{
    margin-right: 5px;
  }
  .menu-title{
    padding-left: 0;
  }
  .brand-main{
    font-size: 14px;
    color: #5078cb;
    line-height: 20px;
  }
  .apply-area{
    font-size: 14px;
    color: #5078cb;
    margin-top: 8px;
  }
  .apply-area span{
    margin-right: 5px;
  }
  .office-address{
    margin-top: 10px;
  }
  .office-address{
    color: #666;
  }
  .office-address:hover{
    color: #5078cb;
    cursor: pointer;
  }
  .brand-description{
    margin-top: 6px;
    font-size: 14px;
    color: #666;
  }
  .brand-description .txt-description{
    font-size: 14px;
    color: #666;
  }
  .brandDetail .brand-logo{
    float: left;
    width: 200px;
    height: 108px;
    text-align: center;
    line-height: 100px;
    border: 1px solid #ccc;
    background-color: #c1c1c1;
  }
  .brandDetail .brand-logo img {
    max-width: 198px;
    max-height: 106px;
    vertical-align: middle;
  }
  .brandDetail .brand-message {
    float: left;
    margin-left: 20px;
    margin-bottom: 60px;
    width: 970px;
  }
  .brandDetail .brand-message .brand-name {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 14px;
  }
  .brandDetail .brand-message .brand-description {
    font-size: 14px;
    line-height: 20px;
  }
</style>
