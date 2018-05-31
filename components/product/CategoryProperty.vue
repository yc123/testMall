<template>
  <div class="main-content container">
    <div class="selector" v-if="kind && !kind.leaf">
      <div class="sl-wrap" >
        <div class="sl-key">
          <span>分类：</span>
        </div>
        <div class="sl-value">
          <ul class="list-inline">
            <li v-for="c in children" :title="c.nameCn">
              <nuxt-link :to="`/product/kind/${c.id}`">{{c.nameCn}}</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="div-table" split-dropdown v-if="kind && kind.leaf">
      <div class="div-table-left">
        <table class="table table-bordered">
          <thead >
          <tr>
            <td class="td-width dropdown">
              <span  class="dropdown-toggle dropdown-back" data-toggle="dropdown">品牌<span class="fa fa-angle-down td-icon"></span></span>
              <ul class="dropdown-menu parameter-selection-ul" role="menu" aria-labelledby="dropdownMenu1" style="top: 38px;">
                <!--orderBy:'nameCn'-->
                <li v-for="b in brands"><a @click="selectBrand(b)"><span>{{b.nameCn}}</span></a></li>
              </ul>
            </td>
          </tr>
          </thead>
          <tbody>
          <tr class="tr-brand">
            <td class="td-brand" style="vertical-align: middle;">
              <div class="sl-selected" v-if="selectedBrand.nameCn" @click="delBrand()">
                <a class="text-num">{{selectedBrand.nameCn}}</a>
                <span><i class="fa fa-close"></i></span>
              </div>
              <div v-if="!selectedBrand.nameCn">
                请选择品牌
              </div>
            </td>
          </tr>
          </tbody>
      </table>
    </div>
    <div class="div-table-right" dropdown-scroll>
        <table class="table table-bordered" style="table-layout:fixed;">
          <thead>
          <tr>
            <td v-for="(pro, index) in properties" class="list-menu td-width word-break" split-dropdown-trigger="pro.id"
                @mouseenter="use_exp_list(pro,index)" @mouseleave="hide_exp_list()">
              <span class="dropdown-toggle dropdown-back" data-toggle="dropdown"><span>{{pro.property.labelCn}}</span><span class="fa fa-angle-down td-icon"></span></span>
            </td>
          </tr>
          </thead>
          <tbody>
          <tr v-if="hasProperties" class="tr-properties">
            <td v-for="pro in properties" class="td-properties" style="vertical-align:middle;" v-bind="selectedProduct">
 								<span class="sl-selected" @click="selectProperty(pro, pro.propertyId)" v-if="!isDel(pro.propertyId)">
 									<a class="text-num" v-text="selectedProduct['a' + pro.propertyId].value" style="color: #5078CB"></a>
									<span><i class="fa fa-close"></i></span>
 								</span>
            </td>
          </tr>
          <tr class="properties-hint-tr" v-if="!hasProperties">
            <td :colspan="properties.length" class="properties-hint-td">
              <div>请选择筛选属性</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
          <ul v-show="list_exp_flag" @mouseenter="show_exp_list()" @mouseleave="hide_exp_list()" class="parameter-selection-ul drop-down-list" role="menu" aria-labelledby="dropdownMenu1">
            <li v-for="item in selectedProperties.values">
              <a @click="selectPropertyValue(item, selectedProperties.propertyId)" class="a-color">
                <span>{{item.value}}</span>
              </a>
            </li>
          </ul>
    </div>
  </div>
</template>

