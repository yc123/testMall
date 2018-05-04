<template>
  <div id="recommend-fragment" v-if="commodities && commodities.length > 0">
    <div class="recommend-list">
      <ul>
        <li v-for="commodity in commodities">
          <img v-if="isConsignment" class="specific-img" src="/images/floor/specificPrice-home.png" alt="">
          <div class="img">
            <a href="javascript:void(0);">
              <img :src="commodity.comImg.startsWith('static')?'/'+commodity.comImg:commodity.comImg"/>
            </a>
          </div>
          <div class="content">
            <p v-text="commodity.comCode">MRFE6S9045NF001</p>
            <p class="color666" v-text="commodity.brandNameCn">PANFAEFQ</p>
            <p class="price" v-if="commodity.minPriceRMB">¥ {{commodity.minPriceRMB | currency}}</p>
            <p class="price" v-if="!commodity.minPriceRMB">$ {{commodity.minPriceUSD | currency}}</p>
          </div>
          <div class="hover-show">
            <nuxt-link :to="commodity.batchCode ? '/store/productDetail/' + commodity.batchCode : ''" class="href">
              <div class="title" v-text="commodity.comCode">MRFE6S9045NF001</div>
              <div class="type" v-text="commodity.brandNameCn">PANFAEFQ</div>
              <div class="hr"><span>抢购价</span></div>
              <div class="price" v-if="commodity.minPriceRMB">¥ {{commodity.minPriceRMB | currency}}</div>
              <div class="price" v-if="!commodity.minPriceRMB">$ {{commodity.minPriceUSD | currency}}</div>
            </nuxt-link>
            <div class="by-cart"><button title="加入购物车" @click="buyNow(false, commodity)"><img src="/images/store/icon/cart-blue.png"/></button></div>
            <div class="buy-now"><button title="立即购买" @click="buyNow(true, commodity)">立即购买</button></div>
          </div>
          <img class="recommend-sellout" v-if="commodity.status == 602" src="/images/store/isSellOut.png" alt="">
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import Buy from '~components/common/buyOrCar/buyComponent.vue'
  export default {
    name: 'recommend-product',
    components: {
      Buy
    },
    computed: {
      commodities () {
        return this.$store.state.shop.recommend.products.data
      },
      storeInfo () {
        return this.$store.state.shop.storeInfo.store.data
      },
      isConsignment () {
        return this.storeInfo.type === 'CONSIGNMENT'
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
              this.$http.post('trade/order/buyNow', [{
                uuid: item.comUuid,
                batchCode: item.batchCode,
                number: item.minBuyQty,
                storeid: item.storeId,
                storeUuid: item.storeUuid,
                currencyName: item.currency,
                minPackQty: item.minPackQty ? item.minPackQty : item.minBuyQty
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
                      this.$message.error('产品信息已失效，请刷新界面')
                    } else {
                      this.$message.error(response.data.message)
                    }
                  }
                }, err => {
                  console.log(err)
                  if (item.minBuyQty > item.reserve) {
                    this.$message.error('商品' + item.code + '的库存已经不满足起订量')
                  }
                })
            } else {
              // this.$store.dispatch('user/addCar', {uuid: item.uuid, batchCode: item.batchCode, number: item.minBuyQty})
              this.$http.post('trade/cart/add', {
                uuid: item.comUuid,
                batchCode: item.batchCode,
                number: item.minBuyQty,
                storeid: item.storeId,
                storeUuid: item.storeUuid,
                currencyName: item.currency,
                minPackQty: item.minPackQty ? item.minPackQty : item.minBuyQty
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
  #recommend-fragment{
    width: 1190px;
    margin: 0 auto;
  }
  .recommend-list{
    width: 100%;
    margin: 0 auto;
    display: inline-block;
  }
  #recommend-fragment ul{
    width: 100%;
    margin: 0 auto;
    display: inline-block;
    -webkit-padding-start: 0;
  }
  #recommend-fragment ul li{
    float: left;
    width: 218px;
    height: 260px;
    border: #d2d2d2 1px solid;
    position: relative;
    overflow: hidden;
    margin-right: 25px;
    margin-bottom: 20px;
  }
  #recommend-fragment ul li:nth-child(5n){
    margin-right: 0;
  }
  #recommend-fragment ul li .img{
    height: 175px;
    text-align: center;
    line-height: 170px;
  }
  #recommend-fragment ul li .specific-img {
    position: absolute;
    left: 0;
    top: 0;
  }
  #recommend-fragment ul li .img img{
    max-width: 120px;
    max-height: 120px;
  }
  #recommend-fragment ul li .content{
    width: 100%;
    margin: 0 auto;
  }
  #recommend-fragment ul li .content p{
    width: 90%;
    display: inline-block;
    line-height: 22px;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0;
    padding-left: 10px;
  }
  #recommend-fragment ul li .content p.price{
    color: #ff9000;
    font-size: 16px;
    font-weight: bold;
  }
  .color666{
    color: #666;
  }
  #recommend-fragment ul li .hover-show{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 100%;
    left: 0;
    background: rgba(80,120,203,.85);
    padding: 30px 10px;
  }
  #recommend-fragment ul li:hover .hover-show{
    top: 0;
    transition: top .5s ease-in;
  }
  #recommend-fragment ul li .hover-show div{
    width: 100%;
    margin: 0 auto;
    text-align: left;
    color: #fff;
    line-height: 25px;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  #recommend-fragment ul li .hover-show .title{
    font-size: 18px;
    margin-top: 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: 0;
  }
  #recommend-fragment ul li .hover-show .type{
    font-size: 14px;
  }
  #recommend-fragment ul li .hover-show .hr{
    text-align: center;
    margin-top: 5px;
  }
  #recommend-fragment ul li .hover-show .hr span{
    font-size: 16px;
    position: relative;
  }
  #recommend-fragment ul li .hover-show .hr span:before,#recommend-fragment ul li .hover-show .hr span:after{
    content: '';
    position: absolute;
    display: inline-block;
    width: 65px;
    height: 1px;
    background: #fff;
    top: 10px;
  }
  #recommend-fragment ul li .hover-show .hr span:before{
    left: 53px;
  }
  #recommend-fragment ul li .hover-show .hr span:after{
    right: 53px;
  }
  #recommend-fragment ul li .hover-show .price{
    font-size: 20px;
    text-align: center;
    line-height: 48px;
  }
  #recommend-fragment ul li .hover-show .by-cart,#recommend-fragment ul li .hover-show .buy-now{
    text-align: center;
    position: absolute;
    left: 0;
  }
  #recommend-fragment ul li .hover-show .by-cart{
    bottom: 50px;
  }
  #recommend-fragment ul li .hover-show .buy-now{
    bottom: 15px;
  }
  #recommend-fragment ul li .hover-show .by-cart button{
    display: inline-block;
    width: 38px;
    height: 38px;
    border-radius: 100%;
    background: #fff;
    line-height: 38px;
    margin-bottom: 5px;
    cursor: pointer;
    border: none;
    z-index: 100;
    position: relative;
  }
  #recommend-fragment ul li .hover-show .buy-now button{
    display: inline-block;
    width: 90px;
    height: 34px;
    text-align: center;
    font-size: 14px;
    border-radius: 4px;
    background: #df1b0f;
    line-height: 34px;
    color: #fff;
    cursor: pointer;
    border: none;
    z-index: 100;
    position: relative;
  }
  #recommend-fragment ul li .hover-show .buy-now button:hover{
    background: #f00;
  }
  #recommend-fragment ul li a.href{
    display: inline-block;
    position: relative;
    z-index: 10;
    width: 100%;
    text-align: center;
    height: 260px;
  }
  #recommend-fragment ul li .recommend-sellout {
    position: absolute;
    right: 0;
    bottom: 0;
  }
</style>
