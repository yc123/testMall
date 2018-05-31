<template>
  <header class="header">
    <div class="apply-adv" v-if="isShowApplyAdv">
      <a href="/applyPurchase#opportunities">
        <img src="/images/applyPurchase/apply-ad.png" alt="">
      </a>
      <i @click="ShowApplyAdv = false"></i>
    </div>
    <nav class="navbar">
      <div class="navbar-container container">
        <div class="navbar-header">
          <a href="http://www.ubtob.com" class="item navbar-link">
            <img src="/images/logo/uas.png" class="navbar-logo">
            <span class="navbar-slogan">进入优软云</span>
          </a>
        </div>
        <div class="navbar-right">
          <template v-if="user.logged">
            <div class="item-wrap dropdown">
              <div class="item dropdown-toggle">
                欢迎您，{{ user.data.userName }}&nbsp;|&nbsp;
                <a @click="logout()">[退出]</a>
                <span>{{enterprise.enName}}</span>
              </div>
              <div class="dropdown-menu" v-if="user.data.enterprises && user.data.enterprises.length > 0">
                <div class="menu-item-first">
                  <span>您可切换至以下账户：</span>
                </div>
                <ul>
                  <!-- <li class="menu-item-first">
                     <span class="member-text" :title="enterprise.enName"><i class="fa fa-map-marker"></i>&nbsp;{{ enterprise.uu?enterprise.enName: user.data.userName + '（个人账户）' }}</span>
                     <a class="pull-right" @click="toggleEnterprises()" v-if="user.data.enterprises && user.data.enterprises.length > 0">
                     {{ showEnterprises ? '取消' : '切换' }}
                     </a>
                     <span>您可切换至以下账户：</span>
                     <input type="text" placeholder="请输入公司名称" v-model="keyword"><span class="search-enterprise" @click="searchEnterprise()">搜索</span>
                   </li>-->
                  <li class="menu-item"
                      v-for="en in sortEnterprises"
                      v-if="en.uu!=enterprise.uu">
                    <a @click="switchEnterprise(en)" :title="en.enName">{{ en.enName }}</a>
                  </li>
                  <li class="menu-item"  v-if="enterprise.uu">
                    <a @click="switchEnterprise({uu: 0})"><span v-text="user.data.userName"></span>（个人账户）</a>
                  </li>
                </ul>
              </div>
            </div>
            <nuxt-link class="item" :to="'/'">商城首页</nuxt-link>
            <!--<nuxt-link class="item" to="/user">买家中心</nuxt-link>
            <nuxt-link class="item" to="/vendor">卖家中心</nuxt-link>-->
            <!--<a class="item" :href="url + '/user'">买家中心</a>
            <a class="item" :href="url + '/vendor'">卖家中心</a>-->
            <a class="item" href="/user#/index">买家中心</a>
            <a class="item" @click="toVendor">卖家中心</a>
          </template>
          <template v-else>
            <a class="item" @click="onLoginClick()">登录</a>
            <a class="item" @click="onRegisterClick">注册</a>
            <nuxt-link class="item" :to="'/'">商城首页</nuxt-link>
          </template>
          <nuxt-link class="item" to="/help/home" target="_blank">帮助中心</nuxt-link>
          <!--<a class="item" href="/help#/home">帮助中心</a>-->
        </div>
      </div>
    </nav>
  </header>
</template>
<script>
  export default {
    name: 'headerView',
    data () {
      return {
//        showEnterprises: false
//        searchEnterpriseArr: [],
//        keyword: '',
//        isSearching: false
        ShowApplyAdv: true,
        showEnterpriseToggle: false
      }
    },
    computed: {
      isShowApplyAdv () {
        if (this.$route.path.indexOf('/applyPurchase') === -1) {
          this.ShowApplyAdv = true
        }
        return this.ShowApplyAdv && this.$route.path.indexOf('/applyPurchase') !== -1
      },
      user () {
        // console.log(this.$store.state.option.user)
        return this.$store.state.option.user
      },
      enterprise () {
        return this.user.data.enterprise
      },
      url () {
        return this.$store.state.option.url
      }
    },
    methods: {
      logout () {
        this.$http.get('/logout/crossBefore').then(response => {
          if (response.data) {
            window.location.href = response.data.logoutUrl + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
          }
        })
      },
      onLoginClick () {
        this.$http.get('/login/page', {params: {returnUrl: window.location.href}}).then(response => {
          if (response.data) {
            window.location.href = response.data.content + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
          }
        })
        // TODO 待Account Center改版
      },
      onRegisterClick () {
        this.$http.get('/register/page').then(response => {
          if (response.data) {
            window.location.href = response.data.content
          }
        })
      },
      // 切换当前企业
      switchEnterprise (en) {
        this.showEnterpriseToggle = false
        this.$http.get(`/user/authentication/${en.uu}`).then(() => {
          this.$store.dispatch('loadUserInfo')
//          let path = this.$route.path
//          if (path === '/register-saler' && en.uu !== 0 && en.isVendor === 313) {
//            window.location.href = '/vendor#/index'
//          } else {
//            window.location.reload()
//          }
          window.location.href = '/'
        })
      },
      toVendor: function () {
        let isSelf = true
        let tempEnterprise = {}
        let ens = this.user.data.enterprises
        if (ens && ens.length) {
          ens.forEach(function (item) {
            if (item.current) {
              isSelf = false
              tempEnterprise = item
            }
          })
        } else {
          isSelf = true
        }
        if (isSelf) {
          window.location.href = '/personalMaterial'
        } else {
          if (tempEnterprise.isVendor === 313) {
            // window.location.href = '/vendor'
            window.location.href = '/vendor#/index'
          } else {
            window.location.href = '/register-saler'
          }
        }
      }
//      searchEnterprise () {
//        let key = this.keyword
//        let enterprise = this.user.data.enterprises
//        this.isSearching = true
//        this.searchEnterpriseArr = []
//        if (this.keyword === '') {
//          this.isSearching = false
//        } else {
//          for (let i = 0; i < enterprise.length; i++) {
//            if (enterprise[i].enName.indexOf(key) !== -1) {
//              this.searchEnterpriseArr.push(enterprise[i])
//            }
//          }
//        }
//      }
    }
  }
