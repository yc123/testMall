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
              <nuxt-link :to="`/help/home`" class="box" style="font-size: 16px">
                <span>{{helpTitle.item}}</span><i class="fa fa-close"></i></nuxt-link>
                <i class="dot fa fa-angle-right"></i>
              </span>
              <nuxt-link :to="`/help/helpList/{$helpDetail.navId}`" class="box" style="font-size: 14px"><span v-text="helpDetail.title"></span><i class="fa fa-close"></i></nuxt-link>
            </div>
            <!--文章详情-->
            <div class="help-center-details" style="color: #000">
              <div class="ql-container ql-snow" v-html="helpDetail.article"></div>
              <div v-if="helpDetail.length == 0" style="color: #999;">暂无数据！</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
</div>
</template>
<script>
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
        store.dispatch('loadHelpDetail', route.params)
        // store.dispatch('loadHelpTitle', route)
      ])
    },
    computed: {
      helpTitle () {
        return this.$store.state.help.title.data
      },
      helpDetail () {
        return this.$store.state.help.detail.data
      }
    }
  }
</script>
<style>
  @import '~assets/scss/help.css';
  .help-center-details .ql-container img {
    max-width: 840px;
  }
  .ql-container.ql-snow{
    border: none;
  }
  .ql-container.ql-snow p{
    font-size: 16px;
  }
  .ql-container.ql-snow .ql-editor{
    padding: 0;
  }
  .ql-tooltip{
    display: none;
  }
</style>
