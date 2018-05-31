<template>
  <div class="component-list container">
    <div :class="activeTab == 0 ? 'type-list active' : 'type-list'" @click="activeTab = 0">型号列表</div>
    <div :class="activeTab == 1 ? 'type-list active' : 'type-list'" @click="activeTab = 1">代理商</div>
    <div class="input-group" v-if="activeTab == 0">
      <input  type="search" class="input-sm form-control" placeholder="请输入型号" title="code"
      v-model="searchCode" @search="goodsSearch(searchCode)"/>
      <span class="input-group-btn">
					<button class="search btn btn-default" type="button" @click="goodsSearch(searchCode)">搜索器件</button>
			</span>
    </div>
    <table class="table" v-if="activeTab == 0">
      <thead>
        <tr class="bgf7">
          <th width="300">型号</th>
          <th width="300">类目(产品名称)</th>
          <th width="200">数据手册</th>
          <th width="200">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center" v-for="item in list.content">
          <td><nuxt-link :to="'/product/component/' + item.uuid"><span>{{item.code}}</span></nuxt-link></td>
          <td><nuxt-link :to="'/product/kind/' + item.kindid"><span>{{item.kind.nameCn || '-'}}</span></nuxt-link></td>
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
    <div style="float: right;" v-if="activeTab == 0">
      <page :total="list.totalElements" :page-size="pageParams.count"
            :current="pageParams.page" @childEvent="handleCurrentChange"></page>
    </div>
    <table class="table supper-table" v-if="activeTab == 1">
      <thead>
      <tr class="bgf7">
        <th width="100"></th>
        <th width="200">代理商</th>
        <th width="200">地址</th>
        <th width="110">电话</th>
        <th width="110">传真</th>
        <th width="110">邮箱</th>
        <th width="120">网址</th>
      </tr>
      </thead>
      <tbody>
      <tr class="text-center" v-for="item in supplier.content">
        <td v-if="item.storeuuid">
          <a class='add-link' :href="'/store/' + item.storeuuid">
            <img :src="item.img || '/images/store/common/default.png'" alt="" class="showImg">
            <img src="/images/store/common/goIn.png" alt="" class="goIn">
          </a>
        </td>
        <td v-if="!item.storeuuid"><img :src="item.img || '/images/store/common/default.png'" alt="" class="showImg"></td>
        <td :title='item.vendorName'  v-if="item.storeuuid"><a class='add-link' :href="'/store/' + item.storeuuid">{{item.vendorName || '-'}}</a></td>
        <td :title='item.vendorName' v-if="!item.storeuuid">{{item.vendorName || '-'}}</td>
        <td :title='item.detailAddress' v-if="item.storeuuid"><a class='add-link' :href="'/store/' + item.storeuuid">{{item.detailAddress || '-'}}</a></td>
        <td :title='item.detailAddress' v-if="!item.storeuuid">{{item.detailAddress || '-'}}</td>
        <td :title='item.tel' v-if="item.storeuuid"><a class='add-link' :href="'/store/' + item.storeuuid">{{item.tel || '-'}}</a></td>
        <td :title='item.tel' v-if="!item.storeuuid">{{item.tel || '-'}}</td>
        <td :title='item.fax' v-if="item.storeuuid"><a class='add-link' :href="'/store/' + item.storeuuid">{{item.fax || '-'}}</a></td>
        <td :title='item.fax' v-if="!item.storeuuid">{{item.fax || '-'}}</td>
        <td :title='item.email' v-if="item.storeuuid"><a class='add-link' :href="'/store/' + item.storeuuid">{{item.email || '-'}}</a></td>
        <td :title='item.email' v-if="!item.storeuuid">{{item.email || '-'}}</td>
        <td :title='item.website' v-if="item.storeuuid"><a class='add-link' :href="'/store/' + item.storeuuid">{{item.website || '-'}}</a></td>
        <td :title='item.website' v-if="!item.storeuuid">{{item.website || '-'}}</td>
      </tr>
      <tr v-if="!supplier.content || supplier.content.length === 0">
        <td colspan="10" class="text-center">
          <div class="empty">
            <div class="empty-img">
              <img src="/images/brandList/empty-cart.png">
            </div>
            <div class="empty-info">
              <p class="grey f16"> 暂无供应商信息 </p>
              <i class="fa fa-mail-reply fa-xs"></i>&nbsp;<a href="javascript:history.go(-1)">返回上一页</a>
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div style="float: right;" v-if="activeTab == 1">
      <page :total="supplier.totalElements" :page-size="supplierPageParams.size"
            :current="supplierPageParams.page" @childEvent="handleChange"></page>
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
        supplierPageParams: {
          page: 1,
          size: 5,
          sort: {'updatetime': 'DESC'}
        },
        searchCode: '',
        activeTab: 0
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
      },
      supplier () {
        return this.$store.state.product.supplierInformation.information.data
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
//      获取供应商分页
      async pageSupplier (params) {
        let uuid = this.$route.params.code
        let { data } = await this.$http.get(`/api/produce/vendorlist/${uuid}`, { params })
        this.$store.commit('product/supplierInformation/GET_INFORMATION_SUCCESS', data)
      },
      handleChange (page) {
        this.supplierPageParams.page = page
        this.pageSupplier(this.supplierPageParams)
      },
      listenChild: function (brand) {
        this.$store.dispatch('loadBrandPages', {count: 10, filter: { brandid: brand.id }, page: brand.page})
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
    /*background-color: #5078CB;*/
    float: left;
    color: #5078cb;
    line-height: 34px;
    text-align: center;
    font-size: 14px;
    cursor: pointer ;
  }
  .component-list .type-list.active{
    background-color: #5078CB;
    color: #fff;
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
  .component-list table tbody tr td a.add-link {
    width: 100%;
    color: #474443;
    font-size: 14px;
    cursor: pointer;
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
  .component-list .supper-table thead th.text-left{
    text-align: left;
  }
  .component-list .supper-table tbody tr{
    height: 74px;
    vertical-align:middle ;
  }
  .component-list .supper-table tbody tr:hover{
    background: #eee;
  }
  .component-list .supper-table tbody tr td{
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100px;
  }
  .component-list .supper-table tbody tr img.showImg{
    width: 90px;
    height: 49px;
    border: 1px solid #dcdcdc;
  }
  .component-list .supper-table tbody tr img.goIn {
    position: absolute;
    top: 13px;
    right: 3px;
    width: 35px;
    height: 35px;
  }
</style>
