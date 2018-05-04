<template>
  <div class="componentDetail">
    <div class="container">
      <!--<div class="menu">
        <component-menu/>
      </div>-->
      <div class="detail">
        <div class="component-img">
          <img :src="list.img?list.img:list.brand&&list.brand.logoUrl?list.brand.logoUrl:'/images/component/default.png'"/>
        </div>
        <div class="component-message">
          <div class="message-code">
            <span>{{list.code}}</span>
          </div>
          <div class="hr-grey"></div>
          <div class="row">
            <div class="message-detail" v-if="list.brand">
              <div class="message-item">品牌</div>
              <div class="colon">:</div>
              <div :title="list.brand.nameCn"><a class="message-body blue" target="_blank" :href="`/product/brand/${list.brand.uuid}`">{{list.brand.nameCn}}</a></div>
            </div>
            <div class="message-detail">
              <div class="message-item">产品生命周期</div>
              <div class="colon">:</div>
              <div class="message-body">
                {{list.lifecycle | lifecycleFilter}}
              </div>
            </div>
            <div class="message-detail">
              <div class="message-item">总库存量</div>
              <div class="colon">:</div>
              <div class="message-body">{{list.reserve || '暂无库存'}}</div>
            </div>
            <div class="message-detail">
              <div class="message-item">产品描述</div>
              <div class="colon" style="margin-right: 17px">:</div>
              <div class="description"
                   :class="{'more-description':showMoreDesc}"
                   v-if="list.description">
                {{[list.description, showMoreDesc] | descriptionFilter}}
                <span @click="showMoreDesc = !showMoreDesc" v-if="list.description.length > 30">
                  <img :src="!showMoreDesc?'/images/component/circle-arrow-down.png':'/images/component/circle-arrow-up.png'" alt="">
                  <!--<i class="iconfont" :class="{'icon-shouqi':showMoreDesc,'icon-shouqi1':!showMoreDesc}"></i>-->
                  <span v-text="showMoreDesc ? '收起' : '展开'"></span>
                </span>
              </div>
              <div class="description" v-if="!list.description">-</div>
            </div>
            <div class="message-detail">
              <div class="message-item">规格书</div>
              <div class="colon">:</div>
              <div class="message-body">
                <img src="/images/all/pdf.png" alt="" @click="toAttach(list.attach)" v-if="list.attach">
                <span v-if="!list.attach">暂无</span>
              </div>
            </div>
            <div class="message-detail"></div>
            <!--<div class="form-group">-->
               <!--<button type="text" v-if="!collectList" @click="collect(list.id)" class="btn btn-default btn-store">加入收藏</button>-->
               <!--<button class="btn btn-default btn-store" v-if="collectList" disabled="disabled">已收藏</button>-->
            <!--</div>-->
          </div>
        </div>
      </div>
      <div class="product-params">
        <p class="product-params-header">产品参数<span>（仅供参考，以实际产品为准）</span>
          <span v-if="list.properties && list.properties.length > 6" class="show-more-param" @click="showMoreParam = !showMoreParam"><span>{{showMoreParam?'收起':'更多'}}</span><i class="fa" :class="{'fa fa-angle-down': !showMoreParam,'fa fa-angle-up': showMoreParam }"></i></span>
        </p>
        <ul v-if="list.properties && (list.properties.length > 1 || (list.properties.length == 1 && list.properties[0].value))">
          <li v-for="prop in properties">
            <span>{{prop.property.labelCn || '-'}}</span>
            <span :title="prop.value&&prop.value.length > 25 ? switchParams(prop.value, 0): ''">{{prop.value || '-'}}</span>
          </li>
          <li v-if="!isEven(properties.length)">
            <span>-</span>
            <span>-</span>
          </li>
        </ul>
        <div class="empty-param" v-else>
          <img src="/images/all/empty-cart.png" alt="">该产品暂无参数
        </div>
      </div>
    </div>
    <!--关注-->
    <el-dialog
      :visible.sync="dialogVisible"
      size="tiny"
    >
      <h3 class="header-text">收藏成功！</h3>
      <div class="focus modal-body">
        <button type="button" @click="dialogVisible = false" class="btn" style="margin-left:25px;">关&nbsp;&nbsp;闭</button>
        <button type="button" class="focus-btn btn btn btn-info" style="margin-left:35px;">
          <a href="/user#/home/componentcol" target="_blank">查看我的产品收藏</a>
        </button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//  import ComponentMenu from '~components/product/component/componentMenu.vue'
  export default {
    name: 'ComponentDetail',
    data () {
      return {
        dialogVisible: false,
        showMoreDesc: false,
        showMoreParam: false
      }
    },
    computed: {
      lists () {
        return this.$store.state.componentDetail.detail
      },
      list () {
        return this.lists.data
      },
      properties () {
        return this.list.properties && this.list.properties.length > 6 ? this.showMoreParam ? this.list.properties : this.list.properties.slice(0, 6) : this.list.properties
      },
      user () {
        return this.$store.state.option.user
      },
      colList () {
        return this.$store.state.product.common.collectList.data
      },
      collectList () {
        let id = this.lists.data.id
        let store = this.colList
        if (store) {
          for (let i = 0; i < store.length; i++) {
            if (store[i].componentid === id) {
              return true
            }
          }
        } else {
          return false
        }
      },
      stores () {
        return this.$store.state.componentStore.store.data
      },
      store () {
        return this.stores[0] ? this.stores[0] : []
      }
    },
//    components: {
//      ComponentMenu
//    },
    filters: {
      descriptionFilter: function ([str, type]) {
        return !type ? str.length > 30 ? str.substring(0, 30) : str : str
      },
      lifecycleFilter: function (code) {
        if (code === 815) {
          return '正常'
        } else if (code === 816) {
          return '即将停产'
        } else if (code === 817) {
          return '停产'
        } else if (code === 818) {
          return '新品'
        } else {
          return '-'
        }
      }
    },
    methods: {
      isEven: function (num) {
        return num % 2 === 0
      },
      collect (id) {
        if (this.user.logged) {
          this.dialogVisible = true
          let kind = 2
          this.$store.dispatch('product/saveEntity', {componentid: id, kind: kind})
//          this.collectList = true
        } else {
          this.$http.get('/login/page', {params: {returnUrl: window.location.href}}).then(response => {
            if (response.data) {
              window.location.href = response.data.content + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
            }
          })
        }
      },
      toAttach: function (url) {
        if (url === '1') {
          this.$http.get('/login/page', {params: {returnUrl: window.location.href}}).then(response => {
            if (response.data) {
              window.location.href = response.data.content + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
            }
          })
        } else {
          window.open(url)
        }
      },
      switchParams: function (str, index) {
        let tmp = ''
        if (str.length > index + 25) {
          tmp += str.substring(index, index + 25)
          tmp += '\n' + this.switchParams(str, index + 25)
        } else {
          tmp += str.substring(index, str.length - 1)
        }
        return tmp
      }
//      getRealLen: function (str) {
//        let len = 0
//        for (let i = 0; i < str.length; i++) {
//          if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
//            len += 2
//          } else {
//            len++
//          }
//        }
//        return len
//      }
    }
  }
