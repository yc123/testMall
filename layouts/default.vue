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
      isInFrame () {
        let cookies = this.$store.state.option.cookies
        let cookieArr = cookies.split(';')
        let cookieObj = {}
        for (let i = 0; i < cookieArr.length; i++) {
          if (cookieArr[i].indexOf('=') > -1) {
            let tmpArr = cookieArr[i].split('=')
            cookieObj[tmpArr[0].trim()] = tmpArr[1].trim()
          }
        }
        return cookieObj.type === 'erp'
      },
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
