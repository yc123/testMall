<template>
  <div>
    <div>
      <div class="tab-filter" >
        <div class="fl">&nbsp;&nbsp;| 产品信息(<span class="text-num"></span><span class="text-num" v-text="good_list.total"></span>)</div>
        <div class="fr">
          <div @click="sortBy('normal1')" :class="activeTag==='normal1'?'active':''"><a >综合排序</a></div>
          <div @click="sortBy('normal2')" :class="activeTag==='normal2'?'active':''"><a >库存<i class="fa fa-long-arrow-down" v-show="reserve_asc"></i><i class="fa fa-long-arrow-up" v-show="!reserve_asc"></i></a></div>
          <!--<div @click="sortBy('type')" :class="activeTag==='type'?'active':''"><a >型号精确</a></div>-->
          <div style="display:none"><a href="">销量</a></div>
          <div style="display:none"><a href="">人气</a></div>
          <div style="display:none"><a href="">信用</a></div>
          <div @click="sortBy('price')" :class="activeTag==='price'?'active':''"><a>价格<i class="fa fa-long-arrow-down" v-show="price_asc"></i><i class="fa fa-long-arrow-up" v-show="!price_asc"></i></a></div>
          <div class="price-filter">
            <div class="price-input">
              <input type="number" min="0" step="0.01" v-model="min_price" class="form-control" placeholder="￥" onfocus="this.placeholder=''" onblur="this.placeholder='￥'" />
              <span>-</span>
              <input type="number" :min="min_price === ''?0:min_price" step="0.01" v-model="max_price" class="form-control" placeholder="￥" onfocus="this.placeholder=''" onblur="this.placeholder='￥'" />
            </div>
            <div class="price-hover">
              <a @click="clear_price">清空</a>
              <a @click="filter_price">确定</a>
            </div>
          </div>
          <div style="display:none;padding-top: 5px; margin-left: 0;">
            <select class="select-adder form-control" style="width: 120px;">
              <option value="1">发货地</option>
            </select>
          </div>
          <div class="off">
            <a @click="list_open=!list_open">
              <span v-text="list_open?'收起':'展开'"></span>
              <i class="fa fa-angle-down" v-show="!list_open"></i>
              <i class="fa fa-angle-up"v-show="list_open"></i>
            </a>
          </div>
        </div>
      </div>
      <div v-if="list_open">
        <table class="product-list" >
          <thead>
          <tr style="height: 40px;">
            <!--<th width="80"></th>-->
            <th width="140">品牌/型号/类目</th>
            <th width="100">包装/生产日期</th>
            <th width="110">商家名称</th>
            <th width="140">库存</th>
            <th width="90">梯度/pcs</th>
            <th width="90" v-if="!crname_click_flag.rmb_click_flag">香港交货</th>
            <th width="110" v-if="!crname_click_flag.usd_click_flag">大陆交货<span style="font-size: 12px;">(含税)</span></th>
            <th width="110">交期<span style="font-size: 12px;">(天)</span></th>
            <th width="90">规格书</th>
            <th width="100">操作</th>
          </tr>
          </thead>
          <tbody id="productList-content">
          <tr v-for="item in good_list.components" @click="goUnstandardDetail(item)">
            <!--<td>-->
            <!--<nuxt-link class="component-img-box" :to="item.batchCode?`/store/${item.storeId}/${item.batchCode}`:`/product/component/${item.uuid}`">-->
              <!--&lt;!&ndash;          <img :src="item.img?item.img:item.brand&&item.brand.logoUrl?item.brand.logoUrl:'/images/component/default.png'">&ndash;&gt;-->
              <!--<img class="component-img" :src="item.batchCode?item.img?item.img:'/images/component/default.png':item.brand&&item.brand.logoUrl?item.brand.logoUrl:'/images/component/default.png'">-->
              <!--<img v-if="item.status === 602" class="sellout-flag" src="/images/search/sellout-search.png" alt="">-->
            <!--</nuxt-link>-->
          <!--</td>-->
            <td class="brand-code">
              <img v-if="item.status === 602" class="sellout-flag" src="/images/search/sellout-search.png" alt="">
              <div class="brand" v-if="item.brand&&item.brand.nameEn"><nuxt-link :to="`/product/brand/${item.brand.uuid}`" class="text-num" v-text="item.brand.nameEn"></nuxt-link></div>
              <div class="brand" v-if="!item.brand||!item.brand.nameEn">{{item.brandEn||'—'}}</div>
              <div class="code"  v-if="item.code">
                <nuxt-link v-if="item.uuid" :to="`/product/component/${item.uuid}`" class="f16 text-bold text-num" v-text="item.code"></nuxt-link>
                <span v-if="!item.uuid">{{item.code}}</span>
              </div>
              <div class="brand" v-if="!item.code">—</div>
              <div class="brand"  v-if="item.kind&&item.kind.nameCn"><nuxt-link :to="`/product/kind/${item.kindid}`" v-text="item.kind.nameCn"></nuxt-link></div>
              <div class="brand" v-if="!item.kind||!item.kind.nameCn">{{item.kindName || '—'}}</div>
            </td>
            <td>
              <div class="package" v-text="item.packaging"></div>
              <div class="date" v-text="item.produceDate"></div>
              <div v-if="!item.packaging && !item.produceDate">—</div>
            </td>
            <td>
              <div v-if="item.storeName">
                <nuxt-link :to="'/store/' + item.storeId" v-text="item.storeName">
                </nuxt-link>
              </div>
              <div v-if="!item.storeName">—</div>
            </td>
            <td class="text-left">
              <div class="goods"  v-if="item.reserve">
                库存：<span v-text="item.reserve"></span>
              </div>
              <div v-if="!item.reserve" style="text-align: center;margin-left: 0;"><span>—</span></div>
              <div class="from" v-if="item.reserve && item.reserve > 0">
                最小起订量：<span v-text="item.minBuyQty" v-if="item.minBuyQty"></span>
              </div>
             <!-- <div class="multiple" v-if="item.reserve > 0">
                倍数：<span v-text="item.minPackQty"></span>
              </div>-->
              <div v-if="item.reserve && item.breakUp" v-text="item.breakUp?'可拆卖':'不可拆卖'"></div>
            </td>
            <td>
              <div v-show="!item.prices">
                <span>—</span>
              </div>
              <div v-for="price in item.prices">
                <span v-text="price.start"></span> +
              </div>
            </td>
            <td v-if="!crname_click_flag.rmb_click_flag">
              <div v-show="!(item.currencyName == 'USD') || !item.prices">
                <span>—</span>
              </div>
              <div v-for="price in item.prices">
                <span>{{price.uSDPrice | currency}}</span>
              </div>
            </td>
            <td v-if="!crname_click_flag.usd_click_flag">
              <div v-show="!(item.currencyName == 'RMB') || !item.prices">
                <span>—</span>
              </div>
              <div v-for="price in item.prices">
                <span>{{price.rMBPrice | currency}}</span>
              </div>
            </td>
            <td>
              <div v-show="!item.b2cMinDelivery">
                <span>—</span>
              </div>
              <div v-if="item.b2cMinDelivery">交期:
                <!--<span v-text="item.b2cMinDelivery + '-' + item.b2cMaxDelivery"></span>-->
                <span v-if="item.b2cMinDelivery != item.b2cMaxDelivery" v-text="item.b2cMinDelivery + '-' + item.b2cMaxDelivery"></span>
                <span v-if="item.b2cMinDelivery == item.b2cMaxDelivery" v-text="item.b2cMinDelivery"></span>
              </div>
            </td>
            <td>
              <span v-if="item.attach"><a @click="goAttach(item.attach, $event)"><img src="/images/store/common/pdf.png" alt=""/></a></span>
              <span v-if="!item.attach">—</span>
            </td>
            <td>
              <div v-show="!item.reserve">
                <span>—</span>
              </div>
              <div v-if="item.reserve > 0">
              <buy :item="item" :isStoreStyle="false" :disabledFlag="item.status === 602"></buy>
              </div>
            </td>
          </tr>
          <tr v-if="good_list.components.length == 'undefined' ||good_list.components.length == 0">
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
      </div>
      <page :total="total_count" :page-size="pageSize"
      :current="nowPage" @childEvent="listenPage"></page>
    </div>
  </div>
