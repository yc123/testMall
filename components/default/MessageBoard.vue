<template>
  <div class="messageBoard container" v-if="isOpen">
    <div class="modal-header">
      <h3 class="modal-title f18">
        <span v-if="showHistory">留言板</span>
        <span v-if="!showHistory">留言记录</span>
      </h3>
      <a @click="isOpendMessage"><i class="fa fa-remove"></i></a>
    </div>
    <div class="modal-body msg-body">
      <div v-if="showHistory">
        <h3>亲爱的&nbsp;<span v-text="user.userName || '游客'">&nbsp;&nbsp;</span> ,您的意见对我们很重要！</h3>
        <div class="form-message">
          <div class="txtArea">
            <b class="first">*</b>
            <textarea @keyup="textareaLength" placeholder="请将您在使用当前页面遇到的任何问题、建议或意见反馈给我们。注意：不要输入您的隐私信息，如：账户密码等。" v-model="messageBoard.question" maxlength="500"></textarea>
            <span class="count_tip"><span v-text="txtVal"></span>/500</span>
          </div>
          <p><b>*</b>您的身份是：</p>
          <p class="radioCheck">
            <label for="buyer01" class="radioLabel">
              <input type="radio" name="role" value="buyer" v-model="messageBoard.role" id="buyer01"/>
              <label for="buyer01" class="txtContact"></label>
              <span>我是买家</span>
            </label>
            <label for="buyer02" class="radioLabel">
              <input type="radio" name="role" value="seller" v-model="messageBoard.role" id="buyer02" checked/>
              <label for="buyer02" class="txtContact"></label>
              <span>我是卖家</span>
            </label>
          </p>
          <p><b>*</b>您反馈的内容类型是：</p>
          <p class="radioCheck">
            <label for="contentType01" class="radioLabel">
              <input type="radio" name="type" value="展示效果" v-model="messageBoard.type" id="contentType01"/>
              <label for="contentType01" class="txtContact"></label>
              <span>展示效果</span>
            </label>
            <label for="contentType02" class="radioLabel">
              <input type="radio" name="type" value="页面功能" v-model="messageBoard.type" id="contentType02" checked/>
              <label for="contentType02" class="txtContact"></label>
              <span>页面功能</span>
            </label>
            <label for="contentType03" class="radioLabel">
              <input type="radio" name="type" value="异常报错" v-model="messageBoard.type" id="contentType03"/>
              <label for="contentType03" class="txtContact"></label>
              <span>异常报错</span>
            </label>
            <label for="contentType04" class="radioLabel">
              <input type="radio" name="type" value="其他方面" v-model="messageBoard.type" id="contentType04"/>
              <label for="contentType04" class="txtContact"></label>
              <span>其他方面</span>
            </label>
          </p>
          <p>&nbsp;&nbsp;&nbsp;添加图片：</p>
          <div class="img-warp">
            <div class="img-item">
              <upload @uploadAction="listenUpload($event, 0)"/>
            </div>
            <div class="img-item">
              <upload @uploadAction="listenUpload($event, 1)"/>
            </div>
            <div class="img-item">
              <upload @uploadAction="listenUpload($event, 2)"/>
            </div>
            <div class="img-item">
              <upload @uploadAction="listenUpload($event, 3)"/>
            </div>
            <div class="img-item">
              <upload @uploadAction="listenUpload($event, 4)"/>
            </div>
          </div>
          <p class="tip clearfix">提示：最多可上传五张图片，每张大小不超过500KB,仅支持JPG、PNG、GIF格式.</p>
          <div v-if="!user.userUU">
            <p><b>*</b>您当前尚未登录，请留下您的联系方式,我们会不定期发布一些有奖体验活动</p>
            <div class="msg-message" v-if="!user.userUU">
              <div class="msg-content">
                <label>手机：</label>
                <input type="text" name="userTel" v-model="messageBoard.userTel"  autocomplete="off" @keyup="checkMobile"/>
                <span v-if="!isMobile"><i class="glyphicon glyphicon-info-sign x-icon-left"></i>请输入正确的号码</span>
              </div>
            </div>
            <div class="msg-message" v-if="!user.userUU">
              <div class="msg-content">
                <label>邮箱：</label>
                <input type="text" name="email" v-model="messageBoard.email"  autocomplete="off" @keyup="checkEmail"/>
                <span v-if="!isEmail"><i class="glyphicon glyphicon-info-sign x-icon-left"></i>请输入正确的邮箱</span>
              </div>
            </div>
          </div>
          <button class="btn" @click="confirm">提交</button>
        </div>
      </div>
      <div class="msg-table" v-else-if="!showHistory && user.userUU">
        <div class="history" v-for="message in messageBoardCurrent.content">
          <div class="form-group row">
            <div class="col-xs-8">{{message.type}}</div>
            <div class="msgDate col-xs-4">{{message.createDate | date}}</div>
          </div>
          <div class="question">
            <span>问题：</span>
            <span style="word-break: break-all">{{message.question}}</span>
          </div>
          <div class="answer" v-show="message.answer" style="margin-bottom: 10px;">
            <span>回复：</span>
            <span style="word-break: break-all">{{message.answer}}</span>
          </div>
        </div>
        <div class="text-center" v-if="!messageBoardCurrent || messageBoardCurrent.length === 0">
          <div>无留言记录</div>
        </div>
      </div>
      <div class="page" v-if="!showHistory">
        <page :total="messageBoardCurrent.totalElements" :page-size="pageParams.count"
              :current="pageParams.page" @childEvent="listenPage"></page>
      </div>
      <div class="msg-slide1" @click="isOpenHistory" v-if="showHistory">
        <i class="fa fa-angle-left"></i><span>留言记录</span>
      </div>
      <div class="msg-slide2" @click="isHideHistory" v-if="!showHistory">
        <i class="fa fa-angle-right"></i><span>关闭记录</span>
      </div>
    </div>
  </div>
