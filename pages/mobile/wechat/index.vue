<template>
  <div class="wechat-view">
    <div class="header-view">
      <div class="hearder-kuang">
        <div class="header-img">
          <img src="/images/mobile/@2x/wechat/header-img.png" :src="headerImg"/>
        </div>
      </div>
      <div class="header-name">
        {{userName}}
      </div>
      <img src="/images/mobile/@2x/wechat/headerbg.png" class="headerbg"/>
    </div>
    <div class="middle-view">
      <ul>
        <li class="telphone">
          <input placeholder="请输入手机号" type="tel" maxlength="11" @blur="telphoneBlur" v-model="telphoneNum"/>
        </li>
        <li class="info">
          <div v-show="telerror">
            请输入正确的手机号码
          </div>
        </li>
        <li class="password">
          <input placeholder="请输入密码" type="password" v-model="passwordNum"/>
        </li>
      </ul>
      <div class="loginBtn" @click="login">确定绑定已有账号登录</div>
      <div class="register">还没有优软账号，直接<span @click="resgiter">创建新账号</span></div>
      <nuxt-link :to="'/'"  class="mobile_footer company" tag="div">
        <div class="hr"></div>
        <img src="/images/mobile/@2x/wechat/logo.png" alt="">
        <div class="hr right"></div>
        <!--<p>此页面由深圳市优软商城科技有限公司提供</p>-->
        <!--<nuxt-link :to="'/'">www.usoftmall.com</nuxt-link>-->
        <!-- <a href="https://www.usoftmall.com">www.usoftmall.com</a> -->
      </nuxt-link>
    </div>
    <remind-box :title="collectResult" :timeoutCount="timeoutCount"></remind-box>
    <div class="listAlert" ref="userContent" v-show="wechatInfo.enterprises">
      <ul>
        <li v-for="(item, index) in wechatInfo.enterprises" @click="clickItem(item)">
          {{item.enName}}
        </li>
        <li @click="clickItem({uu: 0})">
          <a>个人账户</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { RemindBox } from '~components/mobile/common'
  import BScroll from 'better-scroll'
  // 实现深拷贝
  function deepCopy(target) {
    if (typeof target !== 'object') return
    // 判断目标类型，来创建返回值
    var newObj = target instanceof Array ? [] : {}
    for (var item in target) {
      // 只复制元素自身的属性，不复制原型链上的
      if (target.hasOwnProperty(item)) {
        newObj[item] = typeof target[item] === 'object' ? deepCopy(target[item]) : target[item]
      }
    }
    return newObj
  }
  export default {
    name: 'wechatView',
    layout: 'mobileNoHeader',
    // middleware: 'authenticated',
    data() {
       return {
         collectResult: '',
         timeoutCount: 0,
         telerror: false,
         telphoneNum: '',
         passwordNum: ''
       }
    },
    mounted() {
      this.$nextTick(() => {
        let info = localStorage.getItem('USOFTMALLWECHATINFO')
        this.$store.commit('option/REQUEST_WECHATINFO_STATUS_SUCCESS', JSON.parse(info))
        if (this.BScroll) {
          this.BScroll.refresh()
        } else {
          this.BScroll = new BScroll(this.$refs.userContent, {
            click: true
          })
        }
      })
    },
    methods: {
      clickItem(item) {
        let userAccount = deepCopy(this.$store.state.option.wechatInfo.data.userAccount)
        userAccount.spaceUU = item.uu
        this.$http.get('/newLogin/other', {params: userAccount}).then(res => {
          this.$store.dispatch('loadUserInfo').then(() => {
             if (this.$route.query.url && this.$route.query.url !== '') {
                this.$router.replace(this.$route.query.url)
             } else {
               this.goLastPage()
             }
          })
        })
      },
      telphoneBlur() {
        this.telerror = false
        if (!/^1[3|5|7|8]\d{9}$/.test(this.telphoneNum)) {
          this.telerror = true
        }
      },
      login() {
        if (this.telerror === true) {
          return false
        }
        let openid = this.$store.state.option.wechatInfo.data.openid
        this.$http.post('/wx/bindUser', {userTel: this.telphoneNum, userPwd: this.passwordNum, openId: openid}).then(res => {
          this.$store.commit('option/REQUEST_WECHATINFO_STATUS_SUCCESS', res.data)
          localStorage.setItem('USOFTMALLWECHATINFO', JSON.stringify(res.data))
        })
      },
      resgiter() {
        this.$http.get('/register/page').then(response => {
          if (response.data) {
            window.location.href = response.data.content
          }
        })
      }
    },
    components: {
      RemindBox
    },
    computed: {
      userName() {
        // return ''
        return this.$store.state.option.wechatInfo.data.nickname
      },
      headerImg() {
        // return ''
        return this.$store.state.option.wechatInfo.data.headimgurl
      },
      wechatInfo() {
        return this.$store.state.option.wechatInfo.data
      }
    }
  }
