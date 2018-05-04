<template>
  <div id="nav_fragment">
    <div class="container">
      <div class="row" style="height: 120px; padding-top: 30px; margin: 0;">
        <!-- 店铺信息以及下拉菜单 -->
        <div id = "shop" :class="{ 'drop-down-active' : isOpen }" @mouseleave="closeDropDown()">
          <div class="dropdown">
            <div style="width: 440px;">
              <div class="dropdown-btn" style="margin-top: 0;">
                <div style="margin-bottom: 15px;">
                  <a role="button" class="dropdown-toggle" @mouseover="openDropDown()">
                    <span class="shop-name" v-text="storeInfo.storeName || '店铺名称'"></span>
                    <span><i class="fa fa-angle-down fa-fw" style="font-size: 20px;"></i></span>
                  </a>
                </div>
                <div class="icon-style">
                  <button class="btn btn-xs btn-danger btn-nav" v-if="!isFocus"><span class="watch">关注</span></button>
                  <span v-if="isFocus == 'false' || typeof isFocus == 'object'"><button type="text" @click="focus(storeInfo.id, storeInfo.storeName)" class="btn btn-xs btn-danger btn-nav"><span class="watch">关注</span></button></span>
                  <span v-if="isFocus == 'true'" ><button class="btn btn-xs btn-default btn-nav" style="width:50px"><span>已关注</span></button></span>
                  <span v-if="storeInfo.type == 'ORIGINAL_FACTORY'">&nbsp;<img src="/images/store/icon/icon-factory.png"/></span>
                  <span v-else-if="storeInfo.type == 'AGENCY'">&nbsp;<img src="/images/store/icon/icon-agent.png"/></span>
                  <span v-else-if="storeInfo.type == 'DISTRIBUTION'">&nbsp;<img src="/images/store/icon/icon-distribution.png"/></span>
                  <span v-else-if="storeInfo.type == 'CONSIGNMENT'">&nbsp;<img src="/images/store/icon/consignment.png"/></span>
                  <span class="link-seller">
                    <img src="/images/all/songguo.png">
							      <a @click="goWebChat()" class="contact_btn">联系卖家</a>
                  </span>
                  <div class="share">
                    <span @click="setShowShare(!showShare, $event)">生成手机版链接</span>
                    <div v-show="showShare">
                      <i class="icon-guanbi1 iconfont" @click="setShowShare(false, $event)"></i>
                      <h1>分享链接</h1>
                      <p>随时随地使用手机查看店铺现货</p>
                      <canvas id="qrccode-canvas"></canvas>
                      <input v-if="showShare" :value="url" readonly>
                      <span v-if="showShare" id="copyLink"  :data-clipboard-text="url">复制链接</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="clearfix"></div>
            </div>
            <div style="background: #FFFFFF;" v-if="isOpen">
              <ul class = "shop-contact list-unstyled" style="padding: 15px 0; margin-bottom: 0; border-top: #e8e8e8 1px solid; margin-top: 20px;">
                <li v-if="storeInfo.enterprise.enTel">
                  <span>电话：</span><span v-text="storeInfo.enterprise.enTel"></span>
                </li>
                <li v-if="storeInfo.enterprise.enFax">
                  <span>传真：</span><span v-text="storeInfo.enterprise.enFax"></span>
                </li>
                <li v-if="storeInfo.enterprise.address || storeInfo.enterprise.enAddress">
                  <span>地址：</span><span v-text="storeInfo.enterprise.address || storeInfo.enterprise.enAddress"></span>
                </li>
                <li class="text-right">
                  <nuxt-link :to="{ name: 'store-uuid-description', params: { uuid: storeInfo.uuid } }">了解更多&gt;</nuxt-link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 搜索框 -->
        <div id="search-group" style="margin-left: 450px;">
          <search-box/>
        </div>
      </div>
    </div>
    <!--关注-->
    <el-dialog
      :visible.sync="dialogVisible"
      size="tiny"
     >
      <h3 class="header-text">关注成功！</h3>
      <div class="focus modal-body">
        <button type="button" @click="dialogVisible = false" class="btn" style="margin-left:25px;">关&nbsp;&nbsp;闭</button>
        <button type="button" @click="dialogVisible = false" class="focus-btn btn btn btn-info" style="margin-left:35px;">
          <a href="/user#/storeFocus" target="_blank">查看我的店铺关注</a>
        </button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
