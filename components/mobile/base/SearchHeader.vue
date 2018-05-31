<template>
  <div class="search-content com-mobile-header">
    <a @click="goLastPage"><i class="iconfont icon-fanhui"></i></a>
    <input type="text" v-model="keyword" @input="getSimilarList()" :placeholder="placeholder" @keyup.13="onSearch()">
    <span @click="onSearch()"><i class="iconfont icon-sousuo"></i></span>
    <ul v-if="emptyStatus && type == 'supplier' && keyword && keyword !== '' && showSimilarWord">
      <template v-if="similarList.pCmpCode && similarList.pCmpCode.length">
        <li class="title text-ellipse">型号</li>
        <li class="text-ellipse" v-for="code in similarList.pCmpCode.slice(0, 4)" @click="onSearch(code.pCmpCode, 'pCmpCode', $event)">{{code.pCmpCode}}</li>
      </template>
      <template v-if="similarList.pBrandEn && similarList.pBrandEn.length">
        <li class="title text-ellipse">品牌</li>
        <li class="text-ellipse" v-for="brand in similarList.pBrandEn.slice(0, 4)" @click="onSearch(brand.nameCn, 'pBrandEn', $event)">{{brand.nameCn}}</li>
      </template>
      <template v-if="similarList.kind && similarList.kind.length">
        <li class="title text-ellipse">类目</li>
        <li class="text-ellipse" v-for="kind in similarList.kind.slice(0, 4)" @click="onSearch(kind.kind, 'kind', $event)">{{kind.kind}}</li>
      </template>
    </ul>
    <ul v-if="emptyStatus && type == 'default' && keyword && keyword !== '' && showSimilarWord">
      <template v-if="similarList.component && similarList.component.length">
        <li class="title text-ellipse">型号</li>
        <li class="text-ellipse" v-for="code in similarList.component.slice(0, 4)" @click="onSearch(code.code, 'code', $event)">{{code.code}}</li>
      </template>
      <template v-if="similarList.brand && similarList.brand.length">
        <li class="title text-ellipse">品牌</li>
        <li class="text-ellipse" v-for="brand in similarList.brand.slice(0, 4)" @click="onSearch(brand.nameCn, 'brand', $event)">{{brand.nameCn}}</li>
      </template>
      <template v-if="similarList.kind && similarList.kind.length">
        <li class="title text-ellipse">类目</li>
        <li class="text-ellipse" v-for="kind in similarList.kind.slice(0, 4)" @click="onSearch(kind.nameCn, 'kind', $event)">{{kind.nameCn}}</li>
      </template>
    </ul>
  </div>
</template>
<script>
  import {scrollTo} from '~utils/scroll'
  export default {
    props: {
      placeholder: {
        type: String,
        default: '请输入要查找的内容'
      },
      similarUrl: { // 联想词url
        type: String,
        default: '/search/similarKeywords'
      },
      type: { // 搜索类型
        type: String,
        default: 'default'
      },
      showSimilar: { // 是否显示联想词
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        keyword: '',
        similarList: {},
        showSimilarWord: false,
        searchKeyword: ''
      }
    },
    mounted () {
      this.$nextTick(() => {
        document.onclick = () => {
          this.showSimilarWord = false
        }
      })
    },
    computed: {
      emptyStatus () {
        let similarList = this.similarList
        if (this.type === 'supplier') {
          return (similarList.pCmpCode && similarList.pCmpCode.length) ||
            (similarList.pBrandEn && similarList.pBrandEn.length) ||
            (similarList.kind && similarList.kind.length)
        } else if (this.type === 'default') {
          return (similarList.component && similarList.component.length) ||
            (similarList.brand && similarList.brand.length) ||
            (similarList.kind && similarList.kind.length)
        }
      }
    },
    methods: {
      onSearch: function (key, type, e) {
        if (e) {
          e.stopPropagation()
        }
        if (key === this.searchKeyword || this.keyword === this.searchKeyword) {
          return
        }
        if (key) {
          this.keyword = key
          this.$emit('searchAction', {
            keyword: this.keyword,
            type: type
          })
        } else {
          this.$emit('searchAction', {
            keyword: this.keyword
          })
        }
        this.searchKeyword = this.keyword
        scrollTo('body', 10)
        this.showSimilarWord = false
      },
      getSimilarList: function () {
        if (this.showSimilar && this.keyword && this.keyword !== '') {
          this.$http.get(this.similarUrl, {params: {keyword: this.keyword}}).then(
            res => {
              this.similarList = res.data
              this.showSimilarWord = true
            }
          )
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .search-content {
    color: #333;
    input {
      margin: 0 0 0 .5rem;
      line-height: normal;
    }
    ul {
      width: 6.48rem;
      background: #fff;
      position: absolute;
      left: .6rem;
      top: .72rem;
      border: 1px solid #ccc;
      border-radius: .05rem;
      max-height: 4.5rem;
      overflow-y: auto;
      li {
        height: .6rem;
        line-height: .6rem;
        padding: 0 .1rem;
        font-size: .26rem;
        &.title {
          color: #666;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
          background: #f6f5f5;
        }
      }
    }
  }
</style>
