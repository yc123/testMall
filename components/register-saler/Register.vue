<template>
  <div>
    <div class="step-menu">
      <ul class="x-step">
        <li :class="section >= 1?'active':''" >第一步：完善企业信息
          <i class="x-split"></i></li>
        <li :class="section >= 2?'active':''" >第二步：阅读相关条例
          <i class="x-split"></i></li>
        <li :class="section >= 3?'active':''" >第三步：提交申请</li>
      </ul>
    </div>
    <div class="tab-list">
      <step-first v-show="section == 1"
                  @sectionEvent="sectionChange"
                  @registerAction="onRegister"
                  :loginData="loginData"
                  :enterpriseData="enterpriseData"
                  :businessImgUrl="businessImgUrl"
                  @businessImgUrlAction="onBusinessImgUrl"
                  @isSelfCacheDataAction="onCacheData"></step-first>
      <step-second v-show="section == 2"
                   @sectionEvent="sectionChange"
                   :checkData="checkData"
                   :loginData="loginData"
                   :cacheData="cacheData"></step-second>
      <step-third v-show="section == 3"
                  @sectionEvent="sectionChange"
                  :registerData="registerData"
                  :enterpriseData="enterpriseData"
                  :checkData="checkData"
                  :businessImgUrl="businessImgUrl"
                  @businessImgUrlAction="onBusinessImgUrl"
                  :loginData="loginData"></step-third>
    </div>
    </div>
</template>
<script>
  import StepFirst from '~components/register-saler/register/StepFirst.vue'
  import StepSecond from '~components/register-saler/register/StepSecond.vue'
  import StepThird from '~components/register-saler/register/StepThird.vue'
  export default {
    data () {
      return {
        section: 1,
        checkData: {
          checked: false
        },
        registerData: {
          enterprise: {},
          c: false,
          url: ''
        },
        loginData: {
          isSelf: true,
          section: 1,
          enterprise: {}
        },
        cacheData: {},
        enterpriseData: {},
        businessImgUrl: ''
      }
    },
    components: {
      StepFirst,
      StepSecond,
      StepThird
    },
    computed: {
      user () {
        return this.$store.state.option.user
      }
    },
    created () {
      let ens = this.user.data.enterprises
      let isSelf = true
      let tempEnterprise = {}
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
      if (!isSelf) { // 是企业
        this.$http.get('/basic/enterprise/' + tempEnterprise.uu + '/info')
          .then(response => {
            this.enterpriseData = response.data
            this.section = 1
            this.checkData.checked = false
          })
      } else { // 是个人
        this.$http.get('/basic/user/userCacheEnterprise')
          .then(response => {
            if (!response.data) {
              this.section = 1
              this.checkData.checked = false
            } else if (!response.data.enIsRead) {
              this.section = 2
              this.checkData.checked = false
              this.enterpriseData = response.data
            } else if (response.data.enIsRead) {
              this.section = 3
              this.checkData.checked = true
              this.enterpriseData = response.data
            }
          })
      }
      this.loginData.isSelf = isSelf
      this.loginData.section = this.section
      this.loginData.enterprise = tempEnterprise
    },
    methods: {
      sectionChange: function (num) {
        this.section = num
      },
      onRegister: function (data) {
        this.registerData.isValidRegister = data.isValidRegister
        this.registerData.enterprise = data.enterprise
        this.registerData.url = data.url
      },
      onCacheData: function (cache) {
        this.cacheData = cache
      },
      onBusinessImgUrl: function (url) {
        this.businessImgUrl = url
      }
    }
  }
</script>
<style>
  .x-step .x-split {
    float: right;
  }
  .x-step li.active .x-split:before {
    border-left-color: #5078cb;
    right: -17px;
    z-index: 4;
  }

  .x-step li .x-split:before {
    border-left-color: #e8e8e8;
    right: -16px;
    z-index: 2;
  }
  .x-step .x-split:before {
    border-left-color: #e8e8e8;
    right: -20px;
    z-index: 2;
  }
  .x-step li .x-split:after {
    border-left-color: #fff;
    right: -18px;
    z-index: 1;
  }
  .x-step .x-split:after {
    /*border-left-color: #e8e8e8;*/
    right: -17px;
    z-index: 1;
  }
  .x-step li.active:after {
    border-left-color: #5078cb;
    right: -17px;
  }
  .x-step li.active:before {
    /*border-left-color: #e8e8e8;*/
    left: -17px;
    z-index: 3;
  }
  .x-step li:first-child:before, .x-step li:last-child:after {
    border-width: 0;
  }
  .x-step li.active:before, .x-step li.active:after, .x-step .x-split:before, .x-step .x-split:after {
    position: absolute;
    top: 0;
    display: inline-block;
    border-top: 17px solid transparent;
    border-bottom: 17px solid transparent;
    border-left: 17px solid transparent;
    content: '';
  }
  .brand-type .brand-small-img .preview {
    line-height: 84px;
  }
</style>
