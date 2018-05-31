<template>
  <div class="user-content">
    <div class="provider">
      <!--<div class="seek">
        <ul class="seek-type" >
          <li :class="{active: providerType == 'enterprise'}" style="width: 33.3%" @click="switchprovide('enterprise')"><div>企业产品库</div></li>
          <li :class="{active: providerType == 'person'}" style="width: 33.3%" @click="switchprovide('person')"><div>个人产品库</div></li>
          <li :class="{active: providerType == 'onLine'}" style="width: 33.3%" @click="switchprovide('onLine')"><div>在售产品</div></li>
        </ul>
      </div>-->
      <div class="search-content" style="border-bottom: 1px solid #f5f5f5;padding-bottom: 0.25rem">
        <input type="text" placeholder="请输入您要查找的型号或品牌" v-model="seekKeyword" @keyup.13="searchSeek">
        <span @click="searchSeek" >
          <i class="iconfont icon-sousuo"></i>
          </span>
      </div>
      <div v-bind:key="item.id"  v-for="(item, index) in GetEnterpriseListData" class="providerList">
        <div v-if="providerType !== 'onLine'">
          <div class="top">
            <div class="icon" :class="item.standard ? 'standed' : 'istanded'"></div>
            <div class="text">
              {{item.pcmpcode}}
            </div>
            <img v-if="item.addProductPerson" class="person-flag" src="/images/mobile/product/personalMaterial.png" alt="">
          </div>
          <div class="content">
            <div class="fl">
              <div class="linetext">类目(产品名称)：
                <template v-if="!item.kind">
                  {{item.kinden || '-'}}
                </template>
                <template v-else>
                  {{item.kind || '-'}}
                </template>
              </div>
              <div class="linetext">品牌：{{item.pbranden}}</div>
              <div class="linetext">单位：PCS</div>
            </div>
            <div class="fr" :class="providerType == 'enterprise' && item.batchCount > 0 ? '' : 'addtop'" >
              <div class="look" v-if="item.batchCount && providerType == 'enterprise'" @click="lookProductitem(item.id, item)" >查看产品</div>
              <div class="add" v-if="providerType == 'enterprise'" @click="addProtoperson(item)" :class="{noadd: item.addProductPerson}">加入个人产品</div>
              <div class="delete" v-if="providerType == 'person'" @click="deleteProvider(item.id, index)">删除</div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="top top2">
            <div class="icon" :class="item.standard ? 'standed' : 'istanded'"></div>
            <div class="text">
              {{item.code}}
            </div>
           <!-- <div class="pms">
              {{item.storeid === '33069557578d44e69bd91ad12d28a8d4' ? '寄售' : '自营'}}
            </div>-->
            <img class="store-type" v-if="item.storeid === '33069557578d44e69bd91ad12d28a8d4'" src="/images/mobile/product/consignment.png" alt="">
            <img class="store-type" src="/images/mobile/product/self.png" alt="" v-else >
          </div>
          <div class="middle">
            <div class="list list-long">
              <div class="fl">
                <div class="name">规格：</div>
                <div class="text">{{item.spec || '-'}}</div>
              </div>
            </div>
            <div class="list">
              <div class="fl">
                <div class="name">类目(产品名称)：</div>
                <div class="text">{{item.kindNameCn || '-'}}</div>
              </div>
              <div class="fr">
                <div class="textinfo" v-if="item.breakUp">可拆卖</div>
              </div>
            </div>
            <div class="list">
              <div class="fl">
                <div class="name">品牌：</div>
                <div class="text">{{item.brandNameEn}}</div>
              </div>
              <div class="fr">
                <div class="name">交期(天)：</div>
                <div class="text" v-if="item.b2cMaxDelivery && (item.b2cMaxDelivery != item.b2cMinDelivery)" v-text="item.b2cMinDelivery + '-'+ item.b2cMaxDelivery"></div>
                <div class="text" v-if="item.b2cMaxDelivery && (item.b2cMaxDelivery == item.b2cMinDelivery)" v-text="item.b2cMinDelivery"></div>
              </div>
            </div>

            <div class="list">
              <div class="fl">
                <div class="name">最小包装数：</div>
                <div class="text">{{item.minPackQty}}</div>
              </div>
              <div class="fr">
                <div class="name">库存：</div>
                <div class="text">{{item.reserve}}</div>
              </div>
            </div>

            <div class="list">
              <div class="fl">
                <div class="name">包装方式：</div>
                <div class="text">{{item.packaging || '无包装信息'}}</div>
              </div>
              <div class="fr">
                <div class="name">最小起订量：</div>
                <div class="text" style="color: #f31919">{{item.minBuyQty}}</div>
              </div>
            </div>

            <div class="list">
              <div class="name">生产日期：</div>
              <div class="text" :title="item.produceDate">{{item.produceDate || '-'}}</div>
            </div>

            <div class="list">
              <div class="name left">价格梯度：</div>
              <div class="table left">
                <ul>
                  <li class="title">
                    <div>分段数量/PCS</div>
                    <div>分段单价</div>
                  </li>
                  <li v-for="price in item.prices">
                    <div>{{price.start}}+</div>
                    <div v-if="item.currencyName == 'RMB'">¥{{price.rMBPrice}}</div>
                    <div v-else>${{price.rMBPrice}}</div>
                  </li>
                </ul>
              </div>
            </div>

          </div>
          <!--<div class="labelinfo">
            <div class="labelicon">标签</div>
            <div class="labeltext">{{item.tag}}</div>
          </div>-->
          <div class="label-text">{{item.tag || '暂无标签信息'}}</div>
        </div>
      </div>
    </div>
    <!-- 企业产品库 查看信息 -->
    <div class="deleteKuang" v-show="showMoreinfn">
      <div class="Kuang">
        <div class="title">产品信息<i data-v-4faa6b2d="" @click="closeMoreinfo()" class="icon-guanbi iconfont"></i></div>
        <div class="content">
          <div class="infob">
            <div class="info"><div class="name">型号：</div><div>{{cnmpCode}}</div></div>
            <div class="info"><div class="name">类目(产品名称)：</div><div>{{cnmpType || '-'}}</div></div>
            <div class="info"><div class="name">品牌：</div><div>{{cnmpBand}}</div></div>
          </div>
          <div class="content_sq" v-bind:key="item.id" v-for="(item, index) in vendorlist" >
            <div class="labelBg">
              <div class="labelinfo" style="margin-left: -0.1rem">
                <div class="labelicon" style="vertical-align:top;margin-top: 0.09rem">标签</div>
                <div class="labeltext">{{item.tag}}</div>
              </div>
              <div class="middle">
                <div class="list">
                  <div class="fl">
                    <div class="name">
                      <div class="pms">
                        {{item.storeid === '33069557578d44e69bd91ad12d28a8d4' ? '寄售' : '自营'}}
                      </div>
                    </div>
                  </div>
                  <div class="fr">
                    <div class="textinfo" v-if="item.breakUp">可拆卖</div>
                  </div>
                </div>
                <div class="list list-long">
                  <div class="fl">
                    <div class="name">规格：</div>
                    <div class="text">{{item.spec || '-'}}</div>
                  </div>
                </div>
                <div class="list">
                  <div class="fl">
                    <div class="name">最小包装数：</div>
                    <div class="text">{{item.minPackQty}}</div>
                  </div>
                  <div class="fr">
                    <div class="name">交期(天)：</div>
                    <div class="text" v-if="item.b2cMaxDelivery && (item.b2cMaxDelivery != item.b2cMinDelivery)" v-text="item.b2cMinDelivery + '-'+ item.b2cMaxDelivery"></div>
                    <div class="text" v-if="item.b2cMaxDelivery && (item.b2cMaxDelivery == item.b2cMinDelivery)" v-text="item.b2cMinDelivery"></div>
                  </div>
                </div>

                <div class="list">
                  <div class="fl">
                    <div class="name">包装方式：</div>
                    <div class="text">{{item.packaging || '无包装信息'}}</div>
                  </div>
                  <div class="fr">
                    <div class="name">库存：</div>
                    <div class="text">{{item.reserve}}</div>
                  </div>
                </div>

                <div class="list">
                  <div class="fl">
                    <div class="name">生产日期：</div>
                    <div class="text" :title="item.produceDate">{{item.produceDate || '-'}}</div>
                  </div>
                  <div class="fr">
                    <div class="name">最小起订量：</div>
                    <div class="text" style="color: #f31919">{{item.minBuyQty}}</div>
                  </div>
                </div>

                <div class="list">
                  <div class="name left">价格梯度：</div>
                  <div class="table left">
                    <ul>
                      <li class="title">
                        <div>分段数量/PCS</div>
                        <div>分段单价</div>
                      </li>
                      <li v-for="price in item.prices">
                        <div>{{price.start}}+</div>
                        <div v-if="item.currencyName == 'RMB'">¥{{price.rMBPrice}}</div>
                        <div v-else>${{price.rMBPrice}}</div>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="deleteKuang" v-show="showDelete">
      <div class="kuangContent">
        <div class="title">删除信息</div>
        <div class="titleinfo">是否删除此信息</div>
        <!--<div class="info" v-show="isUploadpro">*存在已上架信息</div>-->
        <div class="K_btn">
          <div class="cancelBtn" @click="cancelFn()">取消</div>
          <div class="answerBtn" @click="deleteFn()">确定</div>
        </div>
      </div>
    </div>
    <div class="none-state" v-show="StateNone">
      <img src="/images/mobile/@2x/empty-collect.png">
      <p>暂无数据</p>
      <nuxt-link to="/">返回首页</nuxt-link>
    </div>
    <remind-box :title="collectResult" :timeoutCount="timeoutCount"></remind-box>
  </div>
