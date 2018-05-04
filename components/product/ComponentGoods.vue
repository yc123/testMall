<template>
  <div class="component-table">
    <!-- 筛选结果展示 -->
    <div class="search-record">
      筛选后现为您找到以下<span class="red">{{componentGoods.totalElements}}</span>个结果
    </div>
    <!-- 列表展示 -->
    <table class="product-list">
      <thead>
      <tr style="height: 40px;">
        <th width="80"></th>
        <th width="160">品牌/型号</th>
        <th width="100">包装/生产日期</th>
        <th width="110">库存</th>
        <th width="90">梯度/pcs</th>
        <th width="90">香港交货<span style="font-size: 12px;">($)</span></th>
        <th width="100">大陆交货<span style="font-size: 12px;">(￥)</span></th>
        <th width="100">交期(天)</th>
        <th width="100">操作</th>
      </tr>
      </thead>
      <tbody id="productList-content">
      <!--| orderBy : dir + orderType  ng-class="{'tr-even' : !compGoods.isOdd}"-->
      <tr v-for="compGoods in componentGoods.content">
        <td style="position: relative">
          <img class="sellout-flag" v-if="compGoods.status === 602" src="/images/search/sellout-search.png" alt="">
          <!--store/{{compGoods.storeId}}#/batchInfo/{{compGoods.batchCode}}-->
          <nuxt-link v-if="compGoods.batchCode" :to="`/store/productDetail/${compGoods.batchCode}`" target="_blank">
            <img :src="compGoods.img?compGoods.img:compGoods.brand&&compGoods.brand.logoUrl?compGoods.brand.logoUrl:'/images/all/default.png'"/>
          </nuxt-link>
            <img v-if="!compGoods.batchCode" :src="compGoods.img?compGoods.img:compGoods.brand&&compGoods.brand.logoUrl?compGoods.brand.logoUrl:'/images/all/default.png'"/>
          <!--store/{{compGoods.storeId}}#/home-->
          <nuxt-link :to="'/store/' + compGoods.storeId" class="contact" :title="compGoods.storeName" target="_blank">{{compGoods.storeName}}</nuxt-link>
        </td>
        <td class="brand-code">
          <div class="brand" v-if="compGoods.brand.nameEn"><nuxt-link :to="`/product/brand/${compGoods.brand.uuid}/`" title="compGoods.brand.nameEn">{{compGoods.brand.nameEn}}</nuxt-link></div>
          <div class="brand" v-if="!compGoods.brand.nameEn">—</div>
          <div class="code" v-if="compGoods.code"><nuxt-link :to="`/product/component/${compGoods.uuid}/`" :title="compGoods.code">{{compGoods.code}}</nuxt-link></div>
          <div class="code" v-if="!compGoods.code">—</div>
        </td>
        <td>
          <div class="package" v-if="compGoods.packaging">{{compGoods.packaging}}</div>
          <div v-if="!compGoods.produceDate && !compGoods.packaging">—</div>
          <div class="date" v-if="compGoods.produceDate">{{compGoods.produceDate}}</div>
        </td>
        <td class="text-left">
          <div class="goods" v-if="compGoods.reserve">
            库存：<span>{{compGoods.reserve}}</span>
          </div>
          <div v-if="!compGoods.reserve" style="text-align: center;margin-left: 0;"><span>—</span></div>
          <div class="from" v-if="compGoods.reserve && compGoods.reserve > 0">
            起拍：<span v-if="compGoods.minBuyQty">{{compGoods.minBuyQty}}</span>
          </div>
          <!--<div class="multiple" v-if="compGoods.reserve > 0">
            倍数：<span>{{compGoods.minPackQty}}</span>
          </div>-->
          <div class="can-div-sell" v-if="compGoods.reserve && compGoods.breakUp" v-text="compGoods.breakUp?'可拆卖':'不可拆卖'"></div>
        </td>
        <td>
          <div v-if="!compGoods.prices">
            <span>—</span>
          </div>
          <div v-for="price in compGoods.prices">
            <!--| number-->
            <span>{{price.start}}</span> +
          </div>
        </td>
        <td>
          <div v-if="(compGoods.currencyName && compGoods.currencyName.indexOf('USD')==-1) || !compGoods.prices">
            <span>—</span>
          </div>
          <div v-for="price in compGoods.prices">
            <!--| formateNumber : 6-->
            <span>{{price.uSDPrice | currency}}</span>
          </div>
        </td>
        <td>
          <div v-if="(compGoods.currencyName && compGoods.currencyName.indexOf('RMB')==-1) || !compGoods.prices">
            <span>—</span>
          </div>
          <div v-for="price in compGoods.prices">
            <!--formateNumber : 6-->
            <span>{{price.rMBPrice | currency}}</span>
          </div>
        </td>
        <td>
          <div v-if="!compGoods.b2cMinDelivery">
            <span>—</span>
          </div>
          <div v-if="compGoods.b2cMinDelivery">交期：<span v-if="compGoods.b2cMinDelivery != compGoods.b2cMaxDelivery">{{compGoods.b2cMinDelivery + '-' + compGoods.b2cMaxDelivery}}</span>
            <span v-if="compGoods.b2cMinDelivery == compGoods.b2cMaxDelivery">{{compGoods.b2cMinDelivery}}</span>
          </div>
        </td>
        <td>
          <div v-show="!compGoods.reserve">
            <span>—</span>
          </div>
          <div v-if="compGoods.reserve > 0">
            <buy :item="compGoods" :disabledFlag="compGoods.status === 602"></buy>
          </div>
        </td>
      </tr>
      <tr v-if="componentGoods.totalElements == 0">
        <td colspan="12">
          <div class="empty">
            <p class="empty-img">
              <img src="/images/brandList/empty-cart.png">
            </p>
            <div class="empty-info">
              <p class="grey"> 暂无产品信息 </p>
              <a href="javascript:history.go(-1)"><i class="fa fa-mail-reply fa-xs"></i>返回上一页</a>
            </div>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div style="float: right; margin-bottom: 15px;">
      <page :total="componentGoods.totalElements" :page-size="pageParams.count"
            :current="pageParams.page" @childEvent="handleCurrentChange"></page>
    </div>
  </div>
