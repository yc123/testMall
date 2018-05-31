<template>
  <div>
    <div class="menu-com row">
      <div class="menu-title col-md-12">
        <nuxt-link to="/">商城首页</nuxt-link> >
        <nuxt-link to="/provider/home" v-if="storeInfo.type == 'AGENCY' || storeInfo.type == 'DISTRIBUTION'" title="代理经销">代理经销</nuxt-link>
        <nuxt-link to="/provider/factories" v-if="storeInfo.type == 'ORIGINAL_FACTORY'" title="原厂专区">原厂专区</nuxt-link>
        <nuxt-link :to="'/store/' + storeInfo.uuid" v-if="storeInfo.type == 'CONSIGNMENT'" title="库存寄售">库存寄售</nuxt-link>
        >
        <span v-if="storeInfo.type != 'CONSIGNMENT'"><nuxt-link :to="'/store/' + storeInfo.uuid" :title="storeInfo.storeName" v-text="storeInfo.storeName">storeInfo.storeName</nuxt-link>> </span>
        <span>产品详情</span>
      </div>
    </div>
    <div id="commodity-info-fragment">
      <div class="commodity-detail">
        <div class="img">
          <img src="/images/floor/specificPrice-store.png" alt="" class="specific-price" v-if="isConsignment && isSpecificPriceTag(commodity.tag)">
          <img :src="commodity.img || '/images/store/common/default.png'" style="width: 256px;height: 256px;"/>
          <div class="box">
            <img v-if="commodity.status === 602" src="/images/store/isSellOut.png" alt="">
          </div>
        </div>
        <div class="content">
          <div class="code">
            <span v-text="commodity.code"></span>
          </div>
          <div class="commodity-info-detail">
            <div class="com-info">
              <span class="name">价&nbsp;格</span>：
              <span class="money">
                <span v-if="fragment.currency == 'RMB'">￥</span>
                <span v-if="fragment.currency == 'USD'">$</span>
                <span>{{fragment.price | currency}}</span>
              </span>
            </div>
            <div class="com-info">
              <span class="name">品&nbsp;牌</span>：<span v-text="commodity.brandNameEn"></span>
            </div>
            <div class="com-info">
              <span class="name">类&nbsp;目</span>：<span v-text="commodity.kindNameCn || '无类目信息'"></span>
            </div>
            <div class="com-info">
              <span class="name">下&nbsp;载</span>：<a @click="toAttach(component.attach)" v-if="component.attach">规格书</a><span v-if="!component.attach">暂无信息</span>
            </div>
            <div class="com-info">
              <span class="name">包&nbsp;装</span>：<span v-text="commodity.packaging || '无包装信息'"></span>
            </div>
            <div class="com-info">
              <span class="name">规&nbsp;格</span>：<span v-text="commodity.spec || '无规格信息'"></span>
            </div>
            <div class="com-info">
              <span class="name" style="letter-spacing: 1.5px;">最小包装数</span>：<span v-text="commodity.minPackQty || '无最小包装数信息'"></span>
            </div>
            <div class="com-info">
              <span class="name">库&nbsp;存</span>：<span v-text="commodity.reserve || 0"></span><em style="margin-left: 3px;">PCS</em>
              （<span v-text="commodity.minBuyQty || 1"></span>个起订）
              <span :class="commodity.breakUp?'div-sell can-div-sell':'div-sell not-div-sell'" v-if="commodity.breakUp">可拆卖</span>
            </div>
            <div class="com-info">
              <span class="name">交&nbsp;期</span>：
              <div class="delivery">
                <span v-text="commodity.b2cMinDelivery || 0"></span>
                <span v-if="commodity.b2cMaxDelivery && commodity.b2cMaxDelivery !== commodity.b2cMinDelivery">-</span>
                <span v-if="commodity.b2cMaxDelivery && commodity.b2cMaxDelivery !== commodity.b2cMinDelivery" v-text="commodity.b2cMaxDelivery || 0"></span>
                <span>(天)</span>
              </div>
            </div>
            <div class="com-info form-inline" v-if="commodity.status !== 602 && commodity.status !== 612">
              <span class="name">数&nbsp;量</span>：
              <div class="input-group" style="width: 120px">
                <div :class="fragment.canSub ? ' input-group-addon operate':'input-group-addon'" @click="fragment.canSub ?subNum():''" :style="!fragment.canSub ?'cursor: not-allowed;':''">-</div>
                <input type="text" class="form-control" placeholder="数量" v-model="fragment.num" @change="inputNum()" @input="onInput()" style="padding: 0;min-width: 100px;text-align: center;"/>
                <div :class="fragment.canAdd ?'input-group-addon operate':'input-group-addon'" @click="fragment.canAdd ?addNum():''" :style="!fragment.canAdd ?'cursor: not-allowed;':''">+</div>
                <!--   <div class="input-group-addon operate" @click="subNum()">-</div>
                   <input type="text" class="form-control" placeholder="数量" v-model="fragment.num" @change="inputNum()"style="padding: 0;min-width: 100px;text-align: center;"/>
                   <div class="input-group-addon operate" @click="addNum()">+</div>-->
              </div>
              ×
              <!--<div class="select">
                <select class="form-control"  :disabled="commodity.currencyName != 'RMB-USD'" v-model="fragment.currency" @change="changeCurrency()">
                  <option value="RMB">RMB</option>
                  <option value="USD">USD</option>
                </select>
              </div>-->
              <div class="select">
                <span v-if="fragment.currency == 'RMB'">￥</span>
                <span v-if="fragment.currency == 'USD'">$</span>
                <span>{{(fragment.price || 0) | currency}}</span>
                <span v-if="fragment.currency == 'RMB'" class="tax"> ( 含税 ) </span>
              </div>
              ＝
              <span class="money">
                 <span v-if="fragment.currency == 'RMB'">￥</span>
                 <span v-if="fragment.currency == 'USD'">$</span>
                 <span>{{calculate | currencyShort}}</span>
              </span>
            </div>
            <div class="button" v-if="commodity.status !== 602 && commodity.status !== 612">
              <button class="btn btn-default btn-primary" @click="buyNow(false, commodity)">加入购物车</button>
              <button class="btn btn-default btn-now" @click="buyNow(true, commodity)">立即购买</button>
            </div>
            <div class="warn-area" v-if="commodity.status === 602 || commodity.status === 612" v-text="commodity.status === 602 ? '此产品已售罄':'此产品已下架'"></div>
          </div>
          <div class="price-block">
            <div class="commodity-price">
              <div class="title">价格梯度</div>
              <div class="table">
                <div class="head">
                  <div class="fragment">梯度/pcs</div>
                  <div class="price" v-if="commodity.currencyName == 'RMB'">单价￥(含税)</div>
                  <div class="price" v-if="commodity.currencyName == 'USD'">单价$</div>
                </div>
                <ul class="list-unstyled list-inline">
                  <li v-for="price in commodity.prices">
                    <div class="fragment">
                      <span v-text="price.start"></span>+
                    </div>
                    <div class="price" v-if="commodity.currencyName == 'RMB'">
                      <span v-if="price.rMBPrice">{{price.rMBPrice || 0 | currency}}</span>
                    </div>
                    <div class="price" v-if="commodity.currencyName == 'USD'">
                      <span v-if="price.uSDPrice">{{price.uSDPrice || 0 | currency}}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  function initFragment (commodity) {
    if (!commodity) {
      return {}
    }
    let fragment = {}
    let prices = commodity.prices[0]
    fragment.num = commodity.minBuyQty
    fragment.prices = prices

    if (commodity.currencyName !== 'USD') {
      fragment.currency = 'RMB'
    } else {
      fragment.currency = 'USD'
    }

    if (fragment.currency !== 'USD') {
      fragment.price = prices.rMBPrice
    } else {
      fragment.price = prices.uSDPrice
    }
    fragment.canAdd = true
    fragment.canSub = false
    return fragment
  }
  function getFragment (commodity, fragment) {
    // 判断是否小于第一分段的起订量
    if (commodity.prices[0].start > fragment.num) {
      fragment.num = commodity.prices[0].start
    }
    // 获取分段的信息
    let prices = commodity.prices
    for (let i = 0; i < prices.length; i++) {
      if (fragment.num <= prices[i].end) {
        fragment.prices = prices[i]
        break
      }
    }
  }
  import { enidfilter } from '~utils/baseUtils'
  export default {
    name: 'commodity-info',
    data () {
      return {
        fragment: {
          currency: 'RMB',
          num: 0,
          price: 0,
          canAdd: true,
          canSub: true}
      }
    },
    watch: {
      fragment: function (val, oldVal) {
      }
    },
    filters: {
      currencyShort: function (num) {
        if (typeof num === 'number' && num > 0) {
          if (num <= 0.01) {
            num = 0.01
          } else {
            if (num.toString().indexOf('.') === -1) {
              num += '.00'
            } else {
              let inputStr = num.toString()
              let arr = inputStr.split('.')
              let floatNum = arr[1]
              if (floatNum.length > 2) {
                num = inputStr.substring(0, arr[0].length + 3)
                if (Number(floatNum.charAt(2)) >= 1) {
                  num = (Math.ceil(Number(num) * 100) + 1) / 100
                  let inputStr1 = num.toString()
                  let arr1 = inputStr1.split('.')
                  let floatNum1 = arr1[1]
                  if (num.toString().indexOf('.') === -1) {
                    num += '.00'
                  }
                  if (floatNum1.length === 1) {
                    num = num + '0'
                  }
                }
              } else if (floatNum.length === 1) {
                num = num + '0'
              }
            }
          }
        }
        return num
      },
      currency: function (num) {
        if (typeof num === 'number' && num > 0) {
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
      storeInfo () {
        return this.$store.state.shop.storeInfo.store.data
      },
      commodity () {
        let commodity = this.$store.state.shop.storeInfo.commodity.data
        this.fragment = initFragment(commodity)
        return commodity
      },
      component () {
        return this.$store.state.shop.storeInfo.component.data
      },
      calculate () {
        this.fragment.total = this.fragment.price * Math.pow(10, 6) * this.fragment.num
        return Math.ceil(this.fragment.total) / Math.pow(10, 6)
      },
      user () {
        return this.$store.state.option.user
      },
      isConsignment () {
        return this.storeInfo.type === 'CONSIGNMENT'
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.loadSaveHistory()
      })
    },
    methods: {
      isSpecificPriceTag: function (tag) {
        return tag && tag.indexOf('特价') !== -1
      },
      onInput () {
        let prices = this.commodity.prices
        if (prices && prices.length) {
          let _this = this
          for (let i = 0; i < prices.length; i++) {
            if (_this.fragment.num >= prices[i].start && _this.fragment.num <= prices[i].end) {
              _this.fragment.price = _this.fragment.currency === 'RMB' ? prices[i].rMBPrice : prices[i].uSDPrice
              break
            }
          }
        }
      },
      loadSaveHistory () {
        if (this.user.logged) {
          this.$store.dispatch('shop/saveHistory', {id: this.commodity.batchCode})
        }
      },
      changeCurrency () {
        if (this.fragment.currency === 'RMB') {
          this.fragment.price = this.fragment.prices.rMBPrice
        } else if (this.fragment.currency === 'USD') {
          this.fragment.price = this.fragment.prices.uSDPrice
        }
      },
      changeNum: function (newNum) {
        let pack = this.commodity.perQty || this.commodity.minPackQty
        let buy = this.commodity.minBuyQty
        let reserve = this.commodity.reserve
        let breakUp = this.commodity.breakUp
        if (!newNum) {
          this.fragment.num = buy
        } else {
          newNum = parseInt(newNum)
          if (breakUp) {
            if (newNum < buy) {
              this.$message.error('最小起订量为' + buy)
              this.fragment.num = buy
              this.fragment.canSub = false
              this.fragment.canAdd = true
            } else if (newNum > reserve) {
              this.$message.error('库存不足')
              this.fragment.num = reserve
              this.fragment.canAdd = false
              this.fragment.canSub = true
            } else {
              this.fragment.canSub = true
              this.fragment.canAdd = true
              this.fragment.num = newNum
              newNum === buy && (this.fragment.canSub = false)
              newNum === reserve && (this.fragment.canAdd = false)
            }
          } else {
            if (newNum < buy) {
              this.$message.error('最小起订量为' + buy)
              this.fragment.num = buy
              this.fragment.canSub = false
              if (newNum > reserve) {
                this.$message.error('库存不足')
                this.fragment.num = reserve - (reserve % pack)
                this.fragment.canAdd = false
              }
            } else if (newNum > reserve) {
              this.fragment.canSub = true
              this.fragment.canAdd = false
              this.$message.error('库存不足')
              this.fragment.num = reserve - (reserve % pack)
            } else {
              this.fragment.canSub = true
              this.fragment.canAdd = true
              let remainder = newNum % pack
              if (remainder !== 0) {
//                console.log(this.fragment.num)
                this.$message.error('不支持拆包且包装量为' + pack)
                // 这个直接赋值的，应该给这个值进行判断(Math.floor(newNum / pack) + 1) * pack
                let res = (Math.floor(newNum / pack) + 1) * pack
                this.fragment.num = res > reserve ? Math.floor(newNum / pack) * pack : res
              } else {
                this.fragment.num = newNum
              }
              newNum === buy && (this.fragment.canSub = false)
              newNum === reserve && (this.fragment.canAdd = false)
            }
          }
        }
      },
      subNum () {
        let pack = this.commodity.perQty || this.commodity.minPackQty
        let newNum = 0
        if (this.commodity.breakUp) {
          newNum = this.fragment.num - 1
        } else {
          newNum = this.fragment.num - pack
        }
        this.changeNum(newNum)
        getFragment(this.commodity, this.fragment)
        this.onInput()
      },
      addNum () {
        let pack = this.commodity.perQty || this.commodity.minPackQty
        let newNum = 0
        if (this.commodity.breakUp) {
          newNum = this.fragment.num + 1
        } else {
          newNum = this.fragment.num + pack
        }
        this.changeNum(newNum)
        getFragment(this.commodity, this.fragment)
        this.onInput()
      },
      inputNum () {
        if ((/^[\d]*$/).test(this.fragment.num)) {
          this.changeNum(this.fragment.num)
          getFragment(this.commodity, this.fragment)
        } else {
          this.$message.error('请输入整数')
          this.fragment.num = this.commodity.minBuyQty
        }
      },
      buyNow: function (isBuy, item) {
        if (!this.$store.state.option.user.logged) {
          this.$http.get('/login/page', {params: {returnUrl: window.location.href}}).then(response => {
            if (response.data) {
              window.location.href = response.data.content + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
            }
          })
        } else {
          if (item) {
            if (isBuy) {
              this.$http.post('/trade/order/buyNow', [{
                uuid: item.uuid,
                batchCode: item.batchCode,
                number: this.fragment.num,
                storeid: item.storeid,
                storeUuid: item.storeid,
                currencyName: item.currencyName,
                minPackQty: item.minPackQty
              }])
                .then(response => {
                  if (response.data.success) {
                    if (response.data.message) {
                      this.$message({
                        message: response.data.message,
                        type: 'success'
                      })
                      window.setTimeout(function () {
                        window.location.href = '/user#/order/pay/' + enidfilter(response.data.data.orderid)
                      }, 1000)
                    } else {
                      window.location.href = '/user#/order/pay/' + enidfilter(response.data.data.orderid)
                    }
                  } else {
                    if (response.data.data && response.data.data.unvailable === 1) {
                      this.$message.error('产品信息已失效，请刷新界面')
                    } else {
                      this.$message.error(response.data.message)
                    }
                  }
                }, err => {
                  console.log(err)
                  if (item.minBuyQty > item.reserve) {
                    this.$message.error('商品' + item.code + '的库存已经不满足最小起订量')
                  }
                })
            } else {
              // this.$store.dispatch('user/addCar', {uuid: item.uuid, batchCode: item.batchCode, number: item.minBuyQty})
              this.$http.post('/trade/cart/add', {
                uuid: item.uuid,
                batchCode: item.batchCode,
                number: this.fragment.num,
                storeid: item.storeid,
                storeUuid: item.storeid,
                currencyName: item.currencyName,
                minPackQty: item.minPackQty
              })
                .then(response => {
                  if (response.data.success) {
                    if (response.data.message) {
                      this.$message({
                        message: '添加购物车成功，但商品信息有更新',
                        type: 'success'
                      })
                    } else {
                      this.$message({
                        message: '添加购物车成功',
                        type: 'success'
                      })
                    }
                  } else {
                    if (response.data.code === 2) {
                      this.$message.error(response.data.message + '，请刷新页面')
                    } else {
                      this.$message.error(response.data.message)
                    }
                  }
                })
            }
          }
        }
      },
      toAttach: function (url) {
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
      }
    }
  }
</script>
<style scoped>
  .container.commodity {
    width: 1190px;
    padding-left: 0;
    padding-right: 0;
  }
  .commodity .commodity-detail {
    width: 100%;
    display: inline-block;
    font-size: 0;
  }

  .commodity-detail .img{
    float: left;
    width: 258px;
    height: 320px;
    position: relative;
  }

  .commodity-detail .img >img {
      border: 1px solid #D6D3CE;
  }
  .commodity-detail .img .specific-price {
    position: absolute;
    left: 0;
    top: 0;
    border: none;
  }

  .commodity-detail .img  .box {
    height: 62px;
    position: relative;
  }
  .commodity-detail .img  .box img {
    position: absolute;
    right: 3px;
    bottom: 64px;
  }

  .commodity-detail .content {
    width: 932px;
    float: left;
    font-size: 14px;
  }

  .commodity-detail .content {
    padding-left: 20px;
  }

  .commodity-detail .content .code {
    font-size: 24px;
    color: rgb(50, 50, 50);
    font-weight: 600;
    border-bottom: 1px solid #D6D3CE;
    line-height: 40px;
  }

	.commodity-detail .content .com-info {
		font-size: 14px;
		line-height: 26px;
	}
  .commodity-detail .content .com-info em {
    font-size: 14px;
    line-height: 26px;
    font-style: normal;
  }
	.input-group .input-group-operate {
		padding: 6px 12px;
		font-size: 14px;
		font-weight: 400;
		line-height: 1;
		color: #555;
		text-align: center;
		background-color: #eee;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

  .input-group .input-group-operate:last-child {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  .input-group .input-group-operate:first-child {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }

  .content .com-info .name {
    letter-spacing: 15px;
  }
  .content .com-info a{
    color: #1162a4;
  }
  .content .com-info:hover a{
    color: #23527c;
  }
  .content .warn-area {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-top: 15px;
  }
  .commodity-info-detail {
    float: left;
    padding-top: 10px;
    width: 582px;
  }

  .price-block {
    float: right;
    width: 330px;
    margin-top: 10px;
    height: 220px;
  }

  .commodity-price {
    line-height: 30px;
    text-align: center;
    border: 1px solid #D6D3CE;
  }

  .commodity-price .title {
    background-color: #f7f7f7;
    border-bottom: 1px solid #D6D3CE;
  }

  .commodity-price .head {
    border-bottom: 1px solid #D6D3CE;
  }

  .commodity-price .fragment {
    display: inline-block;
    width: 150px;
  }

  .commodity-price .price {
    width: 150px;
    display: inline-block;
  }

  .com-info div.select {
    display: inline-block;
    font-weight: 600;
    color: red;
    font-size: 14px;
  }
  .com-info div.select .tax {
    font-weight: normal;
    color: black;
    font-size: 12px;
  }
  .com-info .operate {
    cursor: pointer;
  }

  .com-info .operate:hover, .com-info .operate:link {
    background-color: #00B83F;
    color: white;
  }

  .com-info .money {
    font-weight: 600;
    color: red;
    font-size: 14px;
  }

  .com-info select {
    border-radius: 4px;
    width: 120px!important;
  }

  ul.list-inline {
    margin: 0;
  }

  .commodity-price ul.list-inline li {
    padding-left: 0;
    padding-right: 0;
    border-bottom: 1px dashed #D6D3CE;
  }

  .commodity-price .table {
    margin-bottom: 0;
  }

  .commodity-price ul>li:last-child {
    border-bottom: none;
  }

  div.button {
    padding-top: 20px;
    float: left;
  }

  button.btn-now {
    border: 1px solid #3D76C6;
    color: #3D76C6;
    margin-left: 30px;
  }

  .com-info .delivery {
    display: inline;
  }
  #commodity-info-fragment{
    margin-bottom: 20px;
  }

  .commodity-detail .content .com-info .div-sell {
    font-size: 12px;
    height: 16px;
    line-height: 16px;
    color: #fff;
    padding: 0 5px;
    display: inline-block;
    position: relative;
  }
  .commodity-detail .content .com-info .can-div-sell {
    background: #5078cb;
  }
  .commodity-detail .content .com-info .not-div-sell {
    background: #fc8200;
  }
  .commodity-detail .content .com-info .can-div-sell:before {
    content: '';
    position: absolute;
    left: -8px;
    top: 10px;
    border-left: 8px solid transparent;
    border-bottom: 6px solid #5078cb;
  }
  .commodity-detail .content .com-info .not-div-sell:before {
    content: '';
    position: absolute;
    left: -8px;
    top: 10px;
    border-left: 8px solid transparent;
    border-bottom: 6px solid #fc8200;
  }
</style>
