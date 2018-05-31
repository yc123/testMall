<template>
  <div id="mobile-store">
    <nuxt/>
  </div>
</template>
<script>
  export default {
    name: 'mobile-store',
    head () {
      return {
        meta: [
          { name: 'apple-mobile-web-app-capable', content: 'yes' },
          { name: 'MobileOptimized', content: '320' },
          { name: 'HandheldFriendly', content: 'true' },
          { name: 'viewport', content: 'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no' },
          { 'http-equiv': 'Cache-Control', content: 'no-siteapp' },
          { name: 'format-detection', content: 'telephone=no, email=no' }
        ]
      }
    }
  }
</script>
<style lang="scss">
  @import '~assets/scss/mobileCommon';
</style>
