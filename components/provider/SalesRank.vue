<template>
  <div class="sale-module">
    <div class="agency" v-if="providerType == 'agency'">
      <div class="title">
        <img src="/images/store/home/hot.png" />
        <span>销售排行榜</span>
      </div>
      <ul class="list-unstyled list-inline">
        <li v-for="(store, index) in stores">
          <div class="rank">
            <img v-if="index == 0" src="/images/store/home/first.png"/>
            <img v-else-if="index == 1" src="/images/store/home/second.png"/>
            <img v-else-if="index == 2" src="/images/store/home/third.png"/>
          </div>
          <div class="content">
            <div class="name"><a target="_blank" :href="'/store/' + store.uuid" :title="store.storeName">{{store.storeName}}</a></div>
            <div class="grade"> 交易量： <span>{{store.orderCount || 0}}</span></div>
          </div>
        </li>
      </ul>
    </div>
    <div class="original" v-if="providerType == 'original'">
      <div class="title">
        <img src="/images/original/hot-title.png" alt="">
        <span>热卖器件</span>
        <span>手慢无！</span>
      </div>
      <ul>
        <li v-for="item in originalRank">
          <a class="img-wrap" :href="item.codeUrl" target="_blank">
            <i></i>
            <img :src="item.imgUrl" alt="">
          </a>
          <div class="text-wrap">
            <a v-text="item.brand" :href="item.brandUrl" target="_blank"></a>
            <a v-text="item.code" :href="item.codeUrl" target="_blank"></a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'sales-rank',
  data () {
    return {
      originalRank: [
        {
          code: 'ME4-SO2-E4',
          brand: 'winsen',
          imgUrl: 'https://dfs.ubtob.com/group1/M00/57/B7/CgpkyFoDzIyAa9DDAAHns28rA88537.jpg',
          codeUrl: 'https://www.usoftmall.com/product/component/0501400000000181',
          brandUrl: 'https://www.usoftmall.com/product/brand/c62a154dcbe94070828b84dc0ea42dba'
        },
        {
          code: 'WTL3M20512',
          brand: 'WTL',
          imgUrl: 'https://dfs.ubtob.com/group1/M00/61/D1/CgpkyFpTQreAJZCaAABpVPt31iY540.jpg',
          codeUrl: 'https://www.usoftmall.com/product/component/1000100400044153',
          brandUrl: 'https://www.usoftmall.com/product/brand/771c32b029b0415b97009f9490ade671'
        },
        {
          code: 'ME3-PH3',
          brand: 'winsen',
          imgUrl: 'https://dfs.ubtob.com/group1/M00/57/B8/CgpkyFoDzJ-AUmSxAAINqd_smDQ340.jpg',
          codeUrl: 'https://www.usoftmall.com/product/component/0501400000000175',
          brandUrl: 'https://www.usoftmall.com/product/brand/c62a154dcbe94070828b84dc0ea42dba'
        },
        {
          code: 'RJMU101EHV',
          brand: 'runjet',
          imgUrl: 'https://dfs.ubtob.com/group1/M00/61/C6/CgpkyFpDNPOASwwtAAGUrmgl2vc212.jpg',
          codeUrl: 'https://www.usoftmall.com/product/component/0100800400000219',
          brandUrl: 'https://www.usoftmall.com/product/brand/de02a6a065c34f28ae682622f9f2821a'
        }
      ]
    }
  },
  computed: {
    stores () {
      return this.$store.state.provider.storeCms.salesStores.data
    },
    providerType () {
      return this.$route.path === '/provider/home' ? 'agency' : 'original'
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';

  .sale-module {
    width: 240px;
    height: 360px;
    border-left: 1px solid #D6D3CE;
    border-bottom: 1px solid #D6D3CE;
    border-top: 1px solid #D6D3CE;

    a {
      color: #337ab7;
      text-decoration: none;
    }

    .agency {

      .title {
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        font-weight: 600;

        img {
          width: 60px;
          height: 60px;
        }
      }

      img {
        float: left;
        vertical-align: middle;
      }

      .list-unstyled {
        position: relative;
        top: -12px;
      }

      ul {
        margin-bottom: 10px;

        li {
          height: 55px;
          padding: 0;

          .rank {
            display: inline-block;
            height: 60px;
            padding-bottom: 0;
            padding-top: 18px;
            padding-left: 10px;
            width: 60px;

            img {
              width: 40px;
              height: 33px;
            }
          }

          .content {
            width: 169px;
            display: inline-block;
            padding: 5px;
            vertical-align: bottom;
            line-height: 20px;

            .name {
              font-size: 16px;
              width: 150px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              color: #6D6B66;
            }

            .grade {
              font-size: 14px;
              color: #777570;

              >span {
                color: #777570;
              }
            }
          }
        }

        li:nth-child(1), li:nth-child(2), li:nth-child(3) {
          .content {
            .grade {
              >span {
                color: #f00;
              }
            }
          }
        }
      }
    }

    .original {
      .title {
        height: 50px;
        line-height: 50px;
        img {
          margin: 0 10px 10px 39px;
        }
        span {
          color: #5583fe;
          &:nth-child(2) {
            font-size: 18px;
            font-weight: bold;
            margin-right: 10px;
          }
        }
      }
      ul {
        padding: 0 11px;
        li {
          padding: 8px 0;
          border-bottom: 1px solid #e5e5e5;
          &:nth-child(1) {
            padding-top: 0;
            .img-wrap {
              i {
                background: url('/images/original/1.png') no-repeat;
              }
            }
          }
          &:nth-child(2) {
            .img-wrap {
              i {
                background: url('/images/original/2.png') no-repeat;
              }
            }
          }
          &:nth-child(3) {
            .img-wrap {
              i {
                background: url('/images/original/3.png') no-repeat;
              }
            }
          }
          &:nth-child(4) {
            .img-wrap {
              i {
                background: url('/images/original/4.png') no-repeat;
              }
            }
          }
          div {
            display: inline-block;
            vertical-align: middle;
            &.img-wrap {
              position: relative;
              width: 62px;
              height: 62px;
              border: 1px solid #d9d9d9;
              margin-left: 9px;
              line-height: 62px;
              text-align: center;
              img {
                max-width: 60px;
                max-height: 60px;
              }
              i {
                position: absolute;
                left: 0;
                top: 0;
                width: 19px;
                height: 21px;
              }
            }
            &.text-wrap {
              line-height: 25px;
              margin-left: 17px;
              a {
                display: block;
                color: #666;
                width: fit-content;
                max-width: 104px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: bold;
                &:last-child {
                  font-size: 12px;
                  font-weight: normal;
                }
                &:hover {
                  color: #5078cb;
                }
              }
            }
          }
          .img-wrap {
            display: inline-block;
            vertical-align: middle;
            position: relative;
            width: 62px;
            height: 62px;
            border: 1px solid #d9d9d9;
            margin-left: 9px;
            line-height: 56px;
            text-align: center;
            img {
              max-width: 60px;
              max-height: 60px;
            }
            i {
              position: absolute;
              left: 0;
              top: 0;
              width: 19px;
              height: 21px;
            }
          }
        }
      }
    }

  }
</style>
