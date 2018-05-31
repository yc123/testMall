<template>
  <div class="container">
    <div v-if="actives.length">
      <categroy-nav></categroy-nav>
      <!--<category-property  @loadCmpGoodsByBrandEvent="listemBrandFilter" @loadCmpGoodsByTypeEvent="listemProTypeFilter"></category-property>-->
      <component-goods :brandid="brandid" :propertyJSON="propertyJSON"></component-goods>
    </div>
    <div v-else>
      <error-page :title="'类目'"></error-page>
    </div>
  </div>
</template>

<script>
  import { CategroyNav, CategoryProperty, ComponentGoods } from '~components/product'
  import { ErrorPage } from '~components/error'
  export default {
    layout: 'main',
    data () {
      return {
        brandid: '',
        propertyJSON: {}
      }
    },
    fetch ({store, route}) {
      return Promise.all([
        store.dispatch('product/loadKindParentsWithBothers', {id: route.params.id}),
        // store.dispatch('product/loadKindBrands', {id: route.params.id}),
        store.dispatch('product/pageComGoods', {kindid: route.params.id})
      ])
    },
    components: {
      CategroyNav,
      CategoryProperty,
      ComponentGoods,
      ErrorPage
    },
    computed: {
      actives () {
        return this.$store.state.product.kind.kindsParentWithBother.data
      }
    },
    methods: {
      loadPage (id) {
        this.$store.dispatch('product/pageComGoods', {kindid: this.$route.params.id, brandid: id})
      },
      listemBrandFilter (brandid, propertyJSON) {
        this.brandid = brandid
        this.propertyJSON = propertyJSON
        if (brandid) {
          if (propertyJSON !== null && Object.getOwnPropertyNames(propertyJSON).length > 3) {
            this.$store.dispatch('product/pageComGoods', {kindid: this.$route.params.id, brandid: brandid, properties: propertyJSON})
          } else {
            this.$store.dispatch('product/pageComGoods', {kindid: this.$route.params.id, brandid: brandid})
          }
        } else if (propertyJSON !== null && Object.getOwnPropertyNames(propertyJSON).length > 3) {
          this.$store.dispatch('product/pageComGoods', {kindid: this.$route.params.id, properties: propertyJSON})
        } else {
          this.$store.dispatch('product/pageComGoods', {kindid: this.$route.params.id})
        }
      },
      listemProTypeFilter (propertyJSON, brandid) {
        this.brandid = brandid
        this.propertyJSON = propertyJSON
        if (propertyJSON !== null && Object.getOwnPropertyNames(propertyJSON).length > 3) {
          this.$store.dispatch('product/pageComGoods', {kindid: this.$route.params.id, brandid: brandid, properties: propertyJSON})
        } else {
          this.$store.dispatch('product/pageComGoods', {kindid: this.$route.params.id, brandid: brandid})
        }
      }
    }
  }
</script>

<style>
  .container {
    position: relative;
    width: 1190px;
    margin-right: auto;
    margin-left: auto;
  }
</style>
