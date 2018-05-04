<template lang="html">
  <div class="loading" v-if="loading">
    <img src="/images/all/loading.gif" alt="">
  </div>
</template>
<script>
  export default {
    data: () => ({
      loading: false
    }),
    methods: {
      start () {
        this.loading = true
      },
      finish () {
        this.loading = false
      }
    }
  }
</script>
<style scoped>
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width:  100%;
    height: 100%;
    z-index: 1000;
    text-align: center;
  }
  .loading img {
    position: relative;
    top: 40%;
  }
</style>
