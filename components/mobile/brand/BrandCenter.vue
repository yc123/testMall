<template>
  <div>
    <search-header @searchAction="onSearch" :placeholder="'请输入品牌名称'" :showSimilar="false"></search-header>
    <div class="mobile-brand-center mobile-content">
      <div class="mobile-brand-wrap">
        <div class="mobile-brand-header">
          <img src="/images/mobile/@2x/brand/brandWall.png" alt="">
          <div class="mobile-brand-index" :class="{'scrolled': isScrolled, 'is-more': isScrolled && !isMore}">
            <p style="float: left">索引：</p>
            <div style="float: left;width: 5.5rem">
              <nuxt-link :to="'/mobile/brand/brandCenter/' + item"
                         :class="{'active': item == activeIndex}"
                         :key="key" v-for="(item, key) in initArr">{{item}}</nuxt-link>
            </div>
            <div v-if="isScrolled" class="more-index" @click="isMore = !isMore">
              {{!isMore ? '更多' : '收起'}}
              <img v-if="!isMore" src="/images/mobile/@2x/applyPurchase/currency-arrow-down.png" alt="">
              <img src="/images/mobile/@2x/applyPurchase/currency-arrow-up.png" v-else alt="">
            </div>
            <div class="clear-float"></div>
          </div>
        </div>
        <div class="mobile-brand-list">
          <div>
            <div class="brand-initial">
              <p v-text="activeIndex" :style="activeIndex === '0~9' ? 'font-size: .28rem': 'font-size: .32rem'"></p>
              <span>
              {{activeIndex}}开头共<span>{{brandList.totalElements || 0}}</span>个品牌
            </span>
            </div>
            <div class="brand-items" v-if="brandListTemplate.length">
              <nuxt-link :to="`/mobile/brand/${brand.uuid}/`" :key="brand.uuid" v-for="brand in brandListTemplate">
                <div>{{brand.nameEn}}</div>
                <div v-if="brand.nameCn != brand.nameEn">{{brand.nameCn}}</div>
              </nuxt-link>
            </div>
            <empty-status :type="'search'"
                          :text="`抱歉，暂无与“${pageParams.keyword}”匹配的品牌信息`"
                          :showLink="false"
                          v-else
            ></empty-status>
          </div>
        </div>
      </div>
    </div>
    <pull-up :searchMore="fetching" :allPage="allPage" :page="pageParams.page" @pullUpAction="onPullUpAction"></pull-up>
  </div>
</template>
<script>
  import {SearchHeader} from '~components/mobile/base'
  import { PullUp, EmptyStatus } from '~components/mobile/common'
  import { startWith } from '~utils/baseUtils'
  export default {
    name: 'brandList',
    data () {
      return {
        initArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0~9'],
        activeIndex: this.$route.params.initial,
        isScrolled: false,
        isMore: false,
        pageParams: {
          page: 1,
          count: 60,
          keyword: ''
        },
        isChange: false,
        brandListTemplate: []
      }
    },
    components: {
      SearchHeader,
      PullUp,
      EmptyStatus
    },
    mounted: function () {
      let _this = this
      _this.$nextTick(function () {
        window.addEventListener('scroll', function () {
          _this.onScroll()
        }, false)
      })
    },
    watch: {
      'brandData.data': {
        handler: function (val) {
          let list = [...val.content]
          if (this.isChange) {
            this.brandListTemplate = list
            this.isChange = false
          } else {
            this.brandListTemplate = [...this.brandListTemplate, ...list]
          }
        },
        immediate: true
      }
    },
    computed: {
      brandData () {
        return this.$store.state.product.brand.brandPagerList
      },
      brandList () {
        return this.brandData.data
      },
      allPage () {
        return this.brandList.totalPages
      },
      fetching () {
        return this.brandData.fetching
      }
    },
    methods: {
      onScroll () {
        if (startWith(this.$route.path, '/mobile/brand/brandCenter')) {
          let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
          this.isScrolled = scrolled > 200
        }
      },
      reloadData: function () {
        this.$store.dispatch('product/loadBrandsPager', {'initial': this.activeIndex, page: this.pageParams.page, count: this.pageParams.count, keyword: this.pageParams.keyword})
      },
      onSearch: function (keyObj) {
        this.pageParams.keyword = keyObj.keyword
        this.pageParams.page = 1
        this.isChange = true
        this.reloadData()
      },
      onPullUpAction: function () {
        this.pageParams.page++
        this.reloadData()
      }
    }
  }
</script>
<style lang="scss" scoped>
  .mobile-brand-center {
    margin-bottom: .98rem;
    width: 100%;
    background: #f7f7f7;
    padding-top: .24rem;
    .mobile-brand-wrap {
      width: 6.96rem;
      background: #fff;
      margin: 0 auto;
      padding: 0 .21rem;
      border-radius: .1rem;
      .mobile-brand-header {
        text-align: center;
        height: 4.32rem;
        >img {
          margin: .24rem auto .19rem;
          width: 6.09rem;
          height: .66rem;
        }
        .mobile-brand-index {
          font-size: .3rem;
          line-height: .62rem;
          background: #f4fafd;
          margin: .19rem 0 .25rem 0;
          padding: 0 .07rem;
          text-align: left;
          p {
            float: left;
          }
          a {
            color: #666;
            width: 0.9rem;
            display: inline-block;
            text-align: center;
            &.active, &.hover, &.focus {
              color: #418bf6;
            }
          }
          &.scrolled {
            position: fixed;
            top: .88rem;
            width: 100%;
            background: #fff;
            border-bottom: .04rem solid #ccc;
            left: 0;
            padding-left: .58rem;
            margin-top: 0;
            .more-index {
              position: absolute;
              right: .1rem;
              color: #5078cb;
            }
          }
          &.is-more {
            height: 1.32rem;
            overflow: hidden;
            img {
              width: .2rem;
              margin-left: -.1rem;
            }
          }
        }
      }
      .mobile-brand-list {
        font-size: .3rem;
        .brand-initial {
          border-bottom: .04rem solid #418bf6;
          p {
            width: .64rem;
            height: .43rem;
            line-height: .43rem;
            margin: 0;
            background: #418bf6;
            color: #fff;
            font-size: .32rem;
            text-align: center;
            display: inline-block;
            border-top-left-radius: .05rem;
            border-top-right-radius: .05rem;
          }
          >span {
            font-size: .22rem;
            color: #999;
            >span {
              color: #418bf6;
            }
          }
        }
        .brand-items {
          overflow: hidden;
          margin-bottom: .2rem;
          a {
            overflow: hidden;
            display: inline-block;
            color: #333;
            border-radius: .05rem;
            background: #fff;
            margin: .18rem .42rem .12rem 0;
            height: .78rem;
            float: left;
            &:nth-child(3n) {
              margin-right: 0;
            }
            &:active {
              color: #418bf6;
            }
            div {
              width: 1.9rem;
              height: .39rem;
              line-height: .39rem;
              text-align: left;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              &:nth-child(2) {
                font-size: .26rem;
                color: #666;
              }
            }
          }
        }
      }
    }
  }

</style>
