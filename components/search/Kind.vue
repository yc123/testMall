<template>
  <div class="selector" >
    <span class="sendBtn">
      <button type="button" class="btn" id="sendprove" @click="sendprove()">我要发布产品</button>
    </span>
    <a class="show-filter" @click="show_filter = !show_filter">
      <span v-text="show_filter?'收起筛选 ':'展开筛选 '"></span>
      <i :class="show_filter?'fa fa-angle-up':'fa fa-angle-down'"></i>
    </a>
    <div v-show="show_filter">
    <div class="sl-wrap" v-if="good_list.total > 0">
      <div class="sl-key f14">类目：</div>
      <div class="sl-value">
        <span v-for="(kind_temp, index) in kind_exp_arr">
          <div class="sl-filter" @click="click_kind_exp(kind_temp.ki_id, index)">
            <a class="text-num" v-text="kind_temp.ki_name_cn"></a>
            <span><i class="fa fa-close"></i></span>
          </div>
        </span>
        <ul :class="show_kind">
          <li><a class="f14" @click="restore('kind')">全部</a></li>
          <li v-for="(item, index) in list_kind" v-if="item !== ''">
            <a v-text="item.ki_name_cn" class="f14" @click="click_kind(item.ki_id, index)" :title="item.ki_name_cn"></a>
          </li>
        </ul>
      </div>
      <div class="sl-clear"></div>
      <div class="sl-ext">
        <a @click="click_kind_more" v-if="list_kind.length>17">
          <span v-text="kind_open?'更多':'收起'"></span>
          <i class="fa fa-angle-down ng-scope" v-if="kind_open"></i>
          <i class="fa fa-angle-up ng-scope" v-if="!kind_open"></i>
        </a>
      </div>
    </div>
    <div class="sl-wrap" v-if="good_list.total > 0 &&( !list_data_brands || !list_data_brands.uuid )">
      <div class="sl-key f14">品牌：</div>
      <div class="sl-value" >
         <span v-for="(brand_temp, index) in brand_exp_arr" >
          <div class="sl-filter" @click="click_brand_exp(brand_temp.br_id, index)">
            <a class="text-num" v-text="brand_temp.br_name_cn"></a>
            <span><i class="fa fa-close"></i></span>
          </div>
        </span>
        <ul :class="show_brand">
          <li><a class="f14" @click="restore('brand')">全部</a></li>
          <li v-for="(item, index) in list_brand" v-if="item !== ''">
            <a v-text="item.br_name_cn" class="f14" @click="click_brand(item.br_id, index)" :title="item.br_name_cn"></a>
          </li>
        </ul>
      </div>
      <div class="sl-clear"></div>
      <div class="sl-ext" v-if="list_brand.length>17">
        <a @click="click_brand_more">
          <span v-text="brand_open?'更多':'收起'"></span>
          <i class="fa fa-angle-down ng-scope" v-if="brand_open"></i>
          <i class="fa fa-angle-up ng-scope" v-if="!brand_open"></i>
        </a>
      </div>
    </div>
    <div class="sl-wrap" v-if="list_store_type.length != 'undefined' && list_store_type.length > 0" style="height: 40px">
      <div class="sl-key f14">货源：</div>
      <div class="sl-value">
        <ul class="list-inline" >
          <li><a class="f14" @click="restore('store')">全部</a></li>
          <li v-if="getType(list_store_type,store_type_or)">
            <a class="f14" v-if="getType(list_store_type,store_type_or)&&!or_click_flag" @click="click_store_type('ORIGINAL_FACTORY')">原厂</a>
            <span v-if="or_click_flag" @click="cancel_store_type('ORIGINAL_FACTORY')">
              <div class="sl-filter">
                <a class="text-num" >原厂</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="getType(list_store_type,store_type_ag)">
            <a class="f14" v-if="getType(list_store_type,store_type_ag)&&!ag_click_flag" @click="click_store_type('AGENCY')">代理</a>
            <span v-if="ag_click_flag" @click="cancel_store_type('AGENCY')">
              <div class="sl-filter" >
                <a class="text-num" >代理</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="getType(list_store_type,store_type_di)">
            <a class="f14" v-if="getType(list_store_type,store_type_di)&&!di_click_flag" @click="click_store_type('DISTRIBUTION')">经销</a>
            <span v-if="di_click_flag" @click="cancel_store_type('DISTRIBUTION')">
              <div class="sl-filter">
                <a class="text-num" >经销</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="getType(list_store_type,store_type_co)">
            <a class="f14" v-if="getType(list_store_type,store_type_co)&&!co_click_flag" @click="click_store_type('CONSIGNMENT')">寄售</a>
            <span v-if="co_click_flag" @click="cancel_store_type('CONSIGNMENT')">
              <div class="sl-filter">
                <a class="text-num" >寄售</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="!getType(list_store_type,store_type_or)">
            <div class="f14" style="color: #999;" v-if="!getType(list_store_type,store_type_or)&&!or_click_flag">原厂</div>
            <span v-if="or_click_flag" @click="cancel_store_type('ORIGINAL_FACTORY')">
              <div class="sl-filter">
                <a class="text-num" >原厂</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="!getType(list_store_type,store_type_ag)">
            <div class="f14" style="color: #999;" v-if="!getType(list_store_type,store_type_ag)&&!ag_click_flag">代理</div>
            <span v-if="ag_click_flag" @click="cancel_store_type('AGENCY')">
              <div class="sl-filter" >
                <a class="text-num" >代理</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="!getType(list_store_type,store_type_di)">
            <div class="f14" style="color: #999;" v-if="!getType(list_store_type,store_type_di)&&!di_click_flag">经销</div>
            <span v-if="di_click_flag" @click="cancel_store_type('DISTRIBUTION')">
              <div class="sl-filter">
                <a class="text-num" >经销</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="!getType(list_store_type,store_type_co)">
            <div class="f14" style="color: #999;" v-if="!getType(list_store_type,store_type_co)&&!co_click_flag">寄售</div>
            <span v-if="co_click_flag" @click="cancel_store_type('CONSIGNMENT')">
              <div class="sl-filter">
                <a class="text-num" >寄售</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
        </ul>
      </div>

    </div>
    <div class="sl-wrap" v-if="list_crname.length != 'undefined' && list_crname.length > 0" style="height: 40px">
      <div class="sl-key f14">仓库：</div>
      <div class="sl-value">
        <ul class="list-inline"  >
          <li><a class="f14" @click="restore('crname')">全部</a></li>
          <li v-if="!crnameInArr(list_crname_temp, {'cr_name':'RMB'})">
            <a v-if="!crnameInArr(list_crname_temp, {'cr_name':'RMB'})&&!crname_click_flag.rmb_click_flag" class="f14" @click="click_crname('RMB')">大陆</a>
            <div style="color: #999;" v-if="crnameInArr(list_crname_temp, {'cr_name':'RMB'})&&!crname_click_flag.rmb_click_flag" class="f14">大陆</div>
            <span v-if="crname_click_flag.rmb_click_flag" @click="cancel_crname('RMB')">
              <div class="sl-filter">
                <a class="text-num" >大陆</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="!crnameInArr(list_crname_temp, {'cr_name':'USD'})">
            <a v-if="!crnameInArr(list_crname_temp, {'cr_name':'USD'})&&!crname_click_flag.usd_click_flag" class="f14" @click="click_crname('USD')">香港</a>
            <div style="color: #999;" v-if="crnameInArr(list_crname_temp, {'cr_name':'USD'})&&!crname_click_flag.usd_click_flag" class="f14">香港</div>
            <span v-if="crname_click_flag.usd_click_flag" @click="cancel_crname('USD')">
              <div class="sl-filter">
                <a class="text-num" >香港</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="crnameInArr(list_crname_temp, {'cr_name':'RMB'})">
            <a v-if="!crnameInArr(list_crname_temp, {'cr_name':'RMB'})&&!crname_click_flag.rmb_click_flag" class="f14" @click="click_crname('RMB')">大陆</a>
            <div style="color: #999;" v-if="crnameInArr(list_crname_temp, {'cr_name':'RMB'})&&!crname_click_flag.rmb_click_flag" class="f14">大陆</div>
            <span v-if="crname_click_flag.rmb_click_flag" @click="cancel_crname('RMB')">
              <div class="sl-filter">
                <a class="text-num" >大陆</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="crnameInArr(list_crname_temp, {'cr_name':'USD'})">
            <a v-if="!crnameInArr(list_crname_temp, {'cr_name':'USD'})&&!crname_click_flag.usd_click_flag" class="f14" @click="click_crname('USD')">香港</a>
            <div style="color: #999;" v-if="crnameInArr(list_crname_temp, {'cr_name':'USD'})&&!crname_click_flag.usd_click_flag" class="f14">香港</div>
            <span v-if="crname_click_flag.usd_click_flag" @click="cancel_crname('USD')">
              <div class="sl-filter">
                <a class="text-num" >香港</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="sl-wrap" v-if="list_crname.length != 'undefined' && list_crname.length > 0" style="height: 40px">
      <div class="sl-key f14">货币：</div>
      <div class="sl-value">
        <ul class="list-inline"  >
          <li><a class="f14" @click="restore('crname')">全部</a></li>
          <li v-if="!crnameInArr(list_crname_temp, {'cr_name':'RMB'})">
            <a v-if="!crnameInArr(list_crname_temp, {'cr_name':'RMB'})&&!crname_click_flag.rmb_click_flag" class="f14" @click="click_crname('RMB')">人民币</a>
            <div style="color: #999;" v-if="crnameInArr(list_crname_temp, {'cr_name':'RMB'})&&!crname_click_flag.rmb_click_flag" class="f14">人民币</div>
            <span v-if="crname_click_flag.rmb_click_flag" @click="cancel_crname('RMB')">
              <div class="sl-filter">
                <a class="text-num" >人民币</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="!crnameInArr(list_crname_temp, {'cr_name':'USD'})">
            <a v-if="!crnameInArr(list_crname_temp, {'cr_name':'USD'})&&!crname_click_flag.usd_click_flag" class="f14" @click="click_crname('USD')">美元</a>
            <div style="color: #999;" v-if="crnameInArr(list_crname_temp, {'cr_name':'USD'})&&!crname_click_flag.usd_click_flag" class="f14">美元</div>
            <span v-if="crname_click_flag.usd_click_flag" @click="cancel_crname('USD')">
              <div class="sl-filter">
                <a class="text-num" >美元</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="crnameInArr(list_crname_temp, {'cr_name':'RMB'})">
            <a v-if="!crnameInArr(list_crname_temp, {'cr_name':'RMB'})&&!crname_click_flag.rmb_click_flag" class="f14" @click="click_crname('RMB')">人民币</a>
            <div style="color: #999;" v-if="crnameInArr(list_crname_temp, {'cr_name':'RMB'})&&!crname_click_flag.rmb_click_flag" class="f14">人民币</div>
            <span v-if="crname_click_flag.rmb_click_flag" @click="cancel_crname('RMB')">
              <div class="sl-filter">
                <a class="text-num" >人民币</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
          <li v-if="crnameInArr(list_crname_temp, {'cr_name':'USD'})">
            <a v-if="!crnameInArr(list_crname_temp, {'cr_name':'USD'})&&!crname_click_flag.usd_click_flag" class="f14" @click="click_crname('USD')">美元</a>
            <div style="color: #999;" v-if="crnameInArr(list_crname_temp, {'cr_name':'USD'})&&!crname_click_flag.usd_click_flag" class="f14">美元</div>
            <span v-if="crname_click_flag.usd_click_flag" @click="cancel_crname('USD')">
              <div class="sl-filter">
                <a class="text-num" >美元</a>
                <span><i class="fa fa-close"></i></span>
              </div>
            </span>
          </li>
        </ul>
      </div>
    </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        show_filter: true,
        kind_open: true,
        brand_open: true,
        show_kind: 'list-inline',
        show_brand: 'list-inline',
        store_type_co: {store_type: 'CONSIGNMENT'},
        store_type_ag: {store_type: 'AGENCY'},
        store_type_di: {store_type: 'DISTRIBUTION'},
        store_type_or: {store_type: 'ORIGINAL_FACTORY'},
        filter: {},
        kind_arr: [],
        brand_arr: [],
        type_arr: [],
        crname_arr: [],
        kind_exp_arr: [],
        brand_exp_arr: [],
        co_click_flag: false,
        ag_click_flag: false,
        di_click_flag: false,
        or_click_flag: false,
        crname_click_flag: {
          rmb_click_flag: false,
          usd_click_flag: false
        }
      }
    },
    watch: {
      $route: function (val, oldVal) {
        this.store_type_co = {store_type: 'CONSIGNMENT'}
        this.store_type_ag = {store_type: 'AGENCY'}
        this.store_type_di = {store_type: 'DISTRIBUTION'}
        this.store_type_or = {store_type: 'ORIGINAL_FACTORY'}
        this.filter = {}
        this.kind_arr = []
        this.brand_arr = []
        this.type_arr = []
        this.crname_arr = []
        this.kind_exp_arr = []
        this.brand_exp_arr = []
        this.co_click_flag = false
        this.ag_click_flag = false
        this.di_click_flag = false
        this.or_click_flag = false
        this.crname_click_flag = {
          rmb_click_flag: false,
          usd_click_flag: false
        }
      }
    },
    computed: {
      list_kinds () {
        return this.$store.state.searchData.searchKinds.kinds
      },
      list_kind () {
        return this.list_kinds.data
      },
      list_brands () {
        return this.$store.state.searchData.searchBrands.brands
      },
      list_brand () {
        return this.list_brands.data
      },
      list_store_types () {
        return this.$store.state.searchData.searchStoreType.store_type
      },
      list_store_type () {
        return this.list_store_types.data
      },
      list_crnames () {
        return this.$store.state.searchData.searchCrname.crname
      },
      list_crname () {
        return this.list_crnames.data
      },
      list_crname_temp () {
        let arr = this.list_crnames.data
        if (!(JSON.stringify(arr).indexOf(JSON.stringify({cr_name: 'RMB-USD'})) === -1)) {
          return [{cr_name: 'RMB'}, {cr_name: 'USD'}]
        } else {
          return arr
        }
      },
      good_lists () {
        return this.$store.state.searchData.searchList.lists
      },
      good_list () {
        return this.good_lists.data
      },
      list_data_brands () {
        return this.good_list.brands
      },
      enterprise () {
        let ens = this.user.data.enterprises
        if (ens && ens.length) {
          return ens.find(item => item.current) || {enName: '个人账户'}
        } else {
          return {enName: '个人账户'}
        }
      },
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      click_kind_more: function (event) {
        if (this.kind_open) {
          this.show_kind = 'list-inline2'
        } else {
          this.show_kind = 'list-inline'
        }
        this.kind_open = !this.kind_open
      },
      click_brand_more: function (event) {
        if (this.brand_open) {
          this.show_brand = 'list-inline2'
        } else {
          this.show_brand = 'list-inline'
        }
        this.brand_open = !this.brand_open
      },
      getType: function (arr, obj) {
        return !(JSON.stringify(arr).indexOf(obj.store_type) === -1)
      },
      click_kind: function (id, index) {
        this.kind_arr.push(id)
        this.$emit('kindFilterEvent', this.kind_arr)
        this.kind_exp_arr.push(this.list_kind[index])
        this.kind_exp_arr[this.kind_exp_arr.length - 1].index = index
        this.list_kind[index] = ''
      },
      click_brand: function (id, index) {
        this.brand_arr.push(id)
        this.$emit('brandFilterEvent', this.brand_arr)
        this.brand_exp_arr.push(this.list_brand[index])
        this.brand_exp_arr[this.brand_exp_arr.length - 1].index = index
        this.list_brand[index] = ''
      },
      click_store_type: function (type) {
        this.type_arr.push(type)
        this.$emit('typeFilterEvent', this.type_arr)
        if (type === 'CONSIGNMENT') {
          this.co_click_flag = true
        } else if (type === 'AGENCY') {
          this.ag_click_flag = true
        } else if (type === 'DISTRIBUTION') {
          this.di_click_flag = true
        } else if (type === 'ORIGINAL_FACTORY') {
          this.or_click_flag = true
        }
      },
      cancel_store_type: function (type) {
        if (type === 'CONSIGNMENT') {
          this.co_click_flag = false
        } else if (type === 'AGENCY') {
          this.ag_click_flag = false
        } else if (type === 'DISTRIBUTION') {
          this.di_click_flag = false
        } else if (type === 'ORIGINAL_FACTORY') {
          this.or_click_flag = false
        }
        let idx = this.getIndex(this.type_arr, type)
        this.type_arr.splice(idx, 1)
        this.$emit('typeFilterEvent', this.type_arr)
      },
      click_crname: function (name) {
        this.crname_arr.push(name)
        if (this.getIndex(this.crname_arr, 'RMB-USD') === -1) {
          this.crname_arr.push('RMB-USD')
        }
        if (name === 'RMB') {
          this.crname_click_flag.rmb_click_flag = true
        } else if (name === 'USD') {
          this.crname_click_flag.usd_click_flag = true
        }
        this.$emit('crnameFilterEvent', this.crname_arr)
        this.$emit('crnameFlagEvent', this.crname_click_flag)
      },
      cancel_crname: function (name) {
        let idx = this.getIndex(this.crname_arr, name)
        this.crname_arr.splice(idx, 1)
        if (this.crname_arr.length === 1) {
          this.crname_arr = []
        }
        if (name === 'RMB') {
          this.crname_click_flag.rmb_click_flag = false
        } else if (name === 'USD') {
          this.crname_click_flag.usd_click_flag = false
        }
        this.$emit('crnameFilterEvent', this.crname_arr)
        this.$emit('crnameFlagEvent', this.crname_click_flag)
      },
      click_kind_exp: function (id, index) {
        let idx = this.getIndex(this.kind_arr, id)
        this.list_kind[this.kind_exp_arr[index].index] = this.kind_exp_arr[index]
        this.kind_arr.splice(idx, 1)
        this.$emit('kindFilterEvent', this.kind_arr)
        this.kind_exp_arr.splice(index, 1)
      },
      click_brand_exp: function (id, index) {
        let idx = this.getIndex(this.brand_arr, id)
        this.list_brand[this.brand_exp_arr[index].index] = this.brand_exp_arr[index]
        this.brand_arr.splice(idx, 1)
        this.$emit('brandFilterEvent', this.brand_arr)
        this.brand_exp_arr.splice(index, 1)
      },
      restore: function (name) {
        if (name === 'kind') {
          this.list_kind.concat(this.kind_exp_arr)
          this.kind_exp_arr = []
          this.kind_arr = []
          this.$emit('kindFilterEvent', this.kind_arr)
        } else if (name === 'brand') {
          this.list_brand.concat(this.brand_exp_arr)
          this.brand_exp_arr = []
          this.brand_arr = []
          this.$emit('brandFilterEvent', this.brand_arr)
        } else if (name === 'store') {
          this.list_store_type.concat(this.type_arr)
          this.type_arr = []
          this.$emit('typeFilterEvent', this.type_arr)
          this.co_click_flag = false
          this.ag_click_flag = false
          this.di_click_flag = false
          this.or_click_flag = false
        } else if (name === 'crname') {
          this.list_crname.concat(this.crname_arr)
          this.crname_arr = []
          this.crname_click_flag.rmb_click_flag = false
          this.crname_click_flag.usd_click_flag = false
          this.$emit('crnameFlagEvent', this.crname_click_flag)
          this.$emit('crnameFilterEvent', this.crname_arr)
        }
      },
      getIndex: function (arr, obj) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === obj) {
            return i
          }
        }
        return -1
      },
      crnameInArr: function (arr, obj) {
        return (JSON.stringify(arr).indexOf(obj.cr_name) === -1)
      },
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
      }
    }
  }
