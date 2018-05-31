<template>
  <nav class="nav-list">
    <div class="container">
      <nuxt-link to="/product" class="item item-first">
        <div>器件选型</div>
      </nuxt-link>
      <nuxt-link :to="'/'" class="item" exact>
        <span>首&nbsp;&nbsp;页</span>
      </nuxt-link>
      <nuxt-link to="/product" class="item">
        <span>品牌中心</span>
      </nuxt-link>
      <nuxt-link to="/provider/factories" class="item">
        <span>原厂专区</span>
      </nuxt-link>
      <nuxt-link to="/provider/home" class="item">
        <span>代理经销</span>
      </nuxt-link>
     <!-- <nuxt-link to="/product/original" class="item">
        <span>热卖推荐</span>
      </nuxt-link>-->
      <nuxt-link to="/product" class="item" target="_blank">
        <span>库存寄售</span>
      </nuxt-link>
      <nuxt-link to="/news" class="item">
        <span>优软快讯</span>
      </nuxt-link>
    </div>
  </nav>
</template>
<script>
  export default {
    name: 'navView'
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';
  $nav-height: 40px;
 .container{
    padding: 0;
  }
  .nav-list {
    background-color: rgb(244, 248, 255);
    height: $nav-height;

    .item {
      display: inline-block;
      height: $nav-height;
      line-height: $nav-height;
      margin: 0 15px;
      color: $black-light;

      > span {
        padding: 5px 2px;
      }

      &.nuxt-link-active, &:hover {
        > span {
          color: #5078cb;
          border-bottom: #5078cb 3px solid;
          font-weight: bold;
        }
      }

      &.item-first {
        width: 200px;
        margin: 0;
        background-color: rgb(33, 71, 151);
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        color: #fff;
        cursor: pointer;
      }
    }
  }
</style>
