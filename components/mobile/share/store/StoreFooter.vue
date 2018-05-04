<template>
  <div class="share-store-footer">
    <div class="more">
      <div class="hr"></div>
      <p>如需查看更多器件请前往<nuxt-link to="/">优软商城</nuxt-link></p>
      <div class="hr"></div>
    </div>
    <div class="info">
      <!-- <img src="/images/mobile/@2x/shareStore/store-info.png" alt=""> -->
      <div class="share_title"><span></span><a>店铺信息</a></div>
      <div class="info-line">
        <div class="fl">
          <img src="/images/mobile/@2x/shareStore/phone.png" alt="">
          <span>联系电话</span>
        </div>
        <div class="fr">{{storeInfo.enterprise.enTel || '无'}}</div>
      </div>
      <div class="info-line">
        <div class="fl">
          <img src="/images/mobile/@2x/shareStore/fax.png" alt="">
          <span>传真</span>
        </div>
        <div class="fr">{{storeInfo.enterprise.enFax || '无'}}</div>
      </div>
      <div class="info-line">
        <div class="fl">
          <img src="/images/mobile/@2x/shareStore/address.png" alt="">
          <span>公司地址</span>
        </div>
        <div class="fr">{{storeInfo.enterprise.address || storeInfo.enterprise.enAddress}}</div>
      </div>
    </div>
    <div class="company">
      <div class="hr"></div>
      <img src="/images/mobile/@2x/shareStore/logo.png" alt="">
      <div class="hr right"></div>
      <p>此页面由深圳市优软商城科技有限公司提供</p>
      <a href="https://www.usoftmall.com">www.usoftmall.com</a>
    </div>
  </div>
</template>
<script>
  export default {
    computed: {
      storeInfo () {
        return this.$store.state.shop.storeInfo.store.data
      }
    }
  }
</script>
<style lang="scss" scoped>
    .share-store-footer {
      .share_title {
        font-weight: bold;
        display: inline-block;
        span {
          width: 0.08rem;
          height: 0.3rem;
          line-height: 0.3rem;
          background-image: linear-gradient(90deg, 
            #7188ff 0%, 
            #6066fe 84%, 
            #4f44fd 100%), 
          linear-gradient(
            #000000, 
            #000000);
          display: inline-block;
          margin-top: 0.02rem;
          margin-right: 0.09rem;
          vertical-align: top;
        }
        a {
          font-size: 0.28rem;
          color: #09061e;
          display: inline-block;
          vertical-align: top;
        }
      }
      .more {
        height: .82rem;
        line-height: .82rem;
        font-size: .28rem;
        background: #f4f4f4;
        text-align: center;
        position: relative;
        p {
          color: #a9a9aa;
          a {
            color: #2f50f7;
          }
        }
        .hr {
          width: 1.09rem;
          height: .02rem;
          background: #d9d9d9;
          position: absolute;
          left: .47rem;
          top: .4rem;
          &:last-child {
            right: .47rem;
            left: auto;
          }
        }
      }
      .info {
        height: 2.82rem;
        background: #fff;
        padding: .19rem .38rem 0 .35rem ;
        > img {
          width: 1.38rem;
          height: .45rem;
          margin-bottom: .25rem;
        }
        .info-line {
          margin-top: .2rem;
          height: .28rem;
          .fl {
            > img {
              width: .28rem;
              height: .28rem;
            }
            span {
              font-size: .26rem;
              color: #3c3c3c;
              line-height: .28rem;
              margin-left: .18rem;
            }
          }
          .fr {
            font-size: .26rem;
            color: #fb6f03;
            line-height: .28rem;
            max-width: 4.2rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .company {
        position: relative;
        height: 1.36rem;
        background: #f4f4f4;
        text-align: center;
        img {
          width: 1.15rem;
          height: .23rem;
          margin-top: .24rem;
        }
        p {
          font-size: .21rem;
          color: #aaa;
          margin: .13rem 0 0 0;
        }
        a {
          margin-top: .12rem;
          font-size: .18rem;
          color: #bbb;
        }
        .hr {
          width: 1.09rem;
          height: .02rem;
          background: #d9d9d9;
          position: absolute;
          left: 1.94rem;
          top: .35rem;
          &.right {
            right: 1.94rem;
            left: auto;
          }
        }
      }
    }
</style>
