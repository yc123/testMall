<template>
  <div style="margin-bottom: 30px;">
    <div id="introduction-fragment">
      <div class="container">
        <div class="menu-com row">
          <div class="menu-title col-md-12">
            <nuxt-link to="/">商城首页</nuxt-link> >
            <nuxt-link to="/provider/home" v-if="storeInfo.type == 'AGENCY' || storeInfo.type == 'DISTRIBUTION'" title="代理经销">代理经销</nuxt-link>
            <nuxt-link to="/provider/factories" v-if="storeInfo.type == 'ORIGINAL_FACTORY'" title="原厂专区">原厂专区</nuxt-link>
            <nuxt-link :to="'/store/' + storeInfo.uuid" v-if="storeInfo.type == 'CONSIGNMENT'" title="库存寄售">库存寄售</nuxt-link>
            >
            <span v-if="storeInfo.type != 'CONSIGNMENT'"><nuxt-link :to="'/store/' + storeInfo.uuid" :title="storeInfo.storeName" v-text="storeInfo.storeName">店铺名称</nuxt-link>> </span>
            <span>了解更多</span>
          </div>
        </div>
        <div class="intro-title row">
          <h3 class="col-xs-2">
            商家介绍
          </h3>
          <nuxt-link class="col-xs-10" :to="'/store/' + storeInfo.uuid">返回店铺</nuxt-link>
        </div>
        <div class="intro-text" v-text="storeInfo.description">店铺简介</div>
      </div>
    </div>
    <div id="contact-fragment">
      <div class="container" style="margin-top: 30px;">
        <div class="contact-title">
          <h3>
            联系我们
          </h3>
        </div>
        <div ng-if="storeInfo.enterprise">
          <div class="contact-text">
            <div v-text="storeInfo.enterprise.enName">深圳市华商龙商务互联科技有限公司</div>
            <div v-if="storeInfo.enterprise.enAddress.length >0">地址：<span v-text="storeInfo.enterprise.enAddress">深圳市南山区科技园科技南五路英唐大厦一楼</span></div>
            <div v-if="storeInfo.enterprise.enTel.length >0">电话：<span v-text="storeInfo.enterprise.enTel">0755-26038000/26038047/26038008/86140880</span></div>
            <div v-if="storeInfo.enterprise.enFax && storeInfo.enterprise.enFax.length > 0">传真：<span v-text="storeInfo.enterprise.enFax">0755-26038111</span></div>
          </div>
        </div>
      </div>
    </div>
    <div id="proof-fragment" v-show="qualifications.length > 0">
      <div class="container" style="margin-top: 30px; margin-bottom: 60px;">
        <div class="proof-title">
          <h3>
            资质证明
          </h3>
        </div>
        <div>
          <div class="div-proof" style="position:relative;" v-for="qualification in qualifications">
            <div v-if="qualification.isPdf">
              <img src="/images/store/common/timg.png" alt="" style="max-width: 124px; max-height: 147px;">
              <div class="hover-show hover-shows">
                <a :href="qualification.resourceUrl" target="_blank"><i class="fa fa-search" style="margin-right: 5px;"></i>查看</a>
              </div>
            </div>
            <div v-if="!qualification.isPdf">
              <a class="img-show">
                <img :src="qualification.resourceUrl"/>
              </a>
              <div class="hover-show" @click="showImg(qualification.resourceUrl)"><i class="fa fa-search" style="margin-right: 5px;"></i>查看</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--查看大图-->
    <div id="image-box" v-if="isShow">
      <div class="x-floating-wrap"></div>
      <div class="x-floating">
        <div id="item-content">
          <div class="x-close-wrap" @click="isShow = false"><a href="javascript:void(0);">&times;</a></div>
          <div class="img"><img :src="imgUrl"/></div>
        </div>
      </div>
    </div>
    <!--查看大图 end-->
  </div>
</template>
<script>

function isPdf (path) {
  // 根据path文件名来判断文件是否是PDF文件
  if (path) {
    let str = path.slice(path.lastIndexOf('.')).toLowerCase()
    if (str === '.pdf') {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

export default {
  name: 'base-info',
  data () {
    return {
      imgUrl: '',
      isShow: false
    }
  },
  computed: {
    storeInfo () {
      return this.$store.state.shop.storeInfo.store.data
    },
    qualifications () {
      let storeInfo = this.$store.state.shop.storeInfo.store.data
      let qualifications = JSON.parse(JSON.stringify(storeInfo.qualifications))
      qualifications = qualifications.filter(qualification => {
        return qualification && qualification.type === 'APTITUDE'
      })
      for (let i = 0; i < qualifications.length; i++) {
        qualifications[i].isPdf = isPdf(qualifications[i].resourceUrl)
      }
      return qualifications || []
    }
  },
  methods: {
    showImg (imgUrl) {
      this.imgUrl = imgUrl
      this.isShow = true
    }
  }
}
</script>
<style scoped>
  #introduction-fragment .intro-title h3 {
		font-size: 24px;
		color: rgb(50,50,50);
	}

	#introduction-fragment .intro-title a {
		font-size: 14px;
		color: rgb(33,71,151);
		margin-top: 25px;
		margin-left: -50px;
	}

	#introduction-fragment .intro-text {
		font-size: 14px;
		color: rgb(50,50,50);
		margin-top: 10px;
		line-height: 30px;
	}

	#introduction-fragment .intro-text{
		text-indent:2em;
	}

  #contact-fragment .contact-title h3 {
		font-size: 24px;
		color: rgb(50,50,50);

	}

	#contact-fragment .contact-text {
		font-size: 14px;
		color: rgb(50,50,50);
		margin-top: 10px;
		line-height: 28px;
	}

  #proof-fragment .proof-title {
		margin-bottom: 10px;
	}

	#proof-fragment .proof-title h3 {
		font-size: 24px;
		color: rgb(50,50,50);
	}

	#proof-fragment .div-proof {
		float: left;
		border: 1px solid #eee;
		margin-right: 47px;
	}
	#proof-fragment .div-proof:last-child{
		margin-right: 0;
	}

	#proof-fragment .div-proof a :HOVER {
		border: 1px solid #5078cb;
	}
	#proof-fragment .div-proof a.img-show :HOVER{
		border: none;
	}
	#proof-fragment .div-proof img {
		max-width: 200px;
		max-height: 200px;
	}
	.div-proof{
		width: 200px;
		height: 200px;
		overflow: hidden;
		line-height: 200px;
		text-align: center;
	}
	.div-proof a{
		display: inline-block;
		width: 100%;
		height: 100%;
	}
	.hover-show{
		position: absolute;
		width: 100%;
		height: 100%;
		top: 100%;
		left: 0;
		background: rgba(0,0,0,.5);
		z-index: 10;
		line-height: 200px;
		text-align: center;
		color: #fff;
		font-size: 14px;
	}
	.div-proof:hover .hover-show{
		top: 0;
		transition: top .3s ease-in;
	}
	.hover-show:hover{
		cursor: pointer;
	}
	.hover-shows a{
		text-decoration: none;
		color: #fff;
	}
	.hover-shows a:hover, .hover-shows a:focus, .hover-shows a:active{
		text-decoration: none;
		color: #fff;
	}
</style>
