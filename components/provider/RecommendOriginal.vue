<template>
  <div class="container" id="recommends">
    <div class="title-icon">原厂推荐</div>
    <div class="hr-blue"></div>
    <ul class="recommend-list list-unstyled list-inline">
      <li class="recommend" v-for="(store, index) in stores">
        <a :href="'/store/' + store.uuid" target="_blank">
          <div class="img"><img :src="store.logoUrl || '/images/store/common/default.png'" /></div>
          <div class="content">
            <div class="name">
              <span :title="store.storeName">{{store.storeName}}</span>
            </div>
            <!--<div class="subject" style="min-height: 5px;">
            </div>-->
            <div class="description">
              <strong>商家介绍</strong>：
              <span>{{store.description || '暂无简介'}}</span>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>

export default {
  name: 'recommend-original',
  computed: {
    stores () {
      return this.$store.state.provider.storeCms.recommendStore.data
    }
  }
}
</script>
<style scoped>
  #recommends {
		width: 1190px;
		padding: 0px;
	}

  .title-icon {
	  font-size: 24px;
    color: #323232;
    margin-bottom: 10px;
	}

	#recommends .hr-blue {
		border-bottom: 2px solid #6493FF;
		border-right: 0px;
		border-top: 0px;
		border-left: 0px;
		width: 100%;
		margin-bottom: 20px;
	}

	#recommends .recommend-list {
		margin-bottom: 20px;
		margin: 0;
	}

	#recommends .recommend-list .recommend {
		width: 220px;
		height: 210px;
		border: 1px solid #D6D3CE;
		margin-right: 22.5px;
	}
	#recommends .recommend-list .recommend:last-child{
		margin-right: 0px !important;
	}
	.margin-left-zero {
		margin-left: 0px !important;
	}
	#recommends .recommend-list .recommend a {
		text-decoration: none;
	}
	#recommends .recommend-list .recommend .img{
		width: 200px;
		height: 80px;
		display: inline-block;
		overflow: hidden;
		line-height: 80px;
		text-align: center;
		margin-top: 5px;
	}
	#recommends .recommend-list .recommend img{
		max-height: 75px;
		max-width: 200px;
		margin-top: 5px;
	}

	#recommends .recommend-list .recommend .content {
		margin: 0 10px;
		height: 108px;
		text-align: left;
	}

	#recommends .recommend-list .recommend .name {
		font-size: 16px;
		color: #383939;
		font-weight: 600;
		width: 200px;
		height: 30px;
		margin-top: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-break: break-all;
	}
	/*#recommends .recommend-list .recommend:hover .name{*/
		/*width: auto;*/
	/*}*/
	#recommends .recommend-list .recommend .subject, #recommends .recommend-list .recommend .description {
		font-size: 12px;
		color: #797979;
		line-height: 18px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		max-height: 36px;
	}
	#recommends .recommend-list .recommend .description{
		margin-top: 5px;
		width: 200px;
		height: 35px;
	}
	#recommends .recommend-list .recommend .subject span {
		width: 204px;
		white-space: pre-wrap;
		word-wrap : break-word ;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#recommends .recommend-list .recommend:hover{
		border: #5078cb 1px solid;
	}
	#recommends .recommend-list .recommend .description span {
		word-break: break-all;
		width: 204px;
		display: inline;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: pre-wrap;
		word-wrap : break-word ;
	}
</style>
