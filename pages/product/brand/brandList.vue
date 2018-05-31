<template>
  <div>
    <img class="banner-img" src="/images/all/banner-brandcenter.jpg" alt="">
    <recommends></recommends>
    <img class="banner-img" src="/images/all/banner-brandcenter2.jpg" alt="">
    <div id="brandsList" class="container">
      <div class="title-icon">品牌索引</div>
      <div class="hr-blue"></div>
      <ul class="row initials">
        <li class="col-xs-1 initial">
          <nuxt-link :to="'/product/brand/brandList/ABC'">ABC</nuxt-link>
        </li>
        <li class="col-xs-1 initial">
          <nuxt-link :to="'/product/brand/brandList/DEF'">DEF</nuxt-link>
        </li>
        <li class="col-xs-1 initial">
          <nuxt-link :to="'/product/brand/brandList/GHI'">GHI</nuxt-link>
        </li>
        <li class="col-xs-1 initial">
          <nuxt-link :to="'/product/brand/brandList/JKL'">JKL</nuxt-link>
        </li>
        <li class="col-xs-1 initial">
          <nuxt-link :to="'/product/brand/brandList/MNO'">MNO</nuxt-link>
        </li>
        <li class="col-xs-1 initial">
          <nuxt-link :to="'/product/brand/brandList/PQR'">PQR</nuxt-link>
        </li>
        <li class="col-xs-1 initial">
          <nuxt-link :to="'/product/brand/brandList/STU'">STU</nuxt-link>
        </li>
        <li class="col-xs-1 initial">
          <nuxt-link :to="'/product/brand/brandList/VWX'">VWX</nuxt-link>
        </li>
        <li class="col-xs-1 initial">
          <nuxt-link :to="'/product/brand/brandList/YZ'">YZ</nuxt-link>
        </li>
        <li class="col-xs-1 initial">
          <nuxt-link :to="'/product/brand/brandList/0~9'">0~9</nuxt-link>
        </li>
      </ul>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
  import { Recommends } from '~components/product'

  export default {
    layout: 'main',
    fetch ({store}) {
      return Promise.all([
        store.dispatch('product/loadRecommends')
      ])
    },
    components: {
      Recommends
    }
  }
</script>
<style scoped>
  .router-link-exact-active{
    color: #5078CB;
    font-weight: bold;
  }
</style>
