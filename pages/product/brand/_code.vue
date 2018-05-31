<template>
  <div class="details">
    <div class="information" v-if="list.id">
      <brand-detail/>
      <div class="comm-list">
        <categories-list/>
        <brand-component/>
      </div>
    </div>
    <div v-else>
      <error-page :title="'品牌'"></error-page>
    </div>
  </div>
</template>
<script>
  import { BrandDetail, CategoriesList, BrandComponent } from '~components/product'
  import { ErrorPage } from '~components/error'
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
      BrandComponent,
      ErrorPage
    },
    computed: {
      list () {
        let list = this.$store.state.brandDetail.detail.data
        if (list.application && list.application !== '') {
          this.applications = list.application.split(',')
        }
//        console.log(list)
        return list
      }
    },
    fetch ({ store, params }) {
      return Promise.all([
        store.dispatch('loadBrandDetail', { id: params.code }),
        store.dispatch('product/loadSupplierInformation', { uuid: params.code, count: 5, page: 1 })
      ])
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
