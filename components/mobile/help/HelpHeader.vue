<template>
  <nav id="nav" class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <nuxt-link class="navbar-brand pull-left" to="/" style="color: #fff; font-size: 16px;">返回首页</nuxt-link>
      </div>
    </div>
  </nav>
</template>
<script>
  export default {
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/mobileCommon';
  /* nav */
  #nav {
    background-color: #474443;
    border-color: #474443;
  }
  .navbar {
    margin-bottom: 0;
    min-height: 40px;
  }
  .navbar-toggle {
    padding: 4px 5px;
  }
  .navbar-default .navbar-collapse, .navbar-default .navbar-form {
    border-color: #666666;
  }
  .navbar-default .navbar-nav>li>a {
    color: #dddddd;
  }
  .navbar-brand {
    padding: 10px 15px;
    height: 40px;
  }

</style>
