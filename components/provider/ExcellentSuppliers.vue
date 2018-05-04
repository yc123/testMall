<template>
  <div class="container marketing" style="padding-top: 25px;">
    <div class="head">
      <span class="title">优秀商家</span>
      <nuxt-link class="see-more" :to="'/provider/list'" v-if="isShowMore">查看更多</nuxt-link>
    </div>
    <ul class="list-unstyled list-inline">
      <li class="store-box" v-for="(store, index) in stores" :class="{ 'margin-left-zero' : index % 5 == 0}" >
        <a :href="'/store/' + store.uuid" target="_blank">
          <div class="img"><img :src="store.logoUrl || '/images/store/common/default.png'"/></div>
          <div class="content">
            <div class="name" title="store.storeName">
              <span>{{store.storeName}}</span>
            </div>
            <div class="description">
              商家介绍：<span>{{store.description}}</span>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>

export default {
  name: 'excellent-suppliers',
  props: ['isShowMore'],
  computed: {
    stores () {
      return this.$store.state.provider.storeCms.recommendStore.data
    }
  }
}
</script>
<style scoped>
  .marketing {
		width: 1190px;
		padding: 0px;
	}

	.marketing .store-box {
		width: 220px;
		height: 210px;
		border: 1px solid #D6D3CE;
		margin-left: 25px;
		margin-bottom: 22px;
		overflow: hidden;
	}

	.margin-left-zero {
		margin-left: 0px !important;
	}

	.marketing ul.list-inline {
		margin-left: 0px;
	}

	.marketing .list-inline>li.store-box {
		padding-right: 0;
		padding-left: 0;
		margin-right: -3px;
	}
	.marketing .list-inline>li:last-child {
		margin-right: 0;
	}
	.marketing .see-more {
		float: right;
		width: 70px;
		height: 26px;
		border: 1px solid #d6d3ce;
		color: #214797;
		font-family: "Microsoft Yahei", "微软雅黑";
		font-size: 14px;
		line-height: 26px;
		padding-left: 6px;
		margin-top: 20px;
		border-radius: 3px;
	}
	.marketing .see-more:hover{
		background: #5078cb;
		color: #fff;
	}
	.marketing .see-more:hover {
		cursor: pointer;
	}

	.marketing .title {
		font-size: 24px;
		line-height: 60px;
		height: 60px;
		font-weight: inherit;
	}

	li.store-box:hover {
		border-color: #1162A4;
	}

	.store-box a {
		text-decoration: none;
		display: block;
		text-align: center;
		width: 220px;
		height: 210px;
	}
	.store-box a .description {
		text-align: left;
	}

	.store-box a:hover {
		text-decoration: none;
	}

	.store-box img {

		max-height: 80px;
		max-width: 220px;
		margin-top: 0;
	}

	.store-box .content {
		margin: 0 12px;
		padding: 5px;
		height: 103px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-all;
	}

	.store-box .name {
		font-size: 16px;
		color: #383939;
		text-align: left;
		/*width: 200px;*/
		height: 30px;
		font-weight: 600;
		margin: 10px 0 5px 0;
		display: block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.store-box .subject, .store-box .description {
		margin-bottom: 5px;
		/*width: 200px;*/
		height: 35px;
		font-size: 12px;
		color: #797979;
		line-height: 18px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.store-box .description{
		overflow:hidden;
		text-overflow:ellipsis;
		display:-webkit-box;
		-webkit-box-orient:vertical;
		-webkit-line-clamp: 4;
	}
	.store-box .description span {
		word-break: break-all;
		width: 204px;
		display: inline;
		white-space: pre-wrap;
		word-wrap : break-word ;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.store-index-top {
		height: 360px;
	}

	.store-index-top-left {
		width: 240px;
		float: left;
		display: inline-block;
	}

	.store-index-top-center {
		width: 670px;
		display: inline-block;
		float: left;
		border: 1px solid #D6D3CE;
	}

	.store-index-top-right {
		width: 280px;
		float: left;
		display: inline-block;
	}
	.store-box .img{
		margin-top: 5px;
		width: 220px;
		height: 80px;
		display: inline-block;
		overflow: hidden;
		line-height: 80px;
		text-align: center;
	}
</style>