</template>

<script>
  import { RemindBox } from '~components/mobile/common'
  export default {
    layout: 'mobile',
    middleware: 'authenticated',
    name: 'mobileProduct',
    data() {
      return {
        GetEnterpriseListData: [],
        seekPage: 1,
        providerType: this.$route.query.providerType,
        showMoreinfn: false,
        showDelete: false,
        isSearchSearchingMore: false,
        seekKeyword: '',
        collectResult: '',
        timeoutCount: 0,
        EnterprisePage: 1,
        chooseItem: {},
        vendorlist: [] // 查看更多信息
      }
    },
    methods: {
      scroll: function () {
        let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop

//        if (this.$refs.searchSeekInput && this.$store.state.mobile.InputGetFocus) {
//          this.$refs.searchSeekInput.blur()
//        }
        if (Math.ceil(scrolled + window.screen.availHeight) >= document.body.scrollHeight && !this.isSearchSearchingMore && this.seekPage < this.EnterprisePage) {
          this.getMoreSearch()
        }
      },
      searchSeek: function () {
        this.GetEnterpriseListData.splice(0, this.GetEnterpriseListData.length)
        this.GetEnterpriseListData = null
        this.GetEnterpriseListData = []
        this.seekPage = 1
        this.reloadData()
      },
      reloadData: function () {
        this.getResourceProvidor()
      },
//      blur: function() {
//        setTimeout(() => {
//          this.$store.dispatch('mobile/SetInputGetFocus', false)
//        }, 300)
//      },
//      inputGetFocus: function() {
//        setTimeout(() => {
//          this.$store.dispatch('mobile/SetInputGetFocus', true)
//        }, 300)
//      },
      getMoreSearch: function () {
        this.seekPage++
        this.isSearchSearchingMore = true
        this.reloadData()
      },
      // 获取当前企业产品库
      GetEnterpriseList: function() {
        let params = {
          _status: 'all',
          count: 20,
          isStandard: true,
          keyword: this.seekKeyword || '',
          page: this.seekPage,
          sorting: { id: 'DESC' },
          type: 'all'
        }
        return this.$http.get('/trade/products', { params })
      },
      // 获取当前个人产品库
      GetPersonList: function(cb) {
        let params = {
          _status: 'all',
          count: 20,
          isStandard: true,
          keyword: this.seekKeyword || '',
          page: this.seekPage,
          sorting: { id: 'DESC' },
          type: 'all'
        }
        return this.$http.get('/trade/products/person', { params })
      },
      // 获取当前在售产品
      GetOnlineList: function() {
        let params = {
          count: 10,
          keyword: this.seekKeyword || '',
          page: this.seekPage,
          sorting: { 'createdDate': 'DESC' },
          status: '601-602'
        }
        return this.$http.get('/trade/goods/store/status', { params })
      },
      // 产品管理切换
      switchprovide: function(type) {
        this.providerType = type
        this.seekPage = 1
        this.GetEnterpriseListData.splice(0, this.GetEnterpriseListData.length)
        this.GetEnterpriseListData = null
        this.GetEnterpriseListData = []
        this.getResourceProvidor()
      },
      // 删除个人产品库
      deleteProvider: function(id, index) {
        this.showDelete = true
        this.deleteId = id
        // this.deleteItemIndex = index
        // this.$http.get(`/trade/goods/${id}/deleteMessage`).then(response => {
        //   this.isUploadpro = response.data.code
        // })
      },
      deleteFn: function() {
        this.$http.delete(`/trade/products/${this.deleteId}?isPerson=1`).then(response => {
          this.showDelete = false
          this.collectResult = '删除成功'
          this.timeoutCount++
          this.seekPage = 1
          this.GetEnterpriseListData.splice(0, this.GetEnterpriseListData.length)
          this.isChange2 = true
          this.reloadData()
          // this.GetEnterpriseListData.splice(this.deleteItemIndex, 1)
        }, () => {
          this.showDelete = false
          this.collectResult = '删除失败'
          this.timeoutCount++
        })
      },
      cancelFn: function() {
        this.showDelete = false
      },
      // 获取相对应的信息
      getResourceProvidor: function() {
        if (this.providerType === 'enterprise') {
          this.GetEnterpriseList().then(res => {
            this.GetEnterpriseListData = this.GetEnterpriseListData.concat(res.data.content)
            this.EnterprisePage = res.data.totalPages
            this.isSearchSearchingMore = false
            console.log(this.GetEnterpriseListData)
          })
        } else if (this.providerType === 'person') {
          this.GetPersonList().then(res => {
            this.GetEnterpriseListData = this.GetEnterpriseListData.concat(res.data.content)
            this.EnterprisePage = res.data.totalPages
            this.isSearchSearchingMore = false
            console.log(this.GetEnterpriseListData)
          })
        } else if (this.providerType === 'onLine') {
          this.GetOnlineList().then(res => {
            this.GetEnterpriseListData = this.GetEnterpriseListData.concat(res.data.content)
            this.EnterprisePage = res.data.totalPages
            this.isSearchSearchingMore = false
            console.log(this.GetEnterpriseListData)
          })
        }
      },
      // 查看企业产品库更多信息
      lookProductitem: function(id, item) {
        this.chooseItem = item
        this.$http.get(`/trade/products/goods/productid/${id}`).then(res => {
          this.showMoreinfn = true
          this.vendorlist = res.data
        })
      },
      closeMoreinfo: function() {
        this.showMoreinfn = false
      },
      addProtoperson: function(item) {
        if (item.addProductPerson) {
          this.collectResult = '已在个人产品库'
          this.timeoutCount++
          return false
        }
        this.$http.post('/trade/products/person', [item.id])
          .then(response => {
            this.collectResult = '绑定成功'
            this.timeoutCount++
            this.seekPage = 1
            this.GetEnterpriseListData.splice(0, this.GetEnterpriseListData.length)
            this.GetEnterpriseListData = null
            this.GetEnterpriseListData = []
            this.reloadData()
          }, () => {
            this.collectResult = '绑定失败'
            this.timeoutCount++
          })
      }
    },
    computed: {
      // 是否展示空数据
      StateNone() {
        return this.GetEnterpriseListData.length === 0 && this.EnterprisePage === 0
      },
      cnmpCode() { // 型号
        if (this.chooseItem.pcmpcode) {
          return this.chooseItem.pcmpcode
        }
        return ''
      },
      cnmpType() { // 类目
        return this.chooseItem.kind || this.chooseItem.kinden || '-'
      },
      cnmpBand() { // 品牌
        if (this.chooseItem.pbranden) {
          return this.chooseItem.pbranden
        }
        return ''
      },
      shopuuid() {
        return this.$store.state.option.storeStatus.data
      }
    },
    mounted: function () {
      this.$nextTick(() => {
        window.addEventListener('scroll', this.scroll, false)
      })
    },
    created() {
      this.getResourceProvidor()
    },
    components: {
      RemindBox
    }
  }
