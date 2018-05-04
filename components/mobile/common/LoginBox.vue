<template>
  <div class="mobile-modal">
    <div class="mobile-modal-box">
      <div class="mobile-modal-header">请登录后再操作<i @click="close" class="icon-guanbi iconfont"></i></div>
      <div class="mobile-modal-content">
        <span @click="close">暂不登录</span><span @click="goLogin">马上登录</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'loginBox',
    methods: {
      close: function () {
        this.$emit('onLoginBoxClose')
      },
      goLogin: function () {
        this.$router.push('/auth/login?returnUrl=' + window.location.href)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mobile-modal-content {
    padding: .54rem !important;
    text-align: center;
    span {
      display: inline-block;
      width: 1.5rem;
      height: .6rem;
      line-height: .6rem;
      text-align: center;
      background: #418df6;
      color: #fff;
      border-radius: .1rem;
      &:first-child {
        margin-right: .5rem;
      }
    }
  }
</style>
