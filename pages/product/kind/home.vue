<template>
  <div>
    <kind-box></kind-box>
  </div>
</template>

<script>
  import { KindBox } from '~components/product'

  export default {
    layout: 'main',
    fetch ({store}) {
      return Promise.all([
        store.dispatch('product/loadAllProductKinds', { id: 0 })
      ])
    },
    components: {
      KindBox
    }
  }
</script>
