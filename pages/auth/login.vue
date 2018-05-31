<template>
  <div>
    <!--登录代理页面-->
  </div>
</template>
<script>
  export default {
    name: 'login',
    layout: 'login',
    mounted () {
      let uri = this.$route.query.returnUrl ? this.$route.query.returnUrl : window.location.protocol + '//' + window.location.host + '/'
      this.$http.get('/login/page', {params: {returnUrl: uri}}).then(response => {
        if (response.data) {
          window.location.href = response.data.content + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
        }
      })
    }
  }
</script>
