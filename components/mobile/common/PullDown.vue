<template>
  <div class="loading" v-show="isSearchingMore">
    <img src="/images/all/loading.gif" alt="">
  </div>
</template>
<script>
  export default {
    data () {
      return {
        isSearchingMore: false,
        searchLists: [],
        page: 1
      }
    },
    props: ['searchMore', 'allPage', 'count'],
    mounted: function () {
      let _this = this
      _this.$nextTick(function () {
        window.addEventListener('scroll', function () {
          _this.scroll()
        }, false)
      })
    },
    methods: {
      scroll: function () {
        let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (Math.ceil(scrolled + window.screen.availHeight) >= document.body.scrollHeight && !this.isSearchingMore && this.page < this.allPage) {
          this.getMore()
        }
      },
      getMore: function () {
        if (!this.isSearchingMore) {
          this.page++
          this.isSearchingMore = true
          this.searchMore(this.page, this.count)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .loading {
    text-align: center;
    background: #fff;
    >img {
      width: .64rem;
      height: .64rem;
      margin: .2rem 0;
    }
  }
</style>
