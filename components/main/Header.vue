<template>
  <div class="header clearfix">
    <div class="container">
      <!--Logo商标-->
      <div class="header-brand pull-left">
        <nuxt-link :to="'/'">
          <img src="/images/logo/uas_mall.png" class="mall-logo"/>
          <div class="mall-slogan">
            <p>For the World<br/>为世界电子产业创造价值</p>
          </div>
        </nuxt-link>
      </div>
      <!--搜索-->
      <div class="header-search pull-left">
        <search-box></search-box>
      </div>
      <!--统计-->
      <div class="header-count pull-right">
        <count-box></count-box>
      </div>
    </div>
  </div>
</template>
<script>
  import SearchBox from './Search.vue'
  import CountBox from './count/Box.vue'

  export default {
    name: 'home-header',
    components: {
      SearchBox,
      CountBox
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';

  .header {
    padding: 10px 0;

    .header-brand {

      .mall-logo {
        float: left;
      }

      .mall-slogan {
        line-height: 20px;
        font-weight: bold;
        color: $primary;
        border-left: 1px solid $primary;
        padding-left: 12px;
        margin-left: 118px;
        margin-top: 20px;
      }
    }

    .header-search {
      margin-top: 20px;
      margin-left: 75px;
    }
  }
</style>
