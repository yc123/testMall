<template>
  <div class="com-del-box link-saler-box">
    <div class="title">
      <i @click="cancel()"></i>
    </div>
    <div class="content">
      <p><i class="fa fa-exclamation-circle"></i>抱歉，暂时无法与{{target == 'saler' ? '卖' : '买'}}家在线沟通！</p>
      <p>{{target == 'saler' ? '卖' : '买'}}家联系电话：<span v-text="tel"></span></p>
      <div>
        <a @click="cancel()">我知道了</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      tel: {
        default: '',
        type: String
      },
      target: {
        default: 'saler',
        type: String
      }
    },
    methods: {
      cancel: function () {
        this.$emit('cancelAction')
      }
    }
  }
</script>
<style lang="scss" scoped>
  .link-saler-box {
    width: 289px;
    height: auto;
    min-height: auto;
    border-radius: 2px;
    .title {
      background-color: #4290f7;
      height: 22px;
      line-height: 22px;
      margin-bottom: 20px;
    }
    .content {
      p {
        line-height: 20px;
        padding-top: 0;
        i {
          color: #4290f7;
          margin-right: 4px;
        }
        span {
          color: #f62d37;
        }
      }
      div {
        a {
          width: 78px;
          background: #4290f7;
          margin: 18px 0 13px 0;
          border-radius: 2px;
        }
      }
    }
  }
</style>