</template>

<script>
  import Buy from '~components/common/buyOrCar/buyComponent.vue'
  import Page from '~components/common/page/pageComponent.vue'
  export default {
    layout: 'mian',
    props: ['brandid', 'propertyJSON'],
    components: {
      Buy,
      Page
    },
    data () {
      return {
        pageParams: {
          page: 1,
          count: 10,
          filter: {
            kindid: this.$route.params.id,
            brandid: this.brandid,
            propertyJSON: this.propertyJSON
          }
        }
      }
    },
    computed: {
      componentGoods () {
        let goodsPage = this.$store.state.product.component.componentGoods.data
        this.pageParams.page = goodsPage.number
        return goodsPage
      }
    },
    filters: {
      currency: function (num) {
        if (typeof num === 'number') {
          if (num <= 0.000001) {
            num = 0.000001
          } else {
            if (num.toString().indexOf('.') === -1) {
              num += '.00'
            } else {
              let inputStr = num.toString()
              let arr = inputStr.split('.')
              let floatNum = arr[1]
              if (floatNum.length > 6) {
                num = inputStr.substring(0, arr[0].length + 7)
                if (Number(floatNum.charAt(6)) > 4) {
                  num = (Number(num) * 1000000 + 1) / 1000000
                }
              } else if (floatNum.length === 1) {
                num = num + '0'
              }
            }
          }
        }
        return num
      }
    },
    methods: {
      addToCart: function (goods, buyNow) {
        return null
      },
      handlerCurrentNode (data, node) {
        console.log(this.pageParams)
        this.pageParams.page = 1
        this.pageCmpGoods(this.pageParams)
      },
      async pageCmpGoods (pageParams) {
        let params = {}
        params.filter = { kindid: pageParams.filter.kindid }
        if (pageParams.filter.brandid && pageParams.filter.brandid !== '') {
          params.filter.brandid = pageParams.filter.brandid
        }
        if (pageParams.filter.propertyJSON !== null && Object.getOwnPropertyNames(pageParams.filter.propertyJSON).length > 3) {
          params.filter.properties = pageParams.filter.propertyJSON
        }
        params.page = pageParams.page
        params.count = pageParams.count
        let { data } = await this.$http.get('/api/product/product/getCompGoodsByKindid', { params })
        this.$store.commit('product/component/GET_CMPGOODS_SUCCESS', data)
      },
      handleCurrentChange (page) {
        this.pageParams.page = page
        this.pageParams.filter.brandid = this.brandid
        this.pageParams.filter.propertyJSON = this.propertyJSON
        this.pageParams.filter.kindid = this.$route.params.id
        this.pageCmpGoods(this.pageParams)
      }
    }
  }