import SearchBox from '~components/main/Search.vue'

let QRCode = require('qrcode')

export default {
  name: 'store-header',
  data () {
    return {
      isOpen: false,
      dialogVisible: false,
      clipboard: {},
      showShare: false
    }
  },
  components: {
    SearchBox
  },
  mounted () {
    let _this = this
    _this.url = window.location.href
    _this.clipboard = new Clipboard('#copyLink')
    _this.clipboard.on('success', e => {
      _this.clipboard.destroy()
      _this.$message.success('已复制到剪切板')
    })
    _this.clipboard.on('error', e => {
      _this.$message.error('浏览器不支持自动复制，请手动复制')
      _this.clipboard.destroy()
    })
    document.addEventListener('click', function () {
      _this.showShare = false
    })
  },
  computed: {
    storeInfo () {
      return this.$store.state.shop.storeInfo.store.data
    },
    user () {
      return this.$store.state.option.user
    },
    isFocus () {
      return this.$store.state.shop.storeInfo.focusList.data
    },
    tab () {
      return this.$store.state.chat.tab.tab.data
    },
    url: {
      get: function () {
        return window.location.protocol + '//' + window.location.host + '/mobile/share/storeShare/' + this.storeInfo.uuid
      },
      set: function () {
      }
    }
  },
  methods: {
    loadQRcode: function () {
      let canvas = document.getElementById('qrccode-canvas')
      QRCode.toCanvas(canvas, this.url, (error) => {
        if (error) {
          console.log(error)
        } else {
          console.log('QRcode success')
        }
      })
    },
    closeDropDown () {
      this.isOpen = false
    },
    openDropDown () {
      this.isOpen = true
    },
    focus (id, name) {
      if (!this.user.logged) {
        this.$http.get('/login/page', {params: {returnUrl: window.location.href}}).then(response => {
          if (response.data) {
            window.location.href = response.data.content + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
          }
        })
      } else {
        this.dialogVisible = true
        this.$store.dispatch('shop/StoreFocus', {storeName: name, storeid: id})
        this.isFocus = true
      }
    },
    goWebChat: function () {
      if (!this.user.logged) {
        this.$http.get('/login/page').then(response => {
          if (response.data) {
            this.$router.push('/auth/login')
          }
        })
      } else {
        // 获得窗口的垂直位置
        let iTop = (window.screen.availHeight - 30 - 780) / 2
        // 获得窗口的水平位置
        let iLeft = (window.screen.availWidth - 10 - 1030) / 2
        if (this.tab.close) {
          this.tab.close()
        }
        let newTab = window.open('', '即时对话框', 'height=750, width=1000, top=' + iTop + ', left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
        newTab.close()
        newTab = window.open('', '即时对话框', 'height=750, width=1000, top=' + iTop + ', left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
        this.$store.dispatch('chat/setChatTab', {tab: newTab})
        this.$http.get('/basic/enterprise/' + this.storeInfo.enUU + '/info')
          .then(response => {
            let obj = {}
            obj.userPhone = this.user.data.userTel
            obj.userType = 'ENTERPRISE'
            this.user.data.enterprises.forEach(function (item, index) {
              if (item.current) {
                obj.enUU = item.uu
                obj.enterprise = {enUU: item.uu, name: item.enName}
              }
            })
            obj.otherEnUU = response.data.uu
            obj.otherUserType = 'STORE'
            obj.otherEnterprise = {enUU: response.data.uu, name: response.data.enName}
            obj.type = 'CHAT'
            if (!(/^1\d{10}$/).test(response.data.enTel)) {
              this.$http.get('/basic/enterprise/' + response.data.uu + '/admin').then(response => {
                console.log(response)
                obj.toPhone = response.data.userTel
                console.log(obj)
                this.openWebChat(newTab, obj)
              }, err => {
                console.log(err)
                this.$message.error('暂无卖家管理员手机号！')
              })
            } else {
              obj.toPhone = response.data.enTel
              console.log(obj)
              this.openWebChat(newTab, obj)
            }
          }, err => {
            console.log(err)
          })
      }
    },
    openWebChat: function (newTab, obj) {
      this.$http.post('https://im.ubtob.com/api/chat/infos?condition=chat_info', obj)
        .then(response => {
          if (response.data.success) {
            newTab.location.href = 'https://im.ubtob.com/chat/visit?gid=' + response.data.content
          }
        })
    },
    setShowShare: function (flag, event) {
      event.stopPropagation()
      this.loadQRcode()
      this.showShare = flag
    }
  }
}
</script>
<style scoped>
  .header-text {
    text-align: center;
    font-size: 20px;
    color: #008B00;
    margin-top: 0;
  }
  .el-dialog__body{
    padding: 20px !important;
  }
  .focus button.focus-btn a{
    color: #fff;
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  .focus button.focus-btn{
    width: 138px;
    height: 36px;
    line-height: 36px;
    padding: 0;
  }
	#nav_fragment {
		margin-bottom: 20px;
	}

	#nav_fragment .shop-name {
		font-size: 24px;
		color: RGB(50,50,50);
	}

	#nav_fragment div#shop {
		width: 440px;
		padding: 5px;
	}

	#nav_fragment .shop-info {
		font-size: 12px;
		color: rgb(50,50,50);
	}

	#nav_fragment .shop-data {
		font-size: 12px;
		line-height: 25px;
		font-weight: 600;
		color: RGB(255,0,0);
	}

	#nav_fragment .btn-nav{
		width: 40px;
		height: 20px;
		line-height: 14px;
    padding: 0;
	}

	#nav_fragment .btn-nav .watch {
		font-size: 12px;
		color: white;
	}

	#nav_fragment .btn-nav .message {
		font-size: 12px;
		color: rgb(50,50,50);
	}

	#nav_fragment div.dropdown {
		margin-top: -5px;
		padding: 5px;
	}

	#nav_fragment .shop-contact {
		font-size: 14px;
		color: rgb(120,120,120);
		line-height: 25px;
	}

	#nav_fragment .shop-contact a{
		color: rgb(33,71,151);
	}

	#nav_fragment #search_input {
		height: 40px;
		font-size: 16px;
		border: 2px solid #5078cb;
		border-top-left-radius: 0px;
		border-bottom-left-radius: 0px;
		line-height: 40px;
	}

	#nav_fragment #search_input:focus {
		border-color: #5078cb;
		outline: 0;
		-webkit-box-shadow: none;
		box-shadow: none;
	}

	#nav_fragment #search_btn {
		background-color: #5078cb;
		color: rgb(255, 255, 255);
		font-size: 16px;
		width: 78px;
		height: 40px;
		border: 2px solid #5078cb;
		border-radius: 0;
	}

	#nav_fragment #search_btn_this {
		height: 36px;
		line-height: 36px;
		padding-top: 0px;
		padding-bottom: 0px;
		font-size: 16px;
		font-weight: 600;
		color: #5078cb;
		background: #fff;
		border-radius: 0;
		border: 1px #5078cb solid;
	}

	#nav_fragment .my-cart {
		margin-top: 20px;
		margin-left: 20px;
	}

	#nav_fragment .my-cart #my-cart{
		font-size: 14px;
		color: #5078cb;
	}

	#nav_fragment .my-cart .badge {
		background-color: #ff0000;
		position: absolute;
		top: -10px;
	}

	#nav_fragment .list-unstyled {
		list-style: none;
	}

	#nav_fragment a:hover,a:focus {
		text-decoration: none;
	}

	#nav_fragment .row>div {
		float: left;
	}

	#nav_fragment #shop {
		width: 100%;
		position: absolute;
		float: left;
	}

	#nav_fragment #search-group {
		padding-top: 20px;
		margin-left: 10px;
		padding-left: 20px;
		top: -12px;
		position: relative;
	}

	#nav_fragment #search-group .input-group {
		margin-right: 10px;
		float: left;
		width: 480px;
	}

	#nav_fragment .dropdown .dropdown-menu .dropdown-btn {
		float: left;
		margin-top: 30px;
	}

	#nav_fragment .dropdown .dropdown-score .description {
		padding-top: 10px;
		color: #323232;
		font-size: 12px;
	}

	#nav_fragment .dropdown .dropdown-score .score {
		display: inline-block;
		padding-top: 5px;
		color: #FF6868;
		font-size: 12px;
	}

	#nav_fragment .dropdown .dropdown-menu .dropdown-score>div>div {
		margin-top: 0px;
		width: 25px;
		margin-right: 10px;
	}

	#nav_fragment .shop-score {
		margin-top: 20px;
		margin-left: 70px;
	}

	#nav_fragment .shop-score>div>div {
		margin-right: 10px;
		width: 25px;
	}

	#nav_fragment .hot-search .active-search-item {
		color: #ff0101;
		font-size: 13px;
		display: inline-block;
		margin-right: 1em;
	}

	#nav_fragment .hot-search .resources {
		font-size: 12px;
		color: rgb(250,50,50);
	}

	#nav_fragment .hot-search .hot-word {
		font-size: 12px;
		color: rgb(50,50,50);
		margin-left: 20px;
	}
	#nav_fragment .drop-down-active {
		z-index: 20;
		-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 2px rgba(210,209,209,.9);
		box-shadow:inset 0 1px 1px rgba(0,0,0,.075),0 0 2px rgba(210,209,209,.9);
		border: #f5f5f5 1px solid;
		background-color: white;
		transition: dispaly .5s ease;
	}
	.hot-search{
		margin-top: 5px;
	}
	.hot-search .static{
		color: #f00;
	}
	.hot-search a{
		color: #838383;
	}
	.hot-search a:hover{
		color: #f00;
	}
	.my-cart .btn{
		top: -8px;
		position: relative;
	}
	#search-group .association {
		position: absolute;
		left: 0;
		top: 100%;
		right: 61px;
		list-style: none;
		-webkit-padding-start: 0;
		background: #ffffff;
		border: 1px solid #dddddd;
		z-index: 21;
	}

	#search-group .association li {
		padding: 0 15px;
		line-height: 30px;
		text-align: left;
	}

	#search-group .association li:hover {
		background: #EEEEEE;
		cursor: pointer;
	}
	.text-right{
		text-align: right;
	}
	.text-right a:hover{
		color: #d32526 !important;
		text-decoration: underline;
	}
	.icon-style img{
		vertical-align: top;
		position: relative;
		top: -9px;
	}
  .icon-style >span {
    margin-right: 5px;
  }
  .icon-style .link-seller {
    cursor: pointer;
  }
  .icon-style .link-seller img {
    top: -2px;
  }
  .icon-style .link-seller a {
    font-size: 12px;
    color: #fff;
    line-height: 20px;
    height: 20px;
    padding: 0 7px;
    background: #ef7f03;
    border-radius: 2px;
  }
  .icon-style .share {
    display: inline-block;
    margin-left: 5px;
    position: relative;
  }
  .icon-style .share > span {
    color: #4290f7;
    cursor: pointer;
  }
  .icon-style .share > div {
    position: absolute;
    top: 26px;
    left: -94px;
    width: 300px;
    height: 380px;
    background: #fff;
    box-shadow: 1px 1px 4px 0 #ccbebe;
    z-index: 1;
    text-align: center;
  }
  .icon-style .share > div input {
    display: inline-block;
    width: 140px;
    overflow: hidden;
    height: 35px;
    vertical-align: middle;
  }
  .icon-style .share > div span {
    display: inline-block;
    color: #fff;
    background: #4290f7;
    height: 36px;
    line-height: 36px;
    width: 70px;
    font-style: normal;
    vertical-align: middle;
    cursor: pointer;
  }
  .icon-style .share > div i {
    position: absolute;
    right: 10px;
    top: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
  }
</style>
