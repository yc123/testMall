<template>
  <div class="floor-list">
    <div class="container">
      <floor-bar :floors="floors"></floor-bar>
      <!--<a href="/store/33069557578d44e69bd91ad12d28a8d4" target="_blank"><img src="/images/all/banner-cuxiao.png" alt=""></a>-->
      <div v-if="purchaseManListData && false"></div>
      <div class="banner">
        <ul class="seek-banner">
          <li><a href="/store/33069557578d44e69bd91ad12d28a8d4" target="_blank"><img src="/images/all/banner-cuxiao001.png" alt=""></a></li>
          <li>
            <div class="banner-cuxiao">
              <div class="wrap">
                <p class="title"><span>最新求购</span><img class="new-animate" src="/images/all/banner-cuxiao03.jpg" alt="">
                  <nuxt-link to="/applyPurchase">查看更多</nuxt-link>
                </p>
                <div class="list-head">
                  <span>发布时间</span>
                  <span>买家名称</span>
                  <span>型号</span>
                  <span>操作</span>
                </div>
                <ul>
                  <li v-for="(purchaseMan, index) in purchaseManList.content" :style="'top: -' + 32 * timerIndex + 'px'">
                    <div>{{purchaseMan.date | date}}</div>
                    <div>
                      <span v-if="purchaseMan.inquiry && purchaseMan.inquiry.enterprise && purchaseMan.inquiry.enterprise.enName">{{purchaseMan.inquiry.enterprise.enName | enterpriseFilter}}</span>
                      <span v-else>{{purchaseMan.userName | userNameFilter}}</span>
                    </div>
                    <div :title="purchaseMan.cmpCode">{{purchaseMan.cmpCode}}</div>
                    <div>
                      <div class="is-say-price" v-if="purchaseMan.remainingTime > 0 && purchaseMan.quoted == 1">已报价 <img src="/images/applyPurchase/green-check.png" alt=""></div>
                      <div v-else>
                        <a title="该求购已截止" v-if="!purchaseMan.remainingTime || purchaseMan.remainingTime <= 0" class="is-same" @click="sayPriceStop">我要报价</a>
                        <a title="此为贵公司的求购" v-if="purchaseMan.remainingTime > 0 && (!purchaseMan.quoted || purchaseMan.quoted != 1) && (user.logged && ((purchaseMan.inquiry.enterprise && user.data.enterprise && (purchaseMan.inquiry.enterprise.uu === user.data.enterprise.uu)) || (!user.data.enterprise.uu && purchaseMan.userUU == user.data.userUU  && !purchaseMan.inquiry.enterprise)))" class="is-same" @click="sayPriceSeft">我要报价</a>
                        <a v-if="purchaseMan.remainingTime > 0 && (!purchaseMan.quoted || purchaseMan.quoted != 1) && !(user.logged && ((purchaseMan.inquiry.enterprise && user.data.enterprise && (purchaseMan.inquiry.enterprise.uu === user.data.enterprise.uu)) || (!user.data.enterprise.uu && purchaseMan.userUU == user.data.userUU  && !purchaseMan.inquiry.enterprise)))" @click="sayPrice(purchaseMan, index)">我要报价</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <nuxt-link to="/applyPurchase" class="purchase">我要求购</nuxt-link>
            </div>
          </li>
        </ul>
      </div>
      <floor :floor="defaultFloors[0]" :isDefault="true" v-if="!isEmpty"></floor>
      <floor :floor="defaultFloors[1]" :isDefault="true" v-if="!isEmpty"></floor>
      <floor v-for="(floor, index) in floors.data" :floor="floor" :isDefault="false" :key="index"></floor>
    </div>
    <span v-if="expandFloors && false">floor</span>
    <say-price :current="currentSayPriceIndex"
               :purchase="purchaseManList"
               @cancelSayPriceAction="cancelSayPrice"
               @resetListAction="resetList"
               @sayPriceIndexAction="setIndex(index)"
    ></say-price>
  </div>
