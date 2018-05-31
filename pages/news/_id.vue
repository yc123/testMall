<template>
  <div class="container">
    <div class="menu-title" style="margin: 10px 0"><nuxt-link to="/news">优软快讯</nuxt-link> &gt; <span>资讯详情</span></div>
    <left></left>
    <detail></detail>
  </div>
</template>
<script>
  import Left from '~components/news/Left.vue'
  import Detail from '~components/news/Detail.vue'
  export default {
    layout: 'main',
    fetch ({store, route}) {
      return Promise.all([
        store.dispatch('newsData/loadHotNews'),
        store.dispatch('newsData/loadDetailNews', {id: route.params.id})
      ])
    },
    components: {
      Left,
      Detail
    }
  }
</script>
