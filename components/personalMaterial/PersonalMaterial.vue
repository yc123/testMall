<template>
  <div class="personal-material">
    <a @click="goLastPage">&lt;返回上一层</a>
    <div class="personal-material-header">
      <p><i class="fa fa-exclamation-circle"></i>抱歉，您的账户未绑定企业，暂无卖家权限！</p>
      <a @click="setShowApplyRecord(true)">查看申请记录</a>
    </div>
    <div class="personal-material-content">
      <div class="is-open-store">
        <p><img src="/images/material/arrow-right-blue.png" alt="">所属企业已开店</p>
        <div>
          <p>绑定企业</p>
          <div class="search-content">企业全称：<input type="text" class="form-control" v-model="keyword" placeholder="请输入企业全称" @keyup.13="onSearchEnterprise"><span @click="onSearchEnterprise">检测</span></div>
          <div class="result-content" v-if="showSearchResultStatus == 1">
            <p v-text="enInfo.name"></p>
            <div class="result-text">
              <span>管理员</span>
              <span v-text="enInfo.adminName"></span>
            </div>
            <div class="result-text">
              <span>营业执照号</span>
              <span v-text="enInfo.businessCode"></span>
            </div>
            <a href="javascript:void(0)" @click="bindEnterprise">申请绑定</a>
            <div class="result-remind">管理员审核通过后成功绑定</div>
          </div>
          <p class="no-result-content" v-if="showSearchResultStatus == 2">
            {{enName}} <span>(未开店)</span>
          </p>
        </div>
      </div>
      <div class="not-open-store">
        <p><img src="/images/material/arrow-right-yellow.png" alt="">所属企业未开店</p>
        <div>
          <div class="fl">
            <img src="/images/material/car.png" alt="">
            <ul>
              <li>免费入驻 不赚差价</li>
              <li>库存寄售 极速上架</li>
              <li>定量广告 限时免费</li>
            </ul>
          </div>
          <div class="fr">
            <img src="/images/material/house.png" alt="">
            <div>
              <p>请点击下方按钮开设新的店铺</p>
              <a href="/register-saler">开设新店铺</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-wrap" v-show="showRemindBox || showApplyRecord"></div>
    <div class="com-del-box" v-if="showRemindBox">
      <div class="title">
        <i @click="goLastPage"></i>
      </div>
      <p><img src="/images/material/check.png" alt="">绑定申请提交成功！</p>
      <div class="result">审批结果将以短信通知，请保持手机通畅。</div>
      <div class="remind">弹窗将在 <span v-text="timer + '秒'"></span> 后自动关闭</div>
    </div>
    <div class="apply-record" v-if="showApplyRecord">
      <div class="title">申请记录 <img src="/images/material/apply-close.png" alt="" @click="setShowApplyRecord(false)"></div>
      <div class="record-wrap">
        <div class="record-title">
          <span>企业名称</span>
          <span>管理员</span>
          <span>申请时间</span>
          <span>状态</span>
        </div>
        <ul>
          <li v-for="item in applyList">
            <span>{{item.enName}}</span>
            <span>{{item.adminName}}</span>
            <span>{{item.date | date}}</span>
            <span :class="{'green-text': item.status == 311, 'red-text': item.status == 317}">{{item.status | status}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        showApplyRecord: false,
        showRemindBox: false,
        // 0=>初始状态，1=>有搜索结果，2=>搜索结果为空
        showSearchResultStatus: 0,
        keyword: '',
        enName: '',
        enInfo: {},
        timer: 5,
        applyList: []
      }
    },
    computed: {
      user () {
        return this.$store.state.option.user
      }
    },
    filters: {
      date: function (input) {
        const d = new Date(input)
        const year = d.getFullYear()
        const monthTemp = d.getMonth() + 1
        const month = monthTemp < 10 ? '0' + monthTemp : '' + monthTemp
        const hour = d.getHours() < 10 ? '0' + d.getHours() : '' + d.getHours()
        const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : '' + d.getMinutes()
        const seconds = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
        const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
      },
      status: function (status) {
        switch (status) {
          case 311:
            return '待审核'
          case 316:
            return '已通过'
          case 317:
            return '未通过'
          default:
            break
        }
      }
    },
    methods: {
      goLastPage: function () {
        window.history.back(-1)
      },
      onSearchEnterprise: function () {
        if (this.keyword) {
          this.$http.get('/basic/enterprise/findByName/' + encodeURIComponent(this.keyword)).then(response => {
            if (response.data) {
              this.enInfo = response.data
              this.showSearchResultStatus = 1
            } else {
              this.enName = this.keyword
              this.showSearchResultStatus = 2
            }
          })
        }
      },
      bindEnterprise: function () {
        this.$http.get('/basic/enterprise/applyUserSpace', {params: {phone: this.user.data.userTel, enName: this.enInfo.name, businessCode: this.enInfo.businessCode}})
          .then(response => {
            if (response.data.data === 'success') {
              this.showSearchResultStatus = 0
              this.keyword = ''
              this.showRemindBox = true
              this.startInterval()
            } else {
              this.$message.error(response.data.data)
            }
          }, err => {
            console.log(err)
            this.$message.error('系统错误')
          })
      },
      startInterval: function () {
        this.timer = 5
        let _this = this
        let interval = setInterval(() => {
          _this.timer --
          if (_this.timer === 0) {
            clearInterval(interval)
            this.showRemindBox = false
            this.goLastPage()
          }
        }, 1000)
      },
      setShowApplyRecord: function (flag) {
        if (flag) {
          this.$http.get('/basic/enterprise/findApplyInfo', {params: {phone: this.user.data.userTel}})
            .then(responses => {
              this.applyList = responses.data
              this.showApplyRecord = flag
            }, err => {
              console.log(err)
              this.$message.error('系统错误')
            })
        } else {
          this.showApplyRecord = flag
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .personal-material {
    width: 1190px;
    margin: 0 auto;
    p {
      margin: 0;
    }
    a {
      color: #5078cb;
    }
    > a {
      line-height: 71px;
    }
    .personal-material-header {
      height: 111px;
      line-height: 111px;
      border: 1px solid #ebeaea;
      position: relative;
      margin-bottom: 19px;
      p {
        color: #5078cb;
        font-size: 22px;
        text-align: center;
        i {
          margin-right: 20px;
        }
      }
      a {
        position: absolute;
        right: 11px;
        bottom: 14px;
        display: inline-block;
        line-height: normal;
      }
    }
    .personal-material-content {
      border: 1px solid #ebeaea;
      margin-bottom: 147px;
      padding: 0 95px;
      > div {
        padding: 0 50px;
        border-radius: 3px;
        > p {
          height: 81px;
          line-height: 81px;
          font-size: 16px;
          font-weight: bold;
          img {
            margin-right: 4px;
          }
        }
      }
      .is-open-store {
        padding-bottom: 29px;
        border-bottom: 1px solid #d5d5d5;
        > div {
          min-height: 140px;
          border: 1px solid #5078cb;
          > p {
            font-weight: bold;
            font-size: 18px;
            margin: 26px 0;
            text-align: center;
          }
          .search-content {
            text-align: center;
            input {
              width: 290px;
              display: inline-block;
              height: 30px;
              border: {
                top-left-radius: 3px;
                bottom-left-radius: 3px;
                top-right-radius: 0;
                bottom-right-radius: 0;
              }
              border-top-left-radius: 3px;
              border-bottom-left-radius: 3px;
              border: 1px solid #cdcdcd;
              margin-left: 10px;
            }
            span {
              display: inline-block;
              width: 87px;
              height: 30px;
              line-height: 31px;
              text-align: center;
              color: #fff;
              background: #5078cb;
              margin-left: -1px;
              border-top-right-radius: 3px;
              border-bottom-right-radius: 3px;
              cursor: pointer;
            }
          }
          .result-content {
            padding: 0 0 0 221px;
            p {
              height: 41px;
              line-height: 41px;
              font-size: 16px;
              font-weight: bold;
              margin: 24px 0 0 0;
              width: 376px;
              border-bottom: 1px solid #e6e5e4;
              padding-left: 8px;
            }
            .result-text {
              padding-left: 8px;
              span {
                &:first-child {
                  display: inline-block;
                  width: 111px;
                  color: #666;
                }
              }
              &:first-of-type {
                margin: 15px 0 21px 0;
              }
            }
            > a {
              display: inline-block;
              width: 201px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              border-radius: 3px;
              background: #5078cb;
              color: #fff;
              margin: 37px 0 16px 130px;
            }
            .result-remind {
              margin: 0 0 18px 146px;
              color: #666;
            }
          }
          .no-result-content {
            font-size: 16px;
            margin: 26px 0 38px 220px;
            text-align: left;
            span {
              color: #f00707;
              font-weight: normal;
            }
          }
        }
      }
      .not-open-store {
        margin-bottom: 62px;
        > div {
          height: 171px;
          border: 1px solid #ff8522;
          .fl {
            list-style: inside;
            color: #ff8522;
            height: 130px;
            width: 391px;
            margin-top: 25px;
            border-right: 1px dashed #fce3cf;
            img {
              margin: 11px 0 0 16px;
            }
            ul {
              list-style: inside;
              color: #ff8522;
              float: right;
              margin: 19px 61px 0 0;
              li {
                margin-bottom: 20px;
                white-space: nowrap;
                &:nth-child(2) {
                  margin-left: 10px;
                }
                &:nth-child(3) {
                  margin-left: 29px;
                }
              }
            }
          }
          .fr {
            width: 504px;
            img {
              margin: 45px 0 0 62px;
            }
            div {
              float: right;
              margin-right: 140px;
              margin-top: 44px;
              text-align: center;
              p {
                margin-bottom: 29px;
              }
              a {
                display: inline-block;
                width: 124px;
                height: 32px;
                color: #fff;
                font-size: 14px;
                text-align: center;
                line-height: 32px;
                background: #ff8522;
                border-radius: 3px;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
    .com-del-box {
      text-align: center;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      border-radius: 3px;
      > p {
        margin-top: 20px;
        margin-bottom: 10px;
        color: #5078cb;
        img {
          position: relative;
          bottom: 2px;
          margin-right: 8px;
        }
      }
      .result {
        color: #333;
        margin-bottom: 24px;
      }
      .remind {
        font-size: 12px;
        color: #666;
        span {
          color: #f40d0d;
        }
      }
    }
    .apply-record {
      position: fixed;
      top: 23%;
      left: 31%;
      z-index: 10;
      width: 577px;
      height: 239px;
      background: #fff;
      .title {
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 16px;
        color: #333;
        img {
          float: right;
          margin: 10px 11px 0 0;
          cursor: pointer;

        }
      }
    }
    .record-wrap {
      padding: 0 18px;
      .record-title {
        height: 28px;
        line-height: 28px;
        background: #8eb0f5;
        border: 1px solid #e8e8e8;
        color: #fff;
      }
      ul {
        max-height: 150px;
        overflow-y: auto;
        overflow-x: hidden;
        li {
          border-bottom: 1px solid #e8e8e8;
          height: 30px;
          &:nth-child(even) {
            background: #edf2fd;
          }
          &:nth-child(odd) {
            background: #f7f9fe;
          }
          span {
            line-height: 26px;
            position: relative;
            top: 2px;
            &.green-text {
              color: #379b1d;
            }
            &.red-text {
              color: #f51c24;
            }
          }
        }
      }
      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        text-align: center;
        &:nth-child(1) {
          width: 220px;
          padding: 0 10px 0 22px;
        }
        &:nth-child(2) {
          width: 68px;
        }
        &:nth-child(3) {
          width: 165px;
        }
        &:nth-child(4) {
          width: 82px;
        }
      }
    }
  }
</style>
