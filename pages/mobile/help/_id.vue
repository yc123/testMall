<template>
  <!--文章详情-->
  <div class="helper-center-details" style="color: #000">
    <div class="ql-container ql-snow" v-html="helpDetail.article"></div>
    <div v-if="helpDetail.length == 0" style="color: #999;">暂无数据！</div>
  </div>
</template>
<script>
  export default {
    layout: 'help',
    fetch ({ store, route }) {
      return Promise.all([
        store.dispatch('loadHelpDetail', route.params)
      ])
    },
    computed: {
      helpDetail () {
        return this.$store.state.help.detail.data
      }
    }
  }
</script>
<style>
 .helper-center-details{
   width: 100%;
   margin-bottom: 50px;
}
 .helper-center-details .ql-container{
   margin: 0 auto;
   width: 95%;
 }
 .helper-center-details .ql-container .ql-size-20{
   display: block;
   margin-top: 15px;
   font-weight: bold;
 }
 .helper-center-details .ql-container strong{
   display: block;
   margin-top: 15px;
   font-size: 16px;
 }
 .helper-center-details p, .helper-center-details h3{
   margin: 0 auto;
   width: 100%;
 }
 .helper-center-details span{
   font-size: 16px;
 }
 .helper-center-details span.ql-size-16 img{
   width: 5%;
 }
 .helper-center-details img{
   margin: 0 auto;
   width: 100%;
   text-align: center;
 }
</style>
