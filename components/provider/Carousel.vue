<template>
  <div class="carousel">
    <div v-swiper:mySwiper="swiperOption">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="banner in banners">
          <a :href="banner.hrefUrl" target="_blank">
            <img :src="banner.pictureUrl">
          </a>
        </div>
      </div>
      <div class="swiper-pagination swiper-pagination-bullets"></div>
      <div class="swiper-button-prev"><i class="iconfont icon-arrow-left"></i></div>
      <div class="swiper-button-next"><i class="iconfont icon-arrow-right"></i></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'carousel',
    data () {
      return {
        activeSlide: 0,
        swiperOption: {
          autoplay: 5000,
          initialSlide: 0,
          loop: true,
          effect: 'fade',
          lazyLoading: true,
          // 解决点击分页器后图片就不能轮播的问题
          autoplayDisableOnInteraction: false,
          pagination: '.swiper-pagination',
          paginationClickable: true,
          paginationElement: 'li',
          prevButton: '.swiper-button-prev',
          nextButton: '.swiper-button-next'
        }
    //    banners: {}
      }
    },
//    mounted () {
//      this.$http.get('/api/carousel/home%20page%20banner')
//      .then(response => {
//        this.banners = response.data
//        this.x++
//      })
//    }
    computed: {
      banners () {
        let banner = this.$store.state.carousel.banners
        banner.data.sort(function (a, b) {
          return a.orderNumber - b.orderNumber
        })
        return banner.data
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';

  $carousel_width: 668px;
  $carousel_height: 358px;

  .carousel {
    width: $carousel_width;
    height: $carousel_height;
    transition: background-color .3s;
    position: relative;
    overflow: hidden;

    .swiper-wrapper {
      .swiper-slide {
        img {
          display: block;
          width: $carousel_width;
          height: $carousel_height;
        }
      }
    }
  }
</style>
