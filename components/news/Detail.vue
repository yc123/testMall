<template>
    <div class="col-md-9">
      <div class="news-detail" v-bind="item">
        <h1 >{{item.title}}</h1>
        <div class="hot-time">
          <span class="text-num">时间：<span >{{item.created | date}}</span></span>
          <span class="pull-right text-num" style="font-size: 12px;"><i class="fa fa-eye" style="margin-left: 15px;"></i>{{item.viewCount}}</span>
        </div>
        <div class="news-detail-content" v-html=item.content>
        </div>
      </div>
    </div>
</template>
<script>
  export default {
    name: 'Detail',
    computed: {
      new () {
        return this.$store.state.newsData.detailNews.detailNews
      },
      item () {
        return this.new.data
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
    }
  }
</script>
<style scoped>
  .col-md-9{
    padding-left: 0;
    float: right;
    margin-top: 10px;
  }
  @media (min-width: 992px) {
    .col-md-9 {
      width: 75%;
    }
  }
  .news-detail {
    width: 100%;
    margin: 0 auto;
  }
  .news-detail h1 {
    font-size: 24px;
    line-height: 40px;
    margin: 0;
  }
  .news-detail .hot-time {
    margin-bottom: 20px;
  }
  .hot-time span {
    font-size: 14px;
    color: #999;
  }
  .news-detail-content {
    width: 100%;
    margin: 0 auto;
    font-size: 14px;
    border-top: #e8e8e8 1px solid;
    padding-top: 20px;
    line-height: 28px;
    color: #666;
  }
</style>
