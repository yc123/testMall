<template>
  <div>
    <div class="com-mobile-header">
      <a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>
      <p>个人中心
        <span @click="showLogout = true">退出</span>
      </p>
    </div>
    <div class="mobile-user mobile-fix-content">
      <div class="line img-line">
        <div class="img-wrap">
          <img src="/images/component/default.png" alt="">
        </div>
        <span>{{user.data.userName}}</span>
      </div>
      <div class="line" @click="showLogin=true">
        <div class="img-wrap">
          <img src="/images/mobile/user/icon_01.png" alt="">
        </div>
        <span>公司</span>
        <i class="iconfont icon-xiangyou"></i>
        <span class="l-right">{{user.data.enterprise.enName}}</span>
      </div>
      <div class="line" @click="go('/mobile/user/storeinfo')">
        <div class="img-wrap">
          <img src="/images/mobile/user/icon_02.png" alt="">
        </div>
        <span>店铺信息</span>
        <i class="iconfont icon-xiangyou"></i>
      </div>
      <div class="line block-line" @click="go('/mobile/user/enterpriseinfo')">
        <div class="img-wrap">
          <img src="/images/mobile/user/icon_03.png" alt="">
        </div>
        <span>企业信息</span>
        <i class="iconfont icon-xiangyou"></i>
        <div class="border-line"></div>
      </div>
      <nuxt-link to="/mobile/user/info/personal" tag="div" class="line block-line">
        <div class="img-wrap">
          <img src="/images/mobile/user/icon_04.png" alt="">
        </div>
        <span>个人信息</span>
        <i class="iconfont icon-xiangyou"></i>
        <div class="border-line"></div>
      </nuxt-link>
      <div @click="go('/mobile/user/info/admin')" class="line block-line">
        <div class="img-wrap">
          <img src="/images/mobile/user/icon_05.png" alt="">
        </div>
        <span>管理员信息</span>
        <i class="iconfont icon-xiangyou"></i>
        <div class="border-line"></div>
      </div>
      <div class="deleteKuang" v-if="showLogout">
        <div class="kuangContent">
          <div class="title">系统提示</div>
          <div class="titleinfo">是否退出登录</div>
          <!--<div class="info" v-show="isUploadpro">*存在已上架信息</div>-->
          <div class="K_btn">
            <div class="cancelBtn" @click="showLogout = false">取消</div>
            <div class="answerBtn" @click="logout()">确定</div>
          </div>
        </div>
      </div>
      <div class="mobile-modal" v-if="showLogin" @click="showLogin=false">
        <div class="modal-content" @click="stopPro($event)">
          <p>公司选择 <i class="iconfont icon-guanbi1" @click="showLogin=false"></i></p>
          <ul>
            <li class="active" @click="switchEnterprise(user.data.enterprise)">
              <a>{{ user.data.enterprise.enName }}</a>
              <i class="iconfont icon-xuanzhong"></i>
            </li>
            <li
              v-for="en in sortEnterprises"
              v-if="en.uu != user.data.enterprise.uu"
              v-bind:key="en.uu"
              @click="switchEnterprise(en)">
              <a>{{ en.enName }}</a>
            </li>
            <li v-if="user.data.enterprise.uu" @click="switchEnterprise({uu: 0})">
              <a><span v-text="user.data.userName"></span>（个人账户）</a>
            </li>
          </ul>
        </div>
      </div>
      <remind-box :title="collectResult" :timeoutCount="timeoutCount"></remind-box>
    </div>
  </div>
