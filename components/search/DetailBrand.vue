<template>
  <div class="brandDetail container" v-if="list_brands && list_brands.uuid">
    <div id="brand">
      <nuxt-link :to="`/product/brand/${list_brands.uuid}`" class="brand-logo">
        <img :src="list.logoUrl || '/images/component/default.png'" :alt="list.nameEn" :title="list.nameEn"/>
      </nuxt-link>
      <div class="brand-message">
        <div class="brand-main" v-show="list.series"><div>主营产品：</div><span>{{list.series}}</span></div>
        <div class="brand-main" v-show="applications.length>0">
          <div>应用领域：</div><span v-for="(item, index) in applications"><span>{{item}}</span><span v-show="index+1 < applications.length">|</span></span>
        </div>
        <div class="brand-main" v-show="list.brief"><div>品牌介绍：</div><span>{{list.brief}}</span></div>
        <div class="brand-main" v-show="list.url"><div>官网地址：</div><a class="office-address" :href="list.url" target="_blank">{{list.url}}</a></div>
      </div>
    </div>
    <nuxt-link :to="`/product/brand/${list_brands.uuid}`" class="brand-url">进入品牌中心</nuxt-link>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        applications: []
      }
    },
    computed: {
      list_brands () {
        return this.$store.state.searchData.searchList.lists.data.brands
      },
      list () {
        let list = this.$store.state.searchData.searchDetail.detail.data
        if (list.application && list.application !== '') {
          this.applications = list.application.split(',')
        }
        return list
      }
    }
  }
</script>

<style scoped>
  #brand{
    min-height: 160px;
  }
  .brandDetail {
    margin-top: 20px;
    width: 1190px;
    overflow: hidden;
    border-bottom: 1px solid #e5e5e5;
  }
  .brand-main{
    line-height: 20px;
    margin-left: 223px;
    margin-bottom: 10px;
  }
  .brand-main >span, .brand-main >a {
    font-weight: 500;
    font-size: 13px;
    display: inline-block;
    max-width: 92%;
  }
  .brand-main >div {
    font-size: 14px;
    font-weight: 700;
    width: 8%;
    display: inline-block;
    float: left;
  }
  .office-address{
    color: #666;
  }
  .office-address:hover{
    color: #5078cb;
    cursor: pointer;
  }
  .brandDetail .brand-logo{
    float: left;
    width: 213px;
    height: 160px;
    text-align: center;
    line-height: 100px;
  }
  .brandDetail .brand-logo img {
    width: 212px;
    height: 159px;
    border: 1px solid #ccc;
    vertical-align: middle;
  }
  .brand-url{
    color: white;
    background: #2c87d7;
    position: relative;
    left: 1088px;
    padding: 6px 8px;
    border-radius: 5px;
    bottom: 20px;
  }
</style>
