<template>
  <div class="business-opportunities">
    <div class="apply-info">
      <p class="title">如何获取商机<span></span></p>
      <p> <img src="/images/applyPurchase/title1.png" alt="">怎么样才能坐拥<span>商机</span>，<span style="color: #3c7df5; font-size: 18px;">客似云来？</span></p>
      <p> <img src="/images/applyPurchase/title2.png" alt="">优软云月均<span>三万多张采购询价单</span>，大数据将为你匹配推送<span>商机</span></p>
      <p> <img src="/images/applyPurchase/title1.png" alt="">为什么我没收到<span>推送</span>的<span>信息</span>呢？</p>
      <p> <img src="/images/applyPurchase/title2.png" alt="">您需维护您的<span>个人产品库</span>，越丰富商机越多</p>

      <img class="process" src="/images/applyPurchase/business11.png" alt="">
      <img class="process" src="/images/applyPurchase/business22.png" alt="">
      <p class="process-info">买家发出的<span>公共采购询价单</span>将会通过<span>“优软云数据中心”</span>自动匹配和精准推送给<span>个人产品库</span>的有该产品的卖家。</p>

      <img src="/images/applyPurchase/business33.png" alt="">
      <div class="case-info"><img id="case" src="/images/applyPurchase/case.png" alt=""><p class="case">买方发布“型号RHU002N06T106”的公共采购询价，“云数据中心”将匹配卖家用户的个人产品库是否有该型号，如果个人产品库有该型号即可以收到该商机推送，如果个人产品库没有该型号即收不到该商机推送。</p></div>
      <a class="last" @click="Maintenance()">去维护个人产品&nbsp;<i class="iconfont icon-arrow-right"></i></a>
    </div>
  </div>
</template>
<script>
  export default {
    computed: {
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      Maintenance: function (data) {
        if (!this.user.logged) {
          this.$message.error('请先登录')
        } else {
          let isSelf = true
          let tempEnterprise = {}
          let ens = this.user.data.enterprises
          if (ens && ens.length) {
            ens.forEach(function (item) {
              if (item.current) {
                isSelf = false
                tempEnterprise = item
              }
            })
          } else {
            isSelf = true
          }
          if (isSelf) {
            this.$message.error('请先点击【卖家中心】升级成为卖家')
          } else {
            if (tempEnterprise.isVendor === 313) {
              window.location.href = '/vendor#/vendor_upload?type=self'
            } else {
              this.$message.error('请先点击【卖家中心】升级成为卖家')
            }
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .business-opportunities{
    width: 100%;
    min-width: 1190px;
    padding: 0px;
    margin: 0;
    .apply-info{
      width: 1190px;
      margin: 0 auto;
      text-align: center;
      .title {
        width: 100%;
        font-size: 34px;
        color: #333;
        text-align: center;
        padding: 20px 0px;
        border-bottom: 1px solid #9dbbdb;
        span{
          display: block;
          width: 32px;
          height: 10px;
          margin: 0 auto;
          border-bottom: 3px solid #f35178;
          position: relative;
          top: 22px;
        }
      }
      p {
        text-align: left;
        color: #3e7cf5;
        font-size: 18px;
        padding-left: 78px;
        line-height: 24px;
        img{
         margin-right: 29px;
        }
        span{
          color: #ff0013;
          font-size: 24px;
        }
        &:nth-child(3), &:nth-child(5){
          color: #666;
          padding-top: 8px;
        }
        &:nth-child(2){
          padding-top: 8px;
        }
        &:nth-child(4){
          padding-top: 18px;
        }
      }
      .process-info{
        padding: 34px 0px 40px 0px;
        width: 900px;
        margin: 0 auto;
        font-size: 16px;
        span{
          font-size: 20px;
          font-weight: bold;
        }
      }
      .case-info{
        width: 1099px;
        margin: 0 auto;
        height: 101px;
        border-radius: 15px;
        border: dashed 1px #317be9;
        margin-top: 52px;
        padding-top: 5px;
        position: relative;
        .case{
          padding: 16px 45px 0px 100px;
          color: #fff;
          margin: 0 auto;
          font-size: 18px;
          width: 1089px;
          height: 90px;
          background-color: #317be9;
          border-radius: 10px;
          line-height: 30px;
        }
        #case{
          position: absolute;
          left: 15px;
          top: -50px;
        }
      }
      .process{
        margin-top: 8px;
      }
      .last {
        margin: 12px 0px 48px 0px;
        display: inline-block;
        width: 198px;
        height: 40px;
        background: #317be9;
        border-radius: 20px;
        line-height: 40px;
        color: #fff;
        font-size: 18px;
        text-align: center;
        .iconfont{
          color: #fff;
          font-size: 24px;
          vertical-align: middle;
        }
      }
    }
  }
</style>
