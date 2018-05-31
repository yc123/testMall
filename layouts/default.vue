<template>
  <div id="app">
    <header-view v-if="!isInFrame"></header-view>
    <nuxt/>
    <footer-view></footer-view>
    <right-bar></right-bar>
  </div>
</template>
<script>
  import { Header, Footer, RightBar } from '~components/default'

  export default {
    name: 'app',
    components: {
      HeaderView: Header,
      FooterView: Footer,
      RightBar
    },
    head () {
      return {
        title: this.title
      }
    },
    computed: {
      title () {
        let path = this.$route.path
        if (path.startsWith('/help/helpList/')) {
          return this.helpTitle.item + '-优软商城'
        } else if (path.startsWith('/help/helpDetail')) {
          return this.helpDetail.title + '-优软商城'
        } else if (path.startsWith('/help')) {
          return '帮助中心-优软商城'
        } else {
          return '【优软商城】IC电子元器件现货采购交易平台商城'
        }
      },
      helpTitle () {
        return this.$store.state.help.title.data
      },
      helpDetail () {
        return this.$store.state.help.detail.data
      }
    }
  }
</script>
