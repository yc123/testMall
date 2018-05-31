<template>
  <div>
    <div class="com-mobile-header">
      <a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>
      <p>店铺信息
        <span @click="updateInfo()" v-show="storeState === 'look'"><i class="iconfont icon-edit"></i>编辑</span>
      </p>
    </div>
    <!-- 店铺管理 -->
    <template v-if="storeInfo.storeName" >
      <div class="user-content mobile-fix-content">
        <div ref="userContent" class="user-center-content">
          <div class="scroll">
            <div class="si-wrap">
              <ul class="infoul" :class="{'no-edit': !isAdmin}">
                <li class="clearfix" :class="{border:  storeState !== 'look'}">
                  <div class="name pull-left" :class="{update: storeState !== 'look'}">店铺名称：</div>
                  <div class="text pull-left" v-if="storeState === 'look'">
                    {{storeInfo.storeName || '暂无信息'}}
                  </div>
                  <div class="text pull-left" v-else>
                    <input v-model="storeInfo.storeName" type="text"/>
                  </div>
                </li>
                <li class="clearfix" :class="{border:  storeState !== 'look'}">
                  <div class="name pull-left" :class="{update: storeState !== 'look'}">主营产品：</div>
                  <div class="text pull-left clearfix" v-if="storeState === 'look'">
                    {{Islook ? dealWithText(storeInfo.description) : dealWithText()}}
                    <a class="pull-right" @click="dealWithText2('open')" v-show="Islook">
                      全部<img src="/images/store/default/openblack.png"/>
                    </a>
                    <a class="pull-right upload" @click="dealWithText2('hide')" v-show="!hidelook">
                      收起<img src="/images/store/default/openblack.png"/>
                    </a>
                  </div>
                  <div class="text pull-left" v-else>
                  <textarea v-model="storeInfo.description" maxlength="500" ref="descTextarea"></textarea>
                  </div>
                </li>
                <li class="clearfix" :class="{border:  storeState !== 'look'}">
                  <div class="name pull-left" :class="{update: storeState !== 'look'}">店铺地址：</div>
                  <div class="text pull-left" v-if="storeState === 'look'">
                    {{storeInfo.enterprise.address || '暂无信息'}}
                  </div>
                  <div class="text pull-left" v-else>
                    <textarea v-model="storeInfo.enterprise.address" maxlength="50" ref="addTextarea"></textarea>
                    <!--<input v-model="storeInfo.enterprise.address" type="text" maxlength="50"/>-->
                  </div>
                </li>
                <li class="clearfix" :class="{border:  storeState !== 'look'}">
                  <div class="name pull-left" :class="{update: storeState !== 'look'}">电话：</div>
                  <div class="text pull-left" v-if="storeState === 'look'">
                    {{storeInfo.enterprise.enTel || '暂无信息'}}
                  </div>
                  <div class="text pull-left" v-else>
                    <input v-model="storeInfo.enterprise.enTel" type="text" maxlength="20"/>
                  </div>
                </li>
                <li class="clearfix" :class="{border:  storeState !== 'look'}">
                  <div class="name pull-left" :class="{update: storeState !== 'look'}">传真：</div>
                  <div class="text pull-left" v-if="storeState === 'look'">
                    {{storeInfo.enterprise.enFax || '暂无信息'}}
                  </div>
                  <div class="text pull-left" v-else>
                    <input v-model="storeInfo.enterprise.enFax" type="text" maxlength="20"/>
                  </div>
                </li>
                <li class="clearfix" :class="{border:  storeState !== 'look'}">
                  <div class="name pull-left" :class="{update: storeState !== 'look'}">手机：</div>
                  <div class="text pull-left" v-if="storeState === 'look'">
                    {{storeInfo.enterprise.enPhone || '暂无信息'}}
                  </div>
                  <div class="text pull-left" v-else>
                    <input v-model="storeInfo.enterprise.enPhone" type="text" maxlength="11"/>
                  </div>
                </li>
                <li class="clearfix" :class="{border:  storeState !== 'look'}">
                  <div class="name pull-left" :class="{update: storeState !== 'look'}">微信：</div>
                  <div class="text pull-left" v-if="storeState === 'look'">
                    {{storeInfo.enterprise.enWeixin || '暂无信息'}}
                  </div>
                  <div class="text pull-left" v-else>
                    <input v-model="storeInfo.enterprise.enWeixin" type="text" maxlength="20"/>
                  </div>
                </li>
                <li class="clearfix" :class="{border:  storeState !== 'look'}">
                  <div class="name pull-left" :class="{update: storeState !== 'look'}">QQ：</div>
                  <div class="text pull-left" v-if="storeState === 'look'">
                    {{storeInfo.enterprise.enQQ || '暂无信息'}}
                  </div>
                  <div class="text pull-left" v-else>
                    <input v-model="storeInfo.enterprise.enQQ" type="text" maxlength="11"/>
                  </div>
                </li>
              </ul>
            </div>
            <div class="control clearfix" v-if="storeState !== 'look'">
          <div class="cancel" @click="storeInfosave('cancel')" >取消</div>
          <div class="save" @click="storeInfosave()">保存</div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="none-state">
        <img src="/images/mobile/@2x/empty-collect.png">
        <p v-text="getRemindText"></p>
        <nuxt-link to="/">返回首页</nuxt-link>
      </div>
    </template>
    <!-- /end 店铺管理 -->
    <remind-box :title="collectResult" :timeoutCount="timeoutCount"></remind-box>
    <div v-if="storeI && false"></div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { RemindBox } from '~components/mobile/common'
  export default {
    layout: 'mobileNoHeader',
    middleware: 'authenticated',
    fetch ({ store, route }) {
      return Promise.all([
        store.dispatch('loadStoreStatus', { op: 'check' })
      ])
    },
    data() {
      return {
        storeState: 'look',
        storeInfo: {},
        splitText: '', // 省略号文本
        normalText: '', // 原来文本
        Islook: true,
        hidelook: true,
        timeoutCount: 0,
        collectResult: ''
      }
    },
    watch: {
      'storeInfo.description': {
        handler: function (val) {
          this.setTextareaHeight()
        }
      },
      'storeInfo.enterprise.address': {
        handler: function (val) {
          this.setAddarea()
        }
      }
    },
    methods: {
      setRemindText (str) {
        this.collectResult = str
        this.timeoutCount++
      },
      updateInfo() {
        if (!this.isAdmin) {
          this.setRemindText('您无该模块的编辑权限，请联系企业管理员进行编辑维护！')
          return
        }
        this.storeState = 'update'
        this.Islook = true
        this.hidelook = true
        this.setTextareaHeight()
        this.setAddarea()
      },
      dealWithText2(tp) {
        if (tp === 'open') {
          this.Islook = false
          this.hidelook = false
        } else {
          this.Islook = true
          this.hidelook = true
        }
      },
      dealWithText(_T) {
        if (_T !== undefined) {
          // 文本处理
          this.normalText = _T
          if (_T.length < 140) {
            this.Islook = false
            return _T
          } else {
            this.Islook = true
            return _T.substr(0, 140) + '...'
          }
        } else {
          this.Islook = false
          return this.normalText
        }
      },
      storeInfosave(_tp) {
        this.BScroll.refresh()
        if (_tp === 'cancel') {
          let str = JSON.stringify(this.$store.state.option.storeStatus.data)
          this.storeInfo = JSON.parse(str)
          this.storeState = 'look'
          return false
        }
        if (!this.storeInfo) {
          this.collectResult = '店铺信息不能为空'
          this.timeoutCount++
          return false
        }
//        if (!this.storeInfo.description || this.storeInfo.description === '') {
//          this.collectResult = '店铺简介信息不能为空'
//          this.timeoutCount++
//          return false
//        }
        if (!this.storeInfo.enterprise) {
          this.collectResult = '企业信息不能为空'
          this.timeoutCount++
          return false
        }
        if (!this.storeInfo.enterprise.address || this.storeInfo.enterprise.address === '') {
          this.collectResult = '企业地址不能为空'
          this.timeoutCount++
          return false
        }
        if (this.storeInfo.enterprise.enFax && this.storeInfo.enterprise.enFax !== '' && !/^[\d-]{8,20}$/.test(this.storeInfo.enterprise.enTel)) {
          this.collectResult = '请输入正确的传真'
          this.timeoutCount++
          return false
        }
        if (!this.storeInfo.enterprise.enTel || this.storeInfo.enterprise.enTel === '' || !/^[\d-]{8,20}$/.test(this.storeInfo.enterprise.enTel)) {
          this.collectResult = '请输入正确的电话号码'
          this.timeoutCount++
          return false
        }
        if (this.storeInfo.enterprise.enPhone && this.storeInfo.enterprise.enPhone !== '' && !/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.storeInfo.enterprise.enPhone)) {
          this.collectResult = '请输入正确的手机号码'
          this.timeoutCount++
          return false
        }
        if (this.storeInfo.enterprise.enWeixin && this.storeInfo.enterprise.enWeixin !== '' && !/^[0-9a-zA-Z]{6,20}$/.test(this.storeInfo.enterprise.enWeixin)) {
          this.collectResult = '请输入正确的微信号'
          this.timeoutCount++
          return false
        }
        if (this.storeInfo.enterprise.enQQ && this.storeInfo.enterprise.enQQ !== '' && !/^[1-9][0-9]{4,10}$/.test(this.storeInfo.enterprise.enQQ)) {
          this.collectResult = '请输入正确的QQ号'
          this.timeoutCount++
          return false
        }
        let kay = {
          description: this.storeInfo.description,
          enterprise: this.storeInfo.enterprise,
          storeName: this.storeInfo.storeName,
          storeShortName: this.storeInfo.storeShortName
        }
        this.$http.put(`/store-service/stores/${this.storeInfo.uuid}?kind=BASIC_INFO`, kay).then(res => {
          this.collectResult = '保存成功'
          this.timeoutCount++
          this.storeState = 'look'
        }).catch(err => {
          this.collectResult = err.response.data
          this.timeoutCount++
          let str = JSON.stringify(this.$store.state.option.storeStatus.data)
          this.storeInfo = JSON.parse(str)
        })
      },
      setTextareaHeight () {
        this.$nextTick(() => {
          let el = this.$refs.descTextarea
          if (el) {
            el.style.height = '2rem'
            el.style.height = (el.scrollHeight * 2.06 - el.clientHeight + 150) / 100 + 'rem'
          }
        })
      },
      setAddarea () {
        this.$nextTick(() => {
          let el = this.$refs.addTextarea
          if (el) {
//            console.log(el.scrollHeight - el.clientHeight)
//            console.log(el.clientHeight)
//            console.log('-----------------')
            el.style.height = '.6rem'
            el.style.height = (el.scrollHeight * 2 - el.clientHeight + 25) / 100 + 'rem'
          }
        })
      },
      setBS () {
        if (this.BScroll) {
          this.BScroll.refresh()
        } else {
          this.BScroll = new BScroll(this.$refs.userContent, {
            click: true
          })
        }
      },
      cancelBS () {
        this.BScroll.destroy()
      }
    },
    computed: {
      getRemindText: function () {
        return '您的账户暂未开通店铺，请前往pc端申请开通！'
      },
      storeI() {
        let str = JSON.stringify(this.$store.state.option.storeStatus.data)
        this.storeInfo = JSON.parse(str)
        return ''
      },
      isAdmin () {
        return this.user.data.userUU === this.user.data.enterprise.enAdminuu
      }
    },
    components: {
      RemindBox
    },
    mounted() {
      this.$nextTick(() => {
        this.setBS()
      })
    }
  }
