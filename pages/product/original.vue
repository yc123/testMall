<template>
  <div class="originalDetail">
    <original-detail/>
  </div>
</template>
<script>
  import { OriginalDetail } from '~components/product'
  export default {
    layout: 'main',
    components: {
      OriginalDetail
    },
    fetch ({ store }) {
      return Promise.all([
        store.dispatch('loadProductHot', {length: 17})
      ])
    }
  }
</script>

