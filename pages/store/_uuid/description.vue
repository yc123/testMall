<template>
  <div class="container">
    <base-info/>
  </div>
</template>
<script>
import { BaseInfo } from '~components/store'

export default {
  layout: 'shop',
  fetch ({ store, route }) {
    return Promise.all([
      store.dispatch('shop/findStoreInfoFromUuid', route.params)
    ])
  },
  components: {
    BaseInfo
  }
}
</script>