</template>
<script>
  import Floor from './Floor.vue'
  import FloorBar from './FloorBar.vue'
  import SayPrice from '~components/applyPurchase/SayPrice.vue'
  export default {
    name: 'floor-list',
    components: {
      Floor,
      FloorBar,
      SayPrice
    },
    data () {
      return {
        defaultFloors: [
          {
            items: [
              {
                backGroundColor: '',
                body: '',
                hrefUrl: '/store/33069557578d44e69bd91ad12d28a8d4',
                pictureUrl: '/images/floor/banner1.jpg',
                size: 'large'
              }
            ]
          },
          {
            items: [
              {
                backGroundColor: '',
                body: '',
                hrefUrl: '/store/33069557578d44e69bd91ad12d28a8d4',
                pictureUrl: '/images/floor/banner2.jpg',
                size: 'large'
              }
            ]
          }
        ],
        timerIndex: 0,
        pageSize: 50,
        nowPage: 1,
        currentSayPriceIndex: -1,
        purchaseManList: {
          content: []
        },
        listTemplate: [],
        isChange: false
      }
    },
    mounted () {
      setInterval(() => {
        let _this = this
        _this.timerIndex ++
        if (_this.timerIndex % 45 === 0) {
          for (let i = 0; i < _this.listTemplate.content.length; i++) {
            this.purchaseManList.content.push(_this.listTemplate.content[i])
          }
        }
      }, 3000)
    },
    filters: {
      date: function (date) {
        const now = new Date().getDate()
        const day = (new Date(date).getDate() - now)
        return day <= 0 ? '今天' : day + '天前'
      },
      enterpriseFilter (str) {
        if (str) {
          return str.length > 4 ? str.substring(0, 2) + '**' + str.substring(str.length - 2, str.length) : str
        } else {
          return '-'
        }
      },
      userNameFilter (str) {
        return str ? str.substring(0, 1) + '**' : '-'
      }
    },
    computed: {
      floors () {
        return this.$store.state.floor.list
      },
      isProd () {
        return this.$store.state.option.url === 'http://www.usoftmall.com'
      },
      expandFloors () {
        let data = this.$store.state.floor.list_expand.data
        let _this = this
        for (let i = 0; i < data.length; i++) {
          let obj = {
            backGroundColor: '',
            body: '',
            hrefUrl: '',
            name: '',
            pictureUrl: '',
            size: '',
            price: '',
            currency: 'RMB'
          }
          if (data[i]) {
            obj.name = data[i].code
            obj.body = data[i].brandNameEn + '<br/>' + (data[i].kindNameCn || '其他')
            obj.hrefUrl = '/store/productDetail/' + data[i].batchCode
            obj.pictureUrl = '/images/floor/' + (this.isProd ? data[i].code : '2SD2704KT146') + '.png'
            obj.size = i % 3 === 0 ? 'medium' : 'small'
            obj.currency = data[i].currencyName
            obj.price = _this.getMinPrice(data[i].prices, data[i].currencyName)
            _this.defaultFloors[i < 6 ? 0 : 1].items.push(obj)
          }
        }
        return data
      },
      isEmpty () {
        let data = this.$store.state.floor.list_expand.data
        if (!data.length) {
          return true
        } else {
          for (let i = 0; i < data.length; i++) {
            if (!(data[0] && data[0] !== null)) {
              return true
            }
          }
        }
        return false
      },
      purchaseManListData () {
        let list = this.$store.state.applyPurchase.purchaseManList.purchaseManList.data
        if (this.isChange) {
          this.purchaseManList.content = []
          this.listTemplate = list
          this.isChange = false
        } else if (list.content) {
          for (let i = 0; i < list.content.length; i++) {
            this.purchaseManList.content.push(list.content[i])
          }
          this.listTemplate = list
        }
        return list
      },
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      getMinPrice: function (prices, currency) {
        for (let i = 0; i < prices.length; i++) {
          if (i === prices.length - 1) {
            return currency === 'RMB' ? prices[i].rMBPrice : prices[i].uSDPrice
          }
        }
      },
      setIndex: function (index) {
        this.currentSayPriceIndex = index
      },
      sayPriceStop: function () {
        this.$message.error('该求购已截止')
      },
      sayPriceSeft: function () {
        this.$message.error('此为贵公司的求购')
      },
      sayPrice: function (purchaseMan, index) {
        if (this.user.logged) {
          if (this.user.data.enterprise.uu) {
            if (this.user.data.enterprise.isVendor && this.user.data.enterprise.isVendor !== '1690') {
              purchaseMan.active = true
              this.currentSayPriceIndex = index
            } else {
              this.$message.error('抱歉，您需开通卖家功能才可报价')
            }
          } else {
            this.$message.error('个人账户暂不可报价')
          }
        } else {
          this.$router.push('/auth/login?returnUrl=' + window.location.href)
        }
      },
      resetList: function () {
        this.currentSayPriceIndex = -1
        this.timerIndex = 0
        this.isChange = true
        this.$store.dispatch('applyPurchase/loadPurchaseManList', {pageNumber: this.nowPage, pageSize: this.pageSize, enUU: this.user.data.enterprise ? this.user.data.enterprise.uu : null})
      },
      cancelSayPrice: function () {
        this.purchaseManList.content[this.currentSayPriceIndex].active = false
        this.currentSayPriceIndex = -1
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';
  /*add*/
  .floor-list .container{
    padding: 0;
  }
  .floor-list {
    margin-bottom: $xlg-pad;
  }
  .floor-list .container > a > img {
    margin-top: 30px;
  }
  .banner{
    width:1190px;
    height: 253px;
    margin-top: 20px;
    .seek-banner {
      > li{
        float: left;
        padding-left: 14px;
        position: relative;
        &:first-child{
          padding-left: 0;
        }
      }
    }
    .banner-cuxiao {
      width: 660px;
      height: 253px;
      background: url('/images/all/banner-cuxiao02.png') no-repeat;
      .wrap {
        width: 436px;
        .title {
          color: #f57a2e;
          font-size: 20px;
          font-weight: bold;
          padding: 10px 30px;
          margin: 0;
          a {
            font-size: 14px;
            color: #f57a2e;
            float: right;
            margin-top: 7px;
          }
        }
        .list-head {
          height: 30px;
          line-height: 30px;
          color: #fff;
          font-size: 14px;
          background-color: #f57a2e;
          text-align: center;
          span {
            display: inline-block;
            &:nth-child(1) {
              width: 70px;
            }
            &:nth-child(2) {
              width: 144px;
            }
            &:nth-child(3) {
              width: 106px;
            }
            &:nth-child(4) {
              width: 115px;
            }
          }
        }
        ul {
          max-height: 160px;
          overflow: hidden;
          position: relative;
          li {
            height: 32px;
            line-height: 32px;
            position: relative;
            top: 0;
            transition: top 1s;
            -moz-transition: top 1s; /* Firefox 4 */
            -webkit-transition: top 1s; /* Safari and Chrome */
            -o-transition: top 1s; /* Opera */
            > div {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              display: inline-block;
              text-align: center;
              &:first-child {
                color: #f57a2e;
              }
              &:nth-child(1) {
                width: 70px;
              }
              &:nth-child(2) {
                width: 144px;
              }
              &:nth-child(3) {
                width: 106px;
              }
              &:nth-child(4) {
                width: 115px;
              }
              a {
                width: 64px;
                height: 22px;
                line-height: 22px;
                text-align: center;
                padding: 3px 5px;
                color: #fd3904;
                font-size: 12px;
                border-radius: 2px;
                border: 1px solid #fd3904;
                &:hover {
                  border: 1px solid #fd3904;
                  background-color: #fd3904;
                  color: #fff;
                  -moz-box-shadow: 0 3px 5px #f57a2e; /* 老的 Firefox */
                  box-shadow: 0 3px 10px #f57a2e;
                }
                &.is-same {
                  background: #cccbcb;
                  border: none;
                  color: #fff;
                  -webkit-box-shadow: none;
                  -moz-box-shadow: none;
                  box-shadow: none;
                }
              }
              .is-say-price {
                color: #39ae05;
                img {
                  margin-bottom: 2px;
                }
              }
            }
          }
        }
      }
      .purchase {
        position: absolute;
        left: 515px;
        top: 184px;
        width: 100px;
        height: 28px;
        line-height: 28px;
        background-color: #fff;
        color: #f57a2e;
        border-radius: 25px;
        text-align: center;
        font-weight: bold;
        &:hover{
          background-color: #FB6102;
          color: #fff;
          box-shadow: 0px 3px 10px #fd863d;
        }
      }
    }
  }
</style>