</template>
<script>
  import upload from '~components/common/upload/upload.vue'
  import Page from '~components/common/page/pageComponent.vue'
  export default {
    name: 'messageBoard',
    data () {
      return {
        pageParams: {
          page: 1,
          count: 3,
          currentPage: 1,
          dialogVisible: false
        },
        showHistory: true,
        isOpen: true,
        isLogin: false,
        txtVal: 0,
        isMobile: true,
        isEmail: true,
        messageBoard: {},
        dialogImageUrl: ['', '', '', '', '']
      }
    },
    components: {
      Page,
      upload
    },
    computed: {
      messageBoardInfo () {
        return this.$store.state.messageBoard.information.data
      },
      logged () {
        return this.$store.state.option.user.logged
      },
      user () {
        return this.$store.state.option.user.data
      },
      messageBoardCurrent () {
        return this.$store.state.messageBoardInformation.information.data
      }
    },
    filters: {
      date: function (num) {
        const d = new Date(num)
        const year = d.getFullYear()
        const month = d.getMonth() + 1 < 10 ? '0' + d.getMonth() : '' + d.getMonth()
        const day = d.getDay() < 10 ? '0' + d.getDay() : '' + d.getDay()
        return year + '-' + month + '-' + day
      }
    },
    methods: {
      listenUpload: function (url, index) {
        this.dialogImageUrl[index] = url
      },
      listenPage (page) {
        this.pageParams.page = page
        this.$emit('pageEvent', page)
      },
      isOpendMessage () {
        this.$emit('openBoardEvent', false)
      },
      isOpenHistory () {
        this.$store.dispatch('getMessageBoardInformation', {page: 1, count: 3})
        this.showHistory = !this.showHistory
      },
      isHideHistory () {
        this.showHistory = !this.showHistory
      },
      textareaLength () {
        this.txtVal = this.messageBoard.question.length
      },
      // 判断手机号
      checkMobile () {
        this.isMobile = (/^[\d]{8,11}$/).test(this.messageBoard.userTel)
      },
      // 判断邮箱
      checkEmail () {
        this.isEmail = (/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/).test(this.messageBoard.email)
      },
      confirm () {
        if (!this.logged) {
          if (!this.messageBoard.question) {
            this.$message.info('您还没有填写反馈内容')
          } else if (!this.messageBoard.role) {
            this.$message.info('请选择您的身份信息')
          } else if (!this.messageBoard.type) {
            this.$message.info('请选择一种反馈类型')
          } else if (!this.messageBoard.userTel && !this.messageBoard.email) {
            this.$message.info('请填写任意一种联系方式')
          } else {
            if (this.isMobile === false) {
              this.$message.info('请输入正确的手机号码')
            } else if (this.isEmail === false) {
              this.$message.info('请输入正确的邮箱')
            } else {
              this.$store.dispatch('uploadMessageBoardInformation', {
                question: this.messageBoard.question,
                role: this.messageBoard.role,
                submitTitle: '【优软商城】IC电子元器件现货采购交易平台商城',
                submitUrl: window.location.href,
                type: this.messageBoard.type,
                imgs: this.dialogImageUrl,
                userTel: this.messageBoard.userTel ? this.messageBoard.userTel : '',
                email: this.messageBoard.email ? this.messageBoard.email : ''
              })
              this.isOpendMessage()
              this.$message.info('感谢您的宝贵意见')
              this.messageBoard = {}
              this.dialogImageUrl = ['', '', '', '', '']
            }
          }
        } else {
          if (!this.messageBoard.question) {
            this.$message.info('您还没有填写反馈内容')
          } else if (!this.messageBoard.role) {
            this.$message.info('请选择您的身份信息')
          } else if (!this.messageBoard.type) {
            this.$message.info('请选择一种反馈类型')
          } else {
            this.$store.dispatch('uploadMessageBoardInformation', {
              question: this.messageBoard.question,
              role: this.messageBoard.role,
              submitTitle: '【优软商城】IC电子元器件现货采购交易平台商城',
              submitUrl: window.location.href,
              type: this.messageBoard.type,
              imgs: this.dialogImageUrl
            })
            this.isOpendMessage()
            this.$message.info('感谢您的宝贵意见')
            this.messageBoard = {}
            this.dialogImageUrl = ['', '', '', '', '']
          }
        }
      }
    }
  }
