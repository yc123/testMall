<template>
  <div class="categories-list container">
    <div class="categories-list-header">产品分类</div>
    <div class="categories-list-body" id="kinds">
      <el-tree :data="list" :props="defaultProps" accordion :highlight-current="true" @current-change="handlerCurrentNode"></el-tree>
      <!--<ul>-->
        <!--<li v-for="kind in list[0]">-->
          <!--{{kind.nameCn}}-->
        <!--</li>-->
      <!--</ul>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CategoriesList',
    computed: {
      list () {
        let brands = this.$store.state.brandCategories.categories.data
        if (!brands || brands.length === 0) {
          return []
        }
        // 初始化去除重复数据
        for (let i = 0; i < brands.length; i++) {
          for (let j = 0; j < brands[i].length; j++) {
            brands[i][j].children = []
          }
        }

        // 处理第1层
        if ((brands[0] && brands[0].length > 0) && (brands[1] && brands[1].length > 0)) {
          for (let i = 0; i < brands[1].length; i++) {
            for (let j = 0; j < brands[0].length; j++) {
              if (brands[0][j].id === brands[1][i].parentid) {
                if (!brands[0][j].children) {
                  brands[0][j].children = []
                }
                brands[0][j].children.push(brands[1][i])
                break
              }
            }
          }
        }

        // 处理第2层
        if ((brands[1] && brands[1].length > 0) && (brands[2] && brands[2].length > 0)) {
          for (let i = 0; i < brands[2].length; i++) {
            for (let j = 0; j < brands[1].length; j++) {
              if (brands[1][j].id === brands[2][i].parentid) {
                if (!brands[1][j].children) {
                  brands[1][j].children = []
                }
                brands[1][j].children.push(brands[2][i])
                break
              }
            }
          }
        }

        // 处理第3层
        if ((brands[2] && brands[2].length > 0) && (brands[3] && brands[3].length > 0)) {
          for (let i = 0; i < brands[3].length; i++) {
            for (let j = 0; j < brands[2].length; j++) {
              if (brands[2][j].id === brands[3][i].parentid) {
                if (!brands[2][j].children) {
                  brands[2][j].children = []
                }
                brands[2][j].children.push(brands[3][i])
                break
              }
            }
          }
        }
 //       console.log(brands)
        return brands[0] || []
      },
      brand () {
        return this.$store.state.brandDetail.detail.data
      }
    },
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'nameCn'
        },
        parentid: 0,
        ids: null,
        pageParams: {
          page: 1,
          count: 10,
          filter: {}
        }
      }
    },
    methods: {
      handlerCurrentNode (data, node) {
        if (this.parentid === data.id) {
          this.parentid = 0
          this.ids = null
        } else {
          if (data.level === 1) {
            this.parentid = data.id
          }
        }
        this.pageParams.page = 1
        this.pageParams.filter.brandid = this.brand.id
        this.pageParams.filter.kindid = data.id
        this.pageCommodity(this.pageParams, this.ids)
      },
      async pageCommodity (params) {
//      pageCommodity (params) {
        try {
          let { data } = await this.$http.get('/api/product/component/list', { params })
          this.$store.commit('brandComponent/GET_COMPONENT_SUCCESS', data)
        } catch (err) {
          this.$store.commit('brandComponent/GET_COMPONENT_FAILURE', err)
        }
//        this.$http.get('/api/product/component/list', { params }).then(response => {
//          this.$store.commit('brandComponent/GET_COMPONENT_SUCCESS', response)
//        }, err => {
//          this.$store.commit('brandComponent/GET_COMPONENT_FAILURE', err)
//        })
      }
    }
  }
</script>
<style scoped>
  /*  产品分类调整*/
  .el-tree {
    border: none;
    /*min-height: 300px;*/
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

  .no-record{
    font-size: 14px;
    color: #999;
    text-align: center;
    line-height: 172px;
  }
  .categories-list {
    clear: both;
    float: left;
    width: 200px;
    border: 1px solid #e8e8e8;
  }
  .categories-list .categories-list-header {
    height: 34px;
    text-align: center;
    color: #fff;
    background-color: #5078cb;
    font-size: 14px;
    padding: 7px;
  }
  .categories-list ul>li {
    list-style: none;
    padding: 10px 0;
  }
  .categories-list ul>li>a {
    cursor: pointer;
    color: #323232;
  }
  .categories-list .categories-list-body ul>li .kind-active {
    color: #5078CB;
    font-size: 14px;
  }
  .categories-list .categories-list-body>ul {
    padding: 0;
    font-size: 14px;
  }
  .categories-list .categories-list-body>ul>li {
    list-style: none;
    padding: 10px;
  }
</style>
