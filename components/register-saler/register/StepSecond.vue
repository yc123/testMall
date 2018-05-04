<template>
  <!--阅读服务协议-->
  <div class="section">
    <div class="agreement">
      <div class="join_xieyi">
        <div class="article-flag">
          <span @click="chooseTag=1" :class="chooseTag==1?'active':''">优软商城服务条款</span>
          <span @click="chooseTag=2" :class="chooseTag==2?'active':''">优软商城买卖条例</span>
        </div>
        <!--<textarea readonly></textarea>-->
        <div class="text-area">
          <div class="ql-container ql-snow" v-html="article"></div>
        </div>
      </div>
    </div>
    <div class="row" style="margin-left: 30px; text-align: center;">
      <label class="checkbox-inline">
        <input type="checkbox" id="agree" name="agree" value="1" :checked="checkData.checked" @click="onCheck()" >
        我已阅读并同意<a href="http://www.usoftmall.com/help#/issue/50" target="_blank">
        《优软商城服务条款》</a>、<a href="http://www.usoftmall.com/help#/issue/16" target="_blank">
        《优软商城买卖条例》</a>
      </label>
    </div>
    <div class="row next-btn step-two-btn" style="margin-top: 20px">
      <button @click="sectionChange(1)" class="btn">上一步</button>
      <button @click="sectionChange(3)" class="btn" :style="!checkData.checked ? 'opacity: .65;':''">下一步</button>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['checkData', 'loginData', 'cacheData'],
    data () {
      return {
        chooseTag: 1,
        article: ''
      }
    },
    watch: {
      chooseTag: function (val) {
        this.getArticle(val === 1 ? 50 : 16)
      }
    },
    mounted () {
      this.getArticle(50)
    },
    methods: {
      sectionChange: function (type) {
        if (!this.checkData.checked && type === 3) {
          this.$message.error('请阅读相关条例')
        } else {
          this.$emit('sectionEvent', type)
        }
      },
      getArticle: function (num) {
        this.$http.get('/api/help-service/issues/' + num).then(response => {
          this.article = response.data.article
        })
      },
      onCheck: function () {
        this.checkData.checked = !this.checkData.checked
        if (this.loginData.isSelf) {
          this.cacheData.enIsRead = this.checkData.checked
          this.$http.post('/basic/user/userCacheEnterprise', this.cacheData)
        } else {
          if (this.checkData.checked) {
            this.$http.post('/basic/enterprise/openVendorSetRead/' + this.loginData.enterprise.uu)
              .then(() => {
                this.$http.get('/user/authentication/reflash')
                  .then(() => {
                    this.$http.get(`/user/authentication/` + this.loginData.enterprise.uu).then(() => {
                      this.$store.dispatch('loadUserInfo')
                    })
                  })
              })
          } else {
            this.$http.post('/basic/enterprise/openVendorSetNotRead/' + this.loginData.enterprise.uu)
              .then(() => {
                this.$http.get('/user/authentication/reflash')
                  .then(() => {
                    this.$http.get(`/user/authentication/` + this.loginData.enterprise.uu).then(() => {
                      this.$store.dispatch('loadUserInfo')
                    })
                  })
              })
          }
        }
      }
    }
  }
</script>

<style>
  @import '~assets/scss/help.css';
  .step-two-btn button:first-child{
    background: #fff;
    color: #5078cb;
    border: 1px solid #5078cb;
  }
  .join_xieyi .ql-editor span,.join_xieyi .ql-editor a {
    font-size: 12px;
    line-height: 25px;
  }
  .join_xieyi .ql-editor br {
    display: none;
  }
  .join_xieyi .ql-editor {
    padding: 0 0 0 25px;
  }
 /* .join_xieyi .ql-editor p {
    width: 494px;
    margin: 0 auto;
  }*/
  .ql-container.ql-snow {
    border: none;
  }
</style>