<script>
  function compare (propertyName) {
    return function (object1, object2) {
      var value1 = object1[propertyName]
      var value2 = object2[propertyName]
      if (value1 > value2) {
        return 1
      } else if (value1 < value2) {
        return -1
      } else {
        return 0
      }
    }
  }
  export default {
    layout: 'main',
    data () {
      return {
        hasProperties: false,
        selectedBrand: {
          nameCn: null
        },
        selectedProperties: {},
        list_exp_flag: false,
        selectedProduct: {},
        JSONObj: {}
      }
    },
    computed: {
      kind () {
        return this.$store.state.product.kind.kindsParentWithBother.data[this.$store.state.product.kind.kindsParentWithBother.data.length - 1]
      },
      children () {
        return this.$store.state.product.kind.children.data
      },
      properties () {
        let arr = this.$store.state.product.kind.kindProperty.data
        for (let i = 0; i < arr.length; i++) {
          this.selectedProduct[ 'a' + arr[i].propertyId ] = ''
        }
        return arr
      },
      brands () {
        return this.$store.state.product.kind.brands.data
      }
    },
    methods: {
      selectBrand (item) {
        this.selectedBrand = item
        this.$emit('loadCmpGoodsByBrandEvent', item.id, JSON.stringify(this.JSONObj))
      },
      delBrand () {
        this.selectedBrand = {}
        this.$emit('loadCmpGoodsByBrandEvent', null, JSON.stringify(this.JSONObj))
      },
      selectProperty (item, propertyId) {
        this.selectedProduct['a' + propertyId] = ''
        delete this.JSONObj[propertyId]
        this.$emit('loadCmpGoodsByTypeEvent', JSON.stringify(this.JSONObj), this.selectedBrand.id)
        this.hasProperties = this.isempty(this.selectedProduct)
        this.list_exp_flag = true
        this.list_exp_flag = false
      },
      isempty (obj) {
        for (let attr in obj) {
          if (obj[attr] !== '') {
            return true
          }
        }
        return false
      },
      isDel (propertyId) {
        return this.selectedProduct['a' + propertyId] === ''
      },
      selectPropertyValue (item, propertyId) {
        this.hasProperties = true
        this.selectedProduct['a' + propertyId] = item
        this.JSONObj[propertyId] = item.value
        this.$emit('loadCmpGoodsByTypeEvent', JSON.stringify(this.JSONObj), this.selectedBrand.id)
        this.list_exp_flag = false
      },
      use_exp_list: function (pro, index) {
        this.selectedProperties = pro
        this.selectedProperties.values.sort(compare('value'))
        let dom = document.getElementsByClassName('drop-down-list')[0]
        let list = document.getElementsByClassName('list-menu')[index]
        let content = document.getElementsByClassName('container')[0]
        let left = list.getBoundingClientRect().left - content.offsetLeft - 1.5
        dom.setAttribute('style', 'left: ' + left + 'px')
        this.list_exp_flag = true
      },
      hide_exp_list: function () {
        this.list_exp_flag = false
      },
      show_exp_list: function () {
        this.list_exp_flag = true
      }
    }
  }
</script>