</template>

<script>
  import Page from '~components/common/page/pageComponent.vue'
  import Buy from '~components/common/buyOrCar/buyComponent.vue'
  export default {
    data () {
      return {
        list_open: true,
        nowPage: 1,
        pageSize: 15,
        sorting: {},
        price_asc: true,
        reserve_asc: true,
        min_price: '',
        max_price: '',
        filter: {},
        activeTag: 'normal1'
      }
    },
    components: {
      Page,
      Buy
    },
    props: ['crname_click_flag'],
    filters: {
      currency: function (input) {
        if (typeof input === 'number') {
          if (input <= 0.000001) {
            input = 0.000001
          } else {
            if (input.toString().indexOf('.') === -1) {
              input = input + '.00'
            } else {
              let inputStr = input.toString()
              let arr = inputStr.split('.')
              let floatNum = arr[1]
              if (floatNum.length > 6) {
                input = inputStr.substring(0, arr[0].length + 7)
                if (Number(floatNum.charAt(6)) > 4) {
                  input = (Number(input) * 1000000 + 1) / 1000000
                }
              } else if (floatNum.length === 1) {
                input = input + '0'
              }
            }
          }
        }
        return input
      }
    },
    watch: {
      $route: function (val, oldVal) {
        this.filter = {}
        this.activeTag = 'normal1'
      }
    },
    computed: {
      good_lists () {
        return this.$store.state.searchData.searchList.lists
      },
      good_list () {
        return this.good_lists.data
      },
      total_count () {
        return Math.min(this.good_list.total, 100 * this.pageSize)
      },
      buy_info () {
        return this.$store.state.user.buy.buyInfo.data
      },
      car_info () {
        return this.$store.state.user.car.addCarInfo.data
      },
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      goAttach: function (url, event) {
        event.stopPropagation()
        if (this.user.logged) {
          if (url && url !== '1') {
            window.open(url)
          } else {
            this.$message.error('规格书地址错误')
          }
        } else {
          this.$http.get('/login/page', {params: {returnUrl: window.location.href}}).then(response => {
            if (response.data) {
              window.location.href = response.data.content + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
            }
          })
        }
      },
      listenPage: function (changedPage) {
        this.nowPage = changedPage
        this.$emit('pageEvent', this.nowPage)
      },
      sortBy: function (param) {
        if (param === 'normal1') {
          this.sorting = {}
          this.activeTag = 'normal1'
        } else if (param === 'normal2') {
          if (this.reserve_asc) {
            this.sorting = {'RESERVE': 'ASC'}
          } else {
            this.sorting = {'RESERVE': 'DESC'}
          }
          this.activeTag = 'normal2'
          this.reserve_asc = !this.reserve_asc
        } else if (param === 'type') {
          this.sorting = {'RESERVE': 'DESC'}
          this.activeTag = 'type'
        } else if (param === 'price') {
          if (this.price_asc) {
            this.sorting = {'PRICE': 'ASC'}
          } else {
            this.sorting = {'PRICE': 'DESC'}
          }
          this.activeTag = 'price'
          this.price_asc = !this.price_asc
        }
        this.$emit('sortEvent', this.sorting)
        this.nowPage = 1
      },
      filter_price: function () {
        if (this.min_price === '' && this.max_price !== '') {
          this.filter.goods_maxpricermb = this.max_price
        } else if (this.min_price !== '' && this.max_price === '') {
          this.filter.goods_minpricermb = this.min_price
        } else if (this.min_price !== '' && this.max_price !== '') {
          if (this.min_price <= this.max_price) {
            this.filter.goods_minpricermb = this.min_price
            this.filter.goods_maxpricermb = this.max_price
          }
        } else {
          delete this.filter.goods_minpricermb
          delete this.filter.goods_maxpricermb
        }
        this.$emit('filterPriceEvent', this.filter)
      },
      clear_price: function () {
        this.min_price = ''
        this.max_price = ''
        this.$emit('filterPriceEvent', this.filter)
      },
      goUnstandardDetail: function (comp) {
        if (!comp.uuid) {
          this.$router.push('/store/productDetail/' + comp.batchCode)
        }
      }
    }
  }
