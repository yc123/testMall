<template>
  <div class="container" id="title-fragment">
    <div class="container">
      <div class="row" style="margin-bottom: 20px;">
        <!-- 商标展示 -->
        <div class="shop-logo">
          <img :src="storeInfo.logoUrl || '/images/store/common/default.png'" />
        </div>
        <!-- 店名展示 -->
        <div class="shop-banner">
          <img :src="storeInfo.bannerUrl || '/images/store/default/shop_banner.png'">
          <div id="shop-title" v-if="storeInfo.storeShortName" v-text="storeInfo.storeShortName">店铺名称</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'store-title',
  computed: {
    storeInfo () {
      return this.$store.state.shop.storeInfo.store.data
    }
  }
}
</script>
<style scoped>
  #title-fragment {
		padding: 0;
	}
	#title-fragment .container {
		width: 1190px;
		padding-left: 0px;
		padding-right: 0px;
	}
	#title-fragment .container >.row {
		margin-left: 0px;
		margin-right: 0px;
	}
	#title-fragment .shop-logo {
		width: 220px;
		height: 220px;
		border: 1px solid #e8e8e8;
		float: left;
		text-align: center;
		line-height: 210px;
		overflow: hidden;
	}

	#title-fragment .shop-logo img {
		max-width: 220px;
		max-height: 220px;
		vertical-align: middle;
	}

	#title-fragment .shop-banner {
		float: left;
		position: relative;
		width: 970px;
		height: 220px;
		border: 1px solid #e8e8e8;
		border-left: none;
		overflow: hidden;
	}

	#title-fragment .shop-banner img {
		width: 970px;
		height: 220px;
	}

	#title-fragment .shop-banner #shop-title {
		position: absolute;
		top: 50px;
		left: 60px;
		font-size: 30px;
		color: rgb(255,255,255);
	}
	.container{
		width: 1190px;
		padding: 0;
	}
</style>
