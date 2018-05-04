<template>
  <div>
    <excellent-suppliers :isShowMore="false"/>

    <suppliers :types="'AGENCY-DISTRIBUTION'"/>
  </div>
</template>
<script>
import { ExcellentSuppliers, Suppliers } from '~components/provider'

export default {
  layout: 'main',
  fetch ({ store }) {
    return Promise.all([
      store.dispatch('provider/loadRecommendStores', { types: 'AGENCY-DISTRIBUTION', num: 5 }),
      store.dispatch('provider/findStoreList', { page: 1, count: 10, types: 'AGENCY-DISTRIBUTION' })
    ])
  },
  components: {
    ExcellentSuppliers,
    Suppliers
  }
}
</script>
