<template>
  <div class="mobile-modal" v-show="showLogin" @touchmove="preventTouchMove($event)">
    <div class="mobile-modal-box">
      <div class="mobile-modal-header">请登录后再操作<i @click="close" class="icon-guanbi iconfont"></i></div>
      <div class="mobile-modal-content">
        <span @click="onRegisterClick">立即注册</span><span @click="goLogin">马上登录</span>
        <p><i>*</i>目前手机端暂不支持开店功能，完成注册后请前往PC端操作</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'loginBox',
    props: ['url'],
    data() {
      return {
        showLogin: false
      }
    },
    methods: {
      close: function () {
        this.$emit('onLoginBoxClose')
      },
      goLogin: function () {
        this.$router.push('/auth/login?returnUrl=' + window.location.href)
      },
      onRegisterClick () {
        this.$http.get('/register/page').then(response => {
          if (response.data) {
            window.location.href = response.data.content
          }
        })
      }
    },
    mounted() {
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/micromessenger/i) && ua.match(/micromessenger/i)[0] === 'micromessenger') {
        if (this.url) {
          this.$router.push(`/mobile/wechat?url=${this.url}`)
        } else {
          this.$router.push(`/mobile/wechat`)
        }
      } else {
        // document.querySelector('html').style = 'overflow-y: hidden'
        // document.querySelector('body').style = 'overflow-y: hidden'
        this.showLogin = true
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
    p {
      font-size: .28rem;
      color: #666;
      margin-top: .2rem;
      i {
        font-style: normal;
        color: red;
        margin-right: .05rem;
      }
    }
  }
</style>
