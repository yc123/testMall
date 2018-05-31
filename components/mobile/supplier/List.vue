<template>
  <div>
    <search-header @searchAction="search" :similarUrl="similarUrl" :type="'supplier'" :placeholder="'可通过型号/品牌/类目/名称查找供应商'"></search-header>
    <div class="supplier-list mobile-content">
      <ul v-if="listData && listData.length">
        <li v-for="item in listData" @click="goSupplierDetail(item)">
          <img v-if="item.isStore == 1" class="open" src="/images/mobile/supplier/is-open.png" alt="">
          <span>{{item.enName}}</span>
          <!--<img class="tag" src="/images/mobile/supplier/tag.png" alt="">-->
          <i class="tag iconfont icon-xiangyou"></i>
        </li>
      </ul>
      <div class="com-none-state" v-else>
        <img src="/images/mobile/@2x/search-empty.png">
        <p>抱歉，暂无搜索结果</p>
        <nuxt-link to="/">返回首页</nuxt-link>
      </div>
      <remind-box :title="remindText" :timeoutCount="timeoutCount"></remind-box>
    </div>
  </div>
</template>
<script>
  import { RemindBox } from '~components/mobile/common'
  import {SearchHeader} from '~components/mobile/base'
  export default {
    data () {
      return {
        keyword: '',
        isSearchSearchingMore: false,
        page: 1,
        size: 10,
        listData: [],
        isChange: false,
        isDataChange: false,
        remindText: '',
        timeoutCount: 0,
        similarUrl: '/search/product/similarKeywords',
        field: null
      }
    },
    components: {
      RemindBox,
      SearchHeader
    },
    mounted: function () {
      this.$nextTick(() => {
        window.addEventListener('scroll', this.scroll, false)
      })
    },
    watch: {
      'list': {
        handler (val, oldVal) {
          if (this.isChange) {
            this.listData = val.content
            this.page = 1
            this.isChange = false
            this.isDataChange = true
          } else {
            this.listData = this.listData.concat(val.content)
            this.isSearchSearchingMore = false
            this.isDataChange = false
          }
        },
        immediate: true
      }
    },
    computed: {
      list () {
        return this.$store.state.supplier.data.list.data
      },
      allPage () {
        return Math.floor(this.list.totalElements / this.list.size) + Math.floor(this.list.totalElements % this.list.size > 0 ? 1 : 0)
      }
    },
    methods: {
      goLastPage: function () {
        window.history.back(-1)
      },
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
        this.$store.dispatch('supplier/getSupplierList', {keyword: this.keyword, page: this.page, size: this.size, field: this.field})
      },
      search: function (searchObj) {
        if (searchObj) {
          this.keyword = searchObj.keyword
          console.log(searchObj)
          this.field = searchObj.type || null
        }
        this.page = 1
        this.isChange = true
        this.reloadData()
      },
      goSupplierDetail: function (item) {
        // /mobile/supplier/detail/${item.enUU}?isStore=${item.isStore}
        this.$http.get('/vendor/introduction/product/count', {params: {vendUU: item.enUU}})
          .then(response => {
            if (response.data.success && response.data.count > 0) {
              this.$router.push(`/mobile/supplier/detail/${item.enUU}?isStore=${item.isStore}`)
            } else {
              this.onRemind('供应商正在完善产品信息，暂时不能查看更多。')
            }
          })
      },
      onRemind: function(str) {
        this.remindText = str
        this.timeoutCount++
      }
    }
  }
</script>
<style lang="scss" scoped>
    .supplier-list {
      height: 100%;
      background: #29a9f9;
      .mobile-header {
        position: fixed;
        top: 0;
        z-index: 10;
        width:100%;
        height:.88rem;
        line-height: .88rem;
        background: #3e82f5;
        padding:0 .2rem 0 .1rem;
        color:#fff;
        > a {
          font-size:.28rem;
          color:#fff;
          position: absolute;
          i {
            font-size: .48rem;
            margin-right: -.1rem;
          }
        }
        .search-content {
          margin-left: .5rem;
          line-height: normal;
          padding-top: .14rem;
          input {
            color: #333;
            width: 6.48rem;
            line-height: normal;
          }
          span {
            height: .46rem;
            line-height: .46rem;
          }
        }
      }
      ul {
        margin: .26rem auto 0;
        width: 6.91rem;
        li {
          position: relative;
          height: 1.21rem;
          background: #fff;
          line-height: 1.21rem;
          padding-left: .74rem;
          font-size: .32rem;
          margin-bottom: .14rem;
          border-radius: .05rem;
          .open {
            width: 1.35rem;
            position: absolute;
            top: -.08rem;
            left: -.1rem;
          }
          .tag {
            position: absolute;
            right: .35rem;
            color: #3f84f6;
          }
          span {
            color: #333;
            width: 4.65rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
          }
        }
      }
    }
  .com-none-state {
    padding: 1.5rem .5rem .5rem .5rem;
  }
</style>
