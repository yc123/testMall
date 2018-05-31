<template>
  <div id="mobile">
    <mobile-header></mobile-header>
    <nuxt/>
    <mobile-footer></mobile-footer>
  </div>
</template>
<script>
  import { MobileHeader, MobileFooter } from '~components/mobile'
  export default {
    name: 'mobile',
    components: {
      MobileHeader,
      MobileFooter
    },
//    middleware: 'authenticated',
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
