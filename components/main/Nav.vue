<template>
  <nav class="nav-list">
    <div class="container">
      <nuxt-link to="/product/kind/home" class="item item-first">
        <div>器件选型</div>
      </nuxt-link>
      <nuxt-link :to="'/'" class="item" exact>
        <span>首&nbsp;&nbsp;页</span>
      </nuxt-link>
      <nuxt-link to="/applyPurchase" class="item">
        <span>询价求购</span>
        <img class="new-animate" src="/images/all/banner-cuxiao03.png" alt="">
      </nuxt-link>
      <nuxt-link to="/supplier" class="item">
        <span>供应商</span>
      </nuxt-link>
      <a class="item expand-item" :class="{'active': isActive}">
        <span>{{name}}
          <i class="iconfont icon-arrow-down"></i>
          <i class="iconfont icon-arrow-up"></i>
        </span>
        <ul class="expand-list" v-if="isMounted">
          <nuxt-link to="/provider/factories" tag="li" v-show="name !== '原厂专区'">
            <!--<nuxt-link to="/provider/factories">原厂专区</nuxt-link>-->
            <span>原厂专区</span>
          </nuxt-link>
          <nuxt-link to="/provider/home" tag="li" v-show="name !== '代理经销'">
            <span>代理经销</span>
          </nuxt-link>
          <li @click="open('/store/33069557578d44e69bd91ad12d28a8d4')">
            <span>库存寄售</span>
          </li>
        </ul>
      </a>
      <nuxt-link to="/product/brand/brandList/ABC" class="item">
        <span>品牌墙</span>
      </nuxt-link>
      <nuxt-link to="/news" class="item">
        <span>优软快讯</span>
      </nuxt-link>
    </div>
  </nav>
</template>
<script>
  export default {
    name: 'navView',
    data () {
      return {
        isMounted: false
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.isMounted = true
      })
    },
    computed: {
      name () {
        let path = this.$route.path
        if (path === '/provider/factories') {
          return '原厂专区'
        } else if (path === '/provider/home') {
          return '代理经销'
        } else {
          return '店  铺'
        }
      },
      isActive () {
        return (this.$route.path === '/provider/factories' && this.name === '原厂专区') || (this.$route.path === '/provider/home' && this.name === '代理经销')
      }
    },
    methods: {
      open (url) {
        window.open(url)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';
  $nav-height: 40px;
  .nav-list a span{
    font-size: 14px;
  }
  .nav-list {
    background-color: rgb(244, 248, 255);
    height: $nav-height;

    .item {
      display: inline-block;
      height: $nav-height;
      line-height: $nav-height;
      width: 126px;
      text-align: center;
      margin: 0;
      vertical-align: middle;
      color: $black-light;

      > span {
        padding: 5px 2px;
      }

      &.nuxt-link-active, &.active, &:not(.expand-item):hover {
        > span {
          color: #5078cb;
          border-bottom: #5078cb 3px solid;
          font-weight: bold;
        }
      }

      &.expand-item {
        position: relative;
        .expand-list {
          z-index: 10;
          position: absolute;
          left: 8px;
          top: 40px;
          background: #fff;
          width: 106px;
          border-radius: 2px;
          display: none;
          -webkit-box-shadow: 0 1px 12px 0 rgba(0,0,0,.2);
          -moz-box-shadow: 0 1px 12px 0 rgba(0,0,0,.2);
          box-shadow: 0 1px 12px 0 rgba(0,0,0,.2);
          li {
            height: 34px;
            line-height: 34px;
            text-align: center;
            span {
              color: #666;
            }
            &:hover {
              background: #5078cb;
              span {
                color: #fff;
              }
            }
          }
        }
        .icon-arrow-up {
          display: none;
        }
        &:hover {
          color: #2147f9;
          .expand-list {
            display: block;
          }
          .icon-arrow-up {
            display: inline-block;
          }
          .icon-arrow-down {
            display: none;
          }
        }
      }

      &.item-first {
        width: 200px;
        margin: 0;
        background-color: rgb(33, 71, 151);
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        color: #fff;
        cursor: pointer;
      }
    }
  }
</style>