<style scoped>
  .clear, .clr {
    clear: both;
  }
  /* breadcrumbs */
  .breadcrumbs {
    margin-top: 20px;
  }

  .breadcrumbs ul.list-unstyled.list-inline {
    margin-left: 0px;
  }
  .breadcrumbs ul.list-inline.list-unstyled li.crumb-item {
    position: relative;
    padding-left: 0px;
    padding-right: 0px;
    padding-bottom: 1px;
    height: 32px;
    line-height: 30px;
    background: #fff;
    border: solid 1px #6493ff;
  }

  .breadcrumbs ul li.crumb-item-angle {
    margin-left: -5px;
  }

  .breadcrumbs ul li.crumb-item>a {
    display: inline-block;
    width: 100%;
    height: 100%;
    padding-left: 15px;
    padding-right: 15px;
    cursor: pointer;
    text-decoration: none;
    color: #323232;
    font-size: 16px;
  }
  .breadcrumbs ul li.crumb-item:hover>a span,.breadcrumbs ul li.crumb-item:hover>a i{
    color: #5078cb;
  }
  .breadcrumbs ul li.crumb-item>a i{
    margin-right: 10px;
  }
  .breadcrumbs ul li.crumb-item:hover>a i{
    transform: rotate(-180deg);
  }
  .breadcrumbs ul li.crumb-item .angle {
    position: absolute;
    left: -6px;
    top: 50%;
    margin-top: -5px;
    height: 10px;
    width: 10px;
    border-bottom: 1px solid #6493ff;
    border-left: 1px solid #6493ff;
    background: white;
    transform: rotate(45deg);
    -ms-transform: rotate(45deg); 	/* IE 9 */
    -moz-transform: rotate(45deg); 	/* Firefox */
    -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
    -o-transform: rotate(45deg); 	/* Opera */
    z-index: 14;
  }

  .breadcrumbs ul li.crumb-item .crumb-drop {
    position: absolute;
    display: none;
    left: -1px;
    top: 30px;
    border: #6493ff 1px solid;
    background: #fff;
    z-index: 100;
    width: 200px;
  }

  .breadcrumbs ul li.crumb-item .crumb-drop li {
    line-height: 20px;
  }
  .breadcrumbs ul li.crumb-item .crumb-drop li a{
    font-size: 12px;
  }
  li{
    list-style: none;
  }
  .breadcrumbs ul li.crumb-item:hover .crumb-drop {
    display: block;
  }

  .breadcrumbs ul li.crumb-item:hover>a {
    border-color: #f50;
    background: #ffffff;
    z-index: 101;
  }
  .breadcrumbs ul li.crumb-item a{
    color: #323232;
  }
  .breadcrumbs ul li.crumb-item a:hover{
    color: #5078cb;
  }
  .kind-count-line {
    line-height: 25px;
    height: 25px;
    color: #fff;
    font-weight: 600;
    background: #7bb4e1;
  }

  .kind-count-line .kind-count {
    display: inline-block;
    padding: 0 15px;
    background-color: #f39800;
  }

  /* sl_warp */
  .main-content .selector {
    color: #666;
    border: 1px solid #ddd;
    border-top: #6493ff 2px solid;
    margin-bottom: 30px;
    padding: 10px 0;
  }

  .main-content .sl-wrap {
    position: relative;
    line-height: 22px;
    padding: 5px 0;
  }

  .main-content .sl-wrap .sl-key {
    float: left;
    width: 100px;
    padding: 0 8px;
  }

  .main-content .sl-wrap .sl-key>span {
    color: #323232;
    font-size: 14px;
  }

  .main-content .sl-wrap .sl-value {
    margin-left: 110px;
    overflow-y: auto;
  }

  .main-content .sl-wrap .sl-value ul li a{
    color: #323232;
    font-size: 14px;
  }
  .main-content .sl-wrap .sl-value ul li a:hover{
    color: #5078cb;
  }
  .main-content .sl-wrap .sl-value .sl-selected {
    display: inline-block;
    position: relative;
    padding-left: 10px;
    padding-right: 30px;
    border: 1px solid #ccc;
    cursor: pointer;
  }

  .main-content .sl-wrap .sl-value .sl-selected a {
    color: #666;
    text-decoration: none;
  }

  .main-content .sl-wrap .sl-value .sl-selected:HOVER {
    border: 1px solid #f50;
  }

  .main-content .sl-wrap .sl-value .sl-selected:HOVER a {
    color: #f50;
  }

  .main-content .sl-wrap .sl-value .sl-selected span {
    display: inline-block;
    position: absolute;
    right: 0px;
    top: 0px;
    height: 100%;
    width: 20px;
    text-align: center;
    background: #ccc;
    color: #fff;
  }

  .main-content .sl-wrap .sl-value .sl-selected:HOVER span {
    background: #f50;
  }

  .main-content .sl-wrap .sl-value ul {
    margin-bottom: 0;
  }

  .main-content .sl-wrap .sl-value ul.list-inline li {
    width: 16.6666%;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }

  .main-content .sl-wrap .sl-value ul, .main-content .sl-set .sl-value ul{
    min-height: 25px;
  }

  .main-content .sl-wrap .sl-ext {
    position: absolute;
    top: 0px;
    right: 0px;
    width: 80px;
  }

  .main-content .sl-more {
    position: relative;
    top: -1px;
    line-height: 30px;
    text-align: center;
    border-top: 1px solid #DDD;
  }

  .main-content .sl-more a {
    position: relative;
    display: inline-block;
    margin-top: -1px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px 0 10px;
    border-width: 1px;
    border-style: solid;
    border-color: #FFF #DDD #DDD;
    background: #fff;
    cursor: pointer;
    -webkit-transition: border-color .15s ease-in-out;
    -moz-transition: border-color .15s ease-in-out;
    transition: border-color .15s ease-in-out;
  }

  .main-content .sl-more:hover {
    border-top-color: #f39800;
  }

  .main-content .sl-more:hover a {
    color: #f39800;
    border-color: #FFF #f39800 #f39800;
    text-decoration: none;
  }

  .main-content .sl-more a:focus {
    text-decoration: none;
    color: #f39800;
  }

  .main-content .sl-set {
    position: relative;
    line-height: 30px;
    font-size: 14px;
  }

  .main-content .sl-set .sl-key {
    float: left;
    width: 100px;
  }

  .main-content .sl-set .sl-value {
    margin-left: 110px;
  }

  .main-content .content {
    position: relative;
  }

  .main-content .content .total {
    position: relative;
    margin-bottom: 10px;
    line-height: 30px;
    height: 30px;
    background: #7bb4e1;
    color: white;
    font-weight: 700;
  }

  .main-content .info {
    line-height: 24px;
  }

  .main-content .info .title {
    display: inline-block;
    width: 100px;
    font-family: 'microsoft yahei';
    font-weight: 600;
  }

  .main-content .info .content {
    font-size: 14px;
  }

  .main-content .operate {
    margin-bottom: 5px;
  }

  .main-content .operate .btn {
    width: 100px;
    text-align: left;
  }

  .main-content .content .view_all:hover {
    text-decoration: none;
    color: #f50;
    background: #f5f5f5
  }

  .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th,
  .table>thead>tr>td, .table>thead>tr>th {
    padding: 10px 5px;
  }

  .total-content {
    background-color: #f39800;
    padding-left: 10px;
  }

  .btnactive {
    background-color: #f39800;
  }

  .reserve {
    color: white;
    font-weight: 500;
  }

  .pagging .pagging-count {
    padding-left: 10px;
    padding-right: 10px;
  }

  .pagging .pagging-count:HOVER {
    background: #4D7BA5;
    cursor: pointer;
  }

  .pagging .pagging-count a {
    color: white !important;
    text-decoration: none !important;
  }
  .parameter-selection > div:first-child {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 8px;
    transform: translateY(-50%);
  }
  .parameter-selection div:last-child {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 40px;
    transform: translateY(-50%);
  }
  .div-table{
    width:1190px;
    height:120px;
    border-top: #6493ff 2px solid;
  }
  .div-table-left{
    width:135px;
    float:left;
    text-align: center;
  }
  .parameter-selection-ul{
    min-height: 80px;
    max-height: 176px;
    overflow: scroll;
    overflow-x:hidden;
  }
  .div-table-right{
    float:left;
    height:120px;
    width:1055px;
    overflow-x:auto;
    overflow-y:hidden;
    border:1px solid #DBDBDB;
  }
  .div-table-right .table{
    margin-bottom: 0;
  }
  .div-table-right table thead tr td{
    width: 140px;
    text-align: center;
    vertical-align: middle;
    padding: 0;
  }
  .text-hidden {
    text-overflow:ellipsis;
    overflow:hidden;
    white-space: nowrap;
  }
  .text-hidden:hover{
    overflow: visible;
  }
  .td-width{
    color: #323232;
    font-size: 14px;
  }
  .td-icon{
    font-size:18px;
  }
  .tr-brand{
    height:80px;
    vertical-align: middle;
  }
  .tr-properties{
    height:65px;
  }
  .td-brand,.td-properties{
    line-height: 20px;
    word-wrap : break-word;
    word-break : break-all;
  }
  thead tr {
    background: linear-gradient(rgb(93, 134, 220), rgb(12, 53, 136));
    color: #fff;
    height: 48px;
  }
  .table>thead>tr>th{
    padding:5px 5px;
  }

  .dropdown:hover>.dropdown-back {
    border-color: transparent;
    background-color: transparent;
  }
  /* scroll */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background: #ededed;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 5px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #959595;
  }

  .container {
    position: relative;
    width: 1190px;
  }
  .main-content .wrap {
    position: relative;
    width: 500px;
    border: 1px solid #ccc;
    overflow-x: auto;
  }
  .table {
    display: table;
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    position: relative;
    left: 0px;
  }
  .tr, .th {
    display: table-row;

  }
  .th {
    font-weight: 600;
  }
  .td {
    display: table-cell;
    padding: 5px;
    width: 100px;
    text-align: center;
    border: 1px solid #ddd;
  }
  .dropdown-menu {
    display: none;
    position: absolute;
    top: 100%;
    background: #fff;
    text-align: center;
    cursor: pointer;
  }
  [split-dropdown] {
    position: relative;
  }

  [split-dropdown-toggle] {
    position: absolute;
    display: none;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 100;
    top: 40px !important;
  }
  .drop-down-list{
    font-size: 14px;
    min-width: 140px;
    line-height: 1.75;
    background: #fff;
    text-align:center;
    padding: 5px 0;
    margin: 1px 0 0;
  }
  .drop-down-list a{
    padding: 0 10px;
  }
  .drop-down-list li:hover,.dropdown-menu li:hover a{
    background: #5078cb;
  }
  .drop-down-list li:hover a,.dropdown-menu li:hover a{
    color: #fff;
  }
  .a-color {
    color:black;
    cursor: pointer;
  }
  tr.properties-hint-tr {
    height: 65px;
  }
  tr.properties-hint-tr > td.properties-hint-td {
    vertical-align: middle;
    line-height: 20px;
    border-bottom: none;
  }
  tr.properties-hint-tr > td.properties-hint-td > div {
    /*position: relative;
        left: -25em;*/
    text-align: left;
    margin-left: 38em;
  }
  .word-break {
    word-break: break-word;
  }
  /*修改样式*/
  .breadcrumbs,.main-content{
    padding: 0;
  }
  .main-content .table-bordered{
    border-top: none;
  }
  .main-content .table-bordered thead tr{
    background: none;
    line-height: 40px;
    height: 40px;
    color: #323232;
  }
  .div-table-left table thead tr td,.div-table-right table thead tr td{
    border-bottom: none;
  }
  .div-table-left table tbody tr td,.div-table-right table tbody tr td{
    font-size: 12px;
  }
  .div-table-left table tr td{
    border-right: none;
  }
  .div-table-right table thead tr td:first-child{
    border-left: none;
  }
  .table-bordered{
    border: none;
  }
  .div-table-right table thead tr td:hover span{
    color: #5078cb;
  }
  .div-table-right table thead tr td:hover span.fa-angle-down{
    transform: rotate(-180deg);
  }
  .div-table-right table .td-properties{
    text-align: center;
  }
  .div-table-right table .td-properties i,.div-table-left table i{
    color: #5078cb;
  }
  .div-table-right table .td-properties{
    border-bottom: none;
  }
  .div-table-left .table{
    margin-bottom: 0;
  }
  .div-table-right tbody tr td:first-child{
    border-left: none;
  }
  .text-length-more{
    width: 100px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    float: left;
  }
  .drop-down-list {
    position: absolute;
    top: 40px;
    left: 135px;
    border: 1px solid #ddd;
  }
</style>
