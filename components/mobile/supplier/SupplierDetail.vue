<template>
  <div class="supplier-detail">
    <img v-if="$route.query.isStore === '1'" class="open" src="/images/mobile/supplier/is-open.png" alt="">
    <div class="detail">
      <nuxt-link v-if="$route.query.isStore === '1'" :to="`/mobile/shop/${storeInfo.uuid}`" tag="h1">{{enInfo.enName}}<i class="iconfont icon-xiangyou"></i></nuxt-link>
      <div class="line">
        <div class="img-wrap">
          <img src="/images/mobile/supplier/business.png" alt="">
        </div>
        <span>营业执照号：</span>
        <span>{{enInfo.enBussinessCode || '-'}}</span>
      </div>
      <div class="line">
        <div class="img-wrap">
          <img src="/images/mobile/supplier/address.png" alt="">
        </div>
        <span>地址：</span>
        <span>{{enInfo.enAddress || '-'}}</span>
      </div>
      <div class="line">
        <div class="img-wrap">
          <img src="/images/mobile/supplier/email.png" alt="">
        </div>
        <span>邮箱：</span>
        <span>{{enInfo.enEmail || '-'}}</span>
      </div>
      <div class="line">
        <div class="img-wrap">
          <img src="/images/mobile/supplier/phone.png" alt="">
        </div>
        <span>电话：</span>
        <span>{{enInfo.enTel || '-'}}</span>
      </div>
      <div class="line">
        <div class="img-wrap">
          <img src="/images/mobile/supplier/house.png" alt="">
        </div>
        <span>行业：</span>
        <span>{{enInfo.enIndustry || '-'}}</span>
      </div>
    </div>
    <div class="list">
      <div class="search-content">
        <input type="text" placeholder="请输入您要查找的型号或品牌" @keyup.13="search" v-model="key">
        <span @click="search" >
        <i class="iconfont icon-sousuo"></i>
        </span>
      </div>
      <ul v-if="productListData && productListData.length">
        <li v-for="product in productListData">
          <div class="prop">
            <span class="head">型号/品牌：</span>
            <span class="item">{{product.cmpCode || '—'}}</span>
            <span class="item">{{(product.standard == 1 ? product.pbranden : product.brand) || '—'}}</span>
          </div>
          <div class="prop">
            <span class="head">类目/规格：</span>
            <span class="item">{{(product.standard == 1 ? product.kind : product.prodName) || '—'}}</span>
            <span class="item">{{product.spec || '—'}}</span>
          </div>
          <div class="prop">
            <span class="head">单位：</span>
            <span class="item">{{product.unit || 'PCS'}}</span>
          </div>
          <a class="seek-btn" @click="publish(product)">立即询价</a>
        </li>
      </ul>
      <div class="com-none-state" v-else>
        <img src="/images/mobile/@2x/search-empty.png">
        <p>抱歉，暂无搜索结果</p>
      </div>
    </div>
    <publish-supplier-seek :product="currentProduct" :showPublishBox="showPublishBox" @cancelAction="showPublishBox = false" @remindAction="onRemind"></publish-supplier-seek>
    <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
    <login-box :url="url" @onLoginBoxClose="showLoginBox = false" v-if="showLoginBox"></login-box>
  </div>
