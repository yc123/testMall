<template>
  <div id="goods-list-fragment">
    <div class="container" style="width: 1190px; padding: 0;">
      <div class="title-area">
        <div class="category-title">
          <span style="line-height: 34px;">产品分类</span>
        </div>
        <div class="category-content">
          <el-tree :data="kinds" :props="defaultProps" :default-expanded-keys="[0]" node-key="id" accordion :highlight-current="true" @current-change="handlerCurrentNode" @node-collapse="onNodeCollapse"></el-tree>
        </div>
      </div>
      <!-- 产品列表 -->
      <div class="goods-area">
        <div class="row" style="margin: 0;width: 970px;">
          <div class="col-md-3 btn-group btn-group-sm" style="padding: 0;">
            <a type="button" class="btn btn-default btn-line btn-info">产品列表</a>
          </div>
          <div class="col-md-5 col-md-offset-4" style="padding: 0;">
            <div class="input-group">
              <input type="search" class="form-control" id="search_input" title="code" placeholder="请输入要筛选的原厂型号"
                     v-model="searchCode" @search="goodsSearch(searchCode)"/>
              <span class="input-group-btn">
							  <button type="button" class="btn" id="search_btn" @click="goodsSearch(searchCode)">&nbsp;筛&nbsp;选&nbsp;</button>
						  </span>
              <span class="input-group-btn">
                <button type="button" class="btn sendprove" @click="sendprove()">我要发布产品</button>
              </span>
            </div>
          </div>

        </div>

        <!-- 列表展示 -->
        <table class="goodslist" style="width: 970px">
          <thead>
          <tr style="height: 40px;">
            <!--<th width="90"></th>-->
            <th width="140">品牌/型号/类目</th>
            <th width="100">包装/生产日期</th>
            <th width="110">库存</th>
            <th width="90">梯度/pcs</th>
            <!--<th width="90">香港交货<span style="font-size: 12px;">($)</span></th>-->
            <!--<th width="100">大陆交货<span style="font-size: 12px;">(￥)</span></th>-->
            <th width="100">单价</th>
            <th width="100">交期(天)</th>
            <th width="90">规格书</th>
            <th width="100">操作</th>
          </tr>
          </thead>
          <tbody id="goodslist-content">
          <tr v-for="commodity in commodities.content" @click="goBatchDetail(commodity.batchCode)">
            <td class="brand-code">
              <img class="sellout-store-commodity" v-if="commodity.status === 602" src="/images/search/sellout-search.png" alt="">
              <img class="specific-price-tag" v-if="isSpecificPriceTag(commodity.tag) && isConsignment" src="/images/floor/specificPrice-store.png" alt="">
              <div class="brand" v-if="commodity.brandNameEn || commodity.brandEn">
                <a v-if="commodity.brandNameEn && commodity.branduuid" @click="goBrandDetail('/product/brand/' + commodity.branduuid, $event)" v-text="commodity.brandNameEn"></a>
                <span v-if="commodity.brandNameEn && !commodity.branduuid" v-text="commodity.brandNameEn"></span>
                <span v-if="commodity.brandEn">{{commodity.brandEn}}</span>
              </div>
              <div class="brand" v-if="!commodity.brandNameEn && !commodity.brandEn">—</div>
              <div class="code" v-if="commodity.code" v-text="commodity.code"></div>
              <div class="code" v-if="!commodity.code">—</div>
              <a v-if="commodity.kindNameCn" @click="goBrandDetail('/product/kind/' + commodity.kindUuid, $event)" v-text="commodity.kindNameCn"></a>
              <div class="brand" v-if="!commodity.kindNameCn">—</div>
            </td>
            <td>
              <div class="package" v-if="commodity.packaging" v-text="commodity.packaging"></div>
              <div class="package" v-if="!commodity.packaging && !commodity.produceDate">—</div>
              <div class="date" v-if='commodity.produceDate' v-text="commodity.produceDate">2016-12-01</div>
            </td>
            <td style="text-align: left;vertical-align: middle;">
              <div class="goods" v-if="commodity.reserve || commodity.status === 602">
                库存：<span v-text="commodity.reserve"></span>
              </div>
              <div v-if="!commodity.reserve && commodity.status !== 602" style="text-align: center;margin-left: 0;"><span>—</span></div>
              <div class="from" v-if="commodity.reserve && commodity.reserve>0 || commodity.status === 602">
                最小起订量：<span v-if="commodity.minBuyQty" v-text="commodity.minBuyQty">300</span>
              </div>
              <!--<div class="multiple">
                倍数：<span>1</span>
              </div>-->
              <div class="can-div-sell" v-if="(commodity.reserve || commodity.status === 602) && commodity.breakUp">可拆卖</div>
            </td>
            <td>
              <div v-for="price in commodity.prices" v-text="price.start + '+'"></div>
            </td>
            <!--<td>-->
              <!--<div v-show="commodity.currencyName.indexOf('USD')==-1 || !commodity.prices">-->
                <!--<span>—</span>-->
              <!--</div>-->
              <!--<div v-for="price in commodity.prices">{{price.uSDPrice | currency}}</div>-->
            <!--</td>-->
            <!--<td>-->
              <!--<div v-show="commodity.currencyName.indexOf('RMB')==-1 || !commodity.prices">-->
                <!--<span>—</span>-->
              <!--</div>-->
              <!--<div v-for="price in commodity.prices" >{{price.rMBPrice | currency}}</div>-->
            <!--</td>-->
            <td>
              <div v-for="price in commodity.prices">{{commodity.currencyName.indexOf('USD')!=-1?'$':'￥'}}{{commodity.currencyName.indexOf('USD')!=-1?price.uSDPrice:price.rMBPrice | currency}}</div>
              <div v-if="commodity.currencyName.indexOf('RMB')==-1 || !commodity.prices && commodity.currencyName.indexOf('USD')==-1 || !commodity.prices"></div>
            </td>
            <td>
              <div v-if="commodity.b2cMinDelivery">
                <!--{{commodity.b2cMinDelivery || 0}}-{{commodity.b2cMaxDelivery || 0}}天-->
                <span v-if="commodity.b2cMinDelivery != commodity.b2cMaxDelivery" v-text="commodity.b2cMinDelivery + '-' + commodity.b2cMaxDelivery"></span>
                <span v-if="commodity.b2cMinDelivery == commodity.b2cMaxDelivery" v-text="commodity.b2cMinDelivery"></span>
              </div>
              <div v-if="!commodity.b2cMinDelivery"><span>—</span></div>
            </td>
            <td>
              <div v-if="commodity.attach">
                <a @click="goAttach(commodity.attach, $event)" target="_blank"><img src="/images/store/common/pdf.png" alt=""/></a>
              </div>
              <div v-if="!commodity.attach">—</div>
            </td>
            <td>
              <buy :item="commodity" :disabledFlag="commodity.status === 602"></buy>
            </td>
          </tr>
          <tr v-if="!commodities.content || commodities.content.length == 0">
            <td colspan="10">
              <div class="text-center">
                <div class="col-xs-offset-4 col-xs-2">
                  <img src="/images/all/empty-cart.png">
                </div>
                <div class="col-xs-4 txt-info">
                  <p class="grey f16">抱歉，暂无上架产品信息</p>
                  <a href="/">马上去逛一逛</a>
                </div>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="remind-area">
          <img src="/images/store/store-remind.png" alt="">
          所有报价、库存信息的真实性及准确性均由店铺负责，如有疑问请点击
          <a @click="goLink" class="link-seller">联系卖家</a>
        </div>
        <page :total="commodities.totalElements" :page-size="pageParams.count"
              :current="pageParams.page" @childEvent="handleCurrentChange"></page>
      </div>
    </div>
    <link-saler-box
      :tel="tel"
      v-if="showLinkBox"
      @cancelAction="showLinkBox = false">
    </link-saler-box>
  </div>