</template>
<script>
  import { RemindBox } from '~components/mobile/common'
  export default {
    layout: 'mobileNoHeader',
    middleware: 'authenticated',
    data () {
      return {
        showLogout: false,
        showLogin: false,
        timeoutCount: 0,
        collectResult: ''
      }
    },
    components: {
      RemindBox
    },
    methods: {
      switchEnterprise(en) {
        this.$http.get(`/user/authentication/${en.uu || 0}`).then(() => {
          this.$store.dispatch('loadUserInfo').then(() => {
            this.showLogin = false
          })
        })
      },
      logout () {
        this.$http.get('/logout/crossBefore', {params: {returnUrl: window.location.protocol + '//' + window.location.host}}).then(response => {
          if (response.data) {
            window.location.href = response.data.logoutUrl + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
          }
        })
      },
      stopPro (e) {
        if (e) {
          e.stopPropagation()
        }
      },
      go: function (url) {
        if (url === '/mobile/user/storeinfo') {
          this.$http.get('/store-service/stores', {params: {op: 'check'}}).then(res => {
            if (res.data.uuid) {
              this.$router.push(url)
            } else {
              this.setRemindText('请先前往pc端申请开店')
            }
          }, err => {
            console.log(err)
            this.setRemindText('请先前往pc端申请开店')
          })
        } else if (!this.user.data.enterprise.uu || this.user.data.enterprise.isVendor !== 313) {
          this.setRemindText('请先前往pc端完善企业信息')
        } else {
          this.$router.push(url)
        }
      },
      setRemindText: function (str) {
        this.collectResult = str
        this.timeoutCount++
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mobile-user {
    background: #f1f3f6;
    .line {
      height: 1.17rem;
      background: #fff;
      line-height: 1.17rem;
      font-size: .28rem;
      padding: 0 .24rem 0 .26rem;
      width: 7.1rem;
      margin: .3rem auto 0;
      .img-wrap {
        width: .8rem;
        margin: 0 .26rem 0 0;
        display: inline-block;
        img {
          max-width: .8rem;
          max-height: .8rem;
        }
      }
      .l-right {
        color: #666;
        float: right;
        margin-right: .35rem;
        max-width: 4.2rem;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      i {
        float: right;
        color: #c1c1c6;
        font-size: .28rem;
      }
      &.img-line {
        padding-left: .16rem;
        .img-wrap {
          width: .9rem;
          margin: 0 .16rem 0 0;
          img {
            max-width: .9rem;
            max-height: .9rem;
            border-radius: 100%;
            border: 1px solid #acc;
          }
        }
      }
      &.block-line {
        margin-top: 0;
        position: relative;
        .border-line {
          width: 6.62rem;
          position: absolute;
          top: 0;
          height: 1px;
          background: #d9d9d9;
        }
      }
    }
  }
  .deleteKuang {
    position: fixed;
    background: rgba(0,0,0,0.5);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    .kuangContent {
      border-radius: 5px;
      background: #fff;
      width: 5rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      overflow: hidden;
      .titleinfo {
        font-size: .3rem;
        color: #666;
        text-align: center;
        margin-top: 0.5rem;
        margin-bottom: 0.1rem;
      }
      .title {
        background: #5078cb;
        height: .7rem;
        line-height: .7rem;
        font-size: .3rem;
        color: #fff;
        text-align: center;
      }
      .info {
        color: #f00;
        text-align: center;
      }
      .K_btn {
        margin-top: 0.4rem;
        line-height: 0.7rem;
        height: 0.7rem;
        &::after{
          clear: both;
          display: block;
          content: ' ';
          visibility: hidden;
          zoom: 1;
        }
        div {
          float: left;
          width: 50%;
          font-size: 0.3rem;
          text-align: center;
          &.cancelBtn {
            background: #b4b5b9;
            color: #333;
          }
          &.answerBtn {
            background: #5078cb;
            color: #fff;
          }
        }
      }
    }
  }
  .modal-content {
    position: absolute;
    height: 5.32rem;
    bottom: 0;
    left: 0;
    background: #fff;
    width: 100%;
    border-radius: 0;
    box-shadow: 0 -9px 9px rgba(0,0,0,.5);
    p {
      height: .88rem;
      line-height: .88rem;
      text-align: center;
      font-size: .3rem;
      background: #f6f5f5;
      i {
        position: absolute;
        right: 0;
        color: #bebebe;
        font-size: .24rem;
        margin-right: .35rem;
      }
    }
    ul {
      height: 4.4rem;
      overflow-y: auto;
      li {
        height: 1rem;
        line-height: 1rem;
        padding: 0 .23rem 0 .4rem;
        border-bottom: 1px solid #e5e6eb;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        a {
          display: inline-block;
          color: #666;
          font-size: .28rem;
        }
        i {
          color: #3f84f6;
          float: right;
          font-size: .24rem;
        }
        &.active {
          a {
            color: #3f84f6;
            border-bottom: 1px solid #3f84f6;
          }
        }
      }
    }
  }
</style>
