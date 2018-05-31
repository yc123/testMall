<template>
  <info :info="admin"></info>
</template>
<script>
  import {Info} from '~components/mobile'
  export default {
    layout: 'mobile',
    components: {
      Info
    },
    fetch ({store}) {
      return Promise.all([
        store.dispatch('loadUserWithAdmin', {uu: store.state.option.user.data.enterprise.enAdminuu})
      ])
    },
    computed: {
      admin () {
        return this.$store.state.option.infoWithAdmin.data
      }
    }
  }
</script>
