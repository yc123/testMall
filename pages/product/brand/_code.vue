<template>
  <div class="details">
    <div class="information">
      <brand-detail/>
      <div class="comm-list">
        <categories-list/>
        <brand-component/>
      </div>
    </div>
  </div>
</template>
<script>
  import { BrandDetail, CategoriesList, BrandComponent } from '~components/product'
  export default {
    layout: 'main',
    data () {
      return {
        code: ''
      }
    },
    components: {
      BrandDetail,
      CategoriesList,
      BrandComponent
    },
    fetch ({ store, params }) {
      return Promise.all([
        store.dispatch('loadBrandDetail', { id: params.code })
      ])
    },
    methods: {
      listenChild: function (brand) {
        this.$store.dispatch('loadBrandPages', {count: 10, filter: { brandid: brand.id }, page: brand.page})
      }
    }
  }
</script>
<style scoped>
  .comm-list{
    width: 1190px;
    margin: 0 auto;
    overflow: hidden;
  }
</style>