</script>
<style lang="scss" scoped>
  .header .navbar{
    min-height: inherit;
    border-radius: 0;
  }
  .header .navbar .navbar-container .navbar-right .dropdown .dropdown-menu li span,.header .navbar .navbar-container .navbar-right .dropdown .dropdown-menu li a{
    font-size: 12px;
  }
  .header .navbar .navbar-container .navbar-right .dropdown .dropdown-menu .menu-item a{
    width: 100%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 25px;
  }
  .header .navbar .navbar-container .navbar-right .dropdown .dropdown-menu .menu-item{
    height: 30px;
  }
  .apply-adv{
    margin: 0 auto;
    min-width: 1190px;
    position: relative;
    img{
      max-width: 100%;
      min-width: 1190px;
    }
    i {
      background: url("/images/search/search-close.png")no-repeat;
      width: 16px;
      height: 16px;
      position: absolute;
      right: 8px;
      top: 8px;
      cursor: pointer;
      z-index: 20000;
    }
  }
  .dropdown-menu>li>a{
    padding: 0;
    line-height: 30px;
  }
  .dropdown-menu>li a:hover{
    background: none;
    text-decoration: underline !important;
  }
  .dropdown-menu>li>a.pull-right{
    padding: 0;
    color: #1162a4 !important;
    line-height: inherit;
  }
  .member-text{
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
  }
  @import '~assets/scss/mixins';
  @import '~assets/scss/variables';

  $nav-height: 38px;

  .header {
   /* height: $nav-height;*/

    .navbar {
      width: 100%;
      height: 100%;
      font-size: $font-size-small;
      background-color: $black-light;

      .navbar-container {

        .item-wrap {
          display: inline-block;
        }

        .item {
          color: $grey;
          display: inline-block;
          height: 35px;
          line-height: 35px;
        }

        a {
          color: $grey;
        }

        .navbar-header {
          float: left;

          .navbar-logo {
            margin-bottom: 2px;
          }

          .navbar-slogan {
            margin-left: $sm-pad;
          }

        }

        .navbar-right {
          float: right;

          .item {
            padding: 0 $pad;
          }

          .dropdown {
            .dropdown-toggle {
              line-height: $nav-height;
              border-left: 1px solid $black-light;
              border-right: 1px solid $black-light;
              height: 35px;
              a {
                margin-left: 15px;
                float: right;
                &:hover {
                  color: $red !important;
                }
              }
              &:hover {
                border-left: 1px solid #999;
                border-right: 1px solid #999;
              }
              span {
                display: inline-block;
                max-width: 190px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                float: right;
              }
            }
            .menu-item-first {
              background: #eee;
              padding: 0 12px;
              line-height: 30px;
              font-size: 12px;
              >span:nth-child(1) {
                cursor: default;
                font-weight: bold;
              }
              input {
                width: 174px;
                height: 24px;
                margin-left: 35px;
                background: #fff;
                border: 1px solid #5078cb;
                padding-left: 4px;
              }
              .search-enterprise {
                display: inline-block;
                width: 36px;
                height: 24px;
                color: #fff;
                background: #5078cb;
                text-align: center;
                line-height: 24px;
                cursor: pointer;
              }
            }

            .dropdown-menu {
              padding: 0 6px 13px;
              margin:0;
              border-radius: 0;
              right: unset;
              background: #fff;
              border: 1px solid #999999;
              border-top: none;
              -webkit-box-shadow: none;
              -moz-box-shadow: none;
              box-shadow: none;

              ::-webkit-scrollbar {
                background: #f6f6f6;
              }

              ul {
                max-height: 300px;
                overflow-y: auto;
                background: #f6f6f6;
              }

              .menu-item {
                padding: 0 12px;
                a {
                  color: #333;
                  max-width: 300px;
                  line-height: 30px;
                  width: auto;
                  &:hover {
                    color: #5078cb;
                    text-decoration: none!important;
                  }
                }
              }
            }

            &:hover {
              background-color: $white;

              .dropdown-toggle {
                color: $text;
              }
              a {
                color: $text
              }
            }
          }
        }
      }
    }
  }
</style>