</script>
<style scoped>
  .header-text {
    text-align: center;
    font-size: 20px;
    color: #008B00;
    margin-top: 0;
  }
  .focus button.focus-btn a{
    color: #fff;
    width: 100%;
    height: 100%;
    display: inline-block;
  }
  .focus button.focus-btn{
    width: 138px;
    height: 36px;
    line-height: 36px;
    padding: 0;
  }
  .componentDetail .el-dialog__wrapper .focus-btn a{
    color: #fff;
  }
  .componentDetail .container {
    width: 1190px;
    padding: 0;
  }
  .detail{
    margin-bottom: 36px;
  }
  .componentDetail .container .component-img {
    width: 260px;
    height: 260px;
    display: table-cell;
    border:1px solid #ccc;
    text-align: center;
    vertical-align: middle;
  }
  .componentDetail .container .component-img a {
    display: table-cell;
    width: 258px;
    height: 258px;
    text-align: center;
    vertical-align: middle;
  }
  .componentDetail .container .component-img img {
    max-width: 258px;
    max-height: 258px;
  }
  .componentDetail .blue {
    color: #214797;
  }
  .componentDetail .container .component-message {
    width: 910px;
    display: table-cell;
    padding-left: 20px;
    margin-left: 10px;
  }
  .componentDetail .container .component-message .message-code {
    font-size: 24px;
    color: rgb(50,50,50);
    font-weight: 700;
    line-height: 40px;
  }
  .componentDetail .container .component-message .hr-grey {
    height: 1px;
    width: 100%;
    background-color: #ccc;
  }
  .componentDetail .container .component-message .row {
    margin: 18px 0 0 0;
    position: relative;
  }
  .componentDetail .container .component-message .message-item {
    float:left;
    min-width: 60px;
    text-align: justify;
    text-align-last: justify;
    font-size: 14px;
  }
  .componentDetail .container .component-message .colon {
    float:left;
    margin: 0 10px;
  }
  .componentDetail .container .component-message .message-body {
    float: left;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 93px;
  }
  .componentDetail .container .component-message .message-body >img {
    cursor: pointer;
  }
  .componentDetail .container .component-message .description {
    position: relative;
  }
  .componentDetail .container .component-message .description >span {
    cursor: pointer;
    display: inline-block;
    float: right;
    position: relative;
    bottom: 2px;
  }
  .componentDetail .container .component-message .description >span >img {
    vertical-align: middle;
  }
  .componentDetail .container .component-message .description >span >span {
    color: #5078cb;
    vertical-align: middle;
  }
  .componentDetail .container .component-message .description.more-description {
    padding: 13px 13px 30px 13px;
    border: 1px solid #e5e5e5;
    border-top: none;
    position: absolute;
    right: 94px;
    width: 508px;
    background: #f5f6f8;
    z-index: 1;
    line-height: 22.7px;
  }
  .componentDetail .container .component-message .description.more-description >span {
    position: absolute;
    right: 10px;
    bottom: 7px;
  }
  .componentDetail .container .component-message .message-body a {
    color: #337ab7;
  }
  .componentDetail .container .component-message .message-body:hover a{
    color: #23527c;
  }
  .componentDetail .message-item:first-child {
    padding-left: 0;
  }
  .componentDetail .container .storeIns{
    margin-top: 20px;
    width: 1190px;
    height: 48px;
    line-height: 48px;
  }
  .componentDetail .container .storeIns .sign {
    display: table-cell;
    vertical-align: middle;
    font-size: 14px;
  }
  .componentDetail .container .storeIns .storeInList {
    display: table-cell;
  }
  .componentDetail .container .storeIn {
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
  .componentDetail .container .storeIn-active {
    width: 98px;
    float: left;
    border: 1px solid #5078cb;
    text-align: center;
    vertical-align: middle;
    margin-right: 15px;
    cursor: pointer;
  }
  .componentDetail .container .storeIn a,.componentDetail .storeIn-active a {
    display: table-cell;
    height: 46px;
    width: 98px;
    text-align: center;
    vertical-align: middle;
  }
  .componentDetail .storeIn a>img,.componentDetail .storeIn-active a>img {
    max-width: 95px;
    max-height: 46px;
  }
  .componentDetail .btn-store {
    width: 82px;
    height: 30px;
    color: #fff;
    background: #5078cb;
    border: 1px solid #5078cb;
    position: relative;
    top: 27px;
  }
  .product-params {
    width: 100%;
  }
  .product-params .product-params-header {
    height: 34px;
    line-height: 34px;
    background: #d8e5ff;
  }
  .product-params p.product-params-header {
    margin-bottom: 0;
    padding-left: 9px;
    font-weight: bold;
  }
  .product-params p.product-params-header span {
    font-size: 12px;
  }
  .product-params p.product-params-header .show-more-param {
    float: right;
    font-weight: normal;
    font-size: 14px;
    margin-right: 16px;
    cursor: pointer;
    height: 34px;
  }
  .product-params >ul {
    background: #fff;
    margin-bottom: 37px;
  }
  .product-params >ul li {
    display: inline-block;
    border-bottom: 1px solid #e5e5e5;
    float: left;
  }
  .product-params >ul li span {
    display: inline-block;
    width: 297.2px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-right: 1px solid #e5e5e5;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 15px;
    float: left;
  }
  .product-params >ul li span:nth-child(1) {
    font-weight: bold;
  }
  .product-params >ul li:nth-child(odd) {
    border-left: 1px solid #e5e5e5;
  }
  .product-params >ul li:nth-child(4n), .product-params >ul li:nth-child(4n-1) {
    background: #f5f6f8;
  }
  .component-message .message-detail {
    display: inline-block;
    height: 48px;
    line-height: 48px;
    border-left: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
    width: 300px;
    overflow: hidden;
    padding: 0 11px;
    vertical-align: middle;
  }
  .component-message .message-detail:nth-child(even) {
    width: 596px;
    border-right: 1px solid #e5e5e5;
  }
  .component-message .message-detail:nth-child(odd) {
    width: 200px;
  }
  .component-message .message-detail:nth-child(1),.component-message .message-detail:nth-child(2) {
    border-top: 1px solid #e5e5e5;
  }
  .component-message .message-detail:nth-child(4n),.component-message .message-detail:nth-child(4n-1) {
    background: #f5f6f8;
  }
  .empty-param {
    text-align: center;
    padding: 20px 0;
    color: #999;
    font-size: 12px;
    border: 1px solid #ddd;
  }
</style>