</script>

<style scoped lang="scss">
  .user-content{
    margin-bottom: .98rem;
    margin-top: 0.88rem;
    .sa-pub {
      display: inline-block;
      width: 1.41rem;
      height: .47rem;
      line-height: .47rem;
      text-align: center;
      color: #fff;
      background: #3f84f6;
      border-radius: .14rem;
    }
    .none-state{
      text-align: center;
      padding:1.5rem 0;
      background: #fff;
      margin-top:.1rem;
      width:100%;
      img{
        margin:0 auto;
        width: 4.08rem;
        height: 2.62rem;
      }
      p {
        font-size: .32rem;
        color: #999;
        margin: 1.19rem 0 0 0;
      }
      a {
        display: block;
        font-size: .28rem;
        color: #fff;
        width: 1.88rem;
        height: .54rem;
        line-height: .54rem;
        background: #418bf6;
        margin: .7rem auto 0;
        border-radius: .05rem;
      }
    }
    .user-name{
      height: 1.8rem;
      padding: .28rem 0 .28rem .34rem;
      background: #fff;
      width: 100%;
      position: relative;
      img{
        display: inline-block;
        width: 1.25rem;
        height: 1.25rem;
        border: 1px solid #c5dbfc;
        border-radius: .05rem;
        vertical-align: middle;
      }
      .user-info {
        margin-left:.25rem;
        display: inline-block;
        vertical-align: middle;
        position: relative;
        p{
          font-size:.3rem;
          margin:0;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 3.92rem;
          &:nth-child(2) {
            position: relative;
            margin-top: .2rem;
            padding-right: .7rem;
            overflow: unset;
            max-width: unset;
            .en-name {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 3.22rem;
              display: inline-block;
            }
            a {
              position: absolute;
              right: 0;
            }
            .exit {
              right: -.8rem;
            }
            .vir {
              position: absolute;
              right: -.14rem;
            }
          }
        }
        .en-list {
          position: absolute;
          max-width: 5rem;
          max-height: 3rem;
          overflow-y: auto;
          border-radius: .05rem;
          background: rgba(0, 0, 0, .6);
          z-index: 10;
          .menu-item {
            height: .6rem;
            line-height: .6rem;
            font-size: .3rem;
            padding: 0 .2rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:active, &:focus, &:hover {
              background: #7d7d7d;
            }
            a {
              color: #fff;
            }
          }

        }
      }
      > a {
        font-size: .24rem;
        position: absolute;
        top: .45rem;
        right: .1rem;
        color: #3f84f6;
        border: 1px solid #3f84f6;
        border-radius: .2rem;
        padding: .06rem .12rem;
      }
    }
    .shop-list {
      background:#fff;
      border-bottom: .1rem solid #dfe2e4;
      padding: .14rem 0 .14rem 0;
      h3{
        font-size: .32rem;
        line-height: .4rem;
        margin: 0 0 0 .27rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-top: .1rem;
        position: relative;
        top: .1rem;
      }
      .list-item{
        width:6.77rem;
        margin-left:.39rem;
        .item-img{
          width:2.4rem;
          vertical-align: middle;
          display: inline-block;
          img{
            &:nth-child(2) {
              width:2.4rem;
              height:1.69rem;
              border: 1px solid #eee;
            }
            &:nth-child(1) {
              position:absolute;
              width:.65rem;
              height:.33rem;
            }
          }
        }
        .list-item-phone{
          width:3.95rem;
          padding:.18rem 0;
          position:relative;
          display: inline-block;
          vertical-align: middle;
          margin-left: .26rem;
          p{
            font-size:.28rem;
            line-height: .67rem;
            margin:0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 3.2rem;
          }
          i{
            display:block;
            position:absolute;
            top: -.06rem;
            right: -.18rem;
            font-size:.5rem;
            color:#ff7800;
            width: .6rem;
            height: .6rem;
            text-align: center;
            line-height: .6rem;
          }
        }
      }
      &:active {
        background: #e1e1e1;
      }
    }
    .detail-brand{
      background: #fff;
      width:100%;
      min-height:1.5rem;
      padding:.2rem 0;
      border-bottom: .1rem solid #dfe2e4;
      &:nth-child(1) {
        margin-top:.1rem;
      }
      .brand-item{
        width:7rem;
        margin:0 auto;
        border-radius:.1rem;
        background: #fff;
        padding:.2rem;
        position:relative;
        &:active{
          background: #e1e1e1;
        }
        p{
          font-size:.28rem;
          line-height:.4rem;
          color:#333;
          margin:0;
        }
        i{
          display:block;
          position:absolute;
          top:.2rem;
          right:.4rem;
          font-size:.5rem;
          color:#ff7800;
          width: .6rem;
          height: .6rem;
          line-height: .6rem;
          text-align: center;
        }
        .sa-pub {
          position: absolute;
          right: 0;
          bottom: .2rem;
        }
      }
      div.active{
        background: #d4d;
      }
    }
    .collect-list-type {
      background: #fff;
      border-bottom: 1px solid #acacac;
      p {
        font-size: .32rem;
        margin: 0 0 0 .13rem;
        width: .92rem;
        text-align: center;
        line-height: .5rem;
        border-bottom: .06rem solid #418bf6;
      }
    }
    ul.switch-list {
      .noshop {
        width: 50%;
      }
      li {
        display: inline-block;
        width: 2.5rem;
        height: .63rem;
        line-height: .63rem;
        text-align: center;
        font-size: .28rem;
        color: #666;
        background: #fff;
        border: 1px solid #b4b4b4;
        border-right: none;
        &.active {
          background: #0067e7;
          border: 1px solid #0067e7;
          color: #fff;
        }
        &:first-child {
          border-left: none;
        }
        &:last-child {
          border-right: none;
        }
      }
      &.vendor-switch {
        li {
          width: 50%;
        }
      }
    }
    .seek {
      .seek-type {
        margin-top: .15rem;
        li {
          font-size: .28rem;
          color: #666;
          display: inline-block;
          width: 50%;
          text-align: center;
          div {
            border-bottom: 1px solid #c1c4c9;
            margin: 0 auto;
            height: .46rem;
            line-height: .46rem;
          }
          &.active {
            color: #3f84f6;
            div {
              border-color: #3f84f6;
            }
          }
        }
      }
    }
    .search-content {
      text-align: center;
      padding: .25rem 0 0 0;
      input {
        border: 1px solid #376ff3;
      }
      span {
        height: .46rem;
        line-height: .46rem;
      }
    }
    .seek-area {
      height: 1.26rem;
      line-height: 1.26rem;
      border-top: .19rem solid #f6f5f5;
      border-bottom: .19rem solid #f6f5f5;
      overflow: hidden;
      /*padding: .32rem 0;*/
      img {
        height: .78rem;
        margin-right: .2rem;
        vertical-align: top;
        margin-top: .1rem;
      }
      .sa-title {
        font-size: .38rem;
        color: #3f84f6;
        line-height: .32rem;
        vertical-align: top;
        margin-top: .1rem;
        span {
          color: #494949;
        }
        .sa-text {
          font-size: .26rem;
          color: #999;
        }
      }
      .sa-pub {
        margin-left: .86rem;
        vertical-align: top;
        margin-top: .23rem;
      }
    }
  }
  .providerList {
    border-top: .31rem solid #f1f3f7;
    .top {
      position: relative;
      &.top2 {
        .text {
          width: 5.4rem;
        }
        .pms {
          color: #f57710;
          border: 1px solid #f57710;
          border-radius: 0.4rem;
          background: #fff;
          font-size: 0.24rem;
          height: 0.4rem;
          line-height: 0.4rem;
          width: 0.8rem;
          text-align: center;
          float: right;
          margin-top: 0.25rem;
        }
        .store-type {
          width: .77rem;
          height: .77rem;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      .icon {
        width: 0.6rem;
        height: 0.36rem;
        line-height: 0.36rem;
        margin-top: 0.27rem;
        float: left;
        background-size: 100%;
        background-repeat: no-repeat;
        margin-right: 0.12rem;
        text-align: center;
        &.istanded{
          background-image: url('/images/mobile/@2x/istanded.png')
        }
        &.standed{
          background-image: url('/images/mobile/@2x/standed.png')
        }
      }
      .person-flag {
        width: .75rem;
        position: absolute;
        right: 0;
      }
      .text {
        float: left;
        width: 6.3rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      padding: 0 0.24rem;
      /*background: #f5f9fd;*/
      border-bottom: 1px solid #d3d3d3;
      height: 0.9rem;
      line-height: 0.9rem;
      color: #0067e7;
      font-size: 0.3rem;
      &::after{
        clear: both;
        display: block;
        content: ' ';
        visibility: hidden;
        zoom: 1;
      }
    }
    .content {
      padding: 0.24rem 0.24rem;
      background: #fff;
      .linetext {
        margin-bottom: 0.24rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:nth-last-of-type(1){
          margin-bottom: 0rem;
        }
      }
      .fl {
        float: left;
        border-right: 1px dashed #e0e0e4;
        width: 4.68rem;
      }
      .fr {
        float: right;
        margin: 0.18rem 0.24rem;
        margin-right: 0rem;
        font-size: 0.3rem;
        &.addtop {
          margin-top: 0.6rem;
          .add {
            background: #0067e7;
            color: #fff;
            &.noadd{
              background: #cccbcb;
              color: #fff;
              border:1px solid #cccbcb;
            }
          }
        }
        div {
          width: 2.1rem;
          height: 0.6rem;
          text-align: center;
          line-height: 0.6rem;
          border-radius: 3px;
          &.look{
            background: #0067e7;
            color: #fff;
          }
          &.add{
            background: #fff;
            color: #0067e7;
            border: 1px solid #0067e7;
          }
          &.delete{
            background: #fff;
            color: #f70415;
            border: 1px solid #f70415;
          }
          &.noadd{
            background: #cccbcb;
            color: #fff;
            border:1px solid #cccbcb;
          }
        }
        div:nth-child(1){
          margin-bottom: 0.26rem
        }
      }
      &::after{
        clear: both;
        display: block;
        content: ' ';
        visibility: hidden;
        zoom: 1;
      }
    }
  }
  .middle {
    padding: 0.24rem 0.24rem 0px;
    background: #fff;
    .pms {
      color: #f57710;
      border: 1px solid #f57710;
      border-radius: 0.4rem;
      background: #fff;
      font-size: 0.24rem;
      height: 0.4rem;
      line-height: 0.4rem;
      width: 0.8rem;
      text-align: center;
    }
    .list {
      .left {
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .textinfo {
        color: #0067e7;
        font-size: 0.3rem
      }
      margin-bottom: 0.18rem;
      &::after{
        clear: both;
        display: block;
        content: ' ';
        visibility: hidden;
        zoom: 1;
      }
      .fl {
        width: 4.4rem;
        float: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .fr {
        text-align: left;
        width: 2.6rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &.list-long {
        .fl {
          width: 100% !important;
        }
      }
      .name {
        color: #666;
        font-size: 0.3rem;
        display: inline-block;
      }
      .text {
        display: inline-block;
        color: #333;
        font-size: 0.3rem
      }
      .table {
        width: 5.5rem;
        margin-bottom: 0;
        margin-top: 0;
        li {
          height: 0.43rem;
          line-height: 0.43rem;
          border-left: .01rem solid #c5c5c5;
          font-size: .28rem;
          &::after {
            clear: both;
            display: block;
            content: ' ';
            visibility: hidden;
            zoom: 1;
          }
          div {
            text-align: center;
            width: 50%;
            float: left;
            border-right: .01rem solid #c5c5c5;
            border-bottom: .01rem solid #c5c5c5;
          }
          &:nth-child(odd) {
            background: #ddd;
            color: #666;
            font-size: 0.28rem;
          }
          &:nth-child(even) {
            background: #fcfcfc;
            color: #666;
            font-size: 0.28rem;
          }
          &:nth-last-of-type(1){
            color: #f31919;
          }
          &.title {
            font-size: 0.28rem;
            color: #333;
          }
        }
      }
    }
  }
  .labelinfo {
    padding: 0 .24rem;
    background: #e6e6e6;
    height: 0.6rem;
    line-height: 0.6rem;
    width: 100%;
    color: #666;
    font-size: 0.26rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .labelicon {
      background-image: url('/images/mobile/@2x/label_icon.png');
      background-repeat: no-repeat;
      width: 0.61rem;
      height: 0.38rem;
      line-height: 0.38rem;
      background-size: 100%;
      color: #fff;
      margin-right: 0.1rem;
      display: inline-block;
      font-size: 0.22rem;
      text-align: center;
      /*vertical-align: middle;*/
    }
    .labeltext{
      display: inline-block;
      /*vertical-align: middle;*/
    }
  }
  .label-text {
    padding: .09rem .21rem;
    border-radius: .22rem;
    background: #ddd;
    font-size: .26rem;
    color: #666;
    display: inline-block;
    margin-left: .22rem;
    margin-bottom: .25rem;
  }
  .deleteKuang {
    position: fixed;
    background: rgba(0,0,0,0.5);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    .kuangContent {
      border-radius: 5px;
      background: #fff;
      width: 5rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      overflow: hidden;
      .titleinfo {
        font-size: .3rem;
        color: #666;
        text-align: center;
        margin-top: 0.5rem;
        margin-bottom: 0.1rem;
      }
      .title {
        background: #5078cb;
        height: .7rem;
        line-height: .7rem;
        font-size: .3rem;
        color: #fff;
        text-align: center;
      }
      .info {
        color: #f00;
        text-align: center;
      }
      .K_btn {
        margin-top: 0.4rem;
        line-height: 0.7rem;
        height: 0.7rem;
        &::after{
          clear: both;
          display: block;
          content: ' ';
          visibility: hidden;
          zoom: 1;
        }
        div {
          float: left;
          width: 50%;
          font-size: 0.3rem;
          text-align: center;
          &.cancelBtn {
            background: #b4b5b9;
            color: #333;
          }
          &.answerBtn {
            background: #5078cb;
            color: #fff;
          }
        }
      }
    }
    i {
      font-size: .6rem;
      position: absolute;
      right: -0.3rem;
      top: -0.35rem;
      color: #fff;
      &::after{
        position: absolute;
        top: -0.1rem;
        left: -0.1rem;
        right: -0.1rem;
        bottom: -0.1rem;
        content: ' '
      }
    }
    .title {
      background: #3f84f6;
      height: 0.7rem;
      line-height: 0.7rem;
      color: #fff;
      text-align: center;
      font-size: 0.3rem;
      position: relative;
    }
    .Kuang {
      max-height: 10rem;
      width: 6.7rem;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate3d(-50%, -50%, 0);
      background: #ececec;
      border-radius: 5px;
    }
    .content {
      overflow-y: scroll;
      max-height: 9.3rem;
      .infob {
        background: #e3edfd;
        padding: 0.2rem;
        .info {
          color: #333;
          font-size: 0.3rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 0.18rem;
          .name {
            color: #666;
          }
          div {
            display: inline-block;
          }
        }
      }
      .content_sq {
        width: 6.4rem;
        margin: 0.1rem auto;
        background: #fff;
        padding: 0.2rem 0;
        .list {
          margin-bottom: 0.18rem;
        }
        .fl {
          width: 3.2rem;
        }
        .table {
          width: 4.2rem;
          margin-top: -0.1rem;
        }
        .labelinfo {
          background-image: url('/images/mobile/@2x/labelTop.png');
          background-repeat: no-repeat;
          width: 6.29rem;
          height: 0.64rem;
          line-height: 0.64rem;
          background-size: 100%;
          margin-top: 0rem;
          margin-right: 0rem;
          background-color: rgba(0, 0, 0, 0);
          color: #666;
        }
      }
    }
  }
</style>