</script>
<style scoped>
  .messageBoard {
    width: 680px;
    font-size: 14px;
    background: #fff;
  }
  .messageBoard .modal-header {
    position: relative;
    background: url("/images/messageBoard/msg_nav.png") no-repeat left center;
    min-height: 0;
    padding: 11.5px;
    text-align: center;
  }
  .messageBoard .modal-header i{
    position: absolute;
    top: 5px;
    left: 650px;
    font-size: 20px;
    color: #fff;
    cursor: pointer;
  }
  .messageBoard .modal-header>h3{
    font-size: 18px;
    color: #000;
  }
  .messageBoard .modal-header .modal-title {
    margin-left: 30px;
    text-align: center;
    color: #fff;
  }
  .messageBoard .modal-header .modal-title span{
    vertical-align: middle;
  }
  .messageBoard .modal-body {
    padding: 10px;
    min-height: 445px;
    margin: 0 auto;
    width: 680px;
  }
  .messageBoard .modal-body h3{
    width: 680px;
    text-align: center;
    font-size: 14px;
    color: #333;
    margin: 0 0 10px 0;
  }
  .messageBoard .modal-body h3 span{
    color: #5078cb;
  }
  .messageBoard .modal-body .form-message{
    width: 680px;
    text-align: center;
  }
  .messageBoard .modal-body .form-message .txtArea{
    position: relative;
  }
  .messageBoard .modal-body .form-message textarea {
    padding: 10px 10px 20px 10px;
    width: 576px;
    height: 110px;
    color: #333;
    border: #c5c5c5 1px solid;
    font-size: 13px;
    letter-spacing: 1px;
    line-height: 18px;
  }
  .messageBoard .modal-body .form-message span.count_tip{
    position: absolute;
    bottom: 4px;
    right: 55px;
    display: inline-block;
    width: 564px;
    height: 20px;
    color: #979797;
    line-height: 20px;
    font-size: 12px;
    background: #fff;
    text-align: right;
    padding-right: 5px;
  }
  .messageBoard .modal-body .form-message p{
    padding-left: 40px;
    text-align: left;
    font-size: 14px;
    margin: 5px;
    color: #333;
  }
  .messageBoard .modal-body p.radioCheck{
    padding-left: 65px;
  }
  .messageBoard .modal-body .form-message input{
    padding: 0 10px;
    margin-left: 20px;
    height: 30px;
    width: 290px;
    font-size: 14px;
    color: #656565;
    border: #c5c5c5 1px solid;
    vertical-align: sub;
  }
  .messageBoard .modal-body .form-message label{
    margin-right: 25px;
  }
  /*查看图片*/
  .messageBoard .modal-body .form-message .img-warp{
    position: relative;
    overflow: hidden;
    width: 80%;
    margin: 0 auto;
    text-align: center;
  }
  .messageBoard .modal-body .form-message div.img-item{
    position: relative;
    float: left;
    margin-right: 23px;
    width: 82px;
    height: 70px;
    overflow: hidden;
    cursor:  pointer;
    border: #C9C9C9 1px solid;
    font-size: 14px;
  }
  .messageBoard .modal-body .form-message div.img-item:last-child{
    margin-right: 0;
  }
  .messageBoard .modal-body .form-message div.img-item img{
    display: inline-block;
    max-width: 80px;
    max-height: 78px;
    z-index: 10;
    margin-top: 4px;
  }
  /*查看图片*/

  .messageBoard .modal-body .form-message p.tip{
    text-align: left;
    color: #999;
    font-size: 12px;
    padding-left: 68px;
  }
  .messageBoard .modal-body .form-message label{
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: normal;
  }
  .messageBoard .modal-body .form-message input[type='text']{
    width: 295px;
  }
  .messageBoard .modal-body .form-message button{
    margin: 10px auto;
    width: 100px;
    height: 35px;
    background: #4777C6;
    color: #fff;
    border-radius: 0;
    text-align: center;
  }
  .messageBoard .modal-body .form-message .msg-message>label{
    font-size: 14px;
  }
  .messageBoard .modal-body .form-message .msg-message span{
    margin: 0 auto;
    font-size: 12px;
    margin-left: 5px;
  }
  .messageBoard .modal-body .form-message .input-style span{
    color: #666;
  }
  .messageBoard .modal-body .form-message .msg-message span i{
    padding-right: 5px;
    color: #4777C6;
  }
  .messageBoard .modal-body .form-message b{
    margin-right: 5px;
    font-weight: bold;
    color: #FF5A5C;
  }
  .messageBoard .modal-body .form-message b.first{
    position: relative;
    top: -95px;
    left: 2px;
  }
  .messageBoard .modal-body .history{
    border-collapse: collapse;
    margin: 10px auto;
    padding: 0 20px;
    width: 500px;
    min-height: 105px;
    font-size: 16px;
    color: #333;
    border-bottom: 1px dashed #c5c5c5;
  }
  .messageBoard .modal-body .msg-table{
    /*position: absolute;*/
    overflow: auto;
    height: 372px;
    width: 670px;
    margin-top: 10px;
  }
  .messageBoard .modal-body .msg-table .form-group{
    margin-bottom: 15px;
  }
  .messageBoard .modal-body .msgDate {
    padding-right: 55px;
    text-align: right;
    font-size: 13px;
  }
  .messageBoard .modal-body .question{
    margin-bottom: 10px;
    font-size: 12px;
    font-weight: normal;
    list-style-type: none;
    font-style: inherit;
  }
  .messageBoard .modal-body .answer{
    margin-bottom: 10px;
    color: #fa842d;
    font-size: 12px;
    font-weight: normal;
    list-style-type: none;
    font-style: inherit;
  }
  .messageBoard .msg-slide1{
    position: absolute;
    right: 0;
    top: 50%;
    width: 33px;
    height: 100px;
    margin-top: -50px;
    background: url("/images/messageBoard/circle-left.png") no-repeat top right;
    color: #fff;
    cursor: pointer;
  }
  .messageBoard .msg-slide1 span{
    display: inline-block;
    width: 20px;
    height: 40px;
    padding-top: 16px;
    margin-left: 13px;
    text-align: center;
    vertical-align: middle;
  }
  .messageBoard .msg-slide1 i{
    position: absolute;
    top: 50%;
    left: 2px;
    line-height: 20px;
    margin-top: -10px;
    font-size: 26px;
  }
  .messageBoard .msg-slide2{
    width: 33px;
    height: 100px;
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -50px;
    background: url("/images/messageBoard/circle-right.png") no-repeat top right;
    color: #fff;
    cursor: pointer;
  }

  .messageBoard .msg-slide2 span{
    display: inline-block;
    width: 20px;
    height: 40px;
    padding-top: 16px;
    margin-right: 13px;
    text-align: center;
    vertical-align: middle;
  }
  .messageBoard .msg-slide2 i{
    position: absolute;
    top: 50%;
    right: 2px;
    line-height: 20px;
    margin-top: -10px;
    font-size: 26px;
  }
  .msg-message{
    text-align: left;
    margin-bottom: 5px;
    height: 30px;
    line-height: 30px;
  }
  .msg-message .msg-content label{
    margin-left: 75px;
    margin-right: 0 !important;
  }
  .msg-message .modal-body div.txtArea{
    padding-left: 55px;
  }
  .messageBoard .modal-body .form-message p.radioLabel{
    margin-bottom: 10px;
  }
  .radioLabel {
    line-height: 20px;
    cursor: pointer;
    color: #666;
  }
  .radioLabel label{
    width: 16px;
    height: 16px;
    background: url("/images/messageBoard/radio.png");
    background-position: 0 -1px;
    margin-right: 2px;
    vertical-align: middle;
    margin-bottom: 0 !important;
    margin-right: 0 !important;
  }
  .radioLabel input[type="radio"]:checked + label {
    background-position: -19px -1px;
  }
  .radioLabel input[type="radio"] + label + span {
    margin-left: 5px;
  }
  .radioLabel input[type="radio"]:checked + label + span{
    color: #5078cb;
  }
  .radioLabel input[type="radio"]{
    display: none;
  }
  /*分页*/
  .page {
    text-align: center;
  }
  .page .page-wrap{
    float: none;
  }
  .page-wrap ul, .page-wrap div {
    float: none !important;
    display: inline-block;
    margin: 0;
  }
</style>
