<template>
  <div class="mobile-nav">
   <!-- <div class="mobile-modal" v-if="showStoreInfo || showShare" @click="cancelModal">
      <div class="mobile-modal-box" v-if="showStoreInfo" @click="stopPropagation($event)">
        <div class="mobile-modal-header">联系方式<i @click="showStoreInfo = false" class="icon-guanbi iconfont"></i></div>
        <div class="mobile-modal-content" v-if="showDefaultAddr">
          <div>商家地址：深圳市南山区英唐大厦6楼</div>
          <div class="content-line link-url">在线咨询</div>
          <div>致电：<a href="tel:0755-96586323" class="content-line link-url">0755-96586323</a></div>
          <div>邮件：<a href="mailto:yrsc@usoftchina.com" class="content-line link-url">yrsc@usoftchina.com</a></div>
        </div>
        <div class="mobile-modal-content" v-if="!showDefaultAddr">
        <div>商家地址：{{store.enterprise.enAddress || store.enterprise.address}}</div>
        <div class="content-line link-url">在线咨询</div>
        <div>致电：<a :href="'tel:'+store.enterprise.enTel" class="content-line link-url">{{store.enterprise.enTel}}</a></div>
          <div>邮件：<a :href="'mailto:'+store.enterprise.enEmail" class="content-line link-url">{{store.enterprise.enEmail}}</a></div>
        </div>
      </div>
      <div class="mobile-share-box" v-if="showShare" @click="stopPropagation($event)">
        <div class="share-area">
          <ul>
            <li class="share-item" @click="shareWeChat">
             <i class="icon-weixin iconfont" style="color: #07af12;"></i>
              <span>微信</span>
            </li>
            <li class="share-item" @click="shareQQ">
              <i class="icon-qq1 iconfont" style="color: #5872f4;"></i>
              <span>QQ</span>
            </li>
            <li class="share-item" @click="shareWeibo">
              <i class="icon-ff0000 iconfont" style="color: #ff0000;"></i>
              <span>微博</span>
            </li>
            <li class="share-item" @click="shareMessage">
              <i class="icon-msnui-msg-invert iconfont" style="color: #25cdb7"></i>
              <span>短信</span>
              <a href="sms:" class="hide" id="share-sms"></a>
            </li>
            <li class="share-item" @click="shareEmail">
              <i class="icon-youjian iconfont" style="height: .57rem;font-size: .41rem;color:#f18215;"></i>
              <span>邮件</span>
              <a href="mailto:" class="hide" id="share-mail"></a>
            </li>
            <li class="share-item" @click="flash">
              <i class="icon-shuaxin iconfont" style="color: #2584cd;"></i>
              <span>刷新</span>
            </li>
            <li class="share-item" @click="copyLink" id="copyLink"  :data-clipboard-text="url">
              <i class="icon-lianjie iconfont" style="color: #73b0df;"></i>
              <span>复制链接</span>
            </li>
          </ul>
        </div>
        <div class="cancel-share" @click="showShare=false">取消</div>
      </div>
    </div>-->
    <div class="mobile-header" v-if="showHeader && !showMainSearch">
      <a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>
      <p>{{title}}
        <span @click="goMainSearch"><i class="icon-sousuo iconfont"></i>搜索</span>
      </p>
    </div>
    <main-search v-if="showMainSearch" @cancelSearchAction="onCancelSearch"></main-search>
<!--    <i v-show="rightIcon=='share'" class="iconfont icon-fenxiang" @click="showShare = true" @touchmove="onTouchMove($event)"></i>
    <i v-show="rightIcon=='phone'" class="iconfont icon-dianhua" @click="showLink" @touchmove="onTouchMove($event)"></i>-->
  </div>
