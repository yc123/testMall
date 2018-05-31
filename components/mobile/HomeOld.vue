<template>
  <div class="home">
    <div class="mobile-modal" v-if="showStoreInfo" @touchmove="preventTouchMove($event)">
      <div class="mobile-modal-box">
        <div class="mobile-modal-header">联系方式<i @click="showStoreInfo = false" class="icon-guanbi iconfont"></i></div>
        <div class="mobile-modal-content">
          <div>商家地址：深圳市南山区英唐大厦6楼</div>
         <!-- <div class="content-line link-url">在线咨询</div>-->
          <div>致电：<a href="tel:4008301818" target="_blank" class="content-line link-url">4008301818</a></div>
          <div>邮件：<a href="mailto:yrsc@usoftchina.com" target="_blank" class="content-line link-url">yrsc@usoftchina.com</a></div>
        </div>
      </div>
    </div>
    <div v-if="!showMainSearch">
      <div class="home-header" :style="'background:url(' + bgUrl + ')no-repeat center center/100% 6.14rem'">
        <!--<a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>-->
        <div class="home-search">
          <!--<ul>-->
          <!--<li :class="activeType=='model'?'active':''" @click="activeType='model'"><span>型号</span></li>-->
          <!--<li :class="activeType=='brand'?'active':''" @click="activeType='brand'"><span>品牌</span></li>-->
          <!--<li :class="activeType=='shops'?'active':''" @click="activeType='shops'"><span>商家</span></li>-->
          <!--</ul>-->
          <div class="home-input">
            <input type="text" placeholder="请输入您要查找的型号或品牌"
                   @click="onHomeSearchClick()"/>
            <i class="iconfont icon-sousuo"></i>
          </div>
          <!--<p style="color:#e45803;line-height:.4rem;margin-top:.1rem;width:4.2rem;margin-left:1rem;">搜品牌、搜现货 、搜好店 、搜规格书 就上优软商城</p>-->
        </div>
      </div>
      <div class="home-main">
        <nuxt-link to="/mobile/shop" class="home-main-content">
          <div>
            <img src="/images/mobile/@2x/home/shopbrand@2x.png">
          </div>
          <p>店铺列表</p>
        </nuxt-link>
        <nuxt-link to="/mobile/brand/brandCenter/A" class="home-main-content">
          <div>
            <!--<i class="icon-pinpai iconfont"></i>-->
            <img src="/images/mobile/@2x/home/brand@2x.png" alt="">
          </div>
          <!--<h2>
            {{numbrand[0]}}
          </h2>-->
          <p>品牌列表</p>
        </nuxt-link>
        <a @click="goCollect" class="home-main-content">
          <div>
            <img src="/images/mobile/@2x/home/storebrand@2x.png">
          </div>
          <p>我的收藏</p>
        </a>
        <a @click="showStoreInfo = true" class="home-main-content">
          <div>
            <img src="/images/mobile/@2x/home/phonebrand@2x.png">
          </div>
          <p>联系我们</p>
        </a>
        <!--<a class="home-main-content">
          <div>
            <i class="icon-xinghao iconfont"></i>
          </div>
          <h2>
            {{numbrand[1]}}
          </h2>
          <p>型号</p>
        </a>
        <a class="home-main-content">
          <div>
            <i class="icon-biaoguigeshuomingshu iconfont"></i>
          </div>
          <h2>
            {{numbrand[2]}}
          </h2>
          <p>规格书</p>
        </a>-->
      </div>
    </div>
    <main-search v-else @cancelSearchAction="onCancelSearch"></main-search>
    <login-box @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox"></login-box>
  </div>
</template>

