<template>
  <div class="search-box" :class="{'search-box2': !SelectItem}">
    <div class="input-group">
      <select v-model="searchType" class="form-control select-type select-adder" v-if="SelectItem">
        <option value="product">产品</option>
        <option value="store">店铺</option>
      </select>
      <input v-model="keyword" type="text" class="search-input form-control input-primary"
             :placeholder="searchType === 'product' ? '型号/类目/品牌' : '店铺名称'"
             @focus.stop.prevent="onFocus()"
             @blur.stop.prevent="onBlur()"
             @keyup.40="onSelectChange(1)"
             @keyup.38="onSelectChange(-1)"
             @keyup.13="onSearch()"/>
      <span class="input-group-btn" @click="onSearch()" style="z-index: 10">
        <button class="btn btn-primary search-btn" type="button" :class="{'Isblue':!SelectItem}">搜&nbsp;索</button>
      </span>
    </div>
    <ul class="association" :class="{'association2': !SelectItem}" v-show="showAssociate && searchType == 'product'"
        @mouseenter="associate.focus=true" @mouseleave="associate.focus=false">
      <li v-if="similarKeywords.data.component && similarKeywords.data.component.length > 0" class="similar-title">型号：</li>
      <li v-for="(k, index) in similarKeywords.data.component" class="item"
          :class="{'active': index==associate.activeIndex}"
          @click.stop.prevent="onAssociateClick(k.code)">{{ k.code }}
      </li>
      <li v-if="similarKeywords.data.brand && similarKeywords.data.brand.length > 0" class="similar-title">品牌：</li>
      <li v-for="(k, index) in similarKeywords.data.brand" class="item"
          :class="{'active': index==associate.activeIndex}"
          @click.stop.prevent="onAssociateClick(isCnStart() ? k.nameCn : k.nameEn)">{{ isCnStart() ? k.nameCn : k.nameEn }}
      </li>
      <li v-if="similarKeywords.data.kind && similarKeywords.data.kind.length > 0" class="similar-title">类目：</li>
      <li v-for="(k, index) in similarKeywords.data.kind" class="item"
          :class="{'active': index==associate.activeIndex}"
          @click.stop.prevent="onAssociateClick(k.nameCn)">{{ k.nameCn }}
      </li>
    </ul>
    <div class="search-hot" v-if="SelectItem">
      <ul class="list-untyled">
        <li class="item item-first">热门搜索</li>
        <li class="item" v-for="w in hotBrand" v-if="ifFloorsHotSearchInValid">
          <nuxt-link :to="'/product/brand/' + w.uuid" target="_blank">{{ w.nameEn }}</nuxt-link>
        </li>
        <li class="item" v-for="w in hotDevice" v-if="ifFloorsHotSearchInValid">
          <nuxt-link :to="'/product/component/' + w.uuid" target="_blank">{{ w.code }}</nuxt-link>
        </li>
        <li class="item" v-if="!ifFloorsHotSearchInValid && index > 0" v-for="(w, index) in hotSearchData.items">
          <a :href="w.hrefUrl" target="_blank">{{w.body}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'search-box',
    props: {
      SelectItem: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        keyword: '',
        associate: {
          focus: false,
          show: false,
          activeIndex: null
        },
        click_flag: false,
        searchType: 'product'
      }
    },
    computed: {
      hotDevice () {
        return this.$store.state.hotSearchDevice.hot.data
      },
      hotBrand () {
        return this.$store.state.hotSearchBrand.hot.data
      },
      similarKeywords () {
        return this.$store.state.search.keywords
      },
      showAssociate () {
        return this.keyword &&
          this.associate.show &&
          this.similarKeywords.data &&
          (this.similarKeywords.data.brand || this.similarKeywords.data.component || this.similarKeywords.data.kind)
      },
      hotSearchData () {
        let list = this.$store.state.floor.list_v3.data
        let obj = {}
        if (list && list.length) {
          for (let i = 0; i < list.length; i++) {
            if (list[i].floorNumber === 2) {
              obj = list[i]
            }
          }
//          obj = list.find(item => item.floorNumber === 2) || {}
        }
        return obj
      },
      ifFloorsHotSearchInValid () {
        let obj = this.hotSearchData
        let tmp = false
        if (obj.items && obj.items.length) {
          for (let i = 0; i < obj.items.length; i++) {
            if (!obj.items[i].body || obj.items[i].body === '') {
              tmp = obj.items[i]
              break
            }
          }
//          let result = obj.items.find(item => !item.body || item.body === '') || true
          return tmp || true
        }
        return true
      }
    },
    watch: {
      'keyword': {
        handler (val, oldVal) {
          let keywords = this.similarKeywords.data
          if (!keywords || !keywords.length || this.associate.activeIndex === null || val !== keywords[this.associate.activeIndex]) {
            this.onChange()
          }
        }
      }
    },
    methods: {
//      onSelectTypeChange: function (e) {
//        let type = e.target[e.target.selectedIndex].innerHTML
//        if (type === '产品') {
//          this.searchType = 'product'
//        } else if (type === '店铺') {
//          this.searchType = 'store'
//        }
//      },
      onFocus () {
        this.associate.show = true
      },
      onBlur () {
        this.associate.show = this.associate.focus
      },
      onSelectChange (count) {
        let keywords = this.similarKeywords.data
        if (keywords && keywords.length) {
          let index = this.associate.activeIndex
          if (index === null) {
            index = -1
          }
          index += count
          if (index >= keywords.length) {
            index = 0
          } else if (index < 0) {
            index = keywords.length - 1
          }
          this.associate.activeIndex = index
          this.keyword = keywords[index]
        }
      },
      onChange () {
        this.associate.activeIndex = null
        if (!this.keyword) {
          this.associate.show = false
          this.$store.dispatch('resetSearchKeywords')
        } else {
          this.searchKeywords()
        }
        if (this.click_flag) {
          this.associate.show = false
          this.click_flag = false
        }
      },
      searchKeywords () {
        if (this.searchType === 'product') {
          this.associate.show = true
          this.$store.dispatch('searchKeywords', { keyword: this.keyword })
        }
      },
      onSearch () {
        document.getElementsByClassName('search-input')[0].blur()
        if (this.keyword) {
          this.associate.show = false
          this.$store.dispatch('resetSearchKeywords')
          if (this.searchType === 'product') {
            this.$router.push({path: '/search?w=' + encodeURIComponent(this.keyword)})
          } else if (this.searchType === 'store') {
            this.$router.push({path: '/searchStore?w=' + encodeURIComponent(this.keyword)})
          }
        }
      },
      onAssociateClick (word) {
        this.click_flag = true
        this.keyword = word
        this.onSearch()
      },
      isCnStart () {
        if (this.keyword && this.keyword.length > 0) {
          return this.keyword.charCodeAt(0) > 255
        }
      }
    },
    created () {
      this.$store.dispatch('resetSearchKeywords')
    }
  }
