<template>
  <div class="partner">
    <div class="partner-container container">
      <h3>合作案例</h3>
      <ul class="list-unstyled">
        <li v-for="p in partners">
          <a :href="p.href" target="_blank">
            <img :src="p.img"/>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'partner',
    data () {
      return {
        partners: [{
          href: 'http://www.worldshine.net/',
          img: '/images/partners/8.jpg'
        }, {
          href: 'http://www.fantem.cn/',
          img: '/images/partners/2.jpg'
        }, {
          href: 'http://www.huansujt.com',
          img: '/images/partners/3.jpg'
        }, {
          href: 'http://www.madigi.net',
          img: '/images/partners/4.jpg'
        }, {
          href: 'http://www.51cube.com',
          img: '/images/partners/5.jpg'
        }, {
          href: 'http://www.szsoling.com/home',
          img: '/images/partners/6.jpg'
        }, {
          href: 'http://www.chiptrip.com.cn/china/cn/index.asp',
          img: '/images/partners/7.jpg'
        }]
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';
  .partner-container h3{
    font-size: 24px;
  }
  .partner {
    text-align: center;
    margin-bottom: $xlg-pad;

    ul {
      width: 1204px;
      overflow: hidden;

      li {
        float: left;
        width: 155px;
        height: 61px;
        margin-right: 15px;
        border: $border;

        img {
          max-width: 155px;
          max-height: 59px;
        }
      }
    }
  }
</style>