<script>
  import MainSearch from '~/components/mobile/search/MainSearch.vue'
  import {LoginBox} from '~components/mobile/common'
  export default {
    name: 'home',
    data () {
      return {
        activeType: 'model',
        showMainSearch: false,
        showStoreInfo: false,
        isMore: false,
        isShow: false,
        len: 0,
        bgUrl: '/images/mobile/@2x/home/background@2x.png',
        showLoginBox: false
      }
    },
    components: {
      MainSearch,
      LoginBox
    },
    methods: {
      onHomeSearchClick () {
        this.showMainSearch = true
        this.$store.dispatch('searchData/getSearchHistory')
      },
      matNumber (num) {
        if (num > 99999999) {
          this.isShow = true
          let str2 = num.toString()
          num = Math.floor(num / 100000000)
          if (parseInt(str2.charAt(str2.length - 8)) > 8) {
            num = num + 1
          }
          num += '亿'
        }
        if (num > 9999) {
          this.isMore = true
          let str = num.toString()
          num = Math.floor(num / 10000)
          if (parseInt(str.charAt(str.length - 4)) > 4) {
            num = num + 1
          }
          num += '万'
        } else {
          num += '个'
        }
        return num
      },
      forNum (numbers) {
        let num = []
        for (let i = 0; i < numbers.length; i++) {
          num.push(this.matNumber(numbers[i].count))
        }
        return num
      },
      onCancelSearch: function () {
        this.showMainSearch = false
      },
      goCollect: function () {
        if (this.user.logged) {
          this.$router.push('/mobile/user')
        } else {
          this.showLoginBox = true
        }
      },
      goLastPage: function () {
        window.history.back(-1)
      }
    },
    computed: {
      numbrand () {
        return this.forNum(this.counts)
      },
      counts () {
        return this.$store.state.product.common.counts.data
      },
      user () {
        return this.$store.state.option.user
      }
    }
  }
</script>

<style lang="scss" scoped>
  .home{
    font-size: .28rem;
    background: #f7fbff;
    position: fixed;
    top: 0;
    bottom: .98rem;
    width: 100%;
    overflow-y: auto;
    .home-header{
      width:100%;
      height:6.12rem;
      >a{
        font-size:.28rem;
        color:#fff;
        position: absolute;
        left: .1rem;
        top: .2rem;
        i{
          font-size: .48rem;
          margin-right: -.1rem;
          color: #666;
        }
      }
      .home-search{
        width:6rem;
        line-height: .3rem;
        margin:0 auto;
        text-align: center;
        padding-top: 1.74rem;
        ul{
          display:inline-flex;
        li{
          flex:1;
          text-align:center;
          >span{
             display:inline-block;
             width:.72rem;
             line-height:.33rem;
             height:.33rem;
             background: #fff;
             color:#000;
             border-radius: .05rem .05rem 0 0 ;
           }
          }
          li.active span{
              background: #3c7cf5;
              color:#fff;
              cursor:pointer;
          }
        }
        .home-input{
          width: 6rem;
          input{
            width:5.17rem;
            display: inline-block;
            padding: 0 1rem 0 .16rem;
            margin-right:-.83rem;
            font-size:.24rem;
            border:.04rem solid #3c7cf5;
            border-radius:.05rem;
            height: .68rem;
          }
          i{
             display:inline-block;
             text-align: center;
             width:.83rem;
             font-size:.33rem;
             border-left:none;
             color: #999;
            vertical-align: middle;
          }
        }
      }
    }
    }
    .home-main{
      text-align: center;
      padding-top: .46rem;
    }
    .home-main a.home-main-content {
      width:50%;
      margin-bottom:.52rem;
      display: inline-block;
    }
    .home-main .home-main-content div{
      border-radius: .2rem;
      width:1.14rem;
      height:1.14rem;
      margin:0 auto;
    }
    .home-main .home-main-content div>img{
      width: 100%;
      height:100%;
    }
  .home-main .home-main-content div>i {
    font-size: .8rem;
  }
  .home-main .home-main-content:nth-child(3) div>i {
    color: #ff3064;
  }
  /*.home-main .home-main-content:nth-child(5) div>i {
    color: #fa6743;
  }
  .home-main .home-main-content:nth-child(6) div>i {
    color: #fcb836;
  }*/
    .home-main .home-main-content p{
      font-size:.28rem;
      color:rgb(51,51,51);
      line-height: .52rem;
    }
    .home-main .home-main-content h2{
      font-size:.3rem;
      color:#ff7800;
      line-height: .32rem;
      margin:0;
      margin-top:.1rem;
    }
</style>
