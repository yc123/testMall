<template>
  <list></list>
</template>
<script>
  import { List } from '~components/mobile/supplier'
  export default {
    layout: 'mobileNoHeader',
    fetch ({ store }) {
      return Promise.all([
        store.dispatch('supplier/getSupplierList', {page: 1, size: 10})
      ])
    },
    components: {
      List
    }
  }
</script>
