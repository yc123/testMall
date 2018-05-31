<template>
  <!-- 移动端上拉加载更多 -->
</template>
<script>
  export default {
    props: {
      searchMore: {
        type: Boolean
      },
      allPage: {
        type: Number
      },
      page: {
        type: Number
      },
      fixId: {
        type: String,
        default: null
      },
      isValid: {
        type: Boolean,
        default: true
      }
    },
    mounted () {
      let _this = this
      _this.$nextTick(function () {
        let obj = this.fixId ? document.getElementById(this.fixId) : window
        obj.addEventListener('scroll', function () {
          if (_this.isValid) {
            _this.scroll()
          }
        }, false)
      })
    },
    methods: {
      scroll: function () {
        let scrolled = 0
        let height = 0
//        console.log(document.getElementById(this.fixId).scrollHeight)
//        console.log(document.getElementById(this.fixId).scrollTop + window.screen.availHeight + '-------')
        if (this.fixId) {
          let obj = document.getElementById(this.fixId)
          height = obj.scrollHeight
          scrolled = obj.scrollTop - 88
        } else {
          height = document.body.scrollHeight
          scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        }
        if (Math.ceil(scrolled + window.screen.availHeight) >= height && !this.searchMore && this.page < this.allPage) {
          this.getMore()
        }
      },
      getMore: function () {
        if (!this.searchMore) {
          this.$emit('pullUpAction')
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
