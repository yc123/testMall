<template>
  <div class="search-store-title">
    <span class="search-result">
      搜索 "
      <span style="color: #ff0101">{{keyword}}</span>
      "，为您找到
      <span v-text="goodsCount">1000</span>
      家店铺：
    </span>
    <div class="tab-filter" >
      <div class="fr">
        <div :class="{'active': activeType == '0'}" @click="defaultSearch"><a >综合排序</a></div>
        <!--<div :class="activeType == 1?'active':''"><a >库存</a></div>-->
        <!--<div :class="activeType == 2?'active':''"><a >销量</a></div>-->
        <!--<div :class="activeType == 3?'active':''"><a >信用</a></div>-->
        <div :class="{'active': activeType > '0'}">
          <select v-model="activeType" @change="onSelectTypeChange" class="form-control select-type select-adder">
            <option value="0">店铺类型</option>
            <option value="1">原厂</option>
            <option value="2">代理</option>
            <option value="3">经销</option>
            <!--<option value="">寄售</option>-->
          </select>
        </div>
        <!--<div class=""><a >所在地</a></div>-->
    </div>
      <!--<div class="off">-->
        <!--<a @click="showClick">-->
          <!--<span v-text="show?'收起':'展开'" style="margin-right: 10px;"></span>-->
          <!--<i v-show="!show" class="fa fa-angle-down"></i>-->
          <!--<i v-show="show" class="fa fa-angle-up"></i>-->
        <!--</a>-->
      <!--</div>-->
  </div>
  </div>
</template>
<script>
  export default {
    props: ['keyword'],
    data () {
      return {
        activeType: '0',
        paramType: 'AGENCY-DISTRIBUTION-ORIGINAL_FACTORY-CONSIGNMENT',
        show: true
      }
    },
    watch: {
      '$route.query.w': {
        handler: function (val) {
          this.activeType = '0'
          this.paramType = 'AGENCY-DISTRIBUTION-ORIGINAL_FACTORY-CONSIGNMENT'
        },
        immediate: false
      }
    },
    computed: {
      goodsCount () {
        if (this.$store.state.searchStore.searchStoreDetail.detail.data[0].stores) {
          return this.$store.state.searchStore.searchStoreDetail.detail.data[0].stores.totalElements || 0
        } else {
          return 0
        }
      }
    },
    methods: {
      defaultSearch: function () {
        this.activeType = '0'
        this.paramType = 'AGENCY-DISTRIBUTION-ORIGINAL_FACTORY'
        this.$store.dispatch('searchStore/searchStoreDetail',
          {
            page: 1,
            count: 4,
            keyword: this.$route.query.w,
            types: this.paramType,
            op: 'pageByType'})
      },
      onSelectTypeChange: function () {
        let type = this.activeType
        if (type === '1') {
          this.paramType = 'ORIGINAL_FACTORY'
        } else if (type === '2') {
          this.paramType = 'AGENCY'
        } else if (type === '3') {
          this.paramType = 'DISTRIBUTION'
        } else if (type === '0') {
          this.paramType = 'AGENCY-DISTRIBUTION-ORIGINAL_FACTORY'
        }
        this.$emit('typeAction', this.paramType)
        this.$store.dispatch('searchStore/searchStoreDetail',
          {
            page: 1,
            count: 4,
            keyword: this.$route.query.w,
            types: this.paramType,
            op: 'pageByType'})
      },
      showClick: function () {
        this.show = !this.show
        this.$emit('showAction', this.show)
      }
    }
  }
</script>
<style>
  .search-store-title {
    margin-top: 22px;
  }
  .search-store-title .select-type {
    min-width: 87px;
  }
  .tab-filter{
    width: 1190px;
    height: 40px;
    margin-top: 14px;
    line-height: 40px;
    background: #f4f8ff;
    border: 1px solid rgb( 231, 231, 231 );
    border-bottom: none;
  }
  .tab-filter .fl,.tab-filter .fr{
    float: left;
  }
  .tab-filter .fl{
    font-size: 14px;
  }
  .tab-filter .fr{
    max-width: 1050px;
    margin-left: 10px;
  }
  .tab-filter .fl span{
    font-size: 14px;
  }
  .tab-filter .fr div{
    float: left;
    margin-right: 10px;
  }
  .tab-filter .fr div.active a, .tab-filter .fr div.active select{
    border: #5078cb 1px solid;
    color: #5078cb;
  }
  .tab-filter .fr div.active select option {
    color: #000;
  }
  .tab-filter .fr a{
    display: inline-block;
    padding: 0 10px;
    border: #ccc 1px solid;
    line-height: 30px;
    font-size: 14px;
    text-align: center;
    color: #333;
    height: 30px;
    background: #fff;
  }
  .tab-filter .fr a i{
    /*margin-left: 5px;*/
  }
  .tab-filter .fr a:hover{
    border: #5078cb 1px solid;
    color: #5078cb;
  }
  .tab-filter .off{
    float: right;
    margin-right: 20px;
    color: black;
  }
  .tab-filter .off a:hover{
    border: none;
    color: #5078cb;
  }
  .tab-filter .off a{
    border: none;
    text-align: right;
    background: none;
    color: #333;
  }
  .tab-filter .off a i{
    font-size: 16px;
  }
  .tab-filter .fr .form-control{
    width: 85px;
    height: 30px;
    line-height: 30px;
    border-radius: 0;
    padding: 0 5px;
  }
</style>
