<template>
  <div class="main-search" @touchstart="cancelFocus" @click="setShowSearchType(false)" id="main-search">
    <div class="main-search-header">
      <div class="options" @click="setShowSearchType(!showSearchType, $event)">
        {{searchType == 'product' ? '产品' : '店铺'}}
        <i></i>
        <ul v-if="showSearchType">
          <li @click="setSearchType(searchType == 'product' ? 'store' : 'product', $event)">{{searchType == 'product' ? '店铺' : '产品'}}</li>
        </ul>
      </div>
      <input type="text" id="search-box" v-model="keyword" @keyup.13="onSearch()">
      <span @click="onSearch()">搜索</span>
      <a @click="cancelSearch">取消</a>
    </div>
    <ul class="associate-list" v-show="associate.show">
      <li @click="onAssociateClick(similar)" v-for="similar in similarKeywords.all">
        <i class="icon-sousuo iconfont"></i>
        <span>{{similar}}</span>
      </li>
      <li @click="onAssociateClick(keyword)">查找“{{keyword}}”</li>
    </ul>
    <div class="hot-history" v-show="!associate.show">
      <div class="search-history" v-if="searchHistory && searchHistory.length > 0">
        <p>历史搜索<i class="iconfont icon-lajitong" @click="deleteHistory"></i></p>
        <ul>
          <li v-for="item in searchHistory" @click="onSearch(item)" v-if="item.keyword && item.keyword.trim().length">
            <a>{{item.keyword}}</a>
          </li>
        </ul>
      </div>
      <div class="search-hot">
        <img src="/images/mobile/@2x/home/hot-search.png" alt="">
        <ul>
          <li v-for="hotword in hotwords">
            <a :href="hotword.url" v-text="hotword.name"></a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'home',
    data () {
      return {
        keyword: '',
        associate: {
          show: false
        },
        searchType: 'product',
        showSearchType: false
      }
    },
    props: {
      hotwords: {
        type: Array,
        default () {
          return [
            {name: '深圳华商龙', url: 'https://www.usoftmall.com/mobile/shop/worldshine'},
            {name: 'DSP1-DC5V-F', url: 'https://www.usoftmall.com/mobile/brand/componentDetail/0900300200000669'},
            {name: 'Vishay', url: 'https://www.usoftmall.com/mobile/brand/30327265e42a871be050007f01003d96'},
            {name: 'Panasonic', url: 'https://www.usoftmall.com/mobile/brand/30327265e47d871be050007f01003d96'},
            {name: 'Taiyo Yuden', url: 'https://www.usoftmall.com/mobile/brand/30327265e4be871be050007f01003d96'},
            {name: 'AE324FB5PN', url: 'https://www.usoftmall.com/mobile/brand/componentDetail/0900502200684613'}
            ]
        }
      }
    },
//    filters: {
//      similarFilter: function ([key, keyword]) {
//        console.log(keyword)
//        let index = key.indexOf(keyword)
//        if (index !== -1) {
//          key = key.substring(0, index) + '<strong>' + key.substr(index, keyword.length) + '</strong>' + key.substring(index + keyword.length, key.length)
//        }
//        return key
//      }
//    },
    methods: {
      onSearch (item) {
        if (item) {
          this.keyword = item.keyword
          if (item.type === 'SEARCH_STORE') {
            this.$router.push('/mobile/shop?keyword=' + encodeURIComponent(this.keyword))
          } else if (item.type === 'SEARCH_PRODUCT') {
            this.$router.push('/mobile/search?w=' + encodeURIComponent(this.keyword))
          }
        } else {
          if (this.keyword) {
            if (this.searchType === 'product') {
              this.$router.push('/mobile/search?w=' + encodeURIComponent(this.keyword))
            } else if (this.searchType === 'store') {
              this.$router.push('/mobile/shop?keyword=' + encodeURIComponent(this.keyword))
            }
          }
        }
      },
      onChange () {
        if (!this.keyword) {
          this.associate.show = false
          this.$store.dispatch('resetSearchKeywords')
        } else {
          this.searchKeywords()
        }
        if (this.click_flag) {
          this.associate.show = false
        }
      },
      searchKeywords () {
        if (this.searchType === 'product') {
          this.$store.dispatch('searchKeywords', { keyword: this.keyword })
          this.associate.show = true
        }
      },
      onAssociateClick (word) {
        this.keyword = word
        this.onSearch()
      },
      cancelSearch: function () {
        this.$emit('cancelSearchAction')
      },
      cancelFocus: function () {
        // document.getElementById('search-box').blur()
      },
      deleteHistory () {
        this.$http.delete('/search/searchHistory').then(response => {
          this.$store.dispatch('searchData/getSearchHistory')
        })
      },
      setSearchType (type, $event) {
        $event.stopPropagation()
        this.searchType = type
        this.setShowSearchType(false)
        this.associate.show = false
      },
      setShowSearchType (flag, e) {
        if (e) {
          e.stopPropagation()
        }
        this.showSearchType = flag
      }
    },
    created () {
      this.$store.dispatch('resetSearchKeywords')
    },
    mounted () {
      document.getElementById('search-box').focus()
      let height = window.innerHeight
      window.onresize = function () {
        if (window.innerHeight < height) {
          document.getElementById('main-search').style.bottom = (window.innerHeight - height) / (document.documentElement.clientWidth / 750) + 'rem'
        } else {
          document.getElementById('main-search').style.bottom = 0
        }
      }
    },
    watch: {
      'keyword': function (val, oldVal) {
        let keywords = this.similarKeywords.data
        if (!keywords || !keywords.length) {
          this.onChange()
        }
      }
    },
    computed: {
      similarKeywords () {
        return this.$store.state.search.keywords.data
      },
      searchHistory () {
        return this.$store.state.searchData.searchHistory.searchHistory.data
      }
    }
  }
