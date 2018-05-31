<template>
  <div class="news-content col-md-9">
    <h4><span class="label label-primary">News</span>新闻资讯</h4>
    <div class="news" v-for="item in news_show">
      <div class="new">
        <div style="width: 120px;">
          <div class="thumbnail-news">
            <nuxt-link :to="'/news/'+item.id" :title=item.title>
              <img class="content-thumbnail"  alt="新闻缩略图" :src=item.thumbnail></nuxt-link>
          </div>
        </div>
        <div class="news-list">
          <h5> <nuxt-link :to="'/news/'+item.id" :title=item.title>{{item.title}}</nuxt-link></h5>
          <p v-text=item.summary></p>
          <div class="text-muted">
            <span class="pull-left " >{{item.created | date}}</span>
            <span class="pull-right text-num" >
             <i class="fa fa-eye" style="margin-left: 15px;"></i>{{item.viewCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <page :total="totalCount" :page-size="pageSize"
          :current="nowPage" v-on:childEvent="listenPage"></page>
  </div>
</template>

<script>
  import Page from '~components/common/page/pageComponent.vue'
  export default {
    data () {
      return {
        pageSize: 10,
        nowPage: 1
      }
    },
    components: {
      Page
    },
    computed: {
      new () {
        return this.$store.state.newsData.newsPage.allNews
      },
      news_show () {
        return this.new.data.content
      },
      totalCount () {
        return this.new.data.count
      }
    },
    filters: {
      date: function (input) {
        const d = new Date(input)
        const year = d.getFullYear()
        const monthTemp = d.getMonth() + 1
        const month = monthTemp < 10 ? '0' + monthTemp : '' + monthTemp
        const hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours() + ' '
        const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes() + ' '
        const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate() + ' '
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes
      }
    },
    methods: {
      listenPage: function (changedPage) {
        this.nowPage = changedPage
        this.$emit('pageEvent', this.nowPage)
      }
    }
  }

</script>

<style>
  .news-content{
    padding-left: 0;
    float: right;
    width: 75%;
    padding-bottom: 15px;
  }
  .news-content .news{
    margin-bottom: 15px;
  }
  .news-content h4{
    border-bottom: #e8e8e8 1px solid;
    line-height: 40px;
    margin: 0;
    font-weight: normal;
    font-size: 18px;
  }
  .news-content h4 span.label{
    font-size: 12px;
    padding: 5px 2px;
    margin-right: 8px;
  }
  .news-content h4 span.label-primary{
    background: #5078cb;
  }

  .news {
    display: table;
  }

  .new {
    display: table-row;
  }

  .new >div{
    display: table-cell;
    vertical-align: middle;
    border-bottom: 1px dashed #ccc;
    width: 717px;
  }
  .thumbnail-news {
    width: 160px;
    height: 100px;
    overflow: hidden;
    margin: 20px 0 20px;
  }

  .thumbnail-news img {
    width: 160px;
    height: 100px;
    vertical-align: middle;
    border: 0;
  }

  .news-list {
    padding: 10px 10px 10px 20px;
  }
  .new h5 {
    font-size: 16px;
    font-weight: 600;
  }
  .news .new h5 a {
    color: #323232;
    font-weight: normal;
  }
  .news .new h5 a:hover {
   color: #5078cb;
    text-decoration: underline !important;
  }
  .news-list >p{
    line-height: 25px;
  }
  .news-list .pull-right i {
    margin-right: 10px;
  }

  .news-content a{
    cursor: pointer;
  }

</style>
