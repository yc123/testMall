<template>
  <div id="search-store-content">
  <ul class="store-list" v-if="storeData.content && storeData.content.length > 0">
    <li v-for="(store, index) in storeData.content">
      <div class="store-content-left">
        <a :href="'/store/' + store.uuid" target="_blank">
          <img :src="store.logoUrl?store.logoUrl:'/images/all/default.png'" class="storeImg" alt="">
        </a>
        <div class="store-detail">
          <a :href="'/store/' + store.uuid" target="_blank" :title="store.storeName">{{store.storeName}}</a>
          <span style="position: relative;" class="call-seller">
            <img src="static/img/common/songguo.png?_v=1503050008623">
							<a @click="goLink(store)" href="javascript:void(0)" class="contact_btn">联系卖家</a>
          </span>
          <span class="main-product">
             <a :href="'/store/' + store.uuid" target="_blank" v-text="'店铺简介：' + (store.description || '-')"></a>
          </span>
        </div>
        <div class="component-count">
          <span style="margin-right: 30px">销量：<span v-text="salesData[index]"></span></span>
          <span>库存量：<span v-text="store.totalReserve"></span></span>
        </div>
        <div class="btn-content">
          <a class="focus-store store-btn" @click="focusStore(store, index)" v-text="focusData[index] === 'true'?'已关注':'关注店铺'" :class="{'is-focus': focusData[index] === 'true'}"></a>
          <a :href="'/store/' + store.uuid" target="_blank" class="enter-store store-btn">进入店铺</a>
        </div>
      </div>
      <ul class="store-component-list" v-if="componentData">
        <li v-for="(item, index2) in componentData[index].content" @click="goStore(index, index2)">
          <!--<a :href="`/product/component/${item.uuid}`" style="display: block"><img :src="item.img?item.img:'/images/all/default.png'" alt=""></a>
          <div class="describe-list">
            <a style="margin-bottom: 8px" :href="`/product/component/${item.uuid}`" class="store-component-code" v-text="item.code" :title="item.code"></a>
            <a style="margin-bottom: 8px" :href="`/product/brand/${item.branduuid}`" v-text="item.brandNameEn"></a>
            <a :href="`/product/kind/${item.kindUuid}`" v-text="item.kindNameCn"></a>
          </div>-->
          <img v-if="item.status == 602" class="sellout-store-commodity" src="/images/search/sellout-search.png" alt="">
          <a style="display: block"><img :src="item.img?item.img:'/images/all/default.png'" alt=""></a>
          <div class="describe-list">
            <a class="store-component-code" v-text="item.code" :title="item.code"></a>
            <a v-text="item.brandNameEn" :title="item.brandNameEn"></a>
            <a v-text="item.kindNameCn" :title="item.kindNameCn"></a>
          </div>
        </li>
      </ul>
    </li>
  </ul>
    <div class="empty" v-else>
      <img src="/images/all/empty-cart.png">
      <span>暂无搜索结果</span>
    </div>
    <page :total="storeData.totalElements" :page-size="pageSize"
          :current="nowPage" v-on:childEvent="listenPage"></page>
    <el-dialog
      :visible.sync="dialogVisible"
      size="tiny"
    >
      <h3 class="header-text">关注成功！</h3>
      <div class="focus modal-body">
        <button type="button" @click="dialogVisible = false" class="btn" style="margin-left:25px;">关&nbsp;&nbsp;闭</button>
        <button type="button" @click="dialogVisible = false" class="focus-btn btn btn btn-info" style="margin-left:35px;">
          <a href="/user#/storeFocus" target="_blank">查看我的店铺关注</a>
        </button>
      </div>
    </el-dialog>
    <link-saler-box
      :tel="tel"
      v-if="showLinkBox"
      @cancelAction="showLinkBox = false">
    </link-saler-box>
  </div>