</template>
<script>
  import { PublishSupplierSeek } from '~components/mobile/applyPurchase'
  import { RemindBox, LoginBox } from '~components/mobile/common'
  export default {
    data () {
      return {
        key: '',
        isSearchSearchingMore: false,
        page: 1,
        size: 10,
        productListData: [],
        isChange: false,
        isDataChange: false,
        showPublishBox: false,
        remindText: '',
        timeoutCount: 0,
        currentProduct: {},
        showLoginBox: false,
        url: ''
      }
    },
    components: {
      PublishSupplierSeek,
      RemindBox,
      LoginBox
    },
    mounted: function () {
      this.$nextTick(() => {
        window.addEventListener('scroll', this.scroll, false)
      })
    },
    watch: {
      '$store.state.supplier.data.productList.data': {
        handler (val, oldVal) {
          if (this.isChange) {
            this.productListData = val.content
            this.page = 1
            this.isChange = false
            this.isDataChange = true
          } else {
            this.productListData = this.productListData.concat(val.content)
            this.isSearchSearchingMore = false
            this.isDataChange = false
          }
        },
        immediate: true
      }
    },
    computed: {
      enInfo () {
        return this.$store.state.supplier.data.enterpriseData.data
      },
      productList () {
        return this.$store.state.supplier.data.productList.data
      },
      allPage () {
        return Math.floor(this.productList.totalElements / this.productList.size) + Math.floor(this.productList.totalElements % this.productList.size > 0 ? 1 : 0)
      },
      storeInfo () {
        return this.$store.state.shop.storeInfo.store.data
      }
    },
    methods: {
      scroll: function () {
        let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
        if (Math.ceil(scrolled + window.screen.availHeight) >= document.body.scrollHeight && !this.isSearchSearchingMore && this.page < this.allPage) {
          this.getMoreSearch()
        }
      },
      getMoreSearch: function () {
        this.page++
        this.isSearchSearchingMore = true
        this.reloadData()
      },
      reloadData: function () {
        this.$store.dispatch('supplier/getSupplierProductList', { vendUU: this.$route.params.uu, page: this.page, size: this.size, keyword: this.key })
      },
      search: function () {
        this.page = 1
        this.isChange = true
        this.reloadData()
      },
      publish: function (product) {
        if (this.user.logged) {
          this.currentProduct = product
          this.showPublishBox = true
        } else {
          this.url = this.$route.fullPath
          this.showLoginBox = true
        }
      },
      onRemind: function (str) {
        this.remindText = str
        this.timeoutCount ++
      },
      goLastPage: function () {
        window.history.back(-1)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .supplier-detail {
    background: #29a9f9;
    padding: .38rem .19rem;
    position: relative;
    margin-bottom: 1rem;
    .open {
      position: absolute;
      height: .58rem;
      left: -.1rem;
      top: .15rem;
    }
    .detail {
      height: 4.46rem;
      padding: 0 .31rem;
      background: #fff;
      overflow: hidden;
      border-radius: .05rem;
      h1 {
        height: 1.11rem;
        line-height: 1.11rem;
        text-align: center;
        font-size: .44rem;
        border-bottom: 1px solid rgba(0, 0, 0, .26);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        i {
          color: #3f84f6;
          font-size: .31rem;
          float: right;
        }
      }
      .line {
        margin-top: .26rem;
        font-size: .28rem;
        color: #666;
        padding: 0 .15rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .img-wrap {
          width: .3rem;
          text-align: center;
          display: inline-block;
          margin-right: .31rem;
          img {
            height: .25rem;
          }
        }
      }
    }
    .list {
      background: #f2f2f2;
      margin-top: .21rem;
      border-radius: .05rem;
      .search-content {
        padding-top: .15rem;
        padding-bottom: .15rem;
        text-align: center;
        input {
          border: 1px solid #3f84f6;
        }
      }
      ul {
        li {
          &:nth-child(odd) {
            background: #fff;
          }
          position: relative;
          padding: .29rem 0 .16rem .22rem;
          overflow: hidden;
          .prop {
            margin-bottom: .11rem;
            font-size: .28rem;
            &:last-child {
              margin-bottom: 0;
            }
            .head {
              color: #666;
            }
            .item {
              display: inline-block;
              width: 1.68rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-right: .18rem;
              vertical-align: middle;
              &:last-child {
                margin-right: 0;
              }
            }
          }
          .seek-btn {
            position: absolute;
            right: .17rem;
            top: .67rem;
            display: block;
            width: 1.5rem;
            height: .44rem;
            line-height: .44rem;
            text-align: center;
            color: #fff;
            background: #3f84f6;
            border-radius: .22rem;
            font-size: .26rem;
          }
        }
      }
    }
  }
</style>
