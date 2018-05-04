<template>
  <div class="new-sign-module">
    <div class="head">
      <div class="img">
        <img src="/images/store/home/new.png" />
      </div>
      <div class="title">新入驻的商家</div>
    </div>
    <ul class="list-unstyled list-inline" style="height: 210px;">
      <li class="new-store" v-for="(store, index) in stores">
        <div class="img">
          <img :src="store.logoUrl || '/images/store/common/default.png'" style="max-width: 100%;max-height: 100%;" />
        </div>
        <div class="content">
          <div class="name"><a target="_blank" :href="'/store/' + store.uuid" :title="store.storeName">{{store.storeName}}</a></div>
          <div class="subject" style="display: none;">
            主营：<span>暂无</span>
          </div>
          <div class="subject">
            商家简介：<span>{{store.description}}</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="sign">
      <div class="img">
        <img src="/images/store/home/shop.png"/>
      </div>
      <div class="content">
        <div class="count">
          已入驻商家<span>{{storeCount}}</span>家
        </div>
        <div>
          <a @click="goStoreApply()"><button>立即入驻</button></a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'new-store',
  computed: {
    user () {
      return this.$store.state.option.user
    },
    stores () {
      return this.$store.state.provider.storeCms.newStores.data ? this.$store.state.provider.storeCms.newStores.data.content : []
    },
    storeCount () {
      return this.$store.state.provider.storeCms.storeCount.data
    },
    enterprise () {
      let ens = this.user.data.enterprises
      if (ens && ens.length) {
        return ens.find(item => item.current) || {enName: '个人账户'}
      } else {
        return {enName: '个人账户'}
      }
    }
  },
  methods: {
    goStoreApply: function () {
      if (this.user.logged) {
        if (this.enterprise && this.enterprise.isVendor === 313) {
          window.location.href = '/vendor#/store-apply'
        } else {
          this.$router.push('/register-saler')
        }
      } else {
        this.$router.push('/auth/login')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';

  .new-sign-module {
    width: 280px;
    height: 360px;
    padding-left: 10px;
    border-right: 1px solid #D6D3CE;
    border-bottom: 1px solid #D6D3CE;
    border-top: 1px solid #D6D3CE;

    a {
      color: #337ab7;
      text-decoration: none;
    }

    ul {
      margin-bottom: 10px;
    }

    .head {
      height: 60px;

      .img {
        margin-right: 14px;
        width: 50px;
        height: 50px;
        display: inline-block;
        text-align: center;
        line-height: 50px;

        img {
          vertical-align: middle;
        }
      }

      .title {
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        font-weight: 600;
        display: inline-block;
      }
    }

    .new-store {
      display: inline-block;
      height: 70px;
      padding-bottom: 0;
      width: 260px;

      .img {
        width: 50px;
        height: 50px;
        display: inline-block;
        text-align: center;
        line-height: 45px;
        border: #e8e8e8 1px solid;

        img {
          vertical-align: middle;
        }
      }

      .content {
        width: 185px;
        display: inline-block;
        padding: 8px;
        vertical-align: middle;
        margin-left: 10px;

        .name {
          font-size: 16px;
          color: #6D6B66;
          width: 190px;
          line-height: 28px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          word-break: keep-all;
        }

        .subject {
          font-size: 14px;
          color: #777570;
          line-height: 28px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: keep-all;
        }
      }
    }

    .sign {
      height: 80px;
      box-shadow: 0px -5px 20px 0px #E3E1DE;
      margin-left: -20px;
      padding-left: 20px;
      padding-top: 5px;

      .img {
        display: inline-block;

        img {
          margin-bottom: 25px;
          vertical-align: middle;
        }
      }

      .content {
        display: inline-block;
        font-size: 0;
        padding-left: 3px;
        height: 70px;

        button {
          background-color: #3D76C6;
          color: white;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          height: 30px;
          width: 160px;
          border: #3D76C6;
        }

        button:hover {
          transform: scale(1.05);
          background: #5078cb;
        }
      }

      .count {
        font-size: 16px;
        padding: 5px;

        span {
          color: #328CFE;
        }
      }
    }
  }

</style>
