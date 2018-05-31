<template>
  <div class="container marketing">
    <div class="sales-rank">
      <sales-rank />
    </div>
    <div class="carousel">
      <carousel />
    </div>
    <div class="new-store">
      <new-store />
    </div>
  </div>
</template>
<script>
import SalesRank from './SalesRank.vue'
import NewStore from './NewStore.vue'
import Carousel from './Carousel.vue'

export default {
  name: 'recommend-store',
  components: {
    SalesRank,
    NewStore,
    Carousel
  }
}
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';

  .marketing {
    width: 1190px;
    min-height: 360px;
    padding: 0;

    .sales-rank {
      width: 240px;
      min-height: 360px;
      float: left;
      display: inline-block;
    }

    .carousel {
      width: 670px;
      min-height: 360px;
      display: inline-block;
      float: left;
      border: 1px solid #D6D3CE;
    }

    .new-store {
      width: 280px;
      min-height: 360px;
      float: left;
      display: inline-block;
    }
  }
</style>
