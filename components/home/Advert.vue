<template>
  <div class="advert-slide">
    <div class="swiper-container container" v-swiper:swiper="swiperOption">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(advert, index) in adverts" :key="index">
          <a :href="advert.url">
            <img :src="advert.img" target="_blank">
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'advert',
    data () {
      return {
        swiperOption: {
          autoplay: 2500,
          slidesPerView: 7,
          spaceBetween: 20
        },
        adverts: [{
          url: 'http://www.usoftmall.com/store/worldshine',
          img: '/images/adverts/1.jpg'
        }, {
          url: 'https://www.usoftmall.com/store/d2dd2e6fb752434396c58448a91ac85b',
          img: 'https://dfs.ubtob.com/group1/M00/62/22/CgpkyFp6yqCAOX_SAAAXCY1rKvQ451.jpg'
        }, {
          url: 'http://www.usoftmall.com/store/compa',
          img: '/images/adverts/3.jpg'
        }, {
          url: 'https://www.usoftmall.com/store/9e8d68432e8a43b59e10f623a4946378',
          img: 'https://dfs.ubtob.com/group1/M00/61/FD/CgpkyFpgcaiAYBj8AAA4_ERd5ds479.png'
        }, {
          url: 'https://www.usoftmall.com/store/d53e5fea4f5c4432802e3e3673985029',
          img: 'https://dfs.ubtob.com/group1/M00/88/2D/CgpkyFqvflSAJkX4AAA-iLkJ9wM609.png'
        }, {
          url: 'https://www.usoftmall.com/store/1669779299694c53a898897f87460ec7',
          img: 'https://dfs.ubtob.com/group1/M00/2E/BD/CgpkyFlsFsKAJws_AAAcqAKgSlI228.png'
        }, {
          url: 'https://www.usoftmall.com/store/ff8d0fe60f5e4fcf8cdccce1ca71ec3d',
          img: 'https://dfs.ubtob.com/group1/M00/87/FB/CgpkyFqflhaAdMC0AADLt1xhsxk699.jpg'
        }, {
          url: 'https://www.usoftmall.com/store/bf0090954cfd4f96bb2ff47f3ed6eb09',
          img: 'https://dfs.ubtob.com/group1/M00/88/59/CgpkyFramdyAA_EaAABuHeBKg18053.jpg'
        }, {
          url: 'http://www.usoftmall.com/store/yjycoin',
          img: '/images/adverts/9.jpg'
        }, {
          url: 'http://www.usoftmall.com/store/d3567635164a4811a5ba9e9adbcdcc87',
          img: '/images/adverts/10.jpg'
        }, {
          url: 'http://www.usoftmall.com/store/winsen',
          img: '/images/adverts/11.jpg'
        }]
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';
  .advert-slide {
    text-align: center;
    /*margin-bottom: $xlg-pad;*/

    .swiper-container {
      height: 100px;
      background-color: $grey-bg;
      overflow: hidden;

      .swiper-wrapper {
        padding: 5px 0;

        .swiper-slide {

          img {
            width: 161px;
            height: 90px;
          }
        }
      }
    }
  }
</style>
