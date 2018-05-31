<template>
  <div class="help-list">
    <h2>
      <nuxt-link to="/help/home">帮助中心</nuxt-link>
    </h2>
    <!--<ul class="list-unstyled" style="margin-top: 10px;">
      <li v-for="nav01 in helps">
        <a :class="{'cur': nav01.isHide}" @click="toggleNav(nav01)"><span>{{nav01.item}}</span></a>
        <ul class="list-unstyled list-body" v-if="!nav01.isHide">
          <li v-for="nav02 in nav01.children">
            <nuxt-link :to="`/help/helpList/${nav02.id}`"><span v-text="nav02.item"></span></nuxt-link>
          </li>
        </ul>
      </li>
    </ul>-->
    <el-tree :data="helps" :props="defaultProps" :highlight-current="true" default-expand-all @node-click="openList"></el-tree>
  </div>
</template>
<script>
  // 升序
  function compare (property) {
    return function (a, b) {
      var value1 = a[property]
      var value2 = b[property]
      return value1 - value2
    }
  }
  import {deepCopy} from '~utils/baseUtils'
  export default {
    name: 'left',
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'item'
        }
      }
    },
    computed: {
      helps () {
        let data = deepCopy(this.$store.state.help.snapsho.data)
        let list = data.sort(compare('detno'))
        if (list) {
          for (let i = 0; i < list.length; i++) {
            list[i].children = list[i].children.sort(compare('detno'))
          }
        }
        return list
      }
    },
    methods: {
      openList (data) {
        if (data.level !== 1) {
          this.$router.push({ name: 'help-helpList-id', params: { id: data.id } })
        }
      }
    }
  }
</script>
<style scoped>
  .el-tree{
    border: none;
     min-height: 300px;
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content,.el-tree-node:hover{
    background: none !important;
  }
  .el-tree-node__content:hover{
    background: none !important;
  }
  .el-tree-node__content:hover span{
    color: #5078cb;
  }
  .el-pagination .el-pager li.active{
    background-color: #5078cb;
    border-color: #337ab7;
  }
  .el-tree-node__expand-icon{
    font-family: "iconfont" !important;
    font-size: 14px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    width: inherit;
    height: inherit;
    border: inherit;
    font-weight: bold;
    text-shadow: -1px 0px 0 #333;
    margin-right: 3px !important;
  }
  .el-tree-node__content{
    line-height: 30px;
    height: 30px;
  }
  .el-tree-node__expand-icon.is-leaf{
    visibility: hidden;
  }
  .el-tree-node__expand-icon:before{
    content: "\E621";
  }
  .help-list{
    width: 200px;
    background: #fff;
    border: #e8e8e8 1px solid;
  }
  .help-list h2{
    background: #5078cb;
    line-height: 34px;
    height: 34px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    margin: 0;
  }
  .help-list h2 a {
    color: #fff;
  }
  .help-list ul{
    width: 200px;
    display: inline-block;
  }
  .help-list li {
    position: relative;
    line-height: 33px;
    font-size: 14px;
    color: #333;
    float: left;
    width: 100%;
    padding-left: 10px;
  }

  .help-list li a {
    display: block;
    padding-left: 15px;
    text-decoration: none;
    color: #333;
  }

  .help-list li a:hover{
    color: #5078cb;
    cursor: pointer;
  }
  .help-list ul.list-body {
    /*display: none;*/
    color: #666;
  }

  .help-list ul.list-body.active {
    display: block;
  }
  .help-list ul.list-body li {
    float: none;
    background-image: none;
    min-height: 26px;
    line-height: 26px;
    font-size: 12px;
  }

  .help-list ul.list-body li a {
    padding-left: 15px;
    display: block;
    color: rgb(50,50,50);
    background: none;
  }

  .help-list ul.list-body li a:hover {
    color: #5078cb;
    cursor: pointer;
  }
  .help-list ul.list-body li a.cur,.help-list ul li a.cur{
    text-decoration: none;
    font-size: 14px;
  }
  .help-list .operate-icon {
    position: absolute;
    right: 20px;
    top: 1px;
  }
  .help-list li>ul>li>ul>li {
    padding-left: 30px;
  }
</style>