</script>

<style scoped>
  /**/
  .product-list tbody>tr .empty{
    overflow: hidden;
    margin: 0!important;
    height:130px;
    display:inline-flex;
    align-items: center;
  }
  .product-list tbody>tr .empty .empty-img{
    margin:0;
    border:0;
    min-width:143px;
    min-height:72px;
  }
  .product-list tbody>tr .empty .empty-img img {
    margin: 0;
    border: 0;
    min-width: 143px;
    min-height: 72px;
  }
  .product-list tbody>tr .empty-info{
    line-height: 14px;
    width: 143px;
  }
  .product-list tbody>tr .grey{
    color: #999;
    font-size: 14px;
  }
  .product-list tbody>tr .empty .empty-info>a{
    font-size: 14px;
    color: #5078cb;
  }
  .product-list tbody>tr .empty .empty-info i{
    margin-right:5px;
  }
  .product-list{
    width: 1190px;
    margin-bottom: 20px;
  }
  .product-list thead tr{
    border-top: #6493ff 2px solid;
    color: #323232;
    background: none;
  }
  /* 物品列表 */
  .product-list .brand-code {
    font-size: 14px;
    text-align: center;
  }

  .product-list .brand-code .code {
    font-weight: 600;
  }

  .product-list th {
    color: rgb(50,50,50);
    font-size: 14px;
    font-weight: 600;
    background-color: #f7f7f7;
    text-align: center;
  }

  .product-list tbody>tr {
    border: 1px solid #e8e8e8;
  }
  .product-list tbody>tr img {
    border: 1px solid #e8e8e8;
    margin: 10px 0 5px 0;
    max-width: 36px;
    max-height: 36px;
  }
  .product-list tbody>tr .contact{
    font-size: 14px;
    color: #5078cb;
    width: 90%;
    margin: 0 auto;
    display: inline-block;
  }
  .product-list tbody>tr .contact:hover{
    color: #d32526;
  }

  .product-list td {
    font-size: 12px;
    /*color: #333;*/
    text-align: center;
    line-height: 20px;
  }
  .product-list td a{
    color: #337ab7;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
  .product-list td a:hover {
    color: #23527c;
  }

  /* 物品列表按钮 */
  .product-list .btn-buy-now {
    background-color: #5078CB;
    color: #fff;
    width: 80px;
    height: 30px;
    font-size: 12px;
    border: 1px solid #5078cb;
  }

  .product-list .btn-add-cart {
    margin-top: 10px;
    color: #214797;
    width: 80px;
    height: 30px;
    font-size: 12px;
    background-color: #fff;
    border: 1px solid #e8e8e8;
  }
  .product-list .btn-buy-now:hover{
    background: #214797;
  }
  .product-list .btn-add-cart:hover{
    background-color: #5078CB;
    color: #fff;
  }
  .product-list .text-left{
    text-align: left;
  }
  .product-list .text-left div{
    margin-left: 30px;
  }
  .product-list tbody tr td{
    padding: 10px 0;
  }
  .product-list tbody tr td .can-div-sell {
    color: #333;
  }
  .product-list tbody tr td .sellout-flag {
    position: absolute;
    right: 0;
    bottom: 0;
    border: none;
  }
  .search-record{
    width: 100%;
    margin: 0 auto;
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    margin-top: 20px;
  }
  .search-record span.red{
    color: #ff0909;
  }
  .el-pagination .el-pager li.active{
    background-color: #5078cb;
    border-color: #337ab7;
  }
  /*<!-- 分页 -->*/
  .el-pagination .el-pager li.active {
    border-color: #5078cb !important;
    background-color: #5078cb !important;
  }
</style>
