<template>
  <div id="recommends"  class="container">
    <div class="title-icon">品牌推荐</div>
    <div class="hr-blue"></div>
    <ul class="recommend-list list-unstyled list-inline">
      <li class="recommend" v-for="hotBrand in hotBrands">
        <nuxt-link :to="`/product/brand/${hotBrand.uuid}/`">
          <div class="img"><img :src="hotBrand.logoUrl || '/images/all/default.png'" /></div>
          <div class="content">
            <div class="name">
              <span :title="hotBrand.nameEn">{{hotBrand.nameEn}}</span>
            </div>
            <div class="subject">
              <strong>主营分类</strong>： <span>{{hotBrand.series}}</span> <span v-if="!hotBrand.series">未知</span>
            </div>
            <div class="description">
              <strong>品牌介绍</strong>：<span v-html="hotBrand.brief"></span> <span v-if="!hotBrand.brief">暂无简介</span>
            </div>
          </div>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'recommends',

    computed: {
      hotBrands () {
        return this.$store.state.product.brand.recommends.data
      }
    }
  }
</script>

<style>
  #newBrands .newBrands-header img {
    width: 35px;
    height: 35px;
    margin-left: 35px;
  }
  #newBrands .newBrands-body .newBrand .newBrand-img img {
    width: 100px;
    height: 60px;
    line-height: 14px;
    border: 1px solid #ccc;
  }
  #recommends {
    width: 1190px;
    padding: 0px;
  }
  .hr-blue {
    border-bottom: 2px solid #6493FF;
    border-right: 0px;
    border-top: 0px;
    border-left: 0px;
    width: 100%;
    margin-bottom: 20px;
  }
  #recommends .recommend-list {
    text-align: center;
    margin: 0;
  }
  #recommends .recommend-list .recommend {
    width: 220px;
    height: 210px;
    border: 1px solid #D6D3CE;
    margin-right: 22.5px;
    padding: 0;
    float: left;
    overflow: hidden;
  }
  #recommends .recommend-list .recommend:last-child{
    margin-right: 0px !important;
  }
  #recommends .recommend-list .recommend a {
    text-decoration: none;
  }
  #recommends .recommend-list .recommend .img{
    width: 200px;
    height: 80px;
    display: inline-block;
    overflow: hidden;
    line-height: 88px;
    text-align: center;
  }
  #recommends .recommend-list .recommend img{
    max-height: 80px;
    max-width: 200px;
  }
  #recommends .recommend-list .recommend .content {
    margin: 0 10px;
    height: 108px;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
  }
  #recommends .recommend-list .recommend .name {
    font-size: 16px;
    color: #383939;
    font-weight: 600;
    width: 200px;
    /*height: 30px;*/
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #recommends .recommend-list .recommend .subject, #recommends .recommend-list .recommend .description {
    width: 200px;
    height: 35px;
    font-size: 12px;
    color: #797979;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    max-height: 36px;
  }
  #recommends .recommend-list .recommend .description{
    /*overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;*/
    margin-top: 5px;
  }
  #recommends .recommend-list .recommend .subject span {
    width: 204px;
    white-space: pre-wrap;
    word-wrap : break-word ;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #recommends .recommend-list .recommend:hover{
    border: #5078cb 1px solid;
  }
  #recommends .recommend-list .recommend .description span {
    width: 204px;
    display: inline;
    white-space: pre-wrap;
    word-wrap : break-word ;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .title-icon {
    font-size: 24px;
    color: #323232;
    margin-bottom: 10px
  }
</style>
