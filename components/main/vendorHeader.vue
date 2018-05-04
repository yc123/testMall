<template>
  <div class="user_header clearfix">
    <div class="container">
      <!--Logo商标-->
      <div class="user_header-brand pull-left">
        <nuxt-link :to="'/'">
          <img src="/images/vendor/logo.png" class="mall-logo"/>
          <!-- <div class="mall-slogan">
            <p>For the World<br/>为世界电子产业创造价值</p>
          </div> -->
        </nuxt-link>
      </div>
      <!--搜索-->
      <div class="user_header-search">
        <search-box :SelectItem="false"></search-box>
      </div>
      <!--统计-->
      <!-- <div class="header-count pull-right">
        <count-box></count-box>
      </div> -->
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

.user_header {
  width: 100%;
  margin: 0px auto;
  height: 80px;
  background: #5078cb;
  .user_header-brand {
    .mall-logo {
      margin-top: 15px;
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

  .user_header-search {
    margin-top: 20px;
    margin-left: 75px;
    float: right
  }
}
</style>