</template>
<script>
function getAllLeafIds (kind) {
  if (!kind) {
    return null
  }
  if (kind.isLeaf === 1) {
    if (kind.nameCn === '其他') {
      return '其他'
    }
    return kind.id
  } else {
    if (!kind.children || kind.children.length === 0) {
      return null
    }
    let ids = []
    for (let i = 0; i < kind.children.length; i++) {
      ids.push(getAllLeafIds(kind.children[i]))
    }
    return ids.join(',')
  }
}
import Buy from '~components/common/buyOrCar/buyComponent.vue'
import Page from '~components/common/page/pageComponent.vue'
import LinkSalerBox from '~components/common/LinkSalerBox.vue'
import { goLinkUser } from '~utils/baseUtils'
export default {
  name: 'commodity-list',
  props: ['kinds'],
  components: {
    Buy,
    Page,
    LinkSalerBox
  },
  data () {
    return {
      defaultProps: {
        children: 'children',
        label: 'nameCn'
      },
      pageParams: {
        page: 1,
        count: 6
      },
      searchCode: '',
      parentKindId: 0,
      ids: null,
      showLinkBox: false,
      tel: ''
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
  computed: {
    commodities () {
      return this.$store.state.shop.storeInfo.storeCommodity.data
    },
    storeInfo () {
      return this.$store.state.shop.storeInfo.store.data
    },
    user () {
      return this.$store.state.option.user
    },
    tab () {
      return this.$store.state.chat.tab.tab.data
    },
    isConsignment () {
      return this.storeInfo.type === 'CONSIGNMENT'
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
    isSpecificPriceTag: function (tag) {
      return tag && tag.indexOf('特价') !== -1
    },
    handlerCurrentNode (data, node) {
      this.searchCode = ''
      if (this.parentKindId === data.id) {
        this.parentKindId = 0
        this.ids = null
      } else {
        if (data.level === 1) {
          this.parentKindId = data.id
        }
        this.ids = getAllLeafIds(data)
      }
      this.pageParams.page = 1

      this.pageCommodity(this.pageParams, this.ids)
    },
    onNodeCollapse () {
      this.parentKindId = ''
    },
    goodsSearch (keyword) {
      this.pageParams.page = 1
      this.pageCommodity(this.pageParams, this.ids, keyword)
    },
    async pageCommodity (pageParams, kindId, keyword) {
//    pageCommodity (pageParams, kindId, keyword) {
      let params = { storeid: this.$route.params.uuid, origin: 'store', kindUuid: kindId === -10 ? '其他' : kindId, code: keyword }
      params.page = pageParams.page
      params.count = pageParams.count

      try {
        let { data } = await this.$http.get('/api/commodity/commodities', { params })
        this.$store.commit('shop/storeInfo/GET_STORE_COMMODITY_SUCCESS', data)
      } catch (err) {
        this.$store.commit('shop/storeInfo/GET_STORE_COMMODITY_FAILURE', err)
      }
//      this.$http.get('/api/commodity/commodities', { params }).then(response => {
//        this.$store.commit('shop/storeInfo/GET_STORE_COMMODITY_SUCCESS', response)
//      }, err => {
//        this.$store.commit('shop/storeInfo/GET_STORE_COMMODITY_FAILURE', err)
//      })
    },
    handleCurrentChange (page) {
      this.pageParams.page = page
      this.pageCommodity(this.pageParams, this.ids, this.searchCode)
    },
    goBatchDetail (batchCode) {
      window.open('/store/productDetail/' + batchCode)
    },
    goBrandDetail (url, event) {
      event.stopPropagation()
      window.open(url)
    },
    goWebChat: function () {
      if (!this.user.logged) {
        this.$http.get('/login/page').then(response => {
          if (response.data) {
            this.$router.push('/auth/login')
          }
        })
      } else {
        // 获得窗口的垂直位置
        let iTop = (window.screen.availHeight - 30 - 780) / 2
        // 获得窗口的水平位置
        let iLeft = (window.screen.availWidth - 10 - 1030) / 2
        if (this.tab.close) {
          this.tab.close()
        }
        let newTab = window.open('', '即时对话框', 'height=750, width=1000, top=' + iTop + ', left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
        newTab.close()
        newTab = window.open('', '即时对话框', 'height=750, width=1000, top=' + iTop + ', left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
        this.$store.dispatch('chat/setChatTab', {tab: newTab})
        this.$http.get('/basic/enterprise/' + this.storeInfo.enUU + '/info')
          .then(response => {
            let obj = {}
            obj.userPhone = this.user.data.userTel
            obj.userType = 'ENTERPRISE'
            this.user.data.enterprises.forEach(function (item, index) {
              if (item.current) {
                obj.enUU = item.uu
                obj.enterprise = {enUU: item.uu, name: item.enName}
              }
            })
            obj.otherEnUU = response.data.uu
            obj.otherUserType = 'STORE'
            obj.otherEnterprise = {enUU: response.data.uu, name: response.data.enName}
            obj.type = 'CHAT'
            if (!(/^1\d{10}$/).test(response.data.enTel)) {
              this.$http.get('/basic/enterprise/' + response.data.uu + '/admin').then(response => {
                obj.toPhone = response.data.userTel
                this.openWebChat(newTab, obj)
              }, err => {
                console.log(err)
                this.$message.error('暂无卖家管理员手机号！')
              })
            } else {
              obj.toPhone = response.data.enTel
              this.openWebChat(newTab, obj)
            }
          }, err => {
            console.log(err)
          })
      }
    },
    openWebChat: function (newTab, obj) {
      this.$http.post('https://im.ubtob.com/api/chat/infos?condition=chat_info', obj)
        .then(response => {
          if (response.data.success) {
            newTab.location.href = 'https://im.ubtob.com/chat/visit?gid=' + response.data.content
          }
        })
    },
//    goBack () {
//      this.$router.back(-1)
//    }
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
    },
    goLink: function () {
      goLinkUser(this, this.storeInfo.enUU)
    }
  }
}
</script>
<style lang="scss">
/*  产品分类调整*/
  .category-content .el-tree{
    border: none;
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content,.el-tree-node:hover{
    background: none !important;
  }
  .el-tree-node__content:hover{
    background: none !important;
  }
  .el-tree-node__content:hover span{
    color: #5078cb;
  }
  .el-pagination .el-pager li.active{
    background-color: #5078cb;
    border-color: #337ab7;
  }
.el-tree-node__expand-icon{
  font-family: "iconfont" !important;
  font-size: 14px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  width: inherit;
  height: inherit;
  border: inherit;
  font-weight: bold;
  text-shadow: -1px 0px 0 #333;
  margin-right: 3px !important;
}
.el-tree-node__content{
  line-height: 30px;
  height: 30px;
}
.el-tree-node__expand-icon.is-leaf{
  visibility: hidden;
}
.el-tree-node__expand-icon:before{
  content: "\E621";
}
	#goods-list-fragment .category-title {
		height: 34px;
		background-color: #5078cb;
		font-size: 14px;
		color: rgb(255,255,255);
		font-weight: 600;
		text-align: center;
	}

	#goods-list-fragment .category-content li {
		line-height: 33px;
		font-size: 14px;
		color: #333;
		float: left;
		width: 100%;
		padding-left: 10px;
	}

	#goods-list-fragment .category-content li a {
		display: block;
		padding-left: 15px;
		text-decoration: none;
		color: #333;
		/* background:url("static/img/store/default/openblackR.png") no-repeat left; */
	}

	#goods-list-fragment .category-content li a:hover{
		color: #5078cb;
		cursor: pointer;
	}

	#goods-list-fragment .category-content ul.list-body {
		display: none;
		color: #666;
	}

	#goods-list-fragment .category-content ul.list-body.active {
		display: block;
	}

	#goods-list-fragment .category-content ul.list-body li {
		float: none;
		background-image: none;
		min-height: 26px;
		line-height: 26px;
		font-size: 12px;
	}

	#goods-list-fragment .category-content ul.list-body li a {
		padding-left: 15px;
		display: block;
		color: rgb(50,50,50);
		background: none;
	}

	#goods-list-fragment .category-content ul.list-body li a:hover {
		color: #5078cb;
		cursor: pointer;
	}

	#goods-list-fragment .category-content ul.list-body li a.cur {
		text-decoration: none;
		font-size: 14px;
		/* background:url("static/img/store/default/openblackR.png") no-repeat left; */
	}

	#goods-list-fragment .title-area {
		margin-bottom: 30px;
		width: 200px;
		float: left;
	}
	#goods-list-fragment .category-content{
		border: 1px solid #e8e8e8;
	}
	/* goods-area */
	#goods-list-fragment .goods-area {
		margin-left: 20px;
		float: left;
		margin-bottom: 30px;
	}

	#goods-list-fragment .goods-area .btn-line {
		border-radius: 0;
	}


	#goods-list-fragment .btn-info.btn-line {
		background-color: #5078CB;
		color: #fff;
		font-weight: 600;
	}

	#goods-list-fragment .btn-line {
		height: 34px;
		width: 150px;
		border: 1px solid #5078cb;
		background-color: #fff;
		color: rgb(80,120,203);
		font-weight: 600;
	}

	#goods-list-fragment .btn-line:hover {
		background-color: #5078CB;
		color: #fff;
	}

	/* 物品列表 */
	#goods-list-fragment .goodslist .brand-code {
		font-size: 14px;
		text-align: center;
    position: relative;
	}

	#goods-list-fragment #search_btn {
		background: #5078CB;
		color: #FFFFFF;
	}

  #goods-list-fragment .sendprove {
    background: #fff;
		color: #5078CB;
    border-radius: 4px;
    border: 1px solid #5078CB;
    float: right;
    margin-left: 10px
  }

  #goods-list-fragment .sendprove:hover {
    background: #5078CB;
		color: #fff;
    cursor: pointer;
    transition: all 0.4s
  }

	#goods-list-fragment #search_input {
		font-size: 14px;
	}

	#goods-list-fragment .brand-code .code {
		font-weight: 600;
	}