</script>
<style scoped>
/*  .tab-filter {
    width: 1190px;
    height: 40px;
    margin: 0 auto;
    line-height: 40px;
    margin-top: 20px;
    margin-bottom: 10px;
    background: #f1efef;
  }
  .tab-filter .fl {
    font-size: 14px;
  }
  .tab-filter .fl, .tab-filter .fr {
    float: left;
  }
  .tab-filter .fl span {
    font-size: 14px;
  }
  .text-num {
    font-style: normal;
    font-family: verdana;
  }
  .tab-filter .fr {
    max-width: 1050px;
  }
  .tab-filter .fr div {
    float: left;
    margin: 0 5px;
  }
  .tab-filter .fr a {
    display: inline-block;
    padding: 1px 10px;
    border: #ccc 1px solid;
    line-height: 26px;
    font-size: 14px;
    text-align: center;
    color: #333;
    max-height: 30px;
    background: #fff;
  }

  .tab-filter .fr .price-filter {
    padding-top: 5px;
    width: 176px;
    margin: 0;
  }
  .price-filter {
    position: relative;
  }*/
  .price-filter .price-input {
    position: relative;
    z-index: 10;
    margin: 0 10px !important;
    width: 180px;
  }
  .tab-filter .fr .price-filter input, .tab-filter .fr .price-filter span {
    float: left;
  }
  .tab-filter .fr .form-control {
    width: 70px;
    height: 30px;
    border-radius: 0;
    padding-left: 5px;
  }
  .tab-filter .fr .price-filter span {
    margin: 0 5px;
    line-height: 30px;
  }
  .price-filter .price-hover {
    display: none;
    width: 165px;
    height: 25px;
    padding: 60px 6px 6px;
    margin: 0 10px;
    border: 1px solid #999;
    position: absolute;
    background: #fff;
    top: 0;
    -webkit-box-shadow: 1px 1px 2px rgba(0,0,0,.2);
    -moz-box-shadow: 1px 1px 2px rgba(0,0,0,.2);
    box-shadow: 1px 1px 2px rgba(0,0,0,.2);
  }
  .price-filter .price-hover a:first-child {
    position: absolute;
    top: 37px;
    left: 6px;
    width: 36px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    color: #5078cb;
    display: inline-block;
    border: none;
    padding: 0;
  }
  .price-filter .price-hover a:last-child {
    position: absolute;
    top: 37px;
    right: 7px;
    width: 38px;
    height: 25px;
    line-height: 24px;
    border: 1px solid #ccc;
    text-align: center;
    background: #f7f7f7;
    color: #333;
    display: inline-block;
    padding: 0;
  }
 /* .tab-filter .fr .off {
    margin-left: 130px;
    float: right;
  }
  .tab-filter .fr .off a {
    border: none;
    text-align: right;
    padding-left: 360px;
    background: none;
  }
  .tab-filter .fr .off a i {
    font-size: 16px;
  }*/
  .product-list{
    width: 1190px;
    /*margin-bottom: 20px;*/
  }
  .product-list thead tr{
    /*border-top: #6493ff 2px solid;*/
    color: #323232;
    background: none;
  }
  /* 物品列表 */
  .product-list .brand-code {
    font-size: 14px;
    text-align: center;
    position: relative;
  }
  .product-list .brand-code .brand{
  font-size: 12px;
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
    cursor: pointer ;
    position: relative;
  }
  .product-list tbody>tr:hover{
   background: #ecf2fd;
 }
  .product-list tbody>tr .component-img-box {
    width: 80px;
    height: 80px;
    position: relative;
  }
  .product-list tbody>tr .brand-code .sellout-flag {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .product-list tbody>tr .component-img-box .component-img {
    border: 1px solid #e8e8e8;
    margin: 10px 0 5px 0;
    max-width: 80px;
    max-height: 80px;
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
    color: #333;
    text-align: center;
    line-height: 20px;
  }

  /* 物品列表按钮 */
 /* .product-list .btn-buy-now {
    background-color: #5078CB;
    color: #fff;
    width: 80px;
    height: 30px;
    font-size: 12px;
    border: 1px solid #5078cb;
    padding-top: 8px;
  }

  .product-list .btn-add-cart {
    margin-top: 10px;
    color: #214797;
    width: 80px;
    height: 30px;
    font-size: 12px;
    background-color: #fff;
    border: 1px solid #e8e8e8;
    padding-top: 8px;
  }
  .product-list .btn-buy-now:hover{
    background: #214797;
  }
  .product-list .btn-add-cart:hover{
    background-color: #5078CB;
    color: #fff;
  }*/
  .product-list .text-left{
    text-align: left;
  }
  .product-list .text-left div{
    margin-left: 30px;
  }
  .product-list tbody tr td{
    padding: 10px 0;
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
  .tab-filter{
    width: 1190px;
    height: 40px;
    margin: 0 auto;
    line-height: 40px;
    margin-bottom: 10px;
    background: #f1efef;
  }
  .tab-filter .fl,.tab-filter .fr{
    float: left;
  }
  .tab-filter .fl{
    font-size: 14px;
  }
  .tab-filter .fr{
    max-width: 1050px;
  }
  .tab-filter .fl span{
    font-size: 14px;
  }
  .tab-filter .fr div{
    float: left;
    margin: 0 5px;
  }
  .tab-filter .fr div.active a{
    border: #5078cb 1px solid;
    color: #5078cb;
  }
  .tab-filter .fr a{
    display: inline-block;
    padding: 1px 10px;
    border: #ccc 1px solid;
    line-height: 26px;
    font-size: 14px;
    text-align: center;
    color: #333;
    max-height: 30px;
    background: #fff;
  }
  .tab-filter .fr a i{
    /*margin-left: 5px;*/
  }
  .tab-filter .fr a:hover{
    border: #5078cb 1px solid;
    color: #5078cb;
  }
  .tab-filter .fr .off{
    margin-left : 129px;
    float: right;
  }
  .tab-filter .fr .off a:hover{
    border: none;
    color: #5078cb;
  }
  .tab-filter .fr .off a{
    border: none;
    text-align: right;
    padding-left: 360px;
    background: none;
  }
  .tab-filter .fr .off a i{
    font-size: 16px;
  }
  .tab-filter .fr .form-control{
    width: 70px;
    height: 30px;
    border-radius: 0;
    padding-left: 5px;
  }
  .tab-filter .fr .price-filter input,.tab-filter .fr .price-filter span{
    float: left;
  }
  .tab-filter .fr select{
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    -o-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    width: 120px;
  }
  .tab-filter .fr .price-filter{
    padding-top: 5px;
    width: 176px;
    margin: 0;
  }
  .tab-filter .fr .price-filter span{
    margin: 0 5px;
    line-height: 30px;
  }
  .close{
    display: none;
  }
  .price-filter{
    position: relative;
  }
  .price-filter:hover .price-hover{
    display: block;
  }
  .price-filter .price-hover{
    background: transparent;
  }
  .price-filter .price-input{
    position: relative;
    z-index: 10;
    margin: 0 10px !important;
  }
  .price-filter .price-hover{
    display: none;
    width: 165px;
    height: 25px;
    padding: 60px 6px 6px;
    margin: 0 10px;
    border: 1px solid #999;
    position: absolute;
    background: #fff;
    top: 0;
    -webkit-box-shadow: 1px 1px 2px rgba(0,0,0,.2);
    -moz-box-shadow: 1px 1px 2px rgba(0,0,0,.2);
    box-shadow: 1px 1px 2px rgba(0,0,0,.2);
  }
  .price-filter .price-hover a:first-child{
    position: absolute;
    top: 37px;
    left: 6px;
    width: 36px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    color: #5078cb;
    display: inline-block;
    border: none;
    padding: 0;
  }
  .price-filter .price-hover a:last-child{
    position: absolute;
    top: 37px;
    right: 7px;
    width: 38px;
    height: 25px;
    line-height: 24px;
    border: 1px solid #ccc;
    text-align: center;
    background: #f7f7f7;
    color: #333;
    display: inline-block;
    padding: 0;
  }
  .price-filter .price-hover a:last-child:hover{
    background: #5078cb;
    color: #fff;
  }
  div.ng-table-pager input.page-number {
    vertical-align: inherit;
    display: inline-block;
    width: 40px;
    height: 31px;
    padding: 6px 6px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #9B9792;
    text-align: center;
    background-color: #F6F5F4;
    background-image: none;
    border: 1px solid #ccc;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  }
  div.ng-table-pager a.page-a{
    background: #5078cb !important;
    color: #fff;
    float: right;
  }
  tbody a:hover{
    color: #f39801;
  }

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
</style>
