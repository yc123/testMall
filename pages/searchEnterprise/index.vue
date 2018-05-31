<template>
  <div class="is-open-store">
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
    </div>
    <p class="no-result-content" v-if="showSearchResultStatus == 2">
      {{enName}} <span>(未开店)</span>
    </p>
  </div>
</template>
<script>
  export default {
    layout: 'none',
    data () {
      return {
        // 0=>初始状态，1=>有搜索结果，2=>搜索结果为空
        showSearchResultStatus: 0,
        keyword: '',
        enName: '',
        enInfo: {}
      }
    },
    methods: {
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
          }, err => {
            this.$message.error(err.response.data || '系统错误')
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .is-open-store {
    margin-top: 50px;
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
      text-align: center;
      p {
        height: 41px;
        line-height: 41px;
        font-size: 16px;
        font-weight: bold;
        margin: 24px auto 0;
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
      text-align: center;
      span {
        color: #f00707;
        font-weight: normal;
      }
    }
  }
</style>
