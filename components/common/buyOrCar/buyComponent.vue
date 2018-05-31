<template>
  <div>
    <button style="z-index: 1000;" class="btn btn-primary btn-buy-now" :class="{'disabled': disabledFlag}"  @click="buyNow(true, $event)"><span class="watch">立即购买</span></button>
    <button style="z-index: 1000;" class="btn btn-add-cart" :class="{'disabled': disabledFlag}"  @click="buyNow(false, $event)"><span class="watch">加入购物车</span></button>
  </div>
</template>

<script>
  import { enidfilter } from '~utils/baseUtils'
  export default {
    props: ['item', 'disabledFlag'],
    methods: {
      buyNow: function (isBuy, event) {
        event.stopPropagation()
        if (!this.$store.state.option.user.logged) {
          this.$http.get('/login/page', {params: {returnUrl: window.location.href}}).then(response => {
            if (response.data) {
              window.location.href = response.data.content + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
            }
          })
        } else {
          if (this.item && !this.disabledFlag) {
            if (isBuy) {
              this.$http.post('/trade/order/buyNow', [{
                uuid: this.item.uuid,
                batchCode: this.item.batchCode,
                number: this.item.minBuyQty,
                storeid: this.item.storeid ? this.item.storeid : this.item.storeId,
                storeUuid: this.item.storeid ? this.item.storeid : this.item.storeId,
                currencyName: this.item.currencyName,
                minPackQty: this.item.minPackQty
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
                      this.$message.error('产品信息已失效，请刷新页面')
                    } else {
                      this.$message.error(response.data.message)
                    }
                  }
                }, err => {
                  console.log(err)
                  if (this.item.minBuyQty > this.item.reserve) {
                    this.$message.error('商品' + this.item.code + '的库存已经不满足最小起订量')
                  }
                })
            } else {
              this.$http.post('/trade/cart/add', {
                uuid: this.item.uuid,
                batchCode: this.item.batchCode,
                number: this.item.minBuyQty,
                storeid: this.item.storeid ? this.item.storeid : this.item.storeId,
                storeUuid: this.item.storeid ? this.item.storeid : this.item.storeId,
                currencyName: this.item.currencyName,
                minPackQty: this.item.minPackQty
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
                      this.$message.error('库存已不满足最小起订量')
                    } else if (response.data.message === '该产品已失效') {
                      this.$message.error(response.data.message + '，请刷新页面')
                    } else {
                      this.$message.error(response.data.message)
                    }
                  }
                })
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  /* 物品列表按钮 */
  .btn-buy-now {
    background-color: #5078CB;
    color: #fff;
    width: 80px;
    height: 30px;
    font-size: 12px;
    border: 1px solid #5078cb;
  }

  .btn-add-cart {
    margin-top: 10px;
    color: #214797;
    width: 80px;
    height: 30px;
    font-size: 12px;
    background-color: #fff;
    border: 1px solid #e8e8e8;
  }
 .btn-buy-now:hover{
    background: #214797;
  }
  .btn-add-cart:hover{
    background-color: #5078CB;
    color: #fff;
  }
  .btn-buy-now.disabled,
  .btn-buy-now.disabled:focus,
  .btn-add-cart.disabled,
  .btn-add-cart.disabled:focus{
    background-color: #d1d2d3!important;
    border: none!important;
    outline: none;
    color: #fff!important;
    cursor: not-allowed;
  }
</style>
