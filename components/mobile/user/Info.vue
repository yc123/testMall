<template>
  <div class="mobile-fix-content">
    <div class="info">
      <div class="line">
        <span>用户名：</span>
        {{info.userName}}
      </div>
      <div class="line">
        <span>手机：</span>
        {{info.userTel}}
      </div>
      <div class="line">
        <span>邮箱：</span>
        {{info.userEmail}}
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      info: {
        default: {},
        type: Object
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mobile-fix-content {
    background: #f1f3f6;
  }
  .info {
    width: 7.1rem;
    background: #fff;
    margin: 0 auto;
    height: 3.5rem;
    padding: 0 .24rem;
    font-size: .28rem;
    color: #999;
    border-radius: .05rem;
    margin-top: .3rem;
    .line {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 1.16rem;
      line-height: 1.16rem;
      border-bottom: .01rem solid #d9d9d9;
      &:last-child {
        border-bottom: none;
      }
      span {
        margin-left: .56rem;
        display: inline-block;
        width: 1.2rem;
        text-align: right;
      }
    }
  }
</style>
