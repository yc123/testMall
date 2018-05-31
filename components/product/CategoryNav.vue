<template>
  <div class="breadcrumbs container">
    <ul class="list-unstyled list-inline">
      <li class="crumb-item">
        <nuxt-link :to="`/product/kind/home`">电子元器件</nuxt-link>
      </li>
      <li class="crumb-item crumb-item-angle" v-for="k in actives">
        <i class="angle"></i>
        <nuxt-link :to="`/product/kind/${k.id}`">
          <span :title="k.nameCn">{{k.nameCn}}</span> <i class="fa fa-angle-down"></i>
        </nuxt-link>
        <div class="crumb-drop" v-if="k.bothers">
          <ul class="list-unstyled list-inline" role="menu">
            <li v-for="b in k.bothers"><nuxt-link :to="`/product/kind/${b.id}`">{{b.nameCn}}</nuxt-link></li>
          </ul>
        </div>
        <i class="icon-glass"></i>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    computed: {
      actives () {
        return this.$store.state.product.kind.kindsParentWithBother.data
      }
    }
  }
</script>

<style scoped>
  /* breadcrumbs */
  .breadcrumbs {
    margin-top: 20px;
  }
  .breadcrumbs ul.list-unstyled.list-inline {
    margin-left: 0px;
    margin-bottom: 10px;
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
  /* sl_warp */
  .main-content .sl-wrap .sl-key>span {
    color: #323232;
    font-size: 14px;
  }
  .main-content .sl-wrap .sl-value ul li a{
    color: #323232;
    font-size: 14px;
  }
  .main-content .sl-wrap .sl-value ul li a:hover{
    color: #5078cb;
  }
  .main-content .sl-wrap .sl-value .sl-selected a {
    color: #666;
    text-decoration: none;
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
  .main-content .sl-more:hover a {
    color: #f39800;
    border-color: #FFF #f39800 #f39800;
    text-decoration: none;
  }
  .main-content .sl-more a:focus {
    text-decoration: none;
    color: #f39800;
  }
  .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th,
  .table>thead>tr>td, .table>thead>tr>th {
    padding: 10px 5px;
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
  .div-table-right table thead tr td{
    width: 140px;
    text-align: center;
    vertical-align: middle;
    padding: 0;
  }
  thead tr {
    /*background-image: url("static/img/product/th-tr-bg.png");
        background-repeat: repeat-x;*/
    background: linear-gradient(rgb(93, 134, 220), rgb(12, 53, 136));
    color: #fff;
    height: 48px;
  }
  .table>thead>tr>th{
    padding:5px 5px;
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
  .drop-down-list a{
    padding: 0 10px;
  }
  .drop-down-list li:hover,.dropdown-menu li:hover a{
    background: #5078cb;
  }
  .drop-down-list li:hover a,.dropdown-menu li:hover a{
    color: #fff;
  }
  tr.properties-hint-tr > td.properties-hint-td > div {
    /*position: relative;
        left: -25em;*/
    text-align: left;
    margin-left: 38em;
  }
  /*修改样式*/
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
</style>
