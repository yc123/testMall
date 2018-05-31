<template>
  <div class="error">
    <div class="section" :class="{'mobile-page': isMobile}">
      <div class="container">
        <div class="btn-click">
          <a href="/"><i class="fa fa-home" style="margin-right:5px;"></i>返回首页</a>
          <a href="javascript:history.go(-1)"><i class="fa fa-reply" style="margin-right:5px;"></i>返回上一页</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['error'],
    layout (context) {
      return context.store.state.option.isMobile ? 'login' : 'default'
    },
    computed: {
      isMobile () {
        return this.$store.state.option.isMobile
      }
//      background () {
//        return this.isMobile ? '#ebfdff url("/images/404-mobile.png")no-repeat center center' : '#ebfdff url("/images/404.png")no-repeat center center'
//      }
    }
  }
</script>

<style scoped lang="scss">
  .section{
    background: #ebfdff url('/images/404.png')no-repeat center center;
    height:900px;
    position:relative;
    .btn-click{
      position:absolute;
      top:54%;
      left:50%;
      margin-left:-150px;
      a{
        display:inline-block;
        width:130px;
        height:33px;
        font-size: 16px;
        line-height: 33px;
        color:#fff;
        background: #f87c29;
        text-align: center;
        margin:0 10px;
        border-radius: 2px;
        text-decoration: none;
      }
    }
    &.mobile-page {
      background: #ebfdff url("/images/404-mobile.png")no-repeat;
      background-size: contain;
      background-position-y: 3rem;
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      height: auto;
      .btn-click{
        top: 66%;
        left: 1.2rem;
        margin-left: 0;
        a{
          width: 2.3rem;
          height: .63rem;
          font-size: .32rem;
          line-height: .63rem;
          margin: 0 .1rem;
          border-radius: .04rem;
        }
      }
    }
  }
</style>
