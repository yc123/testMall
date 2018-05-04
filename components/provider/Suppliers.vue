<template>
  <div class="container" id="store-list">
    <table class="table">
      <thead>
      <tr>
        <td width="175"></td>
        <td width="auto"></td>
        <td width="200">
          <div class="input-group" style="display: table;">
            <input class="form-control" type="search" v-model="keyword" placeholder="请输入商家名称" @search="search()" />
            <span class="input-group-btn">
							<button type="button" class="btn btn-default" @click="search()"><i class="iconfont">&#xe6fc;</i></button>
						</span>
          </div>
        </td>
        <td width="150" style="vertical-align: middle"><span>入驻商家：</span><span class="text-message">{{stores ? stores.totalElements : 0}}</span><span>家</span></td>
        <td width="150" style="vertical-align: middle;">
          <a @click="goStoreApply" style="width: 100px; height: 30px; display: inline-block;"><button class="btn btn-primary" style="margin-left: 6px;">立即入驻</button></a>
        </td>
      </tr>
      </thead>
      <tbody>
      <!--<tr>{{$data}}</tr>-->
      <tr v-for="store in stores.content" v-if="store">
        <td>
          <div class="logo">
            <a :href="'/store/' + store.uuid" target="_blank"><img :src="store.logoUrl || '/images/store/common/default.png'" :alt="store.storeName"></a>
          </div>
        </td>
        <td colspan="3">
          <a class="store-name" :href="'/store/' + store.uuid" target="_blank"><div :title="store.storeName">{{store.storeName}}</div></a>
          <div class="store-message">
            <span>商家介绍：</span>
            <span>{{showLittleDescription(store.description)}}<em v-if="store.description.length > 160">...</em></span>
          </div>
        </td>
        <td class="vertical-middle">
          <a :href="'/store/' + store.uuid" target="_blank"><button class="btn btn-primary">进入店铺&nbsp;&gt;</button></a>
        </td>
      </tr>
      <tr v-if="!stores || stores.length == 0">
        <td colspan="10" class="text-center" style="line-height: 40px; font-size: 20px;">
          <i class="fa fa-smile-o fa-lg"></i> 暂无店铺信息
        </td>
      </tr>
      </tbody>
    </table>
    <div style="float: right;">
      <page :total="stores.totalElements" :page-size="pageParams.count"
            :current="pageParams.page" v-on:childEvent="handleCurrentChange"></page>
    </div>
  </div>
</template>
<script>
import Page from '~components/common/page/pageComponent.vue'
export default {
  name: 'suppliers',
  props: ['types'],
  components: {
    Page
  },
  data () {
    return {
      keyword: '',
      pageParams: {
        page: 1,
        count: 10,
        keyword: '',
        types: this.types
      }
    }
  },
  computed: {
    stores () {
      return this.$store.state.provider.stores.storeList.data
    },
    user () {
      return this.$store.state.option.user
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
    search () {
      this.pageParams.page = 1
      this.pageParams.keyword = this.keyword === '' ? null : this.keyword
      this.$store.dispatch('provider/findStoreList', this.pageParams)
    },
    showLittleDescription (description) {
      if (!description || description === '') {
        return '暂无简介'
      }
      return description.slice(0, 160)
    },
    async pageCommodity (pageParams) {
//    pageCommodity (pageParams) {
      pageParams.op = 'pageByType'

      try {
        let { data } = await this.$http.get('/api/store-service/stores', { params: pageParams })
        this.$store.commit('provider/stores/GET_STORE_LIST_SUCCESS', data)
      } catch (err) {
        this.$store.commit('provider/stores/GET_STORE_LIST_FAILURE', err)
      }
//      this.$http.get('/api/store-service/stores', { params: pageParams }).then(response => {
//        this.$store.commit('provider/stores/GET_STORE_LIST_SUCCESS', response)
//      }, err => {
//        this.$store.commit('provider/stores/GET_STORE_LIST_FAILURE', err)
//      })
    },
    handleCurrentChange (page) {
      this.pageParams.page = page
      this.pageParams.keyword = this.keyword === '' ? null : this.keyword

      this.pageCommodity(this.pageParams)
    },
    goStoreApply: function () {
      if (this.user.logged) {
        if (this.enterprise && this.enterprise.isVendor === 313) {
          window.location.href = '/vendor#/store-apply'
        } else {
          this.$router.push('/register-saler')
        }
      } else {
        this.$router.push('/auth/login')
      }
    }
  }
}
</script>
<style scoped>
  .el-pagination .el-pager li.active{
    background-color: #5078cb;
    border-color: #337ab7;
  }

  #store-list{
		width: 1190px;
		padding: 0;
	}

	#store-list table {
		border: 1px solid #d8d4d4;
		font-size: 14px;
	}

	#store-list table>thead>tr {
	  background: none;
		background-color: #f7f7f7;
		font-size: 14px;
		font-weight: 600;
		color: rgb(50,50,50);
	}

	#store-list table>thead>tr input {
		font-weight: 100;
	}

	#store-list .text-message {
		color: rgb(80,120,203);
	}

	#store-list .btn-primary {
		background-color: rgb(80,120,203);
		color: #fff;
		width: 100px;
		height: 30px;
		line-height: 14px;
	}

	#store-list table>tbody .logo {
		width: 150px;
		height: 76px;
		text-align: center;
		line-height: 72px;
		border:1px solid #ccc;
	}

	#store-list table>tbody img {
		max-width: 148px;
		max-height: 72px;
	}

	#store-list table>tbody .vertical-middle{
		vertical-align: middle;
	}

	#store-list table>tbody .store-mark {
		margin: 10px 0;
	}

	#store-list table>tbody .text-point {
		color: #ff3737;
		font-weight: 600;
	}

	#store-list table>tbody .store-name {
		font-size: 17px;
		font-weight: 600;
		color: #000;
	}

	#store-list table>tbody .store-message {
    color: #999;
    width: 95%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-height: 18px;
	}
	#store-list table>tbody tr td{
		padding: 15px;
	}

	@font-face {
    font-family: 'iconfont';  /* project id 357960 */
    src: url('//at.alicdn.com/t/font_sw3uw5ndd9uow29.eot');
    src: url('//at.alicdn.com/t/font_sw3uw5ndd9uow29.eot?#iefix') format('embedded-opentype'),
    url('//at.alicdn.com/t/font_sw3uw5ndd9uow29.woff') format('woff'),
    url('//at.alicdn.com/t/font_sw3uw5ndd9uow29.ttf') format('truetype'),
    url('//at.alicdn.com/t/font_sw3uw5ndd9uow29.svg#iconfont') format('svg');
  }
</style>

