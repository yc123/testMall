<template>
  <div class="container original">
    <div class="hot-banner">
      <a><img src="/images/original/hot-banner.png" alt=""/></a>
    </div>
    <div class="hot-content">
      <div class="warp">
        <div class="hot-head"><img src="/images/original/hot.png">热销专区</div>
        <div class="hot-center clearfix">
          <div class="hot-center-1 clearfix">
            <div class="hot-pro" v-for="item in list1">
              <a :title="item.code" :href="'/store/productDetail/' + item.batchCode" target="_blank">
                <p><img :src="item.img" alt=""></p>
                <span><em>{{item.code}}</em></span>
              </a>
            </div>
          </div>
          <div class="hot-center-2 clearfix">
            <ul>
              <li v-for="item in list2">
                <a :title="item.code" :href="'/store/productDetail/' + item.batchCode" target="_blank">
                  <p><img :src="item.img" alt=""></p>
                  <span><em>{{item.code}}</em></span>
                </a>
              </li>
            </ul>
          </div>
          <div class="bg01 hot-head"><img src="/images/original/hot-new.png">人气新品</div>
          <div class="hot-center clearfix pad-b10">
            <div class="hot-center-1 clearfix">
              <div class="hot-pro" v-for="item in list3">
                <a title="" :title="item.code" :href="'/store/productDetail/' + item.batchCode" target="_blank">
                  <p><img :src="item.img" alt=""></p>
                  <span><em>{{item.code}}</em></span>
                </a>
              </div>
            </div>
            <div class="hot-center-2 clearfix">
              <ul>
                <li v-for="item in list4">
                  <nuxt-link title="" :to="'/store/productDetail/' + item.batchCode" target="_blank">
                    <p><img :src="item.img" alt=""></p>
                    <span><em>{{item.code}}</em></span>
                  </nuxt-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'OriginalDetail',
    computed: {
      lists () {
        return this.$store.state.original.hot
      },
      list1 () {
        return this.lists.data.slice(0, 3)
      },
      list2 () {
        return this.lists.data.slice(3, 8)
      },
      list3 () {
        return this.lists.data.slice(8, 11)
      },
      list4 () {
        return this.lists.data.slice(11, 16)
      }
    }
  }
</script>
<style scoped>
  .original {box-sizing: border-box;padding: 0;margin:0;}
  .original {-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  .original {font-size: 12px;background: #fff;color: #323232;}
  .original ol,table,tr,td,ul,li,dt,dd,dl,h1,h2,h3,h4,h5,h6,form,input,select,textarea,p,em,i,b,strong,span{font-size: 12px;font-weight: normal;list-style-type:none;font-style: inherit;}
  .original a{text-decoration: none; color: #323232;}
  .original a:hover{text-decoration: none;}
  .original img{border: none;}
  .original input,button,select,textarea{outline:none}
  .original .clearfix:before,.clearfix:after{display:table;content:'';line-height:0;}
  .original .clearfix:after{clear:both;}
  .original .clear{clear:both;}
  .original .fl{float: left;}
  .original .fr{float: right;}
  .original .textmore{display: block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
  .original .no-space{display: flex;}
  /*热卖产品*/
  .original {width:100%;margin:0 auto;}
  .original .hot-banner{width: 100%;height: 336px;background: #ce1a39;text-align: center;line-height: 336px;/* margin-bottom: 16px;*/}
  .original .hot-banner img{vertical-align: middle; width: 1190px;height: 336px;}
  .original .hot-content{width: 100%;margin: 0 auto;}
  .original .hot-content .warp{width: 100%; margin: 0 auto;}
  .original .hot-content .hot-head{width: 100%;margin: 0 auto;height: 76px;line-height:90px;background: url("/images/original/hot-headbg.png") no-repeat center center;text-align: center;color: #ffc600;font-size: 28px;}
  .original .hot-center{width: 1190px;margin: 0 auto;background: #d1e0fe;padding-top: 10px;}
  .original .hot-center-1{width:1176px;margin: 0 auto;}
  .original .hot-center-1 .hot-pro, .hot-center-1 .hot-pro a{width: 386px;height: 408px;float: left;display: inline-block;background: #fff;}
  .original .hot-center-1 .hot-pro p{width: 100%;height: 344px;margin: 0;text-align: center;line-height: 344px;overflow: hidden;}
  .original .hot-center-1 .hot-pro p img{vertical-align: middle; max-width: 300px;max-height: 300px;}
  .original .hot-center-1 .hot-pro span{width: 386px;height: 64px;display: inline-block;text-align: center;background: #f2f1f2;overflow: hidden;}
  .original .hot-center-1 .hot-pro span em{width: 90%;height: 64px;font-size: 18px;margin: 0 auto;line-height: 64px;color: #787878;display: inline-block;}
  .original .hot-center-1 .hot-pro span em.line01{line-height: 64px;margin-top: 0;}
  .original .hot-center-1 .hot-pro a:hover p{border: #5078cb 1px solid;}
  .original .hot-center-1 .hot-pro a:hover img{transform: scale(1.1); transition: transform 0.1s ease-in;}
  .original .hot-center-1 .hot-pro a:hover span{background: #5078cb; transition: background .1s ease-out;}
  .original .hot-center-1 .hot-pro a:hover span em{color: #fff;}
  .original .hot-center-1 .hot-pro{margin-right: 8px;}
  .original .hot-center-1 .hot-pro:last-child{margin-right: 0 !important;}
  .original .hot-center-2{width:1176px;margin: 0 auto;margin-top: 16px;background: #fff;}
  .original .hot-center-2 ul{width: 100%;margin: 0 auto;padding: 0;}
  .original .hot-center-2 ul li{width: 20%;float: left;text-align: center;height:352px;}
  .original .hot-center-2 ul li a{width: 100%;height: 100%;display: inline-block;}
  .original .hot-center-2 ul li p{width: 100%;height: 260px;display: inline-block;text-align: center;line-height: 250px;overflow: hidden;}
  .original .hot-center-2 ul li p img{vertical-align: middle; max-width: 132px;}
  .original .hot-center-2 ul li span{width: 100%;height:92px;display: inline-block;text-align: center;overflow: hidden;}
  .original .hot-center-2 ul li span em{width: 90%;font-size: 18px;margin: 0 auto;line-height: 25px;color: #787878;display: inline-block;margin-top: 20px;}
  .original .hot-center-2 ul li a:hover p img{transform: scale(1.1);}
  .original .hot-center-2 ul li a:hover span em{color: #5078cb;}
  .original .hot-center-2 ul li a:hover{border: #5078cb 1px solid;}
  .original .hot-center-2 ul li a span em.line02{line-height: 92px;margin-top: 0;}
  .original .pad-b10{ padding-bottom: 10px;}
</style>
