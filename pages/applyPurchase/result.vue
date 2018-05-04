<template>
  <div class="result">
    <div class="container" v-if="state == 'success'">
      <p>发布求购</p>
      <img src="/images/applyPurchase/batch-success.png" alt="">
      <h1>发布成功</h1>
      <h2>成功发布 <span>{{count}}</span> 条求购</h2>
      <div class="footer1">前往 <a href="/user#/seekPurchase">买家中心-我的求购</a> <span>{{timer}}s</span></div>
      <div class="footer2">返回 <nuxt-link to="/">商城首页</nuxt-link> | <nuxt-link to="/applyPurchase">求购首页</nuxt-link></div>
    </div>
    <div class="container" v-else>
      <p>发布求购</p>
      <img src="/images/applyPurchase/batch-error.png" alt="">
      <h1>上传失败</h1>
      <h2>请完善产品信息</h2>
      <div class="footer1">立刻
        <label>
          <input type="file" @change="upload" accept="*.xls, *.xlsx">
          <a>重新上传</a>
        </label>
      </div>
      <div class="footer2">返回 <nuxt-link to="/">商城首页</nuxt-link> | <nuxt-link to="/applyPurchase">求购首页</nuxt-link></div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        timer: 5
      }
    },
    mounted () {
      if (this.state === 'success') {
        setInterval(() => {
          this.timer--
          if (this.timer === 0) {
            window.location.href = '/user#/seekPurchase'
          }
        }, 1000)
      }
    },
    computed: {
      state () {
        return this.$route.query.status
      },
      count () {
        return this.$route.query.count || 0
      },
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      upload: function (e) {
        let file = e.target.files[0]
        if (file) {
          let param = new FormData()
          param.append('file', file, file.name)
          param.append('chunk', '0')
          let config = {
            headers: {'Content-Type': 'multipart/form-data'}
          }
          this.$http.post('/seek/importBom', param, config)
            .then(response => {
              if (response.data.success) {
                window.open('/applyPurchase/' + response.data.data)
              } else {
                this.$message.error(response.data.message)
              }
            }, err => {
              console.log(err)
              if (!this.user.logged) {
                this.$router.push('/auth/login?returnUrl=' + window.location.href)
              } else {
                this.$message.error('上传失败, 系统错误')
              }
            })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .result {
    background: #f5f5f5;
    padding: 20px 0 103px 0;
    .container {
      background: #fff;
      text-align: center;
      height: 400px;
      > p {
        height: 40px;
        line-height: 40px;
        background: #e5edfc;
        margin: 0;
        font-weight: bold;
        font-size: 14px;
        padding-left: 22px;
        text-align: left;
      }
      > img {
        margin: 61px 0 25px 0;
      }
      > h1 {
        font-size: 18px;
        color: #fd4e4e;
        margin: 0 0 8px 0;
      }
      > h2 {
        font-size: 14px;
        margin: 0;
        span {
          color: #fd4e4e;
        }
      }
      .footer1 {
        margin-top: 38px;
        font-size: 16px;
        color: #666;
        label {
          input {
            display: none;
          }
        }
        a {
          color: #007aff;
          font-weight: normal;
        }
        span {
          color: #fd4e4e;
          margin-left: 10px;
        }
      }
      .footer2 {
        margin-top: 21px;
        a {
          &:first-child {
            color: #4290f7;
          }
        }
      }
    }
  }
</style>
