<template>
  <div class="com-remind-box" v-show="showBox">
    <div>{{title}}</div>
  </div>
</template>
<script>
  export default {
    props: ['title', 'timeoutCount'],
    data () {
      return {
        showBox: false,
        timer: ''
      }
    },
    watch: {
      timeoutCount: function (val, oldVal) {
        if (val > 0) {
          clearTimeout(this.timer)
          this.setTimer()
        } else {
          this.showBox = false
        }
      }
    },
    methods: {
      setTimer: function () {
        let _this = this
        _this.showBox = true
        let timeout = 1000
        if (_this.title === '收藏成功' || _this.title === '取消成功') {
          timeout = 1000
        } else {
          timeout = 1500
        }
        _this.timer = setTimeout(function () {
          _this.showBox = false
        }, timeout)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .com-remind-box{
    position: fixed;
    top: 50%;
    left: 0;
    right: 0;
    margin-top: -.6rem;
    z-index: 10000;
    div {
      background: rgba(0,0,0,.6);
      color: #fff;
      font-size: .28rem;
      padding: .44rem .51rem;
      border-radius: .1rem;
      width: max-content;
      margin: 0 auto;
      max-width: 70%;
    }
  }
</style>
