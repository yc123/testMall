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
          url: 'http://www.usoftmall.com/store/adtracon',
          img: '/images/adverts/2.jpg'
        }, {
          url: 'http://www.usoftmall.com/store/compa',
          img: '/images/adverts/3.jpg'
        }, {
          url: 'http://www.usoftmall.com/store/corestaff',
          img: '/images/adverts/4.jpg'
        }, {
          url: 'http://www.usoftmall.com/store/chipled',
          img: '/images/adverts/5.jpg'
        }, {
          url: 'http://www.usoftmall.com/store/opd',
          img: '/images/adverts/6.jpg'
        }, {
          url: 'http://www.usoftmall.com/store/jrxy',
          img: '/images/adverts/7.jpg'
        }, {
          url: 'http://www.usoftmall.com/store/hbt',
          img: '/images/adverts/8.jpg'
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