</template>
<script>
  import Page from '~components/common/page/pageComponent.vue'
  import { goLinkUser } from '~utils/baseUtils'
  import LinkSalerBox from '~components/common/LinkSalerBox.vue'
  export default {
    data () {
      return {
        dialogVisible: false,
        pageSize: 8,
        nowPage: 1,
        showLinkBox: false,
        tel: ''
      }
    },
    components: {
      Page,
      LinkSalerBox
    },
    computed: {
      user () {
        return this.$store.state.option.user
      },
      storeDetail () {
        return this.$store.state.searchStore.searchStoreDetail.detail.data
      },
      storeData () {
        return this.storeDetail[0].stores
      },
      focusData () {
        return this.storeDetail[1].isFocus
      },
      componentData () {
        return this.storeDetail[1].image
      },
      salesData () {
        return this.storeDetail[1].sales
      }
    },
    methods: {
      focusStore: function (store, index) {
        if (!this.user.logged) {
          this.$http.get('/login/page').then(response => {
            if (response.data) {
              window.location.href = response.data.content + '&baseUrl=' + encodeURIComponent(window.location.protocol + '//' + window.location.host + response.data.baseUrl)
            }
          })
        } else {
          if (this.focusData[index] === 'true') {
            // 已关注
            this.$message.error('店铺已关注，不能重复关注')
          } else {
            // 未关注
            this.$http.post('/trade/storeFocus/save', {storeName: store.storeName, storeid: store.id})
              .then(response => {
                if (response.data === 'success') {
                  // 关注成功
                  this.dialogVisible = true
                  this.focusData[index] = 'true'
                } else {
                  // 关注失败
                  this.$message.error('关注失败')
                }
              })
          }
        }
      },
      listenPage: function (page) {
        this.$emit('pageAction', page)
      },
      goStore: function (index, compIndex) {
        window.open('/store/productDetail/' + this.componentData[index].content[compIndex].batchCode)
      },
      goLink: function (store) {
        goLinkUser(this, store.enUU)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .store-list {
    border-right: 1px solid rgb( 231, 231, 231 );
    border-left: 1px solid rgb( 231, 231, 231 );
  }
  .store-list >li{
    border-bottom: 1px solid rgb( 231, 231, 231 );
    padding: 20px 0;
  }
  .store-content-left {
    display: inline-block;
    margin-right: 27px;
  }
  .store-content-left .component-count{
    display: block;
    margin-left: 10px;
    margin-top: 20px;
  }
  .store-content-left >div {
    display: inline-block;
  }
  .store-content-left >a {
    color: black;
    float: left;
    width: 100px;
    height: 100px;
    line-height: 100px;
    display: inline-block;
    border: 1px solid rgb( 231, 231, 231 );
    overflow: hidden;
    margin-left: 10px;
  }
  .store-content-left >a >img.storeImg {
    max-width: 100px;
    max-height: 100px;
  }
  .btn-content {
    display: block!important;
    margin-top: 20px;
  }
  .btn-content >span {
    display: block;
  }
  .btn-content >span:hover {
    cursor: pointer;
  }
  .store-detail {
    margin-left: 20px;
  }
  .store-detail >a {
    font-size: 14px;
    font-weight: 700;
    color: black;
    display: block;
    overflow: hidden;
    width: 175px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .store-detail >span{
    display: block;
    font-size: 12px;
    width: 190px;
  }
  .store-detail .call-seller {
    margin-top: 14px;
  }
  .store-detail .call-seller .contact_btn {
    width: 62px;
    height: 18px;
    line-height: 18px;
    background: #ef7f03;
    display: inline-block;
    text-align: center;
    color: #fff;
    font-size: 12px;
    border-radius: 5px;
    margin-left: 5px;
  }
  .store-detail .main-product {
    margin-top: 12px;
  }
  .store-detail .main-product a:hover {
    cursor: pointer;
    color: #5078cb!important;
  }
  .store-detail .main-product a {
    color: #333;
    width: 126px;
    display: inline-block;
    float: left;
    overflow: hidden;
    word-break: break-all;
    height: 35px;
    line-height: 16px;
    text-overflow: ellipsis;
    /*-webkit-line-clamp: 2;
    -moz-line-clamp: 2;
    -o-line-clamp: 2;
    -ms-line-clamp: 2;
    -webkit-box-orient: vertical;
    -moz-box-orient: vertical;
    -o-box-orient: vertical;
    -ms-box-orient: vertical;*/
  }
  .btn-content .store-btn {
    padding: 4px 14px;
    color: white;
    display: inline-block;
  }
  .btn-content .focus-store {
    margin-right: 30px;
    margin-left: 10px;
    background: #5078cb;
    border: 1px solid #5078cb;
  }
  .btn-content .is-focus {
    background: #999;
    border: 1px solid #999;
  }
  .btn-content .enter-store {
    background: #ff8522;
    border: 1px solid #ff8522;
  }
  .store-component-list {
    display: inline-block;
    margin-right: 6px;
    width: 834px;
    float: right;
  }
  .store-component-list >li {
    position: relative;
    display: inline-block;
    text-align: center;
    border: 1px solid rgb( 231, 231, 231 );
    margin-right: 14px;
    width: 152px;
    height: 178px;
    vertical-align: middle;
  }
  .store-component-list >li:hover {
    cursor: pointer;
    color: #fff!important;
    border: 1px solid #5078cb;
  }
  .store-component-list >li:hover .describe-list {
    background: #5078cb;
  }
  .store-component-list >li:hover div a {
    color: #fff;
  }
  .store-component-list >li img {
    width: 149px;
    height:114px;
  }
  .store-component-list >li >img {
    position: absolute;
    width: 62px;
    height: 50px;
    right: 0;
    top: 63px;
  }
  .store-component-list >li .describe-list {
    padding: 2px 10px;
    background: #dee0e5;
    height: 64px;
  }
  .store-component-list >li div a {
    display: block;
    font-size: 14px;
    text-align: left;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
    white-space: nowrap;
  }
 /* .store-component-list >li a:hover {
    color: #f39801;
  }*/
  /*.store-component-list .store-component-code {
  }*/
  .header-text {
    text-align: center;
    font-size: 20px;
    color: #008B00;
    margin-top: 0;
  }
  .focus button.focus-btn a{
    color: #fff;
  }
  .empty{
    text-align: center;
    height: 200px;
    line-height: 200px;
    border: 1px solid #e8e8e8;
    margin-bottom: 10px;
    span {
      color: #999;
      margin-left: 10px;
    }
  }
</style>
