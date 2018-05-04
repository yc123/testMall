<template>
  <div class="mobile-brand-center mobile-content">
    <div class="mobile-brand-wrap">
      <div class="mobile-brand-header">
        <img src="/images/mobile/@2x/brand/brandWall.png" alt="">
        <div class="mobile-brand-index" :class="{'scrolled': isScrolled}">
          <p>索引：</p>
          <nuxt-link :to="'/mobile/brand/brandCenter/' + item"
                     :class="{'active': item == activeIndex}"
                     :key="key" v-for="(item, key) in initArr">{{item}}</nuxt-link>
        </div>
      </div>
      <div class="mobile-brand-list">
        <div v-for="(brands, initial) in brandList">
          <div class="brand-initial">
            <p v-text="initial" :style="initial === '0~9' ? 'font-size: .28rem': 'font-size: .32rem'"></p>
            <span>
              {{initial}}开头共<span>{{brands.length || 0}}</span>个品牌
            </span>
          </div>
          <div class="brand-items">
            <nuxt-link :to="`/mobile/brand/${brand.uuid}/`" :key="key" v-for="(brand, key) in brands">
              <div>{{brand.nameEn}}</div>
              <div v-if="brand.nameCn != brand.nameEn">{{brand.nameCn}}</div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  function sortList (letter) {
    return function (a, b) {
      var value1 = a[letter]
      var value2 = b[letter]
      if (value1 > value2) {
        return 1
      } else if (value1 < value2) {
        return -1
      } else {
        return 0
      }
    }
  }
  export default {
    name: 'brandList',
    data () {
      return {
        initArr: [
          'ABCD', 'EFGH', 'IJKL', 'MNOP', 'QRST', 'UVWX', 'YZ', '0~9'
        ],
        activeIndex: this.$route.params.initial,
        isScrolled: false
      }
    },
    mounted: function () {
      let _this = this
      _this.$nextTick(function () {
        window.addEventListener('scroll', function () {
          _this.onScroll()
        }, false)
      })
    },
    watch: {
      $route: function (val, oldVal) {
        this.activeIndex = val.params.initial
      }
    },
    computed: {
      brandList () {
        let brandsList = this.$store.state.product.brand.brandList.data
        if (brandsList) {
          for (let i in brandsList) {
            brandsList[i] = brandsList[i].sort(sortList('nameEn'))
          }
        }
        let temp = {}
        let keys = []
        for (let key in brandsList) {
          keys.push(key)
        }
        keys = keys.sort()
        for (let i = 0; i < keys.length; i++) {
          temp[keys[i]] = brandsList[keys[i]]
        }
        return temp
      }
    },
    methods: {
      onScroll () {
        if (this.startWith(this.$route.path, '/mobile/brand/brandCenter')) {
          let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
          this.isScrolled = scrolled > 0
        }
      },
      startWith: function (str, s) {
        let reg = new RegExp('^' + s)
        return reg.test(str)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mobile-brand-center {
    margin-bottom: .98rem;
    width: 100%;
    background: #f7f7f7;
    padding-top: .24rem;
    .mobile-brand-wrap {
      width: 6.96rem;
      background: #fff;
      margin: 0 auto;
      padding: 0 .21rem;
      border-radius: .1rem;
      .mobile-brand-header {
        text-align: center;
        >img {
          margin: .24rem auto .19rem;
          width: 6.09rem;
          height: .66rem;
        }
        .mobile-brand-index {
          font-size: .3rem;
          line-height: .62rem;
          background: #f4fafd;
          margin: .19rem 0 .25rem 0;
          padding: 0 .07rem;
          text-align: left;
          p {
            float: left;
          }
          a {
            color: #666;
            width: 1.1rem;
            display: inline-block;
            text-align: center;
            &.active, &.hover, &.focus {
              color: #418bf6;
            }
          }
          &.scrolled {
            position: fixed;
            top: .88rem;
            width: 100%;
            background: #fff;
            border-bottom: .04rem solid #ccc;
            left: 0;
            padding-left: .58rem;
            margin-top: 0;
          }
        }
      }
      .mobile-brand-list {
        font-size: .3rem;
        .brand-initial {
          border-bottom: .04rem solid #418bf6;
          p {
            width: .64rem;
            height: .43rem;
            line-height: .43rem;
            margin: 0;
            background: #418bf6;
            color: #fff;
            font-size: .32rem;
            text-align: center;
            display: inline-block;
            border-top-left-radius: .05rem;
            border-top-right-radius: .05rem;
          }
          >span {
            font-size: .22rem;
            color: #999;
            >span {
              color: #418bf6;
            }
          }
        }
        .brand-items {
          overflow: hidden;
          margin-bottom: .2rem;
          a {
            overflow: hidden;
            display: inline-block;
            color: #333;
            border-radius: .05rem;
            background: #fff;
            margin: .18rem .42rem .12rem 0;
            height: .78rem;
            float: left;
            &:nth-child(3n) {
              margin-right: 0;
            }
            &:active {
              color: #418bf6;
            }
            div {
              width: 1.9rem;
              height: .39rem;
              line-height: .39rem;
              text-align: left;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              &:nth-child(2) {
                font-size: .26rem;
                color: #666;
              }
            }
          }
        }
      }
    }
  }

</style>