</template>
<script>
//  import Clipboard from 'clipboard'
  import MainSearch from '~/components/mobile/search/MainSearch.vue'
  export default {
    data () {
      return {
//        showStoreInfo: false,
//        showShare: false,
//        rightIcon: 'phone',
//        showDefaultAddr: true,
//        url: '',
//        clipboard: {},
        showMainSearch: false,
        title: '优软商城',
        showHeader: false
//        showSearch: false
      }
    },
    components: {
      MainSearch
    },
    watch: {
      $route: function (val, oldVal) {
        this.showMainSearch = false
        this.title = this.initHeader(val.path, val.query)
      }
    },
    created () {
      this.title = this.initHeader(this.$route.path, this.$route.query)
    },
    computed: {
      brandDetail () {
        return this.$store.state.brandDetail.detail.data
      },
      store () {
        return this.$store.state.shop.storeInfo.store.data
      },
      component () {
        return this.$store.state.componentDetail.detail.data
      }
//      showHeader () {
//        return this.$route.path !== '/' || !this.$route.path || this.$route.path === ''
//      },
//      showSearch () {
//        return this.$route.path !== '/' && !this.$route.path.startsWith('/mobile/search')
//      }
    },
//    mounted () {
//      let _this = this
//      _this.url = window.location.href
//      _this.clipboard = new Clipboard('#copyLink')
//      _this.clipboard.on('success', e => {
//        _this.clipboard.destroy()
//        _this.showShare = false
//      })
//      _this.clipboard.on('error', e => {
//        alert('浏览器不支持自动复制，请手动复制')
//        _this.clipboard.destroy()
//      })
//    },
    methods: {
      goLastPage: function () {
        window.history.back(-1)
      },
      initHeader: function (val, query) {
//        if (val !== '/' || !val || val === '') {
//          this.showHeader = true
//          this.showSearch = !val.startsWith('/mobile/search')
//        } else {
//          this.showHeader = false
//          this.showSearch = false
//        }
        this.showHeader = val && val !== '/' && val !== '/mobile/applyPurchase/list'
//        this.showSearch = val !== '/' && !this.startWith(val, '/mobile/search')
        let title = '优软商城'
        if (this.startWith(val, '/mobile/brand/componentDetail/')) {
          title = this.component.code
//          this.rightIcon = 'share'
        } else if (this.startWith(val, '/mobile/brand/brandCenter')) {
          title = '品牌墙'
//          this.rightIcon = 'share'
        } else if (this.startWith(val, '/mobile/brand/')) {
          if (this.brandDetail.nameCn) {
            if (this.brandDetail.nameCn !== this.brandDetail.nameEn) {
              title = this.brandDetail.nameEn + '(' + this.brandDetail.nameCn + ')'
            } else {
              title = this.brandDetail.nameCn
            }
          } else {
            if (this.component.brand.nameCn !== this.component.brand.nameEn) {
              title = this.component.brand.nameEn + '(' + this.component.brand.nameCn + ')'
            } else {
              title = this.component.brand.nameCn
            }
          }
//          this.rightIcon = 'share'
        } else if (this.startWith(val, '/mobile/shop/')) {
          title = this.store.storeName
//          this.rightIcon = 'phone'
        } else if (this.startWith(val, '/mobile/shop')) {
          title = '店铺列表'
//          this.rightIcon = 'phone'
        } else if (this.startWith(val, '/mobile/user')) {
          if (this.$route.query.type === 'saler') {
            title = '卖家中心'
          } else {
            title = '买家中心'
          }
//          this.rightIcon = 'phone'
        } else if (this.startWith(val, '/mobile/search')) {
          title = '搜索结果'
//          this.rightIcon = 'share'
        } else if (this.startWith(val, '/mobile/applyPurchase/sayPrice')) {
          title = '编辑报价'
        } else if (this.startWith(val, '/mobile/applyPurchase/list')) {
          if (query.status === '1') {
            title = '已采纳'
          } else {
            title = '已报价'
          }
        } else if (val === '' || val === '/' || !val) {
          title = '优软商城'
//          this.rightIcon = 'phone'
        } else {
          title = '优软商城'
//          this.rightIcon = 'phone'
        }
        return title
      },
//      showLink: function () {
//        this.showStoreInfo = true
//        if (this.$route.path.startsWith('/mobile/shop/')) {
//          this.showDefaultAddr = false
//        } else {
//          this.showDefaultAddr = true
//        }
//      },
//      shareWeibo: function () {
//        let _shareUrl = 'http://v.t.sina.com.cn/share/share.php?&appkey=895033136'     // 真实的appkey，必选参数
//        _shareUrl += '&url=' + encodeURIComponent(document.location)     // 参数url设置分享的内容链接|默认当前页location，可选参数
//        _shareUrl += '&title=' + encodeURIComponent(document.title)    // 参数title设置分享的标题|默认当前页标题，可选参数
//        _shareUrl += '&source=' + encodeURIComponent('')
//        _shareUrl += '&sourceUrl=' + encodeURIComponent('')
//        _shareUrl += '&content=' + 'utf-8'   // 参数content设置页面编码gb2312|utf-8，可选参数
//        _shareUrl += '&pic=' + encodeURIComponent('')  // 参数pic设置图片链接|默认为空，可选参数
//        window.open(_shareUrl)
//        this.showShare = false
//      },
//      shareWeChat: function () {
//      },
//      shareQQ: function () {
//        let url = encodeURIComponent(document.location)
//        let title = encodeURIComponent(document.title)
//        let source = encodeURIComponent('')
//        let desc = '优软商城'
//        let pics = 'http://dfs.ubtob.com/group1/M00/4F/C3/CgpkyFnxWjOAMy5DAAlh1PrLlc8684.png'
//        window.open('http://connect.qq.com/widget/shareqq/index.html?url=' +
//          url + '&title=' + title + '&source=' + source + '&desc=' + desc + '&pics=' + pics)
//        this.showShare = false
//      },
//      shareMessage: function () {
//        document.getElementById('share-sms').click()
//      },
//      shareEmail: function () {
//        document.getElementById('share-mail').click()
//      },
//      flash: function () {
//        window.location.reload()
//      },
//      copyLink: function () {
//        let _this = this
//        _this.url = window.location.href
//        _this.clipboard = new Clipboard('#copyLink')
//      },
//      onTouchMove: function (e) {
//        let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
//        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
//        let x = Math.min(width - 40, e.touches[0].clientX)
//        let y = Math.min(height - 40, e.touches[0].clientY)
//        x = Math.max(0, x)
//        y = Math.max(0, y)
//        e.preventDefault()
//        e.target.style.left = x * 2 / 100.0 + 'rem'
//        e.target.style.top = y * 2 / 100.0 + 'rem'
//      },
      onCancelSearch: function () {
        this.showMainSearch = false
      },
//      cancelModal: function () {
//        this.showStoreInfo = false
//        this.showShare = false
//      },
      stopPropagation: function (event) {
        event.stopPropagation()
      },
      goMainSearch: function () {
        this.showMainSearch = true
        this.$store.dispatch('searchData/getSearchHistory')
      },
      startWith: function (str, s) {
        let reg = new RegExp('^' + s)
        return reg.test(str)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mobile-header{
    position: fixed;
    top: 0;
    z-index: 10;
    width:100%;
    height:.88rem;
    line-height: .88rem;
    border-bottom:.04rem solid #ccc;
    background: #3e82f5;
    padding:0 .2rem 0 .1rem;
    color:#fff;
  }
  .mobile-header p{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size:.36rem;
    text-align: center;
    margin: 0;
    width: 6rem;
    padding-left: 1rem;
  }
  .mobile-header a{
    font-size:.28rem;
    color:#fff;
    position: absolute;
  }
  .mobile-header a i{
    font-size: .48rem;
    margin-right: -.1rem;
  }
  .mobile-header p span {
    position: absolute;
    right: .4rem;
    font-size: .28rem;
  }
  .mobile-header p span i {
    font-size: .28rem;
  }
  .mobile-nav >i{
    font-size: .4rem;
    position: fixed;
    right: .25rem;
    top: .25rem;
    z-index: 1000;
    color: #fff;
    background: rgba( 0, 0, 0, .251 );
    width: .8rem;
    height: .8rem;
    line-height: .8rem;
    border-radius: 100%;
    padding-left: .2rem;
  }
  .hide {
    display: none;
  }
  .search-content {
    margin-left: .5rem;
    input {
      color: #333;
    }
  }
</style>
