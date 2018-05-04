<template>
  <div class="storeInfo container">
    <div class="form-group">
      <div class="storeIns">
        <div class="sign">选择商家：</div>
        <div class="storeInList" v-for="storeIn in store">
          <div class="choose" :class="{'storeIn-active' : storeIn.isSelected, 'storeIn' : !storeIn.isSelected}" @click="store.length==1?'':addStore(storeIn)">
            <a class="storeLogo">
              <img :src="storeIn.logoUrl || '/images/component/default.png'" :alt="storeIn.storeName" :title="storeIn.storeName">
            </a>
          </div>
        </div>
        <div class="storeInList" style="font-size: 14px" v-if="!store || store.length == 0">
          暂无商家信息
        </div>
      </div>
    </div>
    <div class="form-group" style="margin-bottom: 40px;">
      <div>
        <div style="font-size: 14px">
          <span>产品匹配：</span>
          <span v-if="store && store.length > 0">
            <input type="checkbox" v-if="storeExist && UmallExist" @click="filterType('umall')" :checked="!this.params.filter.ignoreUMall">
            <span v-if="UmallExist">&nbsp;库存寄售&nbsp;</span>
            <input type="checkbox" v-if="storeExist && UmallExist" @click="filterType('store')" :checked="!this.params.filter.ignoreStore">
            <span v-if="storeExist">&nbsp;店铺自营</span>
          </span>
          <span v-if="!store || store.length == 0">暂无可匹配的信息 </span>
        </div>
      </div>
    </div>
    <div class="goodsList">
      <div class="flex">
        <div class="goods-item">按商家列表</div>
        <div class="flex_item"></div>
        <span>
          <button type="button" class="btn sendprove" @click="sendprove()">我要发布产品</button>
        </span>
      </div>
      <table class="table">
        <thead>
          <tr class="height54">
            <th class="text-center" width="100">型号</th>
            <th class="text-center" width="80">包装方式</th>
            <th class="text-center" width="120">生产日期</th>
            <th class="text-center" width="150">库存</th>
            <th class="text-center" width="80">梯度/pcs</th>
            <th class="text-center" width="100">香港交货<span style="font-size: 12px;">($)</span></th>
            <th class="text-center" width="130">大陆交货<span style="font-size: 12px;">(￥)</span></th>
            <th class="text-center" width="120">交期<span style="font-size: 12px;">(天)</span></th>
            <th class="text-center" width="140">操作</th>
          </tr>
        </thead>
        <tbody class="text-center">
          <tr style="cursor: pointer;" v-for="list in storeList.content" @click="goProductDetail(list.batchCode)">
            <td style="position: relative">
              <img class="sellout-flag" v-if="list.status === 602" src="/images/search/sellout-search.png" alt="">
              <a v-if="list.code">{{list.code}}</a>
              <a v-if="!list.code">—</a>
            </td>
            <td>
              <a v-if="list.packaging">{{list.packaging}}</a>
              <a v-if="!list.packaging">—</a>
            </td>
            <td>
              <a v-if="list.produceDate">{{list.produceDate}}</a>
              <a v-if="!list.produceDate">—</a>
            </td>
            <td style="text-align: left;padding-left: 25px;">
              <a>
                <div v-if="list.reserve">
                  <span>库存：</span>
                  <span>{{list.reserve}}</span>
                </div>
                <div v-if="!list.reserve" style="text-align: center;margin-left: 0;"><span>—</span></div>
                <div v-if="list.reserve && list.reserve>0">
                  <span>起拍：</span>
                  <span v-if="list.minBuyQty">{{list.minBuyQty}}</span>
                </div>
                <div class="can-div-sell" v-if="list.breakUp" v-text="list.breakUp?'可拆卖':'不可拆卖'"></div>

                <!--<div>-->
                  <!--<span>倍数：</span>-->
                  <!--<span>{{list.minPackQty}}</span>-->
                <!--</div>-->
              </a>
            </td>
            <td>
              <a>
                <div v-for="price in list.prices">
                  <span v-if="list.prices">{{price.start}}</span>+
                  <span v-if="!list.prices">—</span>
                </div>
              </a>
            </td>
            <td>
              <a>
                <div v-show="list.currencyName.indexOf('USD')==-1 || !list.prices">
                  <span>—</span>
                </div>
                <div v-for="price in list.prices">
                  <span>{{price.uSDPrice | currency}}</span>
                </div>
              </a>
            </td>
            <td>
              <a>
                <div v-show="list.currencyName.indexOf('RMB')==-1 || !list.prices">
                  <span>—</span>
                </div>
                <div v-for="price in list.prices">
                  <span>{{price.rMBPrice | currency}}</span>
                </div>
              </a>
            </td>
            <td>
              <a>
                <div v-show="list.b2cMinDelivery">
                  <span>交期：</span>
                  <span>{{list.b2cMinDelivery}}</span>
                  <span v-if="list.b2cMaxDelivery && list.b2cMaxDelivery !== list.b2cMinDelivery">-</span>
                  <span v-if="list.b2cMaxDelivery && list.b2cMaxDelivery !== list.b2cMinDelivery">{{list.b2cMaxDelivery}}</span>
                </div>
                <div v-if="!list.b2cMinDelivery">
                  <span>—</span>
                </div>
              </a>
            </td>
            <td>
              <buy :item="list" :disabledFlag="list.status === 602"></buy>
            </td>
          </tr>
          <tr v-if="!storeList.content || storeList.content.length == 0">
            <td colspan="12">
              <div class="empty">
                <p class="empty-img">
                  <img src="/images/brandList/empty-cart.png">
                </p>
                <div class="empty-info">
                  <p class="grey"> 暂无现货信息 </p>
                  <a href="javascript:history.go(-1)"><i class="fa fa-mail-reply fa-xs"></i>返回上一页</a>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
  import Buy from '~components/common/buyOrCar/buyComponent.vue'
  export default {
    name: 'StoreInfo',
    data () {
      return {
        storeIds: [],
        UmallExist: false,
        storeExist: false,
        params: {
          count: 10,
          page: 1,
          sorting: {'minPriceRMB': 'ASC'},
          filter: {
            uuid: this.$route.params.uuid,
            ignoreUMall: false,
            ignoreStore: false,
            storeIds: ''
          }
        }
      }
    },
    components: {
      Buy
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
    computed: {
      user () {
        return this.$store.state.option.user
      },
      stores () {
        return this.$store.state.componentStore.store
      },
      store () {
        return this.stores.data
      },
      storeList () {
        let storeList = this.$store.state.componentInformation.information.data
        let _self = this
        if (storeList.content) {
          storeList.content.forEach(function (item) {
            _self.storeIds.push(item.storeid)
          })
        }
        if (this.storeIds.length > 0) {
          if (this.storeIds.indexOf(this.storeId) === -1) {
            this.storeExist = true
          } else {
            this.storeIds.splice(this.storeIds.indexOf(this.storeId), 1)
            if (this.storeIds.length > 0) {
              this.storeExist = true
            }
            this.UmallExist = true
          }
        }
        return storeList
      },
      storeId () {
        let UmallStoreId = this.$store.state.componentUmallStoreId.storeId.data
        return UmallStoreId
      },
      enterprise () {
        let ens = this.user.data.enterprises
        if (ens && ens.length) {
          return ens.find(item => item.current) || {enName: '个人账户'}
        } else {
          return {enName: '个人账户'}
        }
      }
    },
    methods: {
      addStore (storeIn) {
        if (typeof storeIn.isSelected === 'undefined') {
          storeIn.isSelected = false
        }
        storeIn.isSelected = !storeIn.isSelected
        // 点击请求处理
        let index = this.params.filter.storeIds.indexOf(storeIn.uuid)
        if (index === -1) {
          if (this.params.filter.storeIds === '') {
            this.params.filter.storeIds += storeIn.uuid
          } else {
            this.params.filter.storeIds += ',' + storeIn.uuid
          }
        } else {
          if (this.params.filter.storeIds.charAt(index + storeIn.uuid.length) === '') {
            if (this.params.filter.storeIds.charAt(index - 1) === ',') {
              this.params.filter.storeIds = this.params.filter.storeIds.replace(',' + storeIn.uuid, '')
            }
            this.params.filter.storeIds = this.params.filter.storeIds.replace(storeIn.uuid, '')
          } else {
            this.params.filter.storeIds = this.params.filter.storeIds.replace(storeIn.uuid + ',', '')
          }
        }
        this.$store.dispatch('loadComponentInformation', this.params)
      },
      filterType (type) {
        if (type === 'umall') {
          this.params.filter.ignoreUMall = !this.params.filter.ignoreUMall
        } else if (type === 'store') {
          this.params.filter.ignoreStore = !this.params.filter.ignoreStore
        }
        this.$store.dispatch('loadComponentInformation', this.params)
      },
      goProductDetail: function (batchCode) {
        window.location.href = '/store/productDetail/' + batchCode
      },
      sendprove: function () {
        if (this.user.logged) {
          if (this.enterprise && this.enterprise.isVendor === 313) {
            window.open('/vendor#/vendor_upload')
          } else {
            this.$router.push('/register-saler')
          }
        } else {
          this.$router.push('/auth/login?returnUrl=' + window.location.href)
        }
      }
    }
  }
</script>
<style scoped>
  .storeInfo .storeIns{
    margin-top: 20px;
    width: 1190px;
    line-height: 48px;
    position: relative;
    padding-left: 70px;
  }
  .storeInfo .storeIns .sign {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    position: absolute;
    left: 0;
    top: 0;
  }
  .storeInfo .storeIns .storeInList {
    display: inline-block;
  }
  .storeInfo .choose {
    border: 1px solid #ccc;
  }
  .storeInfo .storeIn {
    width: 98px;
    height: 49px;
    line-height: 30px;
    float: left;
    border: 1px solid #ccc;
    text-align: center;
    vertical-align: middle;
    margin-right: 15px;
    cursor: pointer;
  }
  .storeInfo .storeIn-active {
    width: 98px;
    height: 49px;
    line-height: 46px;
    float: left;
    border: 1px solid #5078cb;
    text-align: center;
    vertical-align: middle;
    margin-right: 15px;
    cursor: pointer;
  }
  .storeInfo .storeIn a,.componentDetail .storeIn-active a {
    display: table-cell;
    height: 49px;
    width: 98px;
    text-align: center;
    vertical-align: middle;
  }
  .storeInList .choose a img{
    max-width: 95px;
    max-height: 45px;
    margin-bottom: 1px;
  }
  a.storeLogo>img,.storeIn-active a.storeLogo>img {
    max-width: 95px;
    max-height: 46px;
  }
  .storeInfo .goodsList {
    clear: both;
    font-size: 14px;
  }
  .storeInfo .goodsList .flex{
    display: flex;
    width: 100%;
  }
  .storeInfo .goodsList .flex_item {
    flex: 1
  }
  .storeInfo .goodsList .goods-item {
    height: 30px;
    width: 120px;
    background-color: #5078cb;
    color: #fff;
    text-align: center;
    vertical-align: middle;
    line-height: 30px;
  }
  .storeInfo .goodsList .sendprove {
    background: #fff;
		color: #5078CB;
    border-radius: 4px;
    border: 1px solid #5078CB;
    height: 30px;
    border-radius: 0px;
    
  }
  .storeInfo .goodsList .sendprove:hover {
    background: #5078CB;
		color: #fff;
    cursor: pointer;
    transition: all 0.4s
  } 
  .storeInfo .goodsList thead {
    background-color: #F7F7F7;
    border:2px solid #f7f7f7;
  }
  .storeInfo .goodsList tbody tr td{
    vertical-align: middle;
    text-align: center;
  }
  .storeInfo .goodsList tbody tr td .sellout-flag {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .storeInfo .goodsList tbody tr td a {
    color: #474443;
  }
  .storeInfo .goodsList tbody tr td:hover a{
    color: #474443;
  }
  /*.storeInfo .goodsList .btn{*/
    /*border-radius: 4px;*/
    /*width: 80px;*/
    /*height: 30px;*/
    /*color: #214797;*/
    /*font-size: 14px;*/
    /*line-height: 14px;*/
    /*text-align: center;*/
    /*margin: 5px 0;*/
    /*padding: 0;*/
    /*user-select: none;*/
    /*background-image: none;*/
    /*border: 1px solid transparent;*/
    /*font-weight: 400;*/
  /*}*/
  /*.storeInfo .goodsList .btn-buyNow {*/
    /*color: #fff;*/
    /*background-color: #5078cb;*/
  /*}*/
  /*.storeInfo .goodsList .btn-default{*/
    /*background-color: #fff;*/
    /*border-color: #ccc;*/
  /*}*/
  .storeInfo .form-group input{
    vertical-align: sub;
  }
  .storeInfo .height54{
    height: 54px;
    background: none;
    color: #333;
  }
  .storeInfo .height54 th{
    line-height: 54px;
    border-bottom: none;
    padding: 0;
  }
  .storeInfo .table tbody td{
    border-bottom: #ddd 1px solid;
    border-top: none;
  }
  .storeInfo .table tbody{
    border-left: #ddd 1px solid;
    border-right: #ddd 1px solid;
  }
  .storeInfo .table tbody td div{
    margin-left: 10%;
  }
  .storeInfo .table tbody tr:hover{
    background: #ecf2fd;
  }
  .storeInfo .goodsList .can-div-sell {
    text-align: left;
    color: #333;
  }
  /**/
  .storeInfo .empty{
    overflow: hidden;
    margin: 0!important;
    height:130px;
    display:inline-flex;
    align-items: center;
  }
  .storeInfo .empty-info{
    line-height: 14px;
    width: 143px;
  }
  .empty-info .grey{
    color: #999;
    font-size: 14px;
  }
  .storeInfo .empty .empty-info>a{
    font-size: 14px;
    color: #5078cb;
  }
  .storeInfo .empty .empty-info i{
    margin-right:5px;
  }
</style>