</script>
<style lang="scss" scoped>
  .main-search {
    background: #fff;
    width: 100%;
    position: fixed;
    z-index: 1000;
    top: 0;
    bottom: 0;
    .main-search-header {
      position: relative;
      height: .88rem;
      background: #3e82f5;
      padding-left: .3rem;
      line-height: .88rem;
      margin-top: 0;
      z-index: 1;
      input {
        width: 4.88rem;
        height: .62rem;
        line-height: .62rem;
        font-size: .26rem;
        color: #999;
        padding-left: 1.26rem;
        border: .04rem solid #fff;
        background: #fff;
        outline: none;
        border-radius: 0;
        float: left;
        margin-top: .12rem;
        -webkit-appearance: none;
        border-top-left-radius: .14rem;
        border-bottom-left-radius: .14rem;
      }
      span {
        display: inline-block;
        width: 1.02rem;
        text-align: center;
        height: .62rem;
        line-height: .62rem;
        color: #366df3;
        font-size: .28rem;
        margin-left: .02rem;
        border-top-right-radius: .14rem;
        border-bottom-right-radius: .14rem;
        background: #fff;
        float: left;
        margin-top: .12rem;
      }
      a {
        font-size: .28rem;
        color: #fff;
        margin-left: .2rem;
      }
      .options {
        position: absolute;
        left: .3rem;
        width: 1.25rem;
        padding-left: .25rem;
        background: url(/images/mobile/@2x/search/select-arrow-blue.jpg) no-repeat;
        background-size: .14rem .12rem;
        background-position: .92rem .36rem;
        color: #3e82f5;
        font-size: .3rem;
        i {
          height: .46rem;
          width: .01rem;
          background: #eceef0;
          display: block;
          float: right;
          margin-top: .18rem;
        }
        ul {
          position: absolute;
          left: 0;
          top: .54rem;
          z-index: -1;
          li {
            width: 1.25rem;
            height: .99rem;
            border-radius: .05rem;
            background: #666;
            color: rgba(255, 255, 255, 0.89);
            text-align: center;
            line-height: 1.2rem;
            font-size: .3rem;
          }
        }
      }
    }
    .associate-list {
      background: #fff;
      li {
        height: 0.7rem;
        line-height: .9rem;
        margin: 0 .45rem;
        border-bottom: .04rem solid #f1f0f0;
        i {
          font-size: .36rem;
          margin-right: .24rem;
          color: #ddd;
        }
        span {
          color: #999;
          font-size: .28rem;
          line-height: .58rem;
          height: .58rem;
          display: inline-block;
        }
        &:active, &:hover {
          background: #eee;
        }
        &:last-child {
          text-align: center;
          font-size: .3rem;
          color: #3976f4;
          border-bottom: none;
          &:active, &:hover {
            background: #fff;
          }
        }
      }
    }
    .hot-history {
      .search-history {
        padding-left: .51rem;
        padding-top: .38rem;
        >p {
          font-size: .3rem;
          color: #333;
          i {
            font-size: .3rem;
            float: right;
            margin-right: 0.4rem;
          }
        }
        ul {
          text-align: left;
          margin-top: .26rem;
          li {
            display: inline-block;
            max-width: 2.83rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0 .1rem .1rem 0;
            background: #f2f6ff;
            height: .56rem;
            line-height: .56rem;
            padding: 0 .12rem;
            a {
              font-size: .3rem;
              color: #666;
            }
          }
        }
      }
      .search-hot {
        text-align: center;
        margin-top: .3rem;
        >img {
          width: 2.56rem;
          height: .67rem;
        }
        ul {
          text-align: left;
          padding-left: .51rem;
          margin-top: .31rem;
          li {
            display: inline-block;
            /*max-width: 2.83rem;*/
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 0 .1rem .1rem 0;
            background: #fef1eb;
            height: .56rem;
            line-height: .56rem;
            padding: 0 .12rem;
            a {
              font-size: .3rem;
              color: #666;
            }
            &:nth-child(1) {
              a {
                color: #fc5708;
              }
            }
          }
        }
      }
    }
  }
</style>
