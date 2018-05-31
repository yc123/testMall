<template>
  <div>
    <div class="com-mobile-header">
      <a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>
      <p>企业信息
        <span @click="updateInfo()" v-show="storeState === 'look'"><i class="iconfont icon-edit"></i>编辑</span>
      </p>
    </div>
    <div class="user-content mobile-fix-content">
      <div ref="userContent" class="user-center-content">
        <div class="scroll">
        <!-- 账户管理 -->
          <div class="si-wrap" v-if="storeState !== 'look'">
            <ul class="infoul infoul2 no-edit" v-if="enterpriseInfo.enName">
              <li class="clearfix">
            <div class="name pull-left" >企业名称：</div>
            <div class="text pull-left">
              {{enterpriseInfo.enName || '-'}}
            </div>
          </li>
          <li class="clearfix">
                <div class="name pull-left">营业执照号：</div>
            <div class="text pull-left">
              {{enterpriseInfo.enBussinessCode || '-'}}
            </div>
          </li>
        </ul>
      </div>
      <div class="si-wrap">
        <ul class="infoul infoul2" :class="{'no-edit': !isAdmin}" v-if="enterpriseInfo.enName">

          <li class="clearfix" v-if="storeState === 'look'">
            <div class="name pull-left">企业名称：</div>
                <div class="text pull-left" >
                  {{enterpriseInfo.enName || '-'}}
                </div>
              </li>

              <li class="clearfix" v-if="storeState === 'look'">
                <div class="name pull-left">营业执照号：</div>
                <div class="text pull-left">
                  {{enterpriseInfo.enBussinessCode || '-'}}
                </div>
              </li>

              <li class="clearfix" :class="{border:  storeState !== 'look'}" >
                <div class="name pull-left" :class="{update: storeState !== 'look'}">注册地址：</div>
                <div class="text pull-left" v-if="storeState === 'look'">
                  {{enterpriseInfo.enAddress || '-'}}
                </div>
                <div class="text pull-left" v-else>
                  <input v-model="enterpriseInfo.enAddress" type="text" :disabled="enterpriseInfo.enValidCode === 2"/>
                </div>
              </li>

              <li class="clearfix" :class="{border:  storeState !== 'look'}">
                <div class="name pull-left" :class="{update: storeState !== 'look'}">官网地址：</div>
                <div class="text pull-left" v-if="storeState === 'look'">
                  {{enterpriseInfo.enUrl || '-'}}
                </div>
                <div v-else class="text pull-left">
                  <input v-model="enterpriseInfo.enUrl" type="text"/>
                </div>
              </li>

              <li class="clearfix" :class="{border:  storeState !== 'look'}">
                <div class="name pull-left" :class="{update: storeState !== 'look'}">所属行业：</div>
                <div class="text pull-left" v-if="storeState === 'look'">
                  {{enterpriseInfo.enIndustry || '-'}}
                </div>
                <div class="text pull-left clearfix" @click="isShowTypeAlert = true" v-else>
                  <div class="text pull-left update" style="width: 4rem">
                    {{enterpriseInfo.enIndustry || '-'}}
                  </div>
                  <div class="moreIcon pull-right">
                    <img src="/images/store/default/moreicon.png" />
                  </div>
                </div>
              </li>

              <li class="clearfix" :class="{border:  storeState !== 'look'}">
                <div class="name pull-left" :class="{update: storeState !== 'look'}" style="margin-top: 0.04rem;">经营范围：</div>
                <div class="text pull-left" v-if="storeState === 'look'" >
                <span v-for="item in scopeLabel" class="label">
                  {{item}}
                </span>
                  <span class="text pull-left nolabel"  v-if="scopeLabel.length == 0">
                  无标签信息
                </span>
                </div>
                <div v-else class="text pull-left">
                  <label v-for="item in scopeLabel" class="labelKuang" v-show="AddBtnShow">
                  <span class="Updatelabel">
                    {{item}}
                  </span>
                    <span class="updatespan"@click="addBtn(item)">删除</span>
                  </label>
                  <span class="addBtn" v-show="AddBtnShow" @click="addBtn()"></span>
                  <div class="commit" v-show="!AddBtnShow">
                    <input type="text" placeholder="请输入不大于10个字符" maxlength="10" class="inputText" v-model="labelText"/>
                    <button @click="saveLabel()">确定</button>
                  </div>
                </div>
              </li>

              <li class="clearfix" :class="{border:  storeState !== 'look'}">
                <div class="name pull-left" :class="{update: storeState !== 'look'}">企业简介：</div>
                <div class="text pull-left clearfix" v-if="storeState === 'look'">
                  {{Islook ? dealWithText(enterpriseInfo.description) : dealWithText()}}
                  <a class="pull-right" @click="dealWithText2('open')" v-show="Islook">
                    全部<img src="/images/store/default/openblack.png"/>
                  </a>
                  <a class="pull-right upload" @click="dealWithText2('hide')" v-show="!hidelook">
                    收起<img src="/images/store/default/openblack.png"/>
                  </a>
                </div>
                <div class="text pull-left" v-else>
                  <textarea v-model="enterpriseInfo.description" maxlength="500" ref="descTextarea"></textarea>
                </div>
              </li>

            </ul>
          </div>
          <div class="control clearfix" v-if="storeState !== 'look'">
            <div class="cancel" @click="storeInfosave('cancel')">取消</div>
            <div class="save" @click="storeInfosave()">保存</div>
          </div>
          <!-- 选择行业弹窗 -->
        </div>
      </div>
    </div>
    <!-- /end 账户管理 -->
    <div class="mobile-modal" v-show="isShowTypeAlert">
      <div class="modal-content">
        <div class="content-title">
          所属行业
          <i class="el-icon-close" @click="isShowTypeAlert = false"></i>
        </div>
        <div class="content-title-label clearfix" >
          <div v-for="(item, index) in ContentTitleArray" @click="chooseTitle(index)">
            <a :class="{active: index === titleActive}">{{item}}</a>
          </div>
        </div>
        <div class="content-info" v-if="TypeListShow.firstListShow">
          <div v-for="(item, index) in TypeList.firstList" class="content-info-item" :class="{active: index === TypeListActive.firstListActive}"  @click="chooseItem('firstList', item, index)" >
            {{item}}<img src="/images/mobile/@2x/getlabel_icon.png" v-show="index === TypeListActive.firstListActive"/>
          </div>
        </div>
        <div class="content-info" v-if="TypeListShow.secondsListShow">
          <div v-for="(item, index) in TypeList.secondsList" class="content-info-item" :class="{active: index === TypeListActive.secondsListActive}"  @click="chooseItem('secondsList', item, index)" >
            {{item}}
            <img src="/images/mobile/@2x/getlabel_icon.png" v-show="index === TypeListActive.secondsListActive"/>
          </div>
        </div>
        <div class="content-info" v-if="TypeListShow.threetListShow">
          <div v-for="(item, index) in TypeList.threetList" class="content-info-item" :class="{active: index === TypeListActive.threetListActive}"  @click="chooseItem('threetList', item, index)" >
            {{item}}
            <img src="/images/mobile/@2x/getlabel_icon.png" v-show="index === TypeListActive.threetListActive"/>
          </div>

        </div>
      </div>
    </div>
    <!-- /end 选择行业弹窗 -->
    <remind-box :title="collectResult" :timeoutCount="timeoutCount"></remind-box>
    <!--<loading v-show="isSearchSearchingMore"></loading>-->
    <div v-if="enterprise && false"></div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { RemindBox } from '~components/mobile/common'
  export default {
    layout: 'mobileNoHeader',
    middleware: 'authenticated',
    data() {
      return {
        timeoutCount: 0,
        collectResult: '',
        storeState: 'look',
        admininfo: {}, // 管理员信息
        labelText: '',
        scopeLabel: [],
        ContentTitleArray: ['', '', ''], // 行业数组
        isShowTypeAlert: false, // 是否现在所属行业弹窗
        TypeList: {
          firstList: [],
          secondsList: [],
          threetList: []
        },
        TypeListActive: {
          firstListActive: '',
          secondsListActive: '',
          threetListActive: ''
        },
        TypeListShow: {
          firstListShow: true,
          secondsListShow: false,
          threetListShow: false
        },
        enterpriseInfo: {},
        titleActive: '',
        TypeObj: {},
        AddBtnShow: true,
        splitText: '', // 省略号文本
        normalText: '', // 原来文本
        Islook: true,
        hidelook: true
      }
    },
    components: {
      RemindBox
    },
    watch: {
      'enterpriseInfo.description': {
        handler: function (val) {
          this.setTextareaHeight()
        }
      }
    },
    methods: {
      chooseTitle(key) {
        if (key === 0) {
          this.TypeListShow = {
            firstListShow: true,
            secondsListShow: false,
            threetListShow: false
          }
          this.titleActive = 0
        } else if (key === 1) {
          this.TypeListShow = {
            firstListShow: false,
            secondsListShow: true,
            threetListShow: false
          }
          this.titleActive = 1
        } else if (key === 2) {
          this.TypeListShow = {
            firstListShow: false,
            secondsListShow: true,
            threetListShow: false
          }
          this.titleActive = 2
        }
      },
      chooseItem(listIndex, key, index) {
        if (listIndex === 'firstList') {
          this.TypeListActive.firstListActive = index
          this.ContentTitleArray[0] = key
          // alert(this.ContentTitleArray)
          this.TypeList.secondsList = []
          this.titleActive = 0
          if (this.TypeObj[key] instanceof Array) {
            this.TypeList.secondsList = this.TypeObj[key]
          } else {
            for (let i of Object.keys(this.TypeObj[key])) {
              this.TypeList.secondsList.push(i)
            }
          }
          this.TypeListShow = {
            firstListShow: false,
            secondsListShow: true,
            threetListShow: false
          }
          this.TypeListActive.secondsListActive = ''
          this.TypeListActive.threetListActive = ''
          for (let i = 1; i < this.ContentTitleArray.length; i++) {
            this.ContentTitleArray.splice(i, 1)
          }
        } else if (listIndex === 'secondsList') {
          this.TypeList.threetList = []
          this.TypeListActive.secondsListActive = index
          this.TypeListActive.threetListActive = ''
          this.ContentTitleArray[1] = key
          this.titleActive = 1
          if (this.TypeObj[this.ContentTitleArray[0]][key] instanceof Array) {
            this.TypeList.threetList = this.TypeObj[this.ContentTitleArray[0]][key] ? this.TypeObj[this.ContentTitleArray[0]][key] : []
          }
          for (let i = 2; i < this.ContentTitleArray.length; i++) {
            this.ContentTitleArray.splice(i, 1)
          }
          if (this.TypeList.threetList.length > 0) {
            this.TypeListShow = {
              firstListShow: false,
              secondsListShow: false,
              threetListShow: true
            }
          } else {
            this.enterpriseInfo.enIndustry = key
            this.isShowTypeAlert = false
            this.TypeListShow = {
              firstListShow: false,
              secondsListShow: true,
              threetListShow: false
            }
          }
        } else if (listIndex === 'threetList') {
          this.titleActive = 2
          this.TypeListActive.threetListActive = index
          this.ContentTitleArray[2] = key
          this.enterpriseInfo.enIndustry = key
          this.isShowTypeAlert = false
          this.TypeListShow = {
            firstListShow: false,
            secondsListShow: false,
            threetListShow: true
          }
        }
      },
      addBtn(text) {
        if (text !== undefined) {
          this.scopeLabel = []
          let ms = this.enterpriseInfo.enBusinessScope.split(',')
          let _newArr = ms.slice()
          for (let j = 0; j < ms.length; j++) {
            if (ms[j].trim() === text) {
              _newArr.splice(j, 1)
            }
          }
          if (_newArr.length === 0) {
            this.enterpriseInfo.enBusinessScope = ''
            this.scopeLabel = []
          } else {
            this.enterpriseInfo.enBusinessScope = _newArr.join(',')
            this.scopeLabel = this.enterpriseInfo.enBusinessScope.split(',')
          }
          return false
        }
        this.AddBtnShow = false
      },
      saveLabel() {
        if (this.labelText === '') {
          this.AddBtnShow = true
          return false
        }
        if (this.labelText.length > 10) {
          this.collectResult = '标签文字不能超过10个字'
          this.timeoutCount++
          return false
        }
        this.AddBtnShow = true
        if (this.IsChange !== '' && this.IsChange !== undefined) {
          let ms = this.enterpriseInfo.enBusinessScope.split(',')
          for (let j = 0; j < ms.length; j++) {
            if (ms[j].trim() === this.IsChange) {
              ms[j] = this.labelText
            }
          }
          this.enterpriseInfo.enBusinessScope = ms.join(',')
        } else {
          if (!this.enterpriseInfo.enBusinessScope) {
            this.enterpriseInfo.enBusinessScope = this.labelText
          } else {
            this.enterpriseInfo.enBusinessScope += ',' + this.labelText
          }
        }
        this.labelText = ''
        this.IsChange = ''
        this.scopeLabel = this.enterpriseInfo.enBusinessScope.split(',')
        // this.enterpriseInfo.enBusinessScope.push(this.labelText)
      },
      swtichTab(_tp) {
        this.activeType = _tp
        this.storeState = 'look'
        this.isSearchSearchingMore = true
        this.updateEnterpriseInfo()
      },
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
        this.BScroll.refresh()
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
          this.clearInfo()
          this.scopeLabel = []
          let str = JSON.stringify(this.$store.state.supplier.material.enUser.data)
          this.enterpriseInfo = JSON.parse(str)
          if (this.enterpriseInfo.enBusinessScope) {
            this.scopeLabel = this.enterpriseInfo.enBusinessScope.split(',')
          }
          return
        }
        if (!this.enterpriseInfo.enAddress) {
          this.collectResult = '企业地址不能为空'
          this.timeoutCount++
          return false
        }
        if (!this.enterpriseInfo.enUrl) {
          this.collectResult = '官网地址不能为空'
          this.timeoutCount++
          return false
        }
        this.$http.post(`/basic/enterprise/${this.user.data.enterprise.uu}/updateInfo`, this.enterpriseInfo).then(res => {
          this.collectResult = '保存成功'
          this.timeoutCount++
          this.storeState = 'look'
        }).catch(err => {
          this.collectResult = err.response.data
          this.timeoutCount++
          let str = JSON.stringify(this.$store.state.supplier.material.enUser.data)
          this.enterpriseInfo = JSON.parse(str)
        })
      },
      clearInfo() {
        this.storeState = 'look'
        this.labelText = ''
        this.IsChange = ''
        this.AddBtnShow = true
      },
      setTextareaHeight () {
        this.$nextTick(() => {
          let el = this.$refs.descTextarea
          if (el) {
            el.style.height = '2rem'
            el.style.height = (el.scrollHeight * 2.06 - el.clientHeight + 150) / 100 + 'rem'
          }
        })
      }
    },
    computed: {
      enterprise() {
        let str = JSON.stringify(this.$store.state.supplier.material.enUser.data)
        this.enterpriseInfo = JSON.parse(str)
        return ''
      },
      isAdmin () {
        return this.user.data.userUU === this.user.data.enterprise.enAdminuu
      }
    },
    created () {
      this.$http.get('/data/profession.json').then(response => {
        this.TypeObj = response.data
        for (let i of Object.keys(response.data)) {
          this.TypeList.firstList.push(i)
        }
      })
      this.$store.dispatch('supplier/loadEnUser', {enUU: this.user.data.enterprise.uu, filter: 'enUU'}).then(res => {
        this.scopeLabel = this.enterpriseInfo.enBusinessScope ? this.enterpriseInfo.enBusinessScope.split(',') : []
      })
    },
    mounted() {
      this.$nextTick(() => {
        if (this.BScroll) {
          this.BScroll.refresh()
        } else {
          this.BScroll = new BScroll(this.$refs.userContent, {
            click: true
          })
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  .com-mobile-header {
    i {
      font-size: .36rem;
      position: relative;
      top: .04rem;
      right: .02rem;
    }
  }
  .user-content{
      background: #f1f3f6;
      .si-wrap {
        width: 7.1rem;
        margin: 0 auto;
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
    .topinfo {
      color: #333;
      font-size: 0.28rem;
      height: 0.8rem;
      line-height: 0.8rem;
      padding: 0 0.24rem;
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
      margin: .24rem 0;
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
          border-bottom: 0.01rem solid #d9d9d9;
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
        li:last-child {
          border-bottom: none;
        }
      }
      .text {
        width: 4.4rem;
        word-break: break-all;
      }
      .update {
        padding: 0.06rem 0 0.06rem 0rem;
      }
      input {
        width: 4.4rem;
        border: 0px solid #b4b4b4;
        padding: 0.06rem 0 0.06rem 0.12rem;
      }
      textarea{
        width: 4.4rem;
        padding: 0.06rem 0 0.06rem 0.12rem;
        overflow: visible;
        resize: none;
        border: 0 solid #b4b4b4;
      }
    }
    .control {
      width: 90%;
      margin: 0.4rem auto 0rem;
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
    .infoul2 {
      .name {
        width: 1.7rem;
      }
      .text {
        width: 4.3rem;
        word-break: break-all;
      }
      input {
        width: 4.3rem;
      }
      .nolabel {
        position: relative;
        width: auto;
        text-align: center;
        color: #666;
        font-size: 0.24rem;
        display: inline-block;
        vertical-align: top;
        padding: 2px 4px;
        margin: 0.02rem 3px 0px;
        background: #f2f3f7;
        border-radius: 5px;
      }
      .label {
        max-width: 3rem;
        padding: 2px 4px;
        margin: 0.08rem 3px 0 3px;
        background: #5078cb;
        border-radius: 5px;
        text-align: center;
        color: #fff;
        font-size: 0.24rem;
        display: inline-block;
        vertical-align: top;
      }
      .labelKuang {
        background: #fff;
        border: 1px solid #b4b4b4;
        border-radius: 3px;
        overflow: hidden;
        height: 0.53rem;
        line-height: 0.53rem;
        display: inline-block;
        vertical-align: top;
        margin: 0px 3px 3px 3px;
        font-size: 0px;
      }
      .Updatelabel {
        padding: 0 4px;
        color: #666;
        font-size: 0.26rem;
        height: 100%;
        display: inline-block;
        vertical-align: top;
        max-width: 3rem;
      }
      .updatespan {
        background: #b5b5b5;
        color: #fff;
        font-size: 0.26rem;
        padding:0 2px;
        height: 100%;
        display: inline-block;
        vertical-align: top;
      }
      .addBtn {
        background-image: url('/images/mobile/@2x/addBtn.png');
        background-size: 100% 100%;
        width: 1.4rem;
        height: 0.54rem;
        display: inline-block;
        vertical-align: middle;
      }
      .commit {

      }
      .inputText {
        width: 3.4rem;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        border: 1px solid #b4b4b4;
        height: 0.62rem;
        line-height: 0.62rem;
        vertical-align: top;
        display: inline-block;
      }
      button {
        display: inline-block;
        height: 0.62rem;
        width: 0.8rem;
        line-height: 0.62rem;
        font-size: 14px;
        font-weight: 400;
        text-align: center;
        background-color: #3f84f6;
        border: 1px solid #3f84f6;
        color: #fff;
        border-top-right-radius: 3px;
        border-bottom-right-radius: 3px;
        vertical-align: top;
        margin-left: -0.1rem;
      }
      .moreIcon {
        margin-top: 0.06rem;
        position: relative;
        img {
          width: 0.17rem;
          height: 0.3rem;
        }
        &:after {
          position: absolute;
          left: -10px;
          right: -10px;
          top: -10px;
          bottom: -10px;
          content: ' '
        }
      }
    }
    .noborder {
      border-top: .01rem solid #d9d9d9;
    }
  }
  .modal-content {
    position: absolute;
    height: 10rem;
    bottom: 0px;
    left: 0px;
    background: #fff;
    width: 100%;
    border-radius: 0px;
    box-shadow: 0 -9px 9px rgba(0,0,0,.5);
    .content-title {
      color: #666;
      font-size: .3rem;
      text-align: center;
      height: 1rem;
      line-height: 1rem;
      position: relative;
      i {
        font-size: 0.3rem;
        color: #999;
        position: absolute;
        right: 0.3rem;
        top: 50%;
        margin-top: -0.15rem;
      }
    }
    .content-title-label {
      color: #3f84f6;
      font-size: 0.28rem;
      height: 0.5rem;
      line-height: 0.5rem;
      border-bottom: 0.01rem solid #999;
      div {
        width: 33.3%;
        float: left;
        text-align: center;
        a {
          height: 0.5rem;
          line-height: 0.5rem;
          color: #333 !important;
          display: inline-block;
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &.active {
            color: #3e82f5 !important;
            border-bottom: 1px solid #3e82f5;
          }
        }
      }
    }
    .content-info {
      overflow-y: auto;
      height: 8.5rem;
      width: 100%;
      .content-info-item {
        height: 0.86rem;
        line-height: 0.86rem;
        color: #333;
        font-size: 0.28rem;
        padding-left: 0.3rem;
        &.active {
          color: #3f84f6 !important
        }
        img {
          width: 0.3rem;
          height: 0.18rem;
          margin-left: 0.3rem;
        }
      }
    }
  }
</style>
