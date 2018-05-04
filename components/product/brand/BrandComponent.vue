<template>
  <div class="component-list container">
    <div class="type-list">型号列表</div>
    <div class="input-group">
      <input  type="search" class="input-sm form-control" placeholder="请输入型号" title="code"
      v-model="searchCode" @search="goodsSearch(searchCode)"/>
      <span class="input-group-btn">
					<button class="search btn btn-default" type="button" @click="goodsSearch(searchCode)">搜索器件</button>
			</span>
    </div>
    <table class="table">
      <thead>
        <tr class="bgf7">
          <th width="500">型号</th>
          <th width="300">数据手册</th>
          <th width="200">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center" v-for="item in list.content">
          <td><nuxt-link :to="'/product/component/' + item.uuid"><span>{{item.code}}</span></nuxt-link></td>
          <td><a @click="toAttach(item.attach)"><button class="btn btn-default"  :disabled="!item.attach" :class="{'disabledbtn':!item.attach}">Datasheet手册</button></a></td>
          <td>
            <button class="btn btn-default disabledbtn" :disabled="true">申请样片</button>
          </td>
        </tr>
        <tr v-if="!list.content || list.content.length === 0">
          <td colspan="10" class="text-center">
            <div class="empty">
              <div class="empty-img">
                <img src="/images/brandList/empty-cart.png">
              </div>
              <div class="empty-info">
                <p class="grey f16"> 暂无器件信息 </p>
                <i class="fa fa-mail-reply fa-xs"></i>&nbsp;<a href="javascript:history.go(-1)">返回上一页</a>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div style="float: right;">
      <page :total="list.totalElements" :page-size="pageParams.count"
            :current="pageParams.page" @childEvent="handleCurrentChange"></page>
    </div>
  </div>
</template>
<script>
  import Page from '~components/common/page/pageComponent.vue'
  export default {
    name: 'BrandComponent',
    data () {
      return {
        pageParams: {
          page: 1,
          count: 10,
          filter: {}
        },
        searchCode: ''
      }
    },
    components: {
      Page
    },
    computed: {
      lists () {
        return this.$store.state.brandComponent.component
      },
      list () {
        return this.lists.data
      },
      brand () {
        return this.$store.state.brandDetail.detail.data
      }
    },
    methods: {
      goodsSearch (keyword) {
        this.pageParams.page = 1
        this.pageParams.filter.code = keyword
        this.pageCmpGoods(this.pageParams)
      },
      handlerCurrentNode () {
        this.searchCode = ''
        this.pageParams.page = 1
        this.pageCmpGoods(this.pageParams)
      },
      async pageCmpGoods (params) {
//      pageCmpGoods (params) {
        params.filter.brandid = this.brand.id
        let { data } = await this.$http.get('/api/product/component/list', { params })
        this.$store.commit('brandComponent/GET_COMPONENT_SUCCESS', data)
//        this.$http.get('/api/product/component/list', { params }).then(response => {
//          this.$store.commit('brandComponent/GET_COMPONENT_SUCCESS', response)
//        })
      },
      handleCurrentChange (page) {
        this.pageParams.page = page
        this.pageParams.filter.brandid = this.brand.id
        this.pageCmpGoods(this.pageParams)
      },
      toAttach: function (url) {
        if (url === '1') {
          this.$http.get('/login/page', {params: {returnUrl: window.location.href}}).then(response => {
            if (response.data) {
              window.location.href = response.data.content + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
            }
          })
        } else {
          window.open(url)
        }
      }
    }
  }
</script>
<style scoped>
  .component-list {
    float: left;
    margin-left: 20px;
    width: 970px;
  }
  .bgf7 th{
    color: #333;
    vertical-align: middle;
  }
  .component-list .type-list{
    height: 34px;
    width: 150px;
    border: 1px solid #5078cb;
    background-color: #5078CB;
    float: left;
    color: #fff;
    line-height: 34px;
    text-align: center;
    font-size: 14px;
  }
  .component-list .input-group {
    width: 300px;
    float: right;
    border-radius: 3px;
  }
  .input-group .form-control{
    border-radius: 3px;
  }
  .component-list .input-group-btn .search{
    background: #5078cb;
    color: #fff;
    height: 34px;
    border-radius: 3px;
  }
  .component-list table {
    margin-top: 10px;
    width: 970px;
    border: 1px solid #e8e8e8;
  }
  .component-list table>thead {
    height: 40px;
  }
  .component-list table>thead>th {
    text-align: center;
  }
  .component-list table tbody tr{
    text-align: center;
  }
  .component-list .table>tbody>tr>td{
    vertical-align: middle;
    border-top: #e8e8e8 1px solid;
  }
  .component-list table tbody tr td a{
    color: #337ab7;
    font-size: 12px;
  }
  .component-list .btn-default {
    color: #214797;
    font-size: 12px;
    line-height: 12px;
    height: 30px;
  }
  .component-list .disabledbtn {
    color: #A0A0A0;
  }
  .component-list td.text-center{
    padding: 30px 0;
    font-size: 20px;
    line-height: 40px;
  }
  .bgf7{
    height: 40px;
  }
  .bgf7 th{
    background: #f7f7f7;
    border-bottom: none !important;
    font-size: 14px;
    text-align: center;
  }
  .component-list .empty{
    overflow: hidden;
    text-align: center;
    margin: 0 auto;
  }
  .component-list .empty-img{
    float: left;
    margin-left: 335px;
  }
  .component-list .empty-info{
    float: left;
    line-height: 10px;
    width: 143px;
    margin-top: 30px;
  }
  .empty-info .grey{
    color: #999;
    font-size: 14px;
  }
  .component-list .empty-info a{
    font-size: 14px;
    color: #5078cb;
  }
  .component-list .empty-info i{
    font-size: 14px;
    color: #5078cb;
  }
</style>
