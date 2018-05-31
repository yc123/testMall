<template>
  <div class="carousel" :style="{backgroundColor: activeColor}">
    <div class="container">
      <slot></slot>
      <div class="carousel-container">
        <div v-swiper:mySwiper="swiperOption">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="banner in banners">
              <a :href="banner.hrefUrl" target="_blank" v-if="banner.hrefUrl">
                <img :src="banner.pictureUrl"/>
              </a>
              <span v-if="!banner.hrefUrl">
                <img :src="banner.pictureUrl"/>
              </span>
            </div>
          </div>
          <div class="swiper-button-prev"><i class="iconfont icon-arrow-left"></i></div>
          <div class="swiper-button-next"><i class="iconfont icon-arrow-right"></i></div>
          <div class="swiper-pagination swiper-pagination-bullets"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'carousel',
    data () {
      let _this = this
      return {
        activeSlide: 0,
        swiperOption: {
          autoplay: 6000,
          initialSlide: 0,
          pagination: '.swiper-pagination',
          // 解决点击分页器后图片就不能轮播的问题
          autoplayDisableOnInteraction: false,
          paginationClickable: true,
          mousewheelControl: false,
          effect: 'fade',
          lazyLoading: true,
          loop: true,
          prevButton: '.swiper-button-prev',
          nextButton: '.swiper-button-next',
          onTransitionStart: (swiper) => {
            // 不要通过vue刷新dom，会导致pagination无法刷新
            // this.activeSlide = swiper.activeIndex
            if (_this.banners.length && (swiper.activeIndex > _this.banners.length)) {
              swiper.activeIndex = 1
            } else if (_this.banners.length && swiper.activeIndex <= 0) {
              swiper.activeIndex = _this.banners.length
            }
            let carousel = document.querySelector('.carousel')
            if (carousel && carousel !== null) {
              carousel.style.backgroundColor =
                _this.banners[swiper.activeIndex - 1].metadata['background-color']
            }
          }
        }
      }
    },
    computed: {
      banners () {
        if (this.$store.state.carousel.banners) {
          let banner = this.$store.state.carousel.banners.data.slice()
           banner.sort(function (a, b) {
             return a.orderNumber - b.orderNumber
           })
          return banner
        } else {
          return ''
        }
      },
      activeColor () {
        return this.banners.length ? this.banners[this.activeSlide].metadata['background-color'] : null
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';

  $carousel_width: 992px;
  $carousel_height: 477px;

  .carousel {
    transition: background-color .3s;
    position: relative;
    margin-bottom: $lg-pad;

    .carousel-container {
      width: $carousel_width;
      height: $carousel_height;
      margin-left: 200px;
      overflow: hidden;

      .swiper-wrapper {
        position: static;
        .swiper-slide {
          img {
            display: block;
            height: $carousel_height;
            width: 100%;
          }
          a[href='']:hover{
            cursor: default;
          }
        }
      }
    }
  }
</style>
