<template>
  <div class="apply-footer">
    <div class="good-provider">
      <h1>优秀供应商</h1>
      <p>海量求购&nbsp;一网打尽</p>
      <div class="provider-list">
        <div class="provider-item">
          <div class="logo-wrap">
            <img src="/images/applyPurchase/test-logo.png" alt="">
          </div>
          <div class="desc-wrap">123333333333333333333333333333333333333333</div>
        </div>
        <div class="provider-item">
          <div class="logo-wrap">
            <img src="/images/applyPurchase/test-logo.png" alt="">
          </div>
          <div class="desc-wrap">123333333333333333333333333333333333333333</div>
        </div>
        <div class="provider-item">
          <div class="logo-wrap">
            <img src="/images/applyPurchase/test-logo.png" alt="">
          </div>
          <div class="desc-wrap">123333333333333333333333333333333333333333</div>
        </div>
      </div>
    </div>
    <div class="turnover-exap">
      <h1>成交案例</h1>
      <p>海量求购&nbsp;一网打尽</p>
      <div class="exap-list">
        <div class="exap-item">
          <div class="logo-wrap">
            <img src="/images/applyPurchase/test-logo.png" alt="">
          </div>
          <div class="desc-wrap">
            收到供应商报价：<span class="red-text">103</span>条
          </div>
          <div class="desc-wrap">
            已完成采购：<span class="red-text">103</span>条
          </div>
        </div>
        <div class="exap-item">
          <div class="logo-wrap">
            <img src="/images/applyPurchase/test-logo.png" alt="">
          </div>
          <div class="desc-wrap">
            收到供应商报价：<span class="red-text">103</span>条
          </div>
          <div class="desc-wrap">
            已完成采购：<span class="red-text">103</span>条
          </div>
        </div>
        <div class="exap-item">
          <div class="logo-wrap">
            <img src="/images/applyPurchase/test-logo.png" alt="">
          </div>
          <div class="desc-wrap">
            收到供应商报价：<span class="red-text">103</span>条
          </div>
          <div class="desc-wrap">
            已完成采购：<span class="red-text">103</span>条
          </div>
        </div>
        <div class="exap-item">
          <div class="logo-wrap">
            <img src="/images/applyPurchase/test-logo.png" alt="">
          </div>
          <div class="desc-wrap">
            收到供应商报价：<span class="red-text">103</span>条
          </div>
          <div class="desc-wrap">
            已完成采购：<span class="red-text">103</span>条
          </div>
        </div>
      </div>
    </div>
    <div class="footer-nav">
      <div class="nav-wrap">
        <div @click="openUrl('order')">
          <img src="/images/applyPurchase/nav-order.png" alt="">
          <p>订单查询</p>
        </div>
        <div @click="openUrl('kind')">
          <img src="/images/applyPurchase/nav-kind.png" alt="">
          <p>器件选型</p>
        </div>
        <div @click="openUrl('openStore')">
          <img src="/images/applyPurchase/nav-open.png" alt="">
          <p>立即入驻</p>
        </div>
        <div @click="openUrl('brand')">
          <img src="/images/applyPurchase/nav-brand.png" alt="">
          <p>品牌百科</p>
        </div>
      </div>
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
      login: function () {
        this.$router.push('/auth/login')
      },
      openUrl: function (type) {
        if (type === 'order') {
          if (this.user.logged) {
            this.$http.get('/basic/vendor/transactionInfo').then(response => {
              if (response.data.isOpenStore) {
                window.open('/vendor#/order/center')
              } else {
                window.open('/user#/order')
              }
            }, err => {
              window.open('/user#/order')
              console.log(err)
            })
          } else {
            this.login()
          }
        } else if (type === 'kind') {
          window.location.href = '/product/kind/home'
        } else if (type === 'openStore') {
          if (this.user.logged) {
            this.$http.get('/basic/vendor/transactionInfo').then(response => {
              if (response.data.isOpenStore) {
                window.location.href = '/vendor#/store/maintain'
              } else {
                window.location.href = '/vendor#/store-apply'
              }
            }, err => {
              this.$message.error('该账户未开通卖家中心')
              console.log(err)
            })
          } else {
            this.login()
          }
        } else if (type === 'brand') {
          window.location.href = '/product/brand/brandList/ABC'
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .apply-footer {
    position: absolute;
    width: 100%;
    top: 1600px;
    .good-provider {
      height: 330px;
      text-align: center;
      background: url('/images/applyPurchase/apply-footer-bg.png') no-repeat;
      color: #fff;
      padding-top: 24px;
      background-size: cover;
      h1 {
        margin: 0 0 7px 0;
        font-size: 36px;
      }
      p {
        font-size: 14px;
      }
      .provider-list {
        margin-top: 37px;
        .provider-item {
          width: 312px;
          height: 183px;
          background: #fff;
          display: inline-block;
          .logo-wrap {
            height: 131px;
            line-height: 131px;
            background: #fff;
            text-align: center;
            img {
              max-width: 310px;
              max-height: 181px;
            }
          }
          .desc-wrap {
            height: 52px;
            line-height: 16px;
            background: rgba(0, 0, 0, .65);
            word-break: break-all;
            text-align: left;
            padding: 11px 10px;
          }
          &:nth-child(2) {
            margin: 0 74px;
          }
        }
      }
    }
    .turnover-exap {
      height: 312px;
      text-align: center;
      h1 {
        margin: 27px 0 7px 0;
        font-size: 36px;
        color: #5392f9;
      }
      p {
        font-size: 14px;
        color: #999;
      }
      .exap-list {
        margin-top: 43px;
        .exap-item {
          width: 224px;
          display: inline-block;
          margin-right: 94px;
          &:last-child {
            margin-right: 0;
          }
          .logo-wrap {
            background: #fff;
            border: 1px solid #d9d9d9;
            height: 86px;
            line-height: 86px;
            margin-bottom: 16px;
            img {
              max-width: 222px;
              max-height: 84px;
            }
          }
          .desc-wrap {
            color: #3c3c3c;
            line-height: 18px;
            .red-text {
              color: #e60012;
            }
            &:last-child {
              margin-top: 9px;
            }
          }
        }
      }
    }
    .footer-nav {
      background: #f7f7f7;
      .nav-wrap {
        height: 133px;
        text-align: center;
        padding-top: 27px;
        width: 1190px;
        margin: 0 auto;
        border-bottom: 1px solid rgba(153, 153, 153, .3);
        div {
          display: inline-block;
          margin-right: 230px;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
          p {
            margin: 5px 0 0 0;
            font-size: 18px;
          }
        }
      }
    }
  }
</style>
