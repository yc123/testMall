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
              <nuxt-link :to="'/help/home'" style="font-size: 14px">帮助中心首页<i class="fa fa-angle-right"></i></nuxt-link>
              <span>
                <nuxt-link :to="`/help/home`" class="box" style="font-size: 16px"><span>{{helpTitle.item}}</span><i class="fa fa-close"></i></nuxt-link>
              </span>
            </div>
            <!-- 文章列表-->
            <div class="help-center-list">
              <h4>问题知识列表</h4>
              <ul>
                <li v-for="list in helpList">
                  <em></em>
                  <nuxt-link :to="`/help/helpDetail/${list.num}`" v-text="list.title" :title="list.title"></nuxt-link>
                </li>
                <li v-if="helpList.length == 0" style="color: #999;">暂无数据！</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  // 升序
  function compare (property) {
    return function (a, b) {
      var value1 = a[property]
      var value2 = b[property]
      return value1 - value2
    }
  }
  import { left, helpHeader } from '~components/help'
  export default {
    name: 'help',
    components: {
      left,
      helpHeader
    },
    fetch ({ store, route }) {
      return Promise.all([
        store.dispatch('loadHelpSnapsho', { parentId: 0 }),
        store.dispatch('loadHelpList', { navId: route.params.id }),
        store.dispatch('loadHelpTitle', route.params)
      ])
    },
    computed: {
      helpTitle () {
        return this.$store.state.help.title.data
      },
      helpList () {
        return [...this.$store.state.help.helplist.data].sort(compare('detno'))
      }
    }
  }
</script>
<style scoped>
  @import '~assets/scss/help.css';
</style>
