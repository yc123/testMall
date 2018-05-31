<template>
  <div class="Content404">
    <div class="image404">
      <div class="bottomText">
        <div class="title">
          <template v-if="title=== '产品'">
            抱歉！您查看的{{title}}
            <span>不存在</span>，可能已
            <span>下架</span>或
            <span>被转移</span>......
          </template>
          <template v-else>
            抱歉！您查看的{{title}}
            <span>不存在</span>......
          </template>
        </div>
        <div class="infotext" v-if="title==='店铺' || title==='器件' || title==='类目'">您可以逛逛：
          <nuxt-link :to="{ path: '/'}">商城首页</nuxt-link>
          <span>|</span>
          <nuxt-link :to="{ path: '/provider/factories'}">原厂专区</nuxt-link>
          <span>|</span>
          <nuxt-link :to="{ path: '/provider/home'}">代理经销</nuxt-link>
        </div>

        <div class="infotext" v-else-if="title==='品牌'">您可以逛逛：
          <nuxt-link :to="{ path: '/'}">商城首页</nuxt-link>
          <span>|</span>
          <nuxt-link :to="{ path: '/product/brand/brandList/ABC'}">品牌中心</nuxt-link>
          <span>|</span>
          <nuxt-link :to="{ path: '/provider/factories'}">原厂专区</nuxt-link>
        </div>

        <div class="infotext" v-else-if="title==='产品'">您可以逛逛：
          <nuxt-link :to="{ path: '/'}">商城首页</nuxt-link>
          <span>|</span>
          <nuxt-link :to="{ path: '/provider/home'}">代理经销</nuxt-link>
          <span>|</span>
          <nuxt-link :to="{ name: 'store-uuid', params: { uuid: '33069557578d44e69bd91ad12d28a8d4' }}">库存寄售</nuxt-link>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.Content404 {
  background: #fff;
  text-align: center;
  .image404 {
    position: relative;
    background: url('/images/404-details.png') top center no-repeat;
    height: 500px;
    position: relative;
    text-align: center;
    margin: 0 auto;
    color: #666;
    font-weight: bold;
    font-size: 24px;
    .bottomText {
      position: absolute;
      width: 100%;
      bottom: 70px;
      .title span {
        color: #fd7022;
      }
      .infotext {
        margin-top: 25px;
        color: #959494;
        font-size: 14px;
        span {
          margin: 0 6px;
        }
        a {
          color: #5078CB
        }
        a:hover {
          color: #fd7022
        }
      }
    }
  }
}
</style>
