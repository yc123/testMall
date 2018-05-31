<template>
  <div class="container news-container">
    <left></left>
    <right @pageEvent="listenChild"></right>
  </div>
</template>

<script>
  import { Left, Right } from '~components/news'
  export default {
    layout: 'main',
    data () {
      return {
        pageSize: 10,
        nowPage: 1
      }
    },
    fetch ({ store }) {
      return Promise.all([
        store.dispatch('newsData/loadAllNews', { page: this.nowPage, pageSize: this.pageSize }),
        store.dispatch('newsData/loadHotNews')
      ])
    },
    components: {
      Left,
      Right
    },
    methods: {
      listenChild: function (nPage) {
        this.nowPage = nPage
        this.$store.dispatch('newsData/loadAllNews', { page: this.nowPage, pageSize: this.pageSize })
      }
    }

  }
</script>

<style scoped>
  body{
    font-size: 14px!important;
  }
  .news-container{
    margin-top: 15px;
  }
</style>