</script>

<style scoped lang="scss">
.wechat-view {
  position: fixed;
  z-index: 999;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  .header-view {
    background: #376ef3;
    height: 4.26rem;
    width: 100%;
    position: relative;
    padding-top: 0.56rem;
    .hearder-kuang {
      background: rgba(0, 0, 0, 0.18);
      width: 1.86rem;
      height: 1.86rem;
      border-radius: 50%;
      margin: 0 auto;
      overflow: hidden;
      position: relative;
      .header-img {
        background: #fff;
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
        overflow: hidden;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
        img {
          width: 1.6rem;
          height: 1.6rem;
          border-radius: 50%;
          vertical-align: center;
        }
      }
    }
    .header-name {
      font-size: 0.3rem;
      color: #fff;
      text-align: center;
      margin-top: 0.24rem;
    }
    .headerbg {
      position: absolute;
      width: 100%;
      height: 0.88rem;
      bottom: 0px;
      left: 0px;
    }
  }
  .middle-view {
    padding: 0 0.71rem;
    margin-top: 0.56rem;
    ul li {
      padding-bottom: 0.1rem;
      min-height: 0.4rem;
      &.info {
        color: #3872f4;
        font-size: 0.24rem;
        margin-left: 0.64rem;
        margin-top: 0.2rem;
        margin-bottom: 0.2rem;
      }
      input {
        margin-left: 0.34rem;
        color: #aaa;
        font-size: 0.3rem;
        height: 0.5rem;
        line-height: 0.5rem;
        border: 0;
        display: inline-block;
        vertical-align: top;
      }
      &.telphone {
        border-bottom: 1px solid #eee;
        &::before {
          background: url('/images/mobile/@2x/wechat/tel_icon.png');
          content: ' ';
          width: 0.28rem;
          height: 0.5rem;
          display: inline-block;
          background-size: 100% 100%;
          vertical-align: top;
        }
        input {
          margin-left: 0.4rem;
        }
      }
      &.password {
        border-bottom: 1px solid #eee;
        &::before {
          background: url('/images/mobile/@2x/wechat/pass_icon.png');
          content: ' ';
          width: 0.34rem;
          height: 0.42rem;
          display: inline-block;
          background-size: 100% 100%;
          vertical-align: top;
        }
      }
    }
    .loginBtn {
      width: 5.8rem;
      height: 0.9rem;
      line-height: 0.9rem;
      text-align: center;
      font-size: 0.3rem;
      color: #fff;
      background: #376ef3;
      border-radius: 5px;
      margin: 1.29rem auto 0;
    }
    .register {
      width: 5.8rem;
      text-align: left;
      font-size: 0.24rem;
      color: #999;
      margin: 0.25rem auto 0;
      span {
        color: #0076ff;
        font-size: 0.24rem;
        text-align: center;
        border: 1px solid #0076ff;
        border-radius: 5px;
        height:0.44rem;
        width: 1.48rem;
        margin-left: 0.2rem;
      }
    }
    .company {
      margin-top: 1.51rem;
      position: relative;
      text-align: center;
      img {
        width: 1.78rem;
        height: 0.39rem;
        margin-top: 0.24rem;
      }
      p {
        font-size: 0.21rem;
        color: #aaa;
        margin: 0.13rem 0 0 0;
      }
      a {
        margin-top: 0.12rem;
        font-size: 0.18rem;
        color: #bbb;
      }
      .hr {
        width: 1.62rem;
        height: 0.02rem;
        background: #e3e3e3;
        position: absolute;
        left: 0.3rem;
        top: 0.45rem;
        &.right {
          right: 0.3rem;
          left: auto;
        }
      }
    }
  }
  .listAlert {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    padding: 0 0.2rem;
    overflow: hidden;
    z-index: 10000;
    li {
      line-height: 0.98rem;
      height: 0.98rem;
      border-bottom: 1px solid #dedede;
    }
  }
}
</style>
