<template>
  <div class="container" style="width:1190px;padding: 0;">
    <div style="background: #fff; z-index:10;">
      <div class="box-first">
        <div class="box-item">类目：</div>
        <div class="box-kind">
          <ul id="letter-nav">
            <!--| orderBy : 'namelength'-->
            <li class="text-num" v-for="kind in kinds">
              <a :title="kind.nameCn"  @click="scrollTo(kind.id)">{{kind.nameCn}}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="box-catagory" v-for="kind in kinds" style="clear: both">
        <div class="box">
          <div class="box-title" :id="kind.id">
            <div class="box-smtitle">
              <div>
                <nuxt-link :to="`/product/kind/${kind.id}`"><span :title="kind.nameCn">{{kind.nameCn}}</span></nuxt-link>
              </div>
            </div>
          </div>
          <div class="box-content">
            <div class="box-subcatagory">
              <div class="childkind" v-for="child in kind.children">
                <dl class="dl-horizontal">
                  <dt class="dt-title">
                    <ul>
                      <li>
                        <nuxt-link :to="`/product/kind/${child.id}`" :title="child.nameCn"><span>{{child.nameCn}}</span></nuxt-link>
                      </li>
                    </ul>
                  </dt>
                  <dd>
                    <ul class="list-unstyled list-inline">
                      <li v-if="leaf.nameCn.length<=15" v-for="leaf in child.children">
                        <nuxt-link :to="`/product/kind/${leaf.id}`" :title="leaf.nameCn"><span>{{leaf.nameCn}}</span></nuxt-link>
                      </li>
                      <li  style="width: 35%" v-if="leaf.nameCn.length>15" v-for="leaf in child.children">
                        <nuxt-link :to="`/product/kind/${leaf.id}`" :title="leaf.nameCn">{{leaf.nameCn}}</nuxt-link>
                      </li>
                    </ul>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { scrollTo } from '~utils/scroll'
  export default {
    name: 'kind-box',
    computed: {
      kinds () {
        return this.$store.state.product.kind.kinds.data
      }
    },
    methods: {
      scrollTo: function (el) {
        scrollTo(document.getElementById(el), 10)
      }
    }
  }
</script>

<style scoped>
  .box {
    margin-bottom: 20px;
  }
  .box .box-title {
    border-bottom: 4px solid #6493FF;
  }
  .box .box-smtitle span {
    background-color: #6493FF;
    line-height: 28px;
    padding: 8px 30px;
    font-size: 14px;
    font-weight: 100;
  }
  .box .box-title a {
    color: #FFF;
    font-weight: bolder;
  }
  .box .box-title h4 {
    margin-top: 5px;
    margin-bottom: 5px;
    line-height: 30px;
  }
  .box .box-content {
    position: relative;
    width: 100%;
    margin: 0 auto;
  }
  .box .box-content .box-subcatagory {
    background-color: #ffffff;
    border-radius: 5px;
  }
  .box .box-content .box-subcatagory .childkind {
    border-bottom: 1px solid #ccc;
    border-bottom-style: dashed;
  }
  .box .box-content .box-subcatagory dl, .box .box-content .box-subcatagory ul
  {
    padding-bottom: 5px;
    margin-bottom: 0px;
  }
  .box .box-content .box-subcatagory dl dt {
    width: 160px;
    margin-left: 20px;
  }
  .box .box-content .box-subcatagory dl dt span{
    width: 125px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .box .box-content .box-subcatagory dl dt a {
    color: #000;
    font-size: 14px;
    font-weight: 500;
  }
  .box .box-content .box-subcatagory dl dt a:hover {
    color: #6493FF;
  }
  .box .box-content .box-subcatagory dl dd {
    margin-left: 180px;
    margin-bottom: 10px;
    margin-top: 20px;
  }
  .box .box-content .box-subcatagory .list-inline {
    margin-left: 0;
  }
  .box .box-content .box-subcatagory .list-inline>li {
    width: 20%;
    margin-bottom: 10px;
    vertical-align: top;
    font-size: 14px;
  }
  .box .box-content .box-subcatagory .list-inline>li a {
    color: #000;
    font-size: 14px;
    font-weight: 500;
  }
  .box .box-content .box-subcatagory .list-inline>li a:hover {
    color: #6493FF;
  }
  .box-first {
    margin-top: 10px;
  }
  .box-first .box-item {
    float: left;
    width: 55px;
    margin-left: 30px;
    font-size: 14px;
    padding-top: 10px;
  }
  .box-first .box-kind {
    float: right;
    width: 1050px;
    margin-left: 50px;
    font-size: 14px;
  }
  #letter-nav ul, #letter-nav li {
    list-style-type: none;
  }
  #letter-nav li {
    float: left;
    width: 130px;
    margin-right: 12px;
    margin-bottom: 15px;
    padding: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  #letter-nav li a {
    color: #000;
    padding: 5px;
    border-radius: 5px;
  }
  #letter-nav li a:hover {
    color: #337ab7;
    cursor: pointer;
    text-decoration: none;
  }
  .dl-horizontal .dt-title{
    text-align:left;
    margin-left: -20px;
  }
  .dt-title li{
    float: left;
    list-style: none;
    max-width: 150px;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .box-first{
    border: #e8e8e8 1px solid;
    width: 100%;
    display: inline-block;
    margin-top: 16px;
    margin-bottom: 16px;
    padding-top: 10px;
  }
</style>
