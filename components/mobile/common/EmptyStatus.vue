<template>
  <div class="com-none-state" v-else>
    <img :src="getImg()">
    <p v-text="text"></p>
    <nuxt-link to="/" v-if="showLink">返回首页</nuxt-link>
  </div>
</template>
<script>
  export default {
    props: {
      // 提示语
      text: {
        default: '暂无信息',
        type: String
      },
      // 空状态类型，控制图片展示
      type: {
        default: 'collect',
        type: String
      },
      // 是否展示返回首页
      showLink: {
        default: true,
        type: Boolean
      }
    },
    methods: {
      getImg () {
        if (this.type === 'collect') {
          return '/images/mobile/@2x/empty-collect.png'
        } else if (this.type === 'search') {
          return '/images/mobile/@2x/search-empty.png'
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .com-none-state {
    background: transparent;
    padding: 1.5rem .5rem;
    word-break: break-all;
    p {
      margin-top: .3rem;
    }
  }
</style>
