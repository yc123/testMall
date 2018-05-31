<template>
  <div class="store-share-header">
    <div class="wrap">
      <div class="img">
        <img :src="storeInfo.logoUrl" alt="">
      </div>
      <div class="title">
        <h1>{{storeInfo.storeName}}</h1>
        <p>{{storeInfo.description | descFilter}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  import { getRealLen, cutOutString } from '~utils/baseUtils'
  export default {
    computed: {
      storeInfo () {
        return this.$store.state.shop.storeInfo.store.data
      }
    },
    filters: {
      descFilter: function (val) {
        return getRealLen(val) > 78 ? cutOutString(val, 78) + '...' : val
      }
    }
  }
</script>
<style lang="scss" scoped>
  .store-share-header {
    height: 1.9rem;
    background: #272a32;
    padding-top: .18rem;
    .wrap {
      height: 1.72rem;
      width: 7.16rem;
      margin: 0 auto;
      background: url('/images/mobile/@2x/shareStore/background@2x.png') no-repeat;
      background-size: cover;
      padding: .2rem 0 0 .4rem;
      > div {
        display: inline-block;
        vertical-align: middle;
        &.img {
          width: 1.24rem;
          height: 1.24rem;
          text-align: center;
          line-height: 1.24rem;
          border-radius: 2px;
          background: #fff;
          img {
            max-width: 1.24rem;
            max-height: 1.24rem;
          }
        }
        &.title {
          margin-left: .44rem;
          width: 5rem;
          h1 {
            font-size: .36rem;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 4.5rem;
          }
          p {
            font-size: .24rem;
            color: #fff;
            margin-top: .2rem;
            line-height: .32rem;
            overflow: hidden;
            max-height: .64rem;
          }
        }
      }
    }
  }
</style>
