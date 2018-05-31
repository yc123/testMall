<template>
  <div class="news">
    <div class="news-container container">
      <h2 class="title">
        <nuxt-link to="/news">优软快讯</nuxt-link>
      </h2>
      <ul class="title-list">
        <li v-for="n in news5" class="item">
          <nuxt-link :to="`/news/${n.id}`" target="_blank">
            {{ n.title }}
          </nuxt-link>
        </li>
        <li class="item item-last"><nuxt-link to="/news">查看更多&gt;&gt;</nuxt-link></li>
      </ul>
      <ul class="thumbnail-list">
        <li v-for="n in news3" class="item">
          <nuxt-link :to="`/news/${n.id}`" target="_blank">
            <img :src="n.thumbnail">
            <span>{{ n.title }}</span>
          </nuxt-link>
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'news',
//    data () {
//      return {
//        news: {}
//      }
//    },
//    mounted () {
//      this.$http.get('/api/news/created', {params: { page: 1, pageSize: 10 }})
//        .then(response => {
//          this.news = response
//        })
//    },
    computed: {
      news () {
        return this.$store.state.news.snapshot
      },
      news3 () {
        if (this.news.data) {
          return this.news.data.slice(0, 3)
        }
      },
      news5 () {
        if (this.news.data) {
          return this.news.data.slice(0, 5)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .news {
    width: 100%;
    margin: 0 auto;
    height: 280px;
    width: 100%;
    margin: 0 auto;
    background: url("/images/news/news-bg.jpg");

    .news-container {

      .title {
        padding: 20px 0 15px 0;
        margin: 0;
      }

      a {
        color: #fff;

        &:hover {
          color: #feb900;
        }
      }

      .title-list {
        width: 450px;
        float: left;

        .item {
          line-height: 25px;

          a {
            display: inline-block;
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }

          &:last-child a, .item-last a{
            color: #feb900;
          }
        }
      }

      .thumbnail-list {
        float: right;

        .item {
          display: inline-block;
          position: relative;
          margin-left: 15px;
          background: #fff;
          overflow: hidden;
          width: 220px;
          height: 190px;

          a {

            img {
              width: 220px;
              height: 152px;
            }

            span {
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              display: block;
              line-height: 38px;
              padding: 0 10px;
              color: #666;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            }

            &:hover {
              img {
                transform: scale(1.15);
              }
              span {
                line-height: 28px;
                color: #feb900;
              }
            }
          }
        }
      }
    }

  }
</style>
