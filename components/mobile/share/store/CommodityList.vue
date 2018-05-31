<template>
  <div class="share-store-commodity">
    <div class="title" v-if="commodities.content && commodities.content.length">
      <!-- <img src="/images/mobile/@2x/shareStore/commodity-title@2x.png" alt=""> -->
      <div class="share_title"><span></span><div>今日现货</div></div>
      <div class="date">
        <span>{{date.month}}</span>月<span>{{date.day}}</span>日
      </div>
      <div class="fr">真实库存、真实价格</div>
    </div>
    <ul>
      <li v-for="commodity in commodities.content">
        <div class="fl">
          <p>{{commodity.code || '-'}}</p>
          <span v-if="commodity.brandNameEn || commodity.brandEn">{{commodity.brandNameEn || commodity.brandEn || '-'}}</span>
        </div>
        <div class="fr">
          <span>{{commodity.currencyName === 'USD' ? '$' : '¥'}}</span>
          <span>{{commodity.prices[0].rMBPrice}}</span>
        </div>
      </li>
    </ul>
    <div v-if="!commodities.content || !commodities.content.length" class="empty">
      <img src="/images/mobile/@2x/shareStore/empty.png" alt="">
      <p>抱歉，该店铺暂未上架商品</p>
    </div>
  </div>
</template>
<script>
  export default {
    filters: {
      price: function (val) {
        return val.toFixed(2)
      }
    },
    computed: {
      commodities () {
        return this.$store.state.shop.storeInfo.storeCommodity.data
//        return []
      },
      date () {
        let now = new Date()
        const monthTemp = now.getMonth() + 1
        const dayTemp = now.getDate()
        const month = monthTemp < 10 ? '0' + monthTemp : monthTemp
        const day = dayTemp < 10 ? '0' + dayTemp : dayTemp
        return {
          month: month,
          day: day
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .share-store-commodity {
    .share_title {
      font-weight: bold;
      margin-top: 0.06rem;
      float: left;
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
      div {
        font-size: 0.28rem;
        color: #09061e;
        display: inline-block;
        vertical-align: top;
        margin-top: 0.02rem;
      }
    }
    padding: .24rem .3rem;
    padding-bottom: 0rem;
    .title {
      margin-bottom: .2rem;
      display: flex;
      &::after {
        content: ' ';
        clear: both;
        display: block;
        visibility: hidden;
        zoom: 1;
      }
      img {
        width: 1.59rem;
        height: .45rem;
      }
      .date {
        flex: 1;
        // display: inline-block;
        font-size: .21rem;
        color: #fa3f46;
        // position: relative;
        // top: .06rem;
        // left: .32rem;
        margin-left: .32rem;
        margin-top: .06rem;
        float: left;
        span {
          color: #fff;
          font-size: .24rem;
          display: inline-block;
          width: .32rem;
          height: .28rem;
          line-height: .28rem;
          text-align: center;
          border-radius: 2px;
          background: #fa3f46;
          margin: .04rem;
        }
      }
      .fr {
        font-size: .24rem;
        color: #666;
        position: relative;
        top: .1rem;
      }
    }
    > ul {
      li {
        &::after {
          content: ' ';
          clear: both;
          display: block;
          visibility: hidden;
        }
        // height: 1rem;
        border-bottom: .02rem solid rgba(217, 217, 217, .35);
        > div {
          padding: 0.1rem 0;
          // height: 1rem;
          &.fl {
            line-height: .4rem;
            p {
              font-size: .26rem;
              color: #fb6f03;
            }
            span {
              font-size: .24rem;
              color: #666;
            }
          }
          &.fr {
            // float: none;
            font-size: .28rem;
            color: #e21616;
            line-height: .82rem;
            // width: 1.8rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            span {
              &:nth-child(2) {
                font-size: .24rem;
              }
            }
          }
        }
      }
    }
    .empty {
      text-align: center;
      padding: 1.44rem 0 2.04rem 0;
      img {
        width: 1.21rem;
        height: 1.21rem;
      }
      p {
        font-size: .24rem;
        color: #ddd;
        margin-top: .17rem;
      }
    }
  }
</style>
