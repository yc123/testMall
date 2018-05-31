<template>
  <div id="component-info-fragment">
    <div class="component-info">
      <div class="head">
        <span class="tab">产品参数<b class="tip">(仅供参考，以实际产品为准)</b></span>
      </div>
      <ul class="list-unstyled list-inline" style="margin-left: 0px;">
        <li v-for="property in component.properties" v-if="property.value">
          <div class="property-name">
            <span v-text="property.property.labelCn"></span>:
          </div>
          <div class="property-value">{{property.value ? property.value : '-'}}</div>
        </li>
        <li v-if="!commodity.uuid || !component.properties || component.properties.length === 0" class="text-info">
          <!--<i class="fa fa-smile-o fa-lg"></i> 暂无参数信息-->
          <span class="info">卖家上传的产品暂无参数,请 <a @click="goLink">联系卖家</a> 了解具体详情</span>
        </li>
      </ul>
    </div>
    <link-saler-box
      :tel="tel"
      v-if="showLinkBox"
      @cancelAction="showLinkBox = false">
    </link-saler-box>
  </div>
</template>
<script>

  import LinkSalerBox from '~components/common/LinkSalerBox.vue'
  import { goLinkUser } from '~utils/baseUtils'

  export default {
    name: 'component-info',
    data () {
      return {
        showLinkBox: false,
        tel: ''
      }
    },
    components: {
      LinkSalerBox
    },
    computed: {
      storeInfo () {
        return this.$store.state.shop.storeInfo.store.data
      },
      user () {
        return this.$store.state.option.user
      },
      component () {
        return this.$store.state.shop.storeInfo.component.data
      },
      commodity () {
        return this.$store.state.shop.storeInfo.commodity.data
      }
    },
    methods: {
      goLink: function () {
        goLinkUser(this, this.storeInfo.enUU)
      }
    }
  }
</script>
<style scoped>
  .component-info {
		width: 906px;
		margin-bottom: 16px;
	}

	.component-info .head {
		background-color: rgb(236, 242, 253);
		height: 40px;
	}

	.component-info ul .tab {
		width: 130px;
	}
	.component-info ul{
		padding-top: 15px;
		padding-bottom: 15px;
	}

	.component-info ul li {
		line-height: 30px;
	}

  .component-info ul li.text-info span.info{
    padding-left: 270px;
    font-size: 14px;
    color: #333;
  }
  .component-info ul li.text-info span.info a{
    font-size: 14px;
    color: #5078cb;
  }
  .component-info ul li.text-info span.info a:hover{
    text-decoration: underline!important ;
  }
	.component-info .head {
		font-size: 14px;
		font-weight: 600;
	}

	.component-info .head .tab {
		line-height: 40px;
		margin-left: 10px;
		text-align: center;
		display: inline-block;
	}

	.component-info ul {
		border: 1px solid #D6D3CE;;
	}

	.component-info ul li {
		line-height: 30px;
		font-size: 12px;
		padding-left: 20px;
	}

	.component-info .property-name {
		width: 130px;
		float: left;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.component-info .property-value {
		float: left;
		width: 740px;
	}

	.tip {
		font-size: 12px;
		color: rgba(168, 181, 181, 0.79);
		margin-left: 5px;
	}
	.ng-hide{
		display: block !important;
	}
</style>