#goods-list-fragment .brand-code .brand a:hover {
  color: #f39801;
}

	#goods-list-fragment .goodslist th {
		color: rgb(50,50,50);
		font-size: 14px;
		font-weight: 600;
		background-color: #f7f7f7;
		text-align: center;
	}

	#goods-list-fragment .category-content a.selected-node,
	#goods-list-fragment .category-content ul.list-body li a.selected-node {
		color: #5078cb;
	}

	#goods-list-fragment .category-content a.selected-parent-node,
	#goods-list-fragment .category-content ul.list-body li a.selected-parent-node {
		/* background:url("static/img/store/default/openblack.png") no-repeat left; */
	}

	#goods-list-fragment .goodslist tbody>tr {
		border: 1px solid #e8e8e8;
    cursor: pointer;
	}
#goods-list-fragment .goodslist tbody>tr:hover{
  background: #ecf2fd;
}
  #goods-list-fragment .goodslist tbody>tr td.commodity-icon {
    position: relative;
  }
	#goods-list-fragment .goodslist tbody>tr td.commodity-icon .img{
		border: 1px solid #e8e8e8;
		margin: 10px;
		width: 80px;
		height: 80px;
		overflow: hidden;
		line-height: 75px;
	}
	#goods-list-fragment .goodslist tbody>tr td.commodity-icon .img>img {
		width: 80px;
		height: 80px;
	}
  #goods-list-fragment .goodslist tbody>tr td.brand-code .sellout-store-commodity {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  #goods-list-fragment .goodslist tbody>tr td.brand-code .specific-price-tag {
    position: absolute;
    top: 0;
    left: 0;
  }
	#goods-list-fragment .goodslist td {
		font-size: 12px;
		color: #333;
		text-align: center;
		line-height: 20px;
	}
  #goods-list-fragment .goodslist tbody>tr td .can-div-sell {
    color: #333;
  }

	/* 物品列表按钮 */
	#goods-list-fragment .btn-buy-now {
    margin: 5px 0;
		background-color: #5078CB;
		color: #fff;
		width: 80px;
		height: 30px;
		font-size: 12px;
		border: 1px solid #5078cb;
	}

	#goods-list-fragment .btn-add-cart {
    margin: 10px 0 5px 0;
		color: #214797;
		width: 80px;
		height: 30px;
		font-size: 12px;
		background-color: #fff;
		border: 1px solid #e8e8e8;
	}
	#goods-list-fragment .btn-buy-now:hover{
		background: #214797;
	}
	#goods-list-fragment .btn-add-cart:hover{
		background-color: #5078CB;
		color: #fff;
	}
