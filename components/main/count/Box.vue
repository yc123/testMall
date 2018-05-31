<template>
  <div class="count-box">
    <div class="swiper-container" v-swiper:swiper="swiperOption">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(c, index) in counts.data" :key="index">
          <count-item class="item" :title="c.item" :value="c.count"></count-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import CountItem from './Item.vue'

  export default {
    name: 'count-box',
    components: {
      CountItem
    },
    data () {
      return {
        swiperOption: {
          autoplay: 5000,
          speed: 500,
          direction: 'vertical',
          slidesPerView: 1,
          slidesPerGroup: 1
        }
      }
    },
    computed: {
      counts () {
        return this.$store.state.product.common.counts
      }
    },
//    mounted () {
//      this.$nextTick(() => {
//        // 刷新统计信息
//        setInterval(() => {
//          this.loadCounts()
//        }, 30000)
//      })
//    },
    methods: {
      loadCounts () {
        this.$store.dispatch('loadProductCounts', { _status: 'actived' })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .count-box {
    position: relative;
    top: 20px;
    width: 136px;
    height: 100px;
    margin-right: 65px;
    overflow: hidden;
    border-radius: 3px;
  .swiper-slide{
    width: 100%;
    border-radius: 3px;
  }

  .swiper-container {
    height: 100%;
  }
  }
</style>

