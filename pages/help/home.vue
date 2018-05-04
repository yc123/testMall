<template>
  <div>
    <help-header></help-header>
  <div id="main">
    <div class="container" style="padding: 0; width: 1190px;">
      <div style="display: inline-block; width: 100%; margin: 0 auto">
        <div class="left">
          <left></left>
        </div>
        <div class="right">
          <div class="help-center">
            <div class="help-head">
              <nuxt-link to="/help/home"><img src="/images/help/help-title.png"></nuxt-link>
            </div>
            <div class="help-center-title">
              <nuxt-link style="font-size: 14px" :to="'/help/home'">帮助中心首页</nuxt-link>
            </div>
            <div class="help-center-home">
              <div v-for="nav01 in helpNav">
                <h4 v-text="nav01.item"></h4>
                <div class="row">
                  <div v-for="nav02 in nav01.children">
                    <em></em><nuxt-link :to="`/help/helpList/${nav02.id}`" v-text="nav02.item"></nuxt-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
//   升序
//  function compare (property) {
//    return function (a, b) {
//      var value1 = a[property]
//      var value2 = b[property]
//      return value1 - value2
//    }
//  }
  function sortBy (arr, property) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i; j < arr.length; j++) {
        if (arr[i][property] > arr[j][property]) {
          let tmp = arr[i]
          arr[i] = arr[j]
          arr[j] = tmp
        }
      }
    }
    return arr
  }
  import { left, helpHeader } from '~components/help'
  export default {
    name: 'help',
    components: {
      left,
      helpHeader
    },
    fetch ({ store }) {
      return Promise.all([
        store.dispatch('loadHelpSnapsho', { parentId: 0 })
      ])
    },
    computed: {
      helpNav () {
        let list = this.$store.state.help.snapsho.data || []
        if (list.length > 0) {
          list = sortBy(list, 'detno')
          for (let i = 0; i < list.length; i++) {
            let tem = sortBy(list[i].children, 'detno')
            list[i].children = tem
          }
        }
        return list
      }
    }
  }
</script>
<style scoped>
  @import '~assets/scss/help.css';
</style>