</script>
<style scoped>
  .show-filter{
    position: relative;
    left: 990px;
    top: -10px;
    color: #888;
    border: 1px solid #aaa;
    padding: 3px 8px;
    background: rgba(238, 238, 238, 0.34);
  }
  #searchResult .selector >div{
    margin-bottom: 20px;
  }
  #searchResult .selector .sl-wrap {
    position: relative;
    padding: 5px 5px;
    font-size: 12px;
    line-height: 30px;
    border: 1px solid #e5e5e5;
    border-bottom: none;
  }
  #searchResult .selector .sl-wrap:last-child {
    border-bottom: 1px solid #e5e5e5;
  }
  #searchResult .selector .sl-wrap .sl-key {
    float: left;
    width: 100px;
  }
  .f14 {
    font-size: 14px;
  }
  #searchResult .selector .sl-wrap .sl-value {
    margin-left: 110px;
    margin-right: 50px;
  }
  #searchResult .selector .sl-wrap .sl-value span >.sl-filter {
    display: inline-block;
    position: relative;
    line-height: 22px;
    padding-left: 10px;
    padding-right: 30px;
    border: 1px solid #ccc;
    cursor: pointer;
    height: 22px;
    margin-right: 10px;
  }
  #searchResult .selector .sl-wrap .sl-value span >.sl-filter a{
    color: #666;
    text-decoration: none;
  }
  #searchResult .selector .sl-wrap .sl-value span >.sl-filter span{
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 20px;
    text-align: center;
    background: #ccc;
    color: #fff;
  }
  #searchResult .selector .sl-wrap .sl-value span >.sl-filter:hover {
    border: 1px solid #f50;
  }
  #searchResult .selector .sl-wrap .sl-value span >.sl-filter:hover a{
    color: #f50;
  }
  #searchResult .selector .sl-wrap .sl-value span >.sl-filter:hover span{
    background: #f50;
  }
  #searchResult .selector .sl-wrap .sl-clear {
    clear: both;
  }
  #searchResult .selector .sl-wrap .sl-ext {
    width: 40px;
    top: 5px;
    position: absolute;
    right: 0;
  }

  .list-inline {
    max-height: 60px;
    overflow: hidden;
    margin-bottom: 0;
    padding-left: 0;
    margin-left: -5px;
    list-style: none;
  }
  .list-inline2 {
    height: 100%;
    overflow: hidden;
    margin-bottom: 0;
    padding-left: 0;
    margin-left: -5px;
    list-style: none;
  }
  .selector .sendBtn {
    position: relative;
    left: 980px;
    top: -11px;
    color: #888;
    z-index: 10;
  }
  .selector #sendprove {
    background: #fff;
		color: #5078CB;
    border: 1px solid #5078CB;
    margin-left: 10px;
    height: 27px;
    padding: 0;
    line-height: 24px;
    padding: 0 8px;
    border-radius: 0px
  }

  .selector #sendprove:hover {
    background: #5078CB;
		color: #fff;
    cursor: pointer;
    transition: all 0.4s
  }
  #searchResult .selector .sl-wrap .sl-value ul >li {
    display: inline-block;
    padding-right: 5px;
    padding-left: 5px;
    margin-right: 20px;
    width: 10%;
    height: 23px;
    line-height: 23px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  #searchResult .selector .sl-wrap .sl-value ul  a{
    color: #1162a4;
  }
  #searchResult .selector .sl-wrap .sl-value ul  a:hover{
    text-decoration: none;
    color: #f50;
  }
  .sl-ext a{
    color: black;
  }
  .sl-ext a:hover{
    color: #5078cb;
    text-decoration: none;
  }

</style>

