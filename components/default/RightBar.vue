<template>
  <div>
    <div class="right-bar">
      <ul class="right-bar-center">
        <li class="right-bar-item" v-show="storeStatus && storeStatus.uuid">
          <a @click="goShop" class="title" target="_blank">
            <i class="iconfont icon-dianpu icon-xlg"></i>
          </a>
          <div class="sidebar-menu"><a @click="goShop" title="我的店铺" target="_blank">我的店铺</a></div>
        </li>
        <li class="right-bar-item" @mouseenter="loadCarCount()">
          <a @click="goCart" class="title" target="_blank">
            <i class="iconfont icon-shopping-cart icon-xlg"></i>
          </a>
          <div class="sidebar-menu"><a @click="goCart" title="我的购物车" target="_blank">我的购物车<em><span>(<span v-text="cartCount.count || 0"></span>)</span></em></a></div>
        </li>
        <li class="right-bar-item">
          <a @click="dialogVisible = true" class="title">
            <i class="iconfont icon-liuyan icon-xlg"></i>
            <div class="sidebar-menu"><a title="留言板" target="_blank">留言板</a></div>
          </a>
        </li>
        <li class="right-bar-item contact-menu">
          <a href="http://wpa.qq.com/msgrd?v=3&uin=3432892085&site=www.ubtoc.com&menu=yes" target="_blank" class="title">
            <i class="iconfont icon-kefu icon-xlg"></i>
          </a>
          <div class="contact-us sidebar-menu">
            <p>在线客服：<img src="/images/all/songguo.png" /><a href="http://wpa.qq.com/msgrd?v=3&uin=3432892085&site=www.ubtoc.com&menu=yes" class="contact-btn" target="_blank">联系客服</a></p>
            <p>服务电话：400-830-1818</p>
            <p>服务邮箱：yrsc@usoftchina.com</p>
            <p>工作时间：</p>
            <p>周一至周五 9:00-18:00</p>
          </div>
        </li>
        <li class="right-bar-item contact-menu">
          <a href="javascript:void(0)" class="title" @click="goWebChat">
            <i class="fa fa-comments-o" aria-hidden="true" style="color: #FFFFFF;">
            </i>
            <i class="remind-point" v-if="user.logged && chatCount>0"></i>
          </a>
          <div class="sidebar-menu" title="优软互联"><a @click="goWebChat">优软互联<span v-if="user.logged">({{chatCount}})</span></a></div>
        </li>
      </ul>
      <ul class="right-bar-bottom">
        <li class="right-bar-item" @mouseenter="loadHistorys()">
          <a @click="goHistory" class="title" target="_blank">
            <i class="iconfont icon-zuji icon-xlg"></i>
          </a>
          <div class="sidebar-menu" v-if="!user.logged"><a @click="goHistory" title="浏览记录">浏览记录</a></div>
          <div class="sidebar-menu" v-if="user.logged && listMe(history).length == 0"><a href="/user#/browsingHistory" title="浏览记录">浏览记录</a></div>
          <div class="foot-record sidebar-menu" v-if="user.logged && listMe(history).length > 0">
            <h3><a href="/user#/browsingHistory">浏览历史</a></h3>
            <dl>
              <dd v-for="item in listMe(history)">
                  <a :href="'/store/productDetail/' + item.batchCode" target="_blank" :title="item.code" v-text="item.code" v-if="item.status== 1"></a>
                  <a :title="item.code" v-text="item.code" v-if="item.status== 0" disabled="disabled"></a>
                  <div class="hover-shows">
                      <em :class="{ 'off' : item.status== 0}"></em>
                      <span :class="{ 'off' : item.status== 0}">失效</span>
                      <a @click="deleteHistory(item,item.id)">&times;</a>
                  </div>
              </dd>
            </dl>
          </div>
        </li>
        <li class="right-bar-item">
          <a @click="toTop()" class="title">
            <i class="iconfont icon-arrow-up icon-xlg"></i>
          </a>
          <div class="sidebar-menu"><a @click="toTop()" title="返回顶部" target="_blank">返回顶部</a></div>
        </li>
      </ul>
    </div>
    <el-dialog class="dialog"
      :visible.sync="dialogVisible"
      size="tiny">
      <message-board @pageEvent="listenPage" @openBoardEvent="listenOpen"/>
    </el-dialog>
  </div>