</script>

<style lang="scss" scoped>
  .user-content {
    background: #f1f3f6;
    .si-wrap {
      width: 7.1rem;
      margin: .3rem auto;
      background: #fff;
      border-radius: .05rem;
    }
    .user-center-content {
      height: 100%;
      overflow: hidden;
    }
    .scroll {
      padding-bottom: 0.4rem;
    }
  }
  .com-mobile-header {
    i {
      font-size: .36rem;
      position: relative;
      top: .04rem;
      right: .02rem;
    }
  }
  .topinfo {
    padding: 0 0.24rem;
    color: #333;
    font-size: 0.28rem;
    height: 0.8rem;
    line-height: 0.8rem;
    border-bottom: 0.01rem solid #d9d9d9;
    .pull-right {
      color: #999;
      font-size: 0.26rem;
      img {
        width: 0.34rem;
        height: 0.34rem;
      }
    }
  }
  .infoul {
    color: #666;
    font-size: 0.28rem;
    padding: 0 .24rem;
    .upload {
      img {
        transform: rotate(180deg);
      }
    }
    li {
      border-bottom: .01rem solid #d9d9d9;
      min-height: 1.16rem;
      line-height: normal;
      padding: .4rem .28rem;
      &.border {
        border-bottom: .01rem solid #d9d9d9;
      }
      &.noupdate {
        background: #fafafa;
        color: #999;
      }
    }
    .name {
      width: 1.6rem;
      text-align: right;
      color: #226ce7;
    }
    &.no-edit {
      color: #999;
      .name {
        color: #999;
      }
    }
    .text {
      width: 4.4rem;
      word-break: break-all;
      line-height: .44rem;
    }
    /*.pull-left {*/
      /*float: none !important;*/
      /*display: inline-block;*/
      /*word-wrap: break-word;*/
      /*vertical-align: top;*/
    /*}*/
    .update {
      padding: 0.06rem 0 0.06rem 0;
    }
    input {
      width: 4.4rem;
      border: 0 solid #b4b4b4;
      padding: 0.06rem 0 0.06rem 0.12rem;
    }
    textarea{
      width: 4.4rem;
      height: 1.36rem;
      padding: 0.06rem 0 0.06rem 0.12rem;
      overflow-y: visible;
      border: none;
    }
  }
  .control {
    width: 90%;
    margin: 0.15rem auto 0.4rem;
    height: .88rem;
    line-height: 0.88rem;
  }
  .save {
    border-radius: 3px;
    width: 48%;
    color: #fff;
    text-align: center;
    height: .88rem;
    line-height: 0.88rem;
    background: #3e82f5;
    float: right;
  }
  .cancel {
    border-radius: 3px;
    width: 48%;
    background: #acabab;
    color: #fff;
    text-align: center;
    height: .88rem;
    line-height: 0.88rem;
    float: left;
  }
  .none-state{
    text-align: center;
    padding:1.5rem 0;
    background: #fff;
    margin-top:.1rem;
    width:100%;
    img{
      margin:0 auto;
      width: 4.08rem;
      height: 2.62rem;
    }
    p {
      font-size: .32rem;
      color: #999;
      margin: 1.19rem 0 0 0;
    }
    a {
      display: block;
      font-size: .28rem;
      color: #fff;
      width: 1.88rem;
      height: .54rem;
      line-height: .54rem;
      background: #418bf6;
      margin: .7rem auto 0;
      border-radius: .05rem;
    }
  }
</style>
