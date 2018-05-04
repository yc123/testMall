<template>
  <div class="search-box">
    <div class="input-group">
      <input v-model="keyword" type="text" class="search-input form-control input-primary"
             placeholder="型号/类目/品牌"
             @focus.stop.prevent="onFocus()"
             @blur.stop.prevent="onBlur()"
             @keyup.40="onSelectChange(1)"
             @keyup.38="onSelectChange(-1)"
             @keyup.13="onSearch()"/>
      <span class="input-group-btn" @click="onSearch()">
        <button class="btn btn-primary search-btn" type="button">搜&nbsp;索</button>
      </span>
    </div>
    <ul class="association" v-show="showAssociate">
      <li v-for="(k, index) in similarKeywords.data" class="item"
          :class="{'active': index==associate.activeIndex}"
          @click.stop.prevent="onAssociateClick(k)">{{ k }}
      </li>
    </ul>
    <div class="search-hot">
      <ul class="list-untyled">
        <li class="item item-first">热门搜索</li>
        <li class="item" v-for="w in hotwords">
          <nuxt-link :to="w.url" target="_blank">{{ w.name }}</nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'search-box',
    data () {
      return {
        keyword: '',
        associate: {
          show: false,
          activeIndex: null
        }
      }
    },
    computed: {
      similarKeywords () {
        return this.$store.state.search.keywords
      },
      showAssociate () {
        return this.associate.show && this.similarKeywords.data && this.similarKeywords.data.length
      }
    },
    props: {
      hotwords: {
        type: Array,
        default () {
          return [{
            name: 'SCT2080KEC',
            url: '/product/component/1100400300009990'
          }, {
            name: '电池组',
            url: '/product/kinds/346'
          }, {
            name: 'Vishay',
            url: '/product/brand/30327265e42a871be050007f01003d96'
          }, {
            name: 'Panasonic Battery',
            url: '/product/brand/30327265e4e7871be050007f01003d96'
          }]
        }
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
      onFocus () {
        this.associate.show = true
      },
      onBlur () {
        this.associate.show = false
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
      },
      searchKeywords () {
        this.associate.show = true
        this.$store.dispatch('searchKeywords', { keyword: this.keyword })
      },
      onSearch () {
        if (this.keyword) {
          this.associate.show = false
          this.$store.dispatch('resetSearchKeywords')
          this.$router.push({path: '/search?w=' + encodeURIComponent(this.keyword)})
        }
      },
      onAssociateClick (word) {
        this.keyword = word
        this.onSearch()
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';
  .search-box {
    width: 470px;
    height: 40px;
    position: relative;

    .search-input, .search-btn {
      height: 40px;
      border-width: 2px;
    }

    .search-btn {
      font-size: 16px;
      width: 78px;
    }

    .search-hot {
      .item {
        display: inline-block;
        font-size: $font-size-small;
        margin-right: $pad;

        &.item-first {
          color: $red;
        }
      }
    }

    .association {
      position: absolute;
      left: 0;
      top: 100%;
      right: 79px;
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
    }
  }
</style>
