<template>
  <div id="main">
    <header-view v-if="!isMobile"></header-view>
    <main-header v-if="!isMobile"></main-header>
    <main-nav v-if="!isMobile"></main-nav>
    <help-header v-if="isMobile"></help-header>
    <nuxt/>
    <footer-view v-if="!isMobile"></footer-view>
    <right-bar v-if="!isMobile"></right-bar>
    <help-footer v-else></help-footer>
  </div>
</template>
<script>
  import { Header, Footer, RightBar } from '~components/default'
  import { MainHeader, MainNav } from '~components/main'
  import { HelpHeader, HelpFooter } from '~components/mobile/help'
  export default {
    name: 'help',
    components: {
      HeaderView: Header,
      FooterView: Footer,
      RightBar,
      MainHeader,
      MainNav,
      HelpHeader,
      HelpFooter
    },
    computed: {
      isMobile: function () {
        return this.$store.state.option.isMobile
      }
    }
  }
</script>
