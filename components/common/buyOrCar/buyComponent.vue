<template>
  <div>
    <button style="z-index: 1000;" class="btn btn-primary btn-buy-now" :class="{'disabled': disabledFlag}"  @click="buyNow(true, $event)"><span class="watch">立即购买</span></button>
    <button style="z-index: 1000;" class="btn btn-add-cart" :class="{'disabled': disabledFlag}"  @click="buyNow(false, $event)"><span class="watch">加入购物车</span></button>
  </div>
</template>

<script>
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
              this.$http.post('trade/order/buyNow', [{
                uuid: this.item.uuid,
                batchCode: this.item.batchCode,
                number: this.item.minBuyQty,
                storeid: this.item.storeid ? this.item.storeid : this.item.storeId,
                storeUuid: this.item.storeid ? this.item.storeid : this.item.storeId,
                currencyName: this.item.currencyName,
                minPackQty: this.item.minPackQty
              }])
                .then(response => {
          //        window.location.href = '/user#/order/pay/' + this.enidfilter(response.data.orderid)
                  if (response.data.success) {
                    if (response.data.message) {
                      this.$message({
                        message: response.data.message,
                        type: 'success'
                      })
                      let _self = this
                      window.setTimeout(function () {
                        window.location.href = '/user#/order/pay/' + _self.enidfilter(response.data.data.orderid)
                      }, 1000)
                    } else {
                      window.location.href = '/user#/order/pay/' + this.enidfilter(response.data.data.orderid)
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
                    this.$message.error('商品' + this.item.code + '的库存已经不满足起订量')
                  }
                })
            } else {
              // this.$store.dispatch('user/addCar', {uuid: item.uuid, batchCode: item.batchCode, number: item.minBuyQty})
              this.$http.post('trade/cart/add', {
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
                      this.$message.error('库存已不满足起订量')
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
        // window.location.href = 'user#/order/pay/' + this.enidfilter(this.buy_info.orderid)
      },
      enidfilter: function (str) {
        if (str) {
          let encryptStr = '' // 最终返回的加密后的字符串
          // 产生三位随机数
          let num = ''
          for (let i = 0; i < 3; i++) {
            num += Math.floor(Math.random() * 10)
          }
          encryptStr += num // 产生3位随机数

          // 16位加密
          let tempspit = ''
          let strspit = str.toString().toLowerCase()
          if (strspit.match(/^[-+]?\d*$/) === null) { // 非整数字符，对每一个字符都转换成16进制，然后拼接
            /**
             * Unicode汉字、英文字母、数字的unicode范围
             *汉字：[0x4e00,0x9fa5]（或十进制[19968,40869]）
             *数字：[0x30,0x39]（或十进制[48, 57]）
             *小写字母：[0x61,0x7a]（或十进制[97, 122]）
             *大写字母：[0x41,0x5a]（或十进制[65, 90]
             * 'a'的Unicode编码：'&#97;',charCodeAt()的值是97
             * '码'的Unicode编码：'\u7801', new String('码').charCodeAt()的值是30721，30721的16进制表示是7801
             */
            let s = strspit.split('')
            for (let i = 0; i < s.length; i++) {
              s[i] = s[i].charCodeAt() // 先转换成Unicode编码
              s[i] = s[i].toString(16)
              // 因为在服务器是每两位当做一个字符进行解析的，所以这里每个字符的Unicode编码范围必须在0——255之间。数字和大小写满足该要求，特殊字符则不一定，如果后续有特殊字符的要求，需要重写编码器和解码器
              if (s[i].length === 1) {
                s[i] = '0' + s[i]
              }
              tempspit = tempspit + s[i]
            }
            tempspit = tempspit + '{' + 1 // 1代表字符
          } else { // 数字直接转换成16进制
            strspit = parseInt(strspit)
              .toString(16)
            tempspit = strspit + '{' + 0 // 0代表纯数字
          }

          let temp = tempspit.split('{') // 对要加密的字符转换成16进制
          let numLength = temp[0].length // 转换后的字符长度
          numLength = numLength.toString(16) // 字符长度换算成16进制
          if (numLength.length === 1) { // 如果是1，补一个0
            numLength = '0' + numLength
          } else if (numLength.length > 3) { // 转换后的16进制字符长度如果大于2位数，则返回，不支持
            return ''
          }
          encryptStr += numLength
          if (temp[1] === '0') {
            encryptStr += 0
          } else if (temp[1] === '1') {
            encryptStr += 1
          }
          encryptStr += temp[0]
          if (encryptStr.length < 20) { // 如果小于20位，补上随机数
            // 产生三位随机数
            let numtwo = ''
            for (let i = 0; i < 20 - encryptStr.length; i++) {
              numtwo += Math.floor(Math.random() * 10)
            }
            let ran = numtwo // 产生3位随机数
            encryptStr += ran
          }
          return encryptStr
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