</script>
<style lang="scss" scoped type="text/scss">
  @import '~assets/scss/variables';
  .form-control{
    border-radius: 0;
  }
  .search-box {
    width: 520px;
    height: 40px;
    position: relative;
    .search-input{
      width: 372px;
      float: left;
    }
    .search-input, .search-btn {
      height: 40px;
      border-width: 2px;
    }
    .select-type{
      width: 70px;
      float: left;
      border: #5078cb 2px solid;
      height: 40px;
      border-right: none;
      margin-right: -1px;
    }
    .search-btn {
      font-size: 16px;
      width: 79px;
      border-radius: 0;
    }

    .Isblue{
      vertical-align: middle;
      display: inline-block;
      text-align: center;
      width: 72px;
      border-left: 0;
      background: #d3e1fc;
      color: #5078cb;
      text-align: center;
      font-size: 14px;
      position: absolute;
      right: 0;
      top: 0;
      &:hover {
        background: #d2272d;
        color: #fff;
        transition: all .3s;
      }
    }
    .search-hot ul{
      line-height: 12px;
    }
    .search-hot ul li a{
      color: #838383;
    }
    .search-hot {
      margin-top:5px;
      .item {
        display: inline-block;
        max-width:22%;
        text-align: center;
        vertical-align: middle;
        font-size: $font-size-small;
        padding-right: $pad;
        a{
          display:block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &.item-first {
          width:12%;
          color: $red;
        }
      }
    }

    .association {
      position: absolute;
      left: 69px;
      top: 100%;
      right: 81px;
      background: $white;
      border: $border;
      border-top-width: 0;
      z-index: 21;

      .item {
        padding: 0 15px;
        line-height: 30px;
        cursor: pointer;

        &.active {
          background-color: $dark-bg;
        }
        &:hover {
          background-color: $grey-bg;
        }
      }
      .similar-title {
        padding: 0 15px;
        line-height: 30px;
        font-size: 16px;
        font-weight: bold;
        border-top: 1px solid #ccc;
        cursor: default;
      }
    }
    .association2 {
      left: 2px;
      right: 71px
    }
  }

  .search-box2 {
    width: 442px;
  }
</style>