#goods-list-fragment {
  .no-record{
    font-size: 14px;
    color: #999;
    text-align: center;
    line-height: 200px;
  }
  .no-record i{
    margin-right: 5px;
  }
  .text-center{
    text-align: left;
    padding-top: 80px;
    height:250px;
  }
  .text-center  .col-xs-2  img{
    vertical-align: middle;
  }
  .text-center .txt-info{
    font-size: 14px;
    margin-top: 15px;
  }
  .text-center  .col-xs-4  p{
    color: #999;
    margin-top: 3px;
    margin-bottom: 2px;
  }
  .text-center  .txt-info a{
    font-size: 14px;
    display: block;
    color: #5078cb;
    background: url('/images/all/icon_nianxian.jpg')no-repeat 0 center;
    padding-left: 20px;
  }
  .text-center  .col-xs-4 i{
    color: #5078cb;
    font-size: 14px;
  }
  .goodslist{
    margin-bottom: 11px;
  }
  .remind-area {
    font-size: 12px;
    color: #666;
  }
  .remind-area img {
    margin-right: 12px;
  }
  .remind-area .link-seller {
    font-size: 12px;
    color: #fff;
    line-height: 20px;
    height: 20px;
    padding: 0 7px;
    background: #ef7f03;
    border-radius: 2px;
  }
}

	@font-face {
    font-family: 'iconfont';  /* project id 357960 */
    src: url('//at.alicdn.com/t/font_27kjyd082ezpk3xr.eot');
    src: url('//at.alicdn.com/t/font_27kjyd082ezpk3xr.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_27kjyd082ezpk3xr.woff') format('woff'),
    url('//at.alicdn.com/t/font_27kjyd082ezpk3xr.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_27kjyd082ezpk3xr.svg#iconfont') format('svg');
  }

  #goods-list-fragment .el-pagination .el-pager li.active {
    border-color: #5078cb !important;
    background-color: #5078cb !important;
  }

  #goods-list-fragment .goods-area .page-wrap {
    margin-top: 18px;
  }
</style>
