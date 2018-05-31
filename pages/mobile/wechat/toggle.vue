<template>
  <div></div>
</template>

<script>
  export default {
    layout: 'mobileNoHeader',
    mounted() {
      this.$nextTick(() => {
        // this.$route.query.url
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd29bbca61728b189&redirect_uri=http://139.199.176.56:23400${this.$route.query.url}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
      })
    }
  }
</script>
