<template>

  <div class="hot-news col-md-3">
    <h4>
      <span>hot</span>热门文章
    </h4>
    <div>
      <ol class="list-unstyled">
        <li v-for="item in news_show" v-bind="item">
          <h5>
            <nuxt-link :to="'/news/'+item.id" :title=item.title
                       v-text=item.title></nuxt-link>
          </h5>
          <div class="hot-time">
            <span class="text-num">{{item.created | date}}</span>
            <span class="pull-right text-num" style="font-size: 12px">
          <i class="fa fa-eye" style="margin-left: 15px;"></i>{{item.viewCount}}
          </span>
          </div>
          <p class="text-muted summary" v-text=item.summary></p>
        </li>
      </ol>
    </div>

  </div>

</template>
<script>
  export default {
    computed: {
      new () {
        return this.$store.state.newsData.hotNews.hotNews
      },
      news_show () {
        return this.new.data
      }
    },
    filters: {
      date: function (input) {
        const d = new Date(input)
        const year = d.getFullYear()
        const monthTemp = d.getMonth() + 1
        const month = monthTemp < 10 ? '0' + monthTemp : '' + monthTemp
        const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
        return year + '-' + month + '-' + day
      }
    }
  }
</script>
<style>
  .hot-news{
    border: 1px solid #e8e8e8;
    width:260px;
    padding: 0;
  }
  .hot-news h4{
    background: #ecf2fd;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 18px!important;
    margin: 0;
    font-weight: normal;
  }
  .hot-news h4 span{
    background: #feb900;
    width: 30px;
    height: 40px;
    display: inline-block;
    position: relative;
    text-align: right;
    color: #fff;
    margin-right: 40px;
    font-size: 12px;
    line-height: 40px;
    float: left;
  }

  .hot-news h4 span:before{
    content: '';
    position: absolute;
    right: -20px;
    top: 0;
    width: 0;
    height: 0;
    border-width: 20px 0 20px 20px;
    border-style: solid;
    border-color: transparent transparent transparent #feb900;
  }

  .hot-news ol{
    padding-top: 0px;
    padding-right: 15px;
    padding-bottom: 0px;
    padding-left: 15px;
  }

  .hot-news ol li{
    border-bottom: #e8e8e8 1px dotted;
  }

  .hot-news li h5 {
    margin-top: 20px;
    margin-bottom: 0;
    padding: 5px 0;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    color: #666666;
    line-height: 20px;
    font-weight: 600;
  }

  .hot-news li h5 a {
    font-weight: normal;
    color: #323232;
  }

  .hot-news li h5 a:hover{
    color: #5078cb;
    text-decoration: underline !important;
  }

  .hot-time{
    line-height: 30px;
  }

  .hot-time span{
    font-size: 14px;
    color: #999;
  }
  li{
    display: list-item;
    text-align: -webkit-match-parent;
  }

  .list-unstyled{
    list-style: none;
  }

  .hot-news li p{
    font-size: 12px;
    line-height: 20px;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .fa {
    margin-right: 5px;
  }



</style>