</template>
<script>
  import { scrollTo } from '~utils/scroll'
  import MessageBoard from '~components/default/MessageBoard.vue'
  export default {
    name: 'right-bar',
    data () {
      return {
        historyLength: [],
        dialogVisible: false,
        page: 1,
        count: 3,
        currentPage: 1,
        chatCount: 0,
        showMyshop: false
      }
    },
    components: {
      MessageBoard
    },
    computed: {
      user () {
        // console.log(this.$store.state.option)
        return this.$store.state.option.user
      },
      cartCount () {
        return this.$store.state.user.history.cartCount.data
      },
      history () {
        let arr = this.$store.state.user.history.historyList.data.slice(0, 8)
        return arr
      },
      enterprise () {
        let ens = this.user.data.enterprises
        if (ens && ens.length) {
          return ens.find(item => item.current) || {enName: this.user.data.userName + '（个人账户）'}
        } else {
          return {enName: this.user.data.userName + '（个人账户）'}
        }
      },
      tab () {
        return this.$store.state.chat.tab.tab.data
      },
      storeStatus () {
        return this.$store.state.option.storeStatus.data
      }
    },
    methods: {
      listenPage: function (p) {
        this.page = p
        this.$store.dispatch('getMessageBoardInformation', {page: this.page, count: 3})
      },
      listenOpen: function (flag) {
        this.dialogVisible = flag
      },
      listMe: function (list) {
        return list.filter(function (item) {
          return item.isDelete === 1
        })
      },
      loadHistorys () {
        if (this.user.logged) {
          if (!this.history.length) {
            this.$store.dispatch('user/loadHistory')
          }
        }
      },
      loadCarCount () {
        if (this.user.logged) {
          if (!this.cartCount.count) {
            this.$store.dispatch('user/CarCount')
          }
        }
      },
      toTop () {
        scrollTo('body', 300)
      },
      toBottom () {
        scrollTo(window.scrollY + window.innerHeight, 300)
      },
      deleteHistory (item, id) {
        this.$store.dispatch('user/deleteHistory', {id: id})
        this.$store.dispatch('user/loadHistory')
      },
      goLogin: function () {
        this.$http.get('/login/page', {params: {returnUrl: window.location.href}}).then(response => {
          if (response.data) {
            window.location.href = response.data.content + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
          }
        })
      },
      goHistory: function () {
        if (!this.user.logged) {
          this.goLogin()
        } else {
          window.location.href = '/user#/browsingHistory'
        }
      },
      goCart: function () {
        if (!this.user.logged) {
          this.goLogin()
        } else {
          window.open('/user#/cart')
        }
      },
      goShop: function () {
        window.location.href = `/store/${this.storeStatus.uuid}`
      },
      goWebChat: function () {
        if (!this.user.logged) {
          this.goLogin()
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
          this.$http.get('/basic/enterprise/' + this.enterprise.uu + '/info')
            .then(response => {
              let obj = {}
              obj.enUU = response.data.uu
              obj.enterprise = {enUU: response.data.uu, name: response.data.enName}
              obj.type = 'LIST'
              if (!(/^1\d{10}$/).test(this.user.data.userTel)) {
                this.$http.get('/basic/enterprise/' + obj.enUU + '/admin').then(response => {
                  obj.userPhone = response.data.userTel
                  this.openWebChat(newTab, obj)
                }, err => {
                  console.log(err)
                  this.$message.error('暂无卖家管理员手机号！')
                })
              } else {
                obj.userPhone = this.user.data.userTel
                this.openWebChat(newTab, obj)
              }
            }, err => {
              console.log(err)
              let obj = {}
              obj.type = 'LIST'
              if (!(/^1\d{10}$/).test(this.user.data.userTel)) {
                this.$http.get('/basic/enterprise/' + obj.enUU + '/admin').then(response => {
                  obj.userPhone = response.data.userTel
                  this.openWebChat(newTab, obj)
                }, err => {
                  console.log(err)
                  this.$message.error('暂无卖家管理员手机号！')
                })
              } else {
                obj.userPhone = this.user.data.userTel
                this.openWebChat(newTab, obj)
              }
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
      getChatCount: function () {
        if (this.user.logged) {
          this.$http.get('https://im.ubtob.com/api/chat/message', {params: {enUU: this.enterprise.uu, operate: 'count_unread', phone: this.user.data.userTel}})
            .then(response => {
              this.chatCount = response.data.count
            })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
a[disabled] {
  cursor: not-allowed;
}
em,
i {
  font-style: inherit;
}
.right-bar ul li {
  position: relative;
}
.right-bar ul li .sidebar-menu {
  position: absolute;
  display: block;
  right: -100%;
  top: 0px;
  bottom: 0;
  width: 100px;
  line-height: 38px;
  height: 38px;
  color: #ffffff;
  background: #555;
  -webkit-transform: translateX(100%);
  -moz-transform: translateX(100%);
  -ms-transform: translateX(100%);
  -o-transform: translateX(100%);
  transform: translateX(100%);
  -webkit-transition: transform 0.5s;
  -moz-transition: transform 0.5s;
  -ms-transition: transform 0.5s;
  -o-transition: transform 0.5s;
  transition: transform 0.5s;
  z-index: 19;
}
.right-bar ul li .sidebar-menu a {
  background-color: #555555;
}
.right-bar ul li:hover a {
  background-color: #555555;
}
.right-bar ul li:hover .sidebar-menu {
  display: block;
  -webkit-transform: translateX(-72px);
  -moz-transform: translateX(-72px);
  -ms-transform: translateX(-72px);
  -o-transform: translateX(-72px);
  transform: translateX(-72px);
}
/*浏览记录*/
.right-bar ul li .foot-record {
  /* display: none; */
  width: 210px !important;
  max-height: 230px;
  line-height: 30px;
  /* right: 200px;*/
  top: inherit;
  bottom: -100%;
  height: inherit;
  /*padding-bottom: 10px;*/
}
.right-bar ul li .foot-record h3 {
  line-height: 39px;
  border-bottom: #767575 1px solid;
  text-align: left;
  padding-left: 10px;
  width: 96%;
  display: inline-block;
  margin: 0 auto;
  font-size: 12px;
  height: 39px;
}
.right-bar ul li .foot-record h3:hover a {
  color: #fbb029;
}
.right-bar ul li .foot-record h3 a {
  color: #fff;
  background-color: inherit;
  line-height: 39px;
  text-align: left;
}
.right-bar ul li .foot-record dl {
  padding-top: 5px;
  display: inline-block;
  background: #555;
}
.right-bar ul li .foot-record dl,
.right-bar ul li .foot-record dl dd {
  width: 100%;
  margin: 0 auto;
  background: #555;
}
.right-bar ul li .foot-record dl dd {
  line-height: 22px;
  width: 100%;
  display: inline-block;
  float: left;
  height: 22px;
  position: relative;
}
.right-bar ul li .foot-record dl dd a {
  display: inline-block;
  height: 22px;
  padding: 0 10px;
  width: 91%;
  font-size: 12px;
  color: #fff;
  line-height: 22px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: none;
  text-align: left;
  padding-right: 44px;
}
.right-bar ul li a i {
  font-size: 20px;
}
.right-bar .remind-point {
  width: 8px;
  height: 8px;
  display: block;
  border-radius: 100%;
  background: red;
  position: relative;
  top: -31px;
  right: -21px;
}
.right-bar ul li li a:hover div.foot-record {
  display: inline-block !important;
}
.right-bar ul li .foot-record dl dd:hover {
  background: #fff;
}
.right-bar ul li .foot-record dl dd:hover a {
  color: #333;
}
.right-bar ul li .foot-record dl dd:hover div.hover-shows {
  display: inline-block;
}
.right-bar ul li .foot-record dl dd div.hover-shows {
  position: absolute;
  top: 0;
  right: 2px;
  max-width: 55px;
  line-height: 20px;
  padding-right: 0;
  z-index: 100;
  display: none;
}
.right-bar ul li .foot-record dl dd div.hover-shows span {
  display: inline-block;
  width: 30px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  background: #e04b38;
  color: #fff;
  border-radius: 5px;
  opacity: 0;
  margin-top: 1px;
}
.right-bar ul li .foot-record dl dd:first-child {
  /* margin-top: 5px;*/
}
.right-bar ul li .foot-record dl dd:last-child {
  /* margin-bottom: 10px;*/
}
.right-bar ul li .foot-record dl dd div.hover-shows a {
  font-size: 23px;
  float: right;
  width: 20px;
  padding: 0;
  text-align: center;
  color: #999;
  top: -2px;
}
.right-bar ul li .foot-record dl dd div.hover-shows a:hover {
  color: #fbb029;
}
.right-bar ul li .foot-record dl dd div.hover-shows em {
  display: inline-block;
  position: absolute;
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-left: 7px solid #fbb029;
  border-bottom: 8px solid transparent;
  left: -158px;
  top: 4px;
}
.right-bar ul li .foot-record dl dd div.hover-shows em.off {
  border-left: 8px solid #b2b0b0;
}
.right-bar ul li .foot-record dl dd div.hover-shows span.off {
  opacity: 1;
}
/*浏览记录结束*/
.right-bar ul li .contact-us {
  /*right: 200px;*/
  height: 180px;
  padding-top: 10px;
  width: 210px;
  top: -76px;
}
.right-bar ul li .contact-us p {
  line-height: 33px;
  text-align: left;
  padding-left: 10px;
  margin-bottom: 0;
  white-space: nowrap;
  font-size: 12px;
}
.right-bar ul li .contact-us .contact-btn {
  width: 62px;
  height: 18px;
  line-height: 18px;
  background: #ef7f03;
  display: inline-block;
  text-align: center;
  color: #fff;
  font-size: 12px;
  border-radius: 5px;
  padding: 0;
}
.right-bar-item {
  width: 36px;
  /* height: 38px;*/
}
.right-bar .right-bar-item a.title {
  display: inline-block;
  width: 36px;
  height: 38px;
  line-height: 38px;
  padding: 0;
}
.right-bar {
  position: fixed;
  z-index: 1000;
  right: 0;
  top: 0;
  width: 36px;
  height: 100%;

  .right-bar-center {
    position: absolute;
    top: 60%;
    transform: translateY(-50%);
    list-style: none;
    padding: 0;
    width: 100%;
  }

  .right-bar-bottom {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 36px;
  }

  .right-bar-item {
    a {
      position: relative;
      display: block;
      width: 100%;
      color: #fff;
      background-color: #5078cb;
      text-align: center;
      -webkit-transition: background-color ease 0.5s;
      -moz-transition: background-color ease 0.5s;
      -ms-transition: background-color ease 0.5s;
      -o-transition: background-color ease 0.5s;
      transition: background-color ease 0.5s;
      z-index: 20;
      font-size: 12px;
    }
  }
}
</style>
