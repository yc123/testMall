<template>
  <div class="user-contentCompontent">
    <div class="user-name">
      <img src="/images/component/default.png"/>
      <div class="user-info">
        <p v-text="userInfo.data.userName"></p>
        <p :class="{'long': !isShow}">
          <span class="en-name">{{enData.enName}}</span>
        </p>
        <div class="switch" v-if="isShow">
          <a @click="setShowEnterpriseToggle(!showEnterpriseToggle, $event)">切换</a>
          <span class="vir">|</span>
          <a class="exit" @click="showLogout = true">退出</a>
        <ul class="en-list" v-show="showEnterpriseToggle">
          <li class="menu-item"
              v-for="en in sortEnterprises"
              v-if="en.uu != enData.uu"
              v-bind:key="en.uu">
            <a @click="switchEnterprise(en)">{{ en.enName }}</a>
          </li>
          <li class="menu-item"  v-if="enData.uu">
            <a @click="switchEnterprise({uu: 0})"><span v-text="userInfo.data.userName"></span>（个人账户）</a>
          </li>
        </ul>
        </div>
      </div>
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
  </div>
</template>

<script>
  export default {
    data () {
      return {
        showEnterpriseToggle: false,
        showLogout: false  // 退出登录提示框
      }
    },
    props: {
      isShow: {
        default: true,
        type: Boolean
      }
    },
    mounted () {
      this.$nextTick(() => {
        document.body.addEventListener('click', () => {
          this.setShowEnterpriseToggle(false)
        }, false)
      })
    },
    methods: {
      // 切换当前企业
      switchEnterprise(en) {
        this.showEnterpriseToggle = false
        this.$http.get(`/user/authentication/${en.uu}`).then(() => {
          // this.$store.dispatch('loadUserInfo')
          this.$store.dispatch('loadUserInfo').then(() => {
            this.$emit('switchEnAction')
          })
          // this.$store.dispatch('loadStoreStatus', { op: 'check' }).then(() => {
          //   this.$emit('updateLoad')
          // })
        })
      },
      setShowEnterpriseToggle(flag, e) {
        if (e) {
          e.stopPropagation()
        }
        this.showEnterpriseToggle = flag
      },
      logout () {
        this.$http.get('/logout/crossBefore', {params: {returnUrl: window.location.protocol + '//' + window.location.host}}).then(response => {
          if (response.data) {
            window.location.href = response.data.logoutUrl + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
          }
        })
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.option.user
      },
      enData () {
        return this.user.data.enterprise
      }
    }
  }
</script>

<style lang="scss">
  .user-contentCompontent{
    .user-name{
      height: 1.8rem;
      padding: .28rem 0 .28rem .34rem;
      background: #fff;
      width: 100%;
      position: relative;
      img{
        display: inline-block;
        width: 1.25rem;
        height: 1.25rem;
        border: 1px solid #c5dbfc;
        border-radius: .05rem;
        vertical-align: middle;
      }
      .user-info {
        margin-left:.25rem;
        display: inline-block;
        vertical-align: middle;
        /*position: relative;*/
        p{
          font-size:.3rem;
          margin:0;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 3.92rem;
          &:nth-child(2) {
            position: relative;
            margin-top: .2rem;
            padding-right: .7rem;
            overflow: unset;
            max-width: unset;
            &.long {
              padding-right: 0;
              span {
                max-width: 5rem;
              }
            }
            .en-name {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 3.22rem;
              display: inline-block;
            }
            a {
              position: absolute;
              right: 0;
            }
          }
        }
        .switch {
          position: absolute;
          right: 1rem;
          top: 1.01rem;
          .en-list {
            position: absolute;
            max-width: 3rem;
            max-height: 3rem;
            overflow-y: auto;
            border-radius: .05rem;
            background: rgba(0, 0, 0, 0.6);
            z-index: 10;
            left: -1rem;
            .menu-item {
              height: .6rem;
              line-height: .6rem;
              font-size: .3rem;
              padding: 0 .2rem;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              &:active, &:focus, &:hover {
                background: #7d7d7d;
              }
              a {
                color: #fff;
              }
            }

          }
          .exit {
            right: -.8rem;
          }
          .vir {
            margin: 0 .1rem;
          }
        }
      }
      > a {
        font-size: .24rem;
        position: absolute;
        top: .45rem;
        right: .1rem;
        color: #3f84f6;
        border: 1px solid #3f84f6;
        border-radius: .2rem;
        padding: .06rem .12rem;
      }
    }
    ul.switch-list {
      li {
        display: inline-block;
        width: 50%;
        height: .63rem;
        line-height: .63rem;
        text-align: center;
        font-size: .28rem;
        color: #666;
        background: #fff;
        border: 1px solid #b4b4b4;
        border-right: none;
        &.active {
          background: #0067e7;
          border: 1px solid #0067e7;
          color: #fff;
        }
        &:first-child {
          border-left: none;
        }
        &:last-child {
          border-right: none;
        }
      }
      &.vendor-switch {
        li {
          width: 50%;
        }
      }
    }
    .seek {
      .seek-type {
        margin-top: .15rem;
        li {
          font-size: .28rem;
          color: #666;
          display: inline-block;
          width: 50%;
          text-align: center;
          div {
            border-bottom: 1px solid #c1c4c9;
            margin: 0 auto;
            height: .46rem;
            line-height: .46rem;
          }
          &.active {
            color: #3f84f6;
            div {
              border-color: #3f84f6;
            }
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
  }
</style>
