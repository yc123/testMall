<template>
  <div class="batch-publish">
    <p><img src="/images/applyPurchase/batch-icon.png" alt="">共上传<b class="blue-text">{{bomNumber.successImport || 0}}</b>个产品，其中<span class="red-text">{{bomNumber.nullField || 0}}</span>个产品的必填项缺失，请在当前页完善信息</p>
    <div class="list-wrap" v-if="bomList.content.length">
      <table class="list-content">
        <thead>
        <tr>
          <!--<th width="60">-->
          <!--<label class="com-check-box">-->
          <!--<input type="checkbox" id="all" @change="onCheck()" v-model="isCheckAll">-->
          <!--<label for="all"></label>-->
          <!--</label>全选-->
          <!--</th>-->
          <th width="307">类目/品牌</th>
          <th width="307">型号/规格</th>
          <th width="95">采购数量(PCS)</th>
          <!--<th width="114">生产日期</th>-->
          <th width="136"><i class="red-text">*</i>截止时间</th>
          <th width="186">操作</th>
        </tr>
        </thead>
        <tbody v-for="(item, index) in bomList.content">
        <tr v-if="!item.active">
          <!--<td>
            <label class="com-check-box">
              <input type="checkbox" @change="onCheck(index)" v-model="item.checked" :id="index">
              <label :for="index"></label>
            </label>
          </td>-->
          <td>
            <div class="prod-items">
              <div class="prod-item prod-item-large" :title="item.kind">
                <span class="pi-title">类目(产品名称)：</span>
                <div class="pi-content over-ell">{{item.kind || '-'}}</div>
              </div>
              <!--<div class="prod-item prod-item-small">
                <span class="pi-title">单价预算：</span>
                <div class="pi-content over-ell" v-if="item.unitPrice">{{(item.currency === 'RMB' ? '¥' : '$') + item.unitPrice}}</div>
                <div class="pi-content over-ell" v-else="!item.unitPrice">-</div>
              </div>-->
              <div class="prod-item prod-item-large" :title="item.brand">
                <span class="pi-title"><i class="red-text">*</i>品牌：</span>
                <div class="pi-content over-ell" v-if="item.brand && (!item.brandWord || item.brandWord.length == 0)" :title="item.brand">{{item.brand}}</div>
                <div class="pi-content red-text" v-if="!item.brand">请完善信息</div>
                <div class="pi-content similar-select over-ell" v-if="item.brandWord && item.brandWord.length > 0" @click="setShowBrandWord(index, $event)">{{item.brand}}</div>
                <ul v-show="item.showBrandWord">
                  <li v-for="brand in item.brandWord" @click="modifyItemByWord(index, brand.nameEn, 'brand')" :title="brand.nameEn">{{brand.nameEn}}</li>
                </ul>
              </div>
              <!--<div class="prod-item prod-item-small" :title="item.encapsulation">
                <span class="pi-title">封装：</span>
                <div class="pi-content over-ell">
                  {{item.encapsulation || '-'}}
                </div>
              </div>-->
            </div>
          </td>
          <td>
            <div class="prod-items">
              <div class="prod-item prod-item-large" :title="item.code">
                <span class="pi-title"><i class="red-text">*</i>型号：</span>
                <div class="pi-content over-ell" v-if="item.code && (!item.codeWord || item.codeWord.length == 0)" :title="item.code">{{item.code}}</div>
                <div class="pi-content red-text" v-if="!item.code">请完善信息</div>
                <div class="pi-content over-ell similar-select" v-if="item.codeWord && item.codeWord.length > 0" @click="setShowCodeWord(index, $event)">{{item.code}}</div>
                <ul v-show="item.showCodeWord">
                  <li v-for="code in item.codeWord" @click="modifyItemByWord(index, code.code, 'code')" :title="code.code">{{code.code}}</li>
                </ul>
              </div>
              <!--<div class="prod-item prod-item-small">
                <span class="pi-title">单价预算：</span>
                <div class="pi-content over-ell" v-if="item.unitPrice">{{(item.currency === 'RMB' ? '¥' : '$') + item.unitPrice}}</div>
                <div class="pi-content over-ell" v-else="!item.unitPrice">-</div>
              </div>-->
              <div class="prod-item prod-item-large" :title="item.spec">
                <span class="pi-title">规格：</span>
                <div class="pi-content over-ell">{{item.spec || '-'}}</div>
              </div>
              <!--<div class="prod-item prod-item-small" :title="item.encapsulation">
                <span class="pi-title">封装：</span>
                <div class="pi-content over-ell">
                  {{item.encapsulation || '-'}}
                </div>
              </div>-->
            </div>
          </td>
          <td>
            <div class="over-ell" :title="item.amount">{{item.amount || '-'}}</div>
          </td>
          <!--<td>
            <div class="over-ell" :title="item.produceDate">
              {{item.produceDate || '-'}}
            </div>
          </td>-->
          <td>
            <span v-if="item.deadline">{{item.deadline | date}}</span>
            <span class="red-text" v-if="!item.deadline">请完善信息</span>
            <div class="red-text remind" v-if="!isValidTime(item.deadline)">默认≤90天</div>
          </td>
          <td class="operate">
            <a @click="modifyItem(index)" class="size-s">编辑</a>
            <a @click="deleteItem(index)" class="size-s">删除</a>
            <a @click="setShowSpotGoods(true, item)" class="size-m" v-if="item.spotGoods && item.spotGoods.length && !item.showSpotGoods">商城现货&nbsp;<i class="fa fa-angle-double-down"></i></a>
            <a @click="setShowSpotGoods(false)" class="size-m" v-if="item.spotGoods && item.spotGoods.length && item.showSpotGoods">收起&nbsp;<i class="fa fa-angle-double-up"></i></a>
          </td>
        </tr>
        <tr class="spot-goods" v-if="item.showSpotGoods">
          <td colspan="5">
            <div class="spot-goods-body">
              <div class="spot-goods-title">商城现货（{{spotGoodsData.length || 0}}）</div>
              <table>
                <thead>
                <tr>
                  <th width="214">卖家</th>
                  <th width="83">交期(天)</th>
                  <th width="104">单价</th>
                  <th width="137">生产日期</th>
                  <th width="111">库存</th>
                  <th width="142">购买数量</th>
                  <th width="186">操作</th>
                </tr>
                </thead>
              </table>
              <div class="spot-goods-list">
                <table>
                  <tbody>
                  <tr v-for="(spotGoods, index) in spotGoodsData">
                    <td width="214" v-text="spotGoods.storeName"></td>
                    <td width="83" class="red-text" v-text="spotGoods.b2cMinDelivery + '-' + spotGoods.b2cMaxDelivery">4-6</td>
                    <td width="104" class="red-text" v-text="spotGoods.currencyName == 'RMB' ? '¥' + spotGoods.prices[0].rMBPrice: '$' + spotGoods.prices[0].uSDPrice"></td>
                    <td width="137" v-text="spotGoods.produceDate"></td>
                    <td width="111" v-text="spotGoods.reserve">21412</td>
                    <td width="142" class="input-number">
                      <div>
                        <span @click="subNum(index)" :class="{'not-allowed': !fragments[index].canSub}">-</span>
                        <input type="number" v-model="fragments[index].num" @blur="inputNum(index)">
                        <span @click="addNum(index)" :class="{'not-allowed': !fragments[index].canAdd}">+</span>
                      </div>
                    </td>
                    <td width="186" class="operate">
                      <a href="javascript:void(0)" @click="linkSaler(spotGoods)">联系卖家<img src="/images/applyPurchase/link-buyer.png" alt=""></a>
                      <span @click="buyNow(spotGoods, index)">立即购买</span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
        <tr class="modify-row" v-if="item.active">
          <!-- <td>
             <label class="com-check-box">
               <input type="checkbox" @change="onCheck(index)" v-model="item.checked" :id="index">
               <label :for="index"></label>
             </label>
           </td>-->
          <td>
            <div class="prod-items">
              <div class="prod-item prod-item-large">
                <span class="pi-title">类目(产品名称)：</span>
                <input type="text" class="form-control" v-model="modifyObj.kind" @input="onProdTitleInput">
              </div>
              <div class="prod-item prod-item-large">
                <span class="pi-title"><i class="red-text">*</i>品牌：</span>
                <input type="text" class="form-control" v-model="modifyObj.brand" :class="{'error': !validObj.brand}" @blur="checkBrand" @input="onBrandChange">
                <ul class="brand-similar-list" v-show="showSimilarBrandList">
                  <li v-for="sBrand in similarBrand" @click="setBrand(sBrand.nameEn)">{{sBrand.nameEn}}</li>
                </ul>
              </div>
              <!--<div class="prod-item prod-item-small pi-select">
                <span class="pi-title">单价预算：</span>
                <select class="form-control" v-model="modifyObj.currency">
                  <option value="RMB">¥</option>
                  <option value="USD">$</option>
                </select>
                <input class="form-control" type="number" v-model="modifyObj.unitPrice" :class="{'error': !validObj.unitPrice}" @blur="checkUnitPrice" @input="onUnitPriceInput">
              </div>-->
              <!--<div class="prod-item prod-item-small">
                <span class="pi-title">封装：</span>
                <input type="text" class="form-control" v-model="modifyObj.encapsulation" @input="onEncapsulationChange">
              </div>-->
            </div>
          </td>
          <td>
            <div class="prod-items">
              <div class="prod-item prod-item-large">
                <span class="pi-title"><i class="red-text">*</i>型号：</span>
                <input type="text" class="form-control" v-model="modifyObj.code" :class="{'error': !validObj.code}" @blur="checkCode" @input="onCodeChange" >
                <ul v-show="showSimilarCodeList">
                  <li v-for="sCode in similarCode" @click="setCode(sCode.code)">{{sCode.code}}</li>
                </ul>
              </div>
              <div class="prod-item prod-item-large">
                <span class="pi-title">规格：</span>
                <input type="text" class="form-control" v-model="modifyObj.spec" :class="{'error': !validObj.spec}" @input="onSpecInput" @blur="checkSpec">
              </div>
            </div>
          </td>
          <td>
            <input type="text" class="form-control" v-model="modifyObj.amount" :class="{'error': !validObj.amount}" @blur="checkAmount" @input="onAmountInput">
          </td>
          <!--<td>
            <input type="text" class="form-control" v-model="modifyObj.produceDate" @input="onProduceDateChange">
          </td>-->
          <td>
            <el-date-picker
              v-model="modifyObj.deadline"
              type="date"
              :picker-options="pickerOptions"
              :editable="false"
              :class="{'error': !validObj.deadline}"
              @change="getDate1()"
              size="mini">
            </el-date-picker>
            <!--<input type="text" class="form-control" v-model="modifyObj.deadline">-->
          </td>
          <td class="operate">
            <a class="btn-ok size-s" @click="submitModify(index)">确认</a>
            <a class="btn-cancel size-s" @click="cancelModify(index)">取消</a>
          </td>
        </tr>
        </tbody>
      </table>
      <page :total="bomList.totalElements" :page-size="pageSize"
            :current="nowPage" @childEvent="listenPage"></page>
      <div class="submit-area" v-if="bomList.content.length">
        <!--  <a class="modify-btn" @click="deleteItem()">删除</a>-->
        <a class="modify-btn" @click="submitBOM">确认发布</a>
      </div>
    </div>
  </div>
</template>
<script>
  import { enidfilter, getRealLen, cutOutString, formatDate, checkNullStr } from '~utils/baseUtils'
  import Page from '~components/common/page/pageComponent.vue'
  export default {
    data () {
      return {
        pageSize: 10,
        nowPage: 1,
        isCheckAll: false,
//        showRemindBox: false,
        modifyObj: {
          code: '',
          brand: '',
          unitPrice: '',
          currency: 'RMB',
          encapsulation: '',
          produceDate: '',
          amount: '',
          deadline: '',
          kind: '',
          spec: ''
        },
        pickerOptions: {
          disabledDate (time) {
            // 大于等于今天 小于三个月后
            return time.getTime() < Date.now() - 1000 * 60 * 60 * 24 || time.getTime() > Date.now() + 1000 * 60 * 60 * 24 * 30 * 3
          }
        },
        similarCode: [],
        similarBrand: [],
        validObj: {
          code: true,
          brand: true,
          unitPrice: true,
//          encapsulation: true,
//          produceDate: true,
          amount: true,
          deadline: true,
          spec: true
        },
//        successResult: 0,
        showSimilarCodeList: false,
        showSimilarBrandList: false,
        spotGoodsData: [],
        fragments: [],
        bomList: {}
      }
    },
    components: {
      Page
    },
    watch: {
      '$store.state.applyPurchase.bomMaterial.bomList.data': {
        handler: function (val) {
          let _this = this
          let list = JSON.parse(JSON.stringify(val))
          list.content = list.content.slice()
          for (let i = 0; i < list.content.length; i++) {
            _this.$set(list.content[i], 'checked', false)
            _this.$set(list.content[i], 'active', false)
            _this.$set(list.content[i], 'showCodeWord', false)
            _this.$set(list.content[i], 'showBrandWord', false)
            _this.$set(list.content[i], 'showSpotGoods', false)
          }
          this.bomList = list
        },
        immediate: true
      }
    },
    computed: {
//      bomList () {
//        let _this = this
//        let list = JSON.parse(JSON.stringify(this.$store.state.applyPurchase.bomMaterial.bomList.data))
//        list.content = list.content.slice()
//        for (let i = 0; i < list.content.length; i++) {
//          _this.$set(list.content[i], 'checked', false)
//          _this.$set(list.content[i], 'active', false)
//          _this.$set(list.content[i], 'showCodeWord', false)
//          _this.$set(list.content[i], 'showBrandWord', false)
//          _this.$set(list.content[i], 'showSpotGoods', false)
// //          list.content[i].checked = false
// //          list.content[i].active = false
// //          if (!list.content[i].code || list.content[i].brand || !list.content[i].deadline || !this.isValidDate(list.content[i].deadline)) {
// //            _this.validList = false
// //          }
//        }
//        console.log(list)
//        return list
//      },
      bomNumber () {
        return this.$store.state.applyPurchase.bomMaterial.bomNumber.data
      },
      tab () {
        return this.$store.state.chat.tab.tab.data
      },
      user () {
        return this.$store.state.option.user
      }
    },
    mounted () {
      let _this = this
      document.body.onclick = function () {
        _this.showSimilarCodeList = false
        _this.showSimilarBrandList = false
        for (let i = 0; i < _this.bomList.content.length; i++) {
          _this.bomList.content[i].showCodeWord = false
          _this.bomList.content[i].showBrandWord = false
        }
      }
    },
    filters: {
      date: function (input) {
        if (input) {
          const d = new Date(input)
          const year = d.getFullYear()
          const monthTemp = d.getMonth() + 1
          const month = monthTemp < 10 ? '0' + monthTemp : '' + monthTemp
          const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
          return year + '-' + month + '-' + day
        } else {
          return null
        }
      },
      currencyStr: function (str) {
        return typeof str === 'string' && str !== 'RMB' && str !== 'USD' ? str.startsWith('RMB') ? '¥' + str.substring(3, str.length) : '$' + str.substring(3, str.length) : '-'
      }
    },
    methods: {
      getDate1: function () {
        this.modifyObj.deadline = formatDate(this.modifyObj.deadline, 'yyyy-MM-dd hh:mm:ss')
        this.validObj.deadline = true
      },
      initModifyObj: function () {
        for (let attr in this.modifyObj) {
          this.modifyObj[attr] = attr === 'currency' ? 'RMB' : ''
        }
      },
      initValidObj: function () {
        this.validObj = {
          code: true,
          brand: true,
          unitPrice: true,
          amount: true,
          deadline: true,
          spec: true
        }
      },
      listenPage: function (page) {
        this.nowPage = page
        this.reloadData()
      },
      reloadData: function () {
        this.$store.dispatch('applyPurchase/loadBOMMaterialList', {bomId: this.$route.params.id, page: this.nowPage, count: this.pageSize})
      },
      submitBOM: function () {
//        let str = ''
//        for (let i = 0; i < this.bomList.content.length; i++) {
//          if (this.bomList.content[i].checked) {
//            if (!this.getSingleValidInfo(this.bomList.content[i])) {
//              this.$message.error('请选择信息完善的产品发布求购')
//              return
//            }
//            str += this.bomList.content[i].id + ','
//          }
//        }
//        let param = {'bomId': Number(this.$route.params.id)}
//        if (str.length) {
//          str = str.substring(0, str.length - 1)
//          param.spIds = str
//        }
        this.$http.post('/seek/confirmBom?bomId=' + Number(this.$route.params.id))
          .then(response => {
            if (response.data.success) {
//              this.showRemindBox = true
//              this.successResult = response.data.data
//              this.listenPage(1)
//              this.$store.dispatch('applyPurchase/loadBOMNumber', {bomId: this.$route.params.id})
              if (response.data.data.successAmount && response.data.data.successAmount > 0) {
                this.$router.push('/applyPurchase/result?status=success&count=' + response.data.data.successAmount)
              } else {
                this.$router.push('/applyPurchase/result?status=error')
              }
            } else {
//              this.$message.error(response.data.message)
              this.$router.push('/applyPurchase/result?status=error')
            }
          }, err => {
            console.log(err)
            this.$message.error('系统错误')
          })
      },
      onCheck: function (index) {
        if (typeof index === 'undefined') {
          let isCheckedAll = true
          for (let i = 0; i < this.bomList.content.length; i++) {
            if (!this.bomList.content[i].checked) {
              isCheckedAll = false
              break
            }
          }
          this.setAllCheck(!isCheckedAll)
          this.isCheckAll = !isCheckedAll
        }
      },
      setAllCheck: function (flag) {
        for (let i = 0; i < this.bomList.content.length; i++) {
          this.bomList.content[i].checked = flag
        }
      },
      cancelModifyItem: function () {
        for (let i = 0; i < this.bomList.content.length; i++) {
          if (this.bomList.content[i].active) {
            this.$message.error('抱歉，您尚有未保存的信息')
            return false
          }
          this.bomList.content[i].active = false
        }
        return true
      },
      modifyItem: function (index) {
        if (!this.cancelModifyItem()) {
          return
        }
        this.cancelShowSpotGoods()
//        this.$set(this.bomList.content[index], 'active', true)
        this.bomList.content[index].active = true
        let _this = this
        this.initModifyObj()
        this.initValidObj()
        for (let attr in this.bomList.content[index]) {
//          console.log(attr + ':' + _this.bomList.content[index][attr])
          _this.$set(_this.modifyObj, attr, _this.bomList.content[index][attr])
//          _this.modifyObj[attr] = _this.bomList.content[index][attr]
        }
//        this.modifyObj = this.bomList.content[index]
        this.modifyObj.deadline = this.bomList.content[index].deadline ? this.getDate(this.bomList.content[index].deadline) : ''
      },
      cancelModify: function (index) {
        this.bomList.content[index].active = false
      },
      getDate: function (input) {
        const d = new Date(input)
        const year = d.getFullYear()
        const monthTemp = d.getMonth() + 1
        const month = monthTemp < 10 ? '0' + monthTemp : '' + monthTemp
        const day = d.getDate() < 10 ? '0' + d.getDate() : '' + d.getDate()
        return year + '-' + month + '-' + day
      },
//      validDate: function (timestamp) {
//        let now = new Date().getTime()
//        return timestamp - now <= 1000 * 60 * 60 * 24 * 90 && timestamp - now > 0
//      },
      submitModify: function (index) {
        let checkValid = this.checkAll()
        if (this.getSingleValidInfo(this.modifyObj) && checkValid) {
          if (!this.modifyObj.unitPrice) {
            this.modifyObj.currency = null
          }
          this.modifyObj.code = this.modifyObj.code.trim()
          delete this.modifyObj.brandWord
          delete this.modifyObj.codeWord
          this.$http.put('/seek/updateSeekPurchaseByBatch', this.modifyObj)
            .then(response => {
              if (response.data.success) {
                this.reloadData()
                this.$message.success('修改成功')
//                this.bomList.content[index].active = false
              } else {
                this.$message.error('修改失败')
              }
            }, err => {
              console.log(err)
              this.$message.error('系统错误')
            })
        } else {
          if (!checkValid) {
            if (!this.validObj.deadline) {
              if (!this.isValidDate(this.modifyObj.deadline)) {
                this.$message.error('截止日期需在90天以内')
              } else {
                this.$message.error('截止日期不能为空')
              }
            } else if (!this.validObj.amount || !this.validObj.unitPrice) {
              this.$message.error('请输入正确的数值')
            }
          } else {
            this.$message.error('请完善信息')
          }
        }
      },
      deleteItem: function (index) {
        if (!index && index !== 0) {
          let str = ''
          for (let i = 0; i < this.bomList.content.length; i++) {
            if (this.bomList.content[i].checked) {
              str += this.bomList.content[i].id + ','
            }
          }
          let param = {}
          if (str.length) {
            str = str.substring(0, str.length - 1)
            param.spIds = str
            this.doDelete(param)
          } else {
            this.$message.error('请勾选')
            return
          }
        } else {
          this.doDelete({spIds: this.bomList.content[index].id})
        }
      },
      doDelete: function (param) {
        this.$http.put('/seek/deleteSeekPurchaseByBatch', param)
          .then(response => {
            if (response.data.success) {
              this.listenPage(1)
              this.$message.success('删除成功')
            } else {
              this.$message.error('删除失败')
            }
          }, err => {
            console.log(err)
            this.$message.error('系统错误')
          })
      },
      isValidTime: function (time) {
        let now = new Date().getTime()
        return !time || (time >= now && time <= now + 1000 * 60 * 60 * 24 * 91)
      },
      isValidDate: function (date) {
        date = formatDate(date, 'yyyy-MM-dd hh:mm:ss')
        this.modifyObj.deadline = date
        let now = new Date().getTime()
        let time = new Date(date).getTime()
        return !time || (time >= now && time <= now + 1000 * 60 * 60 * 24 * 91)
      },
      getSimilarCode: function () {
        if (this.modifyObj.code) {
          this.$http.get('/search/similarComponents', {params: {keyword: this.modifyObj.code}})
            .then(response => {
              this.similarCode = response.data
              if (response.data.length) {
                this.showSimilarCodeList = true
              } else {
                this.showSimilarCodeList = false
              }
            })
        } else {
          this.showSimilarCodeList = false
        }
      },
      getSimilarBrand: function () {
        if (this.modifyObj.brand) {
          this.$http.get('/search/similarBrands', {params: {keyword: this.modifyObj.brand}})
            .then(response => {
              this.similarBrand = response.data
              if (response.data.length) {
                this.showSimilarBrandList = true
              } else {
                this.showSimilarBrandList = false
              }
            })
        } else {
          this.showSimilarBrandList = false
        }
      },
      getSingleValidInfo: function (item) {
        return item.code && item.brand && item.deadline && this.isValidDate(item.deadline)
      },
      checkCode: function () {
        let code = this.modifyObj.code.trim()
        let nullStrFlag = checkNullStr(code)
        this.validObj.code = code && code !== '' && nullStrFlag
        if (!this.validObj.code) {
          if (!nullStrFlag) {
            this.$message.error('型号输入不合法')
          } else {
            this.$message.error('型号不能为空')
          }
        }
        return this.validObj.code
      },
      checkBrand: function () {
        let nullStrFlag = checkNullStr(this.modifyObj.brand)
        this.validObj.brand = this.modifyObj.brand && this.modifyObj.brand !== '' && nullStrFlag
        if (!this.validObj.brand) {
          if (!nullStrFlag) {
            this.$message.error('品牌输入不合法')
          } else {
            this.$message.error('品牌不能为空')
          }
        }
        return this.validObj.brand
      },
      checkUnitPrice: function () {
        this.validObj.unitPrice = (!this.modifyObj.unitPrice || this.modifyObj.unitPrice === '') ? true : this.modifyObj.unitPrice > 0 && this.modifyObj.unitPrice < 100000000
        return this.validObj.unitPrice
      },
      checkAmount: function () {
        this.validObj.amount = (!this.modifyObj.amount || this.modifyObj.amount === '') ? true : this.modifyObj.amount > 0 && this.modifyObj.amount < 1000000000
        return this.validObj.amount
      },
      checkSpec: function () {
        let nullStrFlag = checkNullStr(this.modifyObj.spec)
        this.validObj.spec = nullStrFlag
        if (!nullStrFlag) {
          this.$message.error('规格输入不合法')
        }
        return this.validObj.spec
      },
      checkAll: function () {
        return this.checkCode() && this.checkBrand() && this.checkDeadline() && this.checkUnitPrice() && this.checkAmount() && this.checkSpec()
      },
      checkDeadline: function () {
        this.validObj.deadline = this.modifyObj.deadline && this.modifyObj.deadline !== '' && this.isValidDate(this.modifyObj.deadline)
        return this.validObj.deadline
      },
      onUnitPriceInput: function () {
        let price = this.modifyObj.unitPrice
        if (price >= 10000) {
          this.modifyObj.unitPrice = price.substring(0, 4)
        } else if (price.indexOf('.') > -1) {
          let arr = price.split('.')
          if (arr[0].length > 4) {
            this.modifyObj.unitPrice = Number(arr[0].substring(0, 4) + '.' + arr[1])
          } else if (arr[1].length > 6) {
            this.modifyObj.unitPrice = Number(arr[0] + '.' + arr[1].substring(0, 6))
          }
        }
      },
      onProduceDateChange: function () {
        if (this.modifyObj.produceDate && getRealLen(this.modifyObj.produceDate) > 12) {
          this.modifyObj.produceDate = cutOutString(this.modifyObj.produceDate, 12)
        }
      },
      onEncapsulationChange: function () {
        if (this.modifyObj.encapsulation && getRealLen(this.modifyObj.encapsulation) > 20) {
          this.modifyObj.encapsulation = cutOutString(this.modifyObj.encapsulation, 20)
        }
      },
      onCodeChange: function () {
        if ((/[^\x00-\xff]/g).test(this.modifyObj.code)) {
          let chineseIndex = -1
          for (let i = 0; i < this.modifyObj.code.length; i++) {
            if ((/[^\x00-\xff]/g).test(this.modifyObj.code.charAt(i))) {
              chineseIndex = i
              break
            }
          }
          this.modifyObj.code = cutOutString(this.modifyObj.code, chineseIndex)
        } else if (this.modifyObj.code && getRealLen(this.modifyObj.code) > 100) {
          this.modifyObj.code = cutOutString(this.modifyObj.code, 100)
        } else {
          this.getSimilarCode()
        }
      },
      onBrandChange: function () {
        this.modifyObj.brand = this.modifyObj.brand.trim()
        if ((/[^\x00-\xff]/g).test(this.modifyObj.brand)) {
          let chineseIndex = -1
          for (let i = 0; i < this.modifyObj.brand.length; i++) {
            if ((/[^\x00-\xff]/g).test(this.modifyObj.brand.charAt(i)) && !(/[\u4e00-\u9fa5]/).test(this.modifyObj.brand.charAt(i))) {
              chineseIndex = i
              break
            }
          }
          if (chineseIndex > -1) {
            this.modifyObj.brand = this.modifyObj.brand.substring(0, chineseIndex)
          }
        } else if (this.modifyObj.brand && getRealLen(this.modifyObj.brand) > 50) {
          this.modifyObj.brand = cutOutString(this.modifyObj.brand, 50)
        }
        this.getSimilarBrand()
      },
      onProdTitleInput: function () {
        if (this.modifyObj.kind && getRealLen(this.modifyObj.kind) > 40) {
          this.modifyObj.kind = cutOutString(this.modifyObj.kind, 40)
        }
      },
      onSpecInput: function () {
        if (this.modifyObj.spec && getRealLen(this.modifyObj.spec) > 100) {
          this.modifyObj.spec = cutOutString(this.modifyObj.spec, 100)
        }
      },
      onAmountInput: function () {
        if (!(/^[0-9]*$/).test(this.modifyObj.amount)) {
          let chineseIndex = -1
          for (let i = 0; i < this.modifyObj.amount.length; i++) {
            if (!(/^[0-9]*$/).test(this.modifyObj.amount.charAt(i))) {
              chineseIndex = i
              break
            }
          }
          this.modifyObj.amount = cutOutString(this.modifyObj.amount, chineseIndex)
        } else if (this.modifyObj.amount.length > 9) {
          this.modifyObj.amount = cutOutString(this.modifyObj.amount, 9)
        }
      },
      setCode: function (code) {
        this.modifyObj.code = code
        this.showSimilarCodeList = false
      },
      setBrand: function (brand) {
        this.modifyObj.brand = brand
        this.showSimilarBrandList = false
      },
      setShowCodeWord: function (index, event) {
        event.stopPropagation()
        for (let i = 0; i < this.bomList.content.length; i++) {
          if (i !== index) {
            this.bomList.content[i].showCodeWord = false
          }
          this.bomList.content[i].showBrandWord = false
        }
        this.bomList.content[index].showCodeWord = !this.bomList.content[index].showCodeWord
      },
      setShowBrandWord: function (index, event) {
        event.stopPropagation()
        for (let i = 0; i < this.bomList.content.length; i++) {
          if (i !== index) {
            this.bomList.content[i].showBrandWord = false
          }
          this.bomList.content[i].showCodeWord = false
        }
        this.bomList.content[index].showBrandWord = !this.bomList.content[index].showBrandWord
      },
      modifyItemByWord: function (index, param, type) {
        if (type === 'code') {
          this.bomList.content[index].code = param
          this.requestModify(this.bomList.content[index])
        } else if (type === 'brand') {
          this.bomList.content[index].brand = param
          this.requestModify(this.bomList.content[index])
        } else {
          this.$message.error('修改失败')
        }
      },
      requestModify: function (item) {
        this.$http.put('/seek/updateSeekPurchaseByBatch', item)
          .then(response => {
            if (response.data.success) {
              this.$message.success('修改成功')
            } else {
              this.$message.error('修改失败')
            }
            this.reloadData()
          }, err => {
            console.log(err)
            this.$message.error('系统错误')
//            this.reloadData()
          })
      },
      cancelShowSpotGoods: function () {
        for (let i = 0; i < this.bomList.content.length; i++) {
          this.bomList.content[i].showSpotGoods = false
        }
      },
      setShowSpotGoods: function (flag, item) {
        if (flag && item && item.spotGoods.length) {
          this.spotGoodsData = item.spotGoods
          this.initFragments()
        }
        if (!this.cancelModifyItem()) {
          return
        }
        this.cancelShowSpotGoods()
        item.showSpotGoods = flag
      },
      initFragment: function (commodity) {
        if (!commodity) {
          return {}
        }
        let fragment = {}
        let prices = commodity.prices[0]
        fragment.num = commodity.minBuyQty
        fragment.prices = prices

        if (commodity.currencyName !== 'USD') {
          fragment.currency = 'RMB'
        } else {
          fragment.currency = 'USD'
        }

        if (fragment.currency !== 'USD') {
          fragment.price = prices.rMBPrice
        } else {
          fragment.price = prices.uSDPrice
        }
        fragment.canAdd = true
        fragment.canSub = false
        return fragment
      },
      initFragments: function () {
        for (let i = 0; i < this.spotGoodsData.length; i++) {
          this.fragments.push(this.initFragment(this.spotGoodsData[i]))
        }
      },
      getFragment: function (commodity, fragment) {
        // 判断是否小于第一分段的起订量
        if (commodity.prices[0].start > fragment.num) {
          fragment.num = commodity.prices[0].start
        }
        // 获取分段的信息
        let prices = commodity.prices
        for (let i = 0; i < prices.length; i++) {
          if (fragment.num <= prices[i].end) {
            fragment.prices = prices[i]
            break
          }
        }
      },
      onInput: function (index) {
        let prices = this.spotGoodsData[index].prices
        if (prices && prices.length) {
          for (let i = 0; i < prices.length; i++) {
            if (this.fragments[index].num >= prices[i].start && this.fragments[index].num <= prices[i].end) {
              this.fragments[index].price = this.fragments[index].currency === 'RMB' ? prices[i].rMBPrice : prices[i].uSDPrice
              break
            }
          }
        }
      },
      changeNum: function (newNum, index) {
        let pack = this.spotGoodsData[index].perQty || this.spotGoodsData[index].minPackQty
        let buy = this.spotGoodsData[index].minBuyQty
        let reserve = this.spotGoodsData[index].reserve
        let breakUp = this.spotGoodsData[index].breakUp
        let nowFragment = this.fragments[index]
        if (!newNum) {
          nowFragment.num = buy
        } else {
          newNum = parseInt(newNum)
          if (breakUp) {
            if (newNum < buy) {
              this.$message.error('最小起订量为' + buy)
              nowFragment.num = buy
              nowFragment.canSub = false
              nowFragment.canAdd = true
            } else if (newNum > reserve) {
              this.$message.error('库存不足')
              nowFragment.num = reserve
              nowFragment.canAdd = false
              nowFragment.canSub = true
            } else {
              nowFragment.canSub = true
              nowFragment.canAdd = true
              nowFragment.num = newNum
              newNum === buy && (nowFragment.canSub = false)
              newNum === reserve && (nowFragment.canAdd = false)
            }
          } else {
            if (newNum < buy) {
              this.$message.error('最小起订量为' + buy)
              nowFragment.num = buy
              nowFragment.canSub = false
              if (newNum > reserve) {
                this.$message.error('库存不足')
                nowFragment.num = reserve - (reserve % pack)
                nowFragment.canAdd = false
              }
            } else if (newNum > reserve) {
              nowFragment.canSub = true
              nowFragment.canAdd = false
              this.$message.error('库存不足')
              nowFragment.num = reserve - (reserve % pack)
            } else {
              nowFragment.canSub = true
              nowFragment.canAdd = true
              let remainder = newNum % pack
              if (remainder !== 0) {
                this.$message.error('不支持拆包且包装量为' + pack)
                let res = (Math.floor(newNum / pack) + 1) * pack
                nowFragment.num = res > reserve ? Math.floor(newNum / pack) * pack : res
              } else {
                nowFragment.num = newNum
              }
              newNum === buy && (nowFragment.canSub = false)
              newNum === reserve && (nowFragment.canAdd = false)
            }
          }
        }
      },
      subNum: function (index) {
        let nowFragment = this.fragments[index]
        if (nowFragment.canSub) {
          let pack = this.spotGoodsData[index].perQty || this.spotGoodsData[index].minPackQty
          let newNum = 0
          if (this.spotGoodsData[index].breakUp) {
            newNum = nowFragment.num - 1
          } else {
            newNum = nowFragment.num - pack
          }
          this.changeNum(newNum, index)
          this.getFragment(this.spotGoodsData[index], nowFragment)
          this.onInput(index)
        } else {
          this.$message.error('该商品最少购买' + this.spotGoodsData[index].minBuyQty + '件')
        }
      },
      addNum: function (index) {
        let nowFragment = this.fragments[index]
        if (nowFragment.canAdd) {
          let pack = this.spotGoodsData[index].perQty || this.spotGoodsData[index].minPackQty
          let newNum = 0
          if (this.spotGoodsData[index].breakUp) {
            newNum = nowFragment.num + 1
          } else {
            newNum = nowFragment.num + pack
          }
          this.changeNum(newNum, index)
          this.getFragment(this.spotGoodsData[index], nowFragment)
          this.onInput(index)
        } else {
          this.$message.error('库存不足')
        }
      },
      inputNum: function (index) {
        if ((/^[\d]*$/).test(this.fragments[index].num)) {
          this.changeNum(this.fragments[index].num, index)
          this.getFragment(this.spotGoodsData[index], this.fragments[index])
        } else {
          this.message.error('请输入整数')
          this.fragments[index].num = this.spotGoodsData[index].minBuyQty
        }
        this.onInput(index)
      },
      buyNow: function (goods, index) {
        this.$http.post('/trade/order/buyNow', [{
          uuid: goods.uuid,
          batchCode: goods.batchCode,
          number: this.fragments[index].num,
          storeid: goods.storeid ? goods.storeid : goods.storeId,
          storeUuid: goods.storeid ? goods.storeid : goods.storeId,
          currencyName: goods.currencyName,
          minPackQty: goods.minPackQty
        }])
          .then(response => {
            if (response.data.success) {
              if (response.data.message) {
                this.$message({
                  message: response.data.message,
                  type: 'success'
                })
                window.setTimeout(function () {
                  window.open('/user#/order/pay/' + enidfilter(response.data.data.orderid))
                }, 1000)
              } else {
                window.open('/user#/order/pay/' + enidfilter(response.data.data.orderid))
              }
            } else {
              if (response.data.data && response.data.data.unvailable === 1) {
                this.$message.error('产品信息已失效，请刷新页面')
              } else {
                this.$message.error(response.data.message)
              }
            }
          }, err => {
            console.log(err)
            if (goods.minBuyQty > goods.reserve) {
              this.$message.error('商品' + goods.code + '的库存已经不满足最小起订量')
            }
          })
      },
      linkSaler: function (commodity) {
        // 获得窗口的垂直位置
        let iTop = (window.screen.availHeight - 30 - 780) / 2
        // 获得窗口的水平位置
        let iLeft = (window.screen.availWidth - 10 - 1030) / 2
        if (this.tab.close) {
          this.tab.close()
        }
        let newTab = window.open('', '即时对话框', 'height=750, width=1000, top=' + iTop + ', left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
        newTab.close()
        newTab = window.open('', '即时对话框', 'height=750, width=1000, top=' + iTop + ', left=' + iLeft + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')
        this.$store.dispatch('chat/setChatTab', {tab: newTab})
        this.$http.get('/basic/enterprise/' + commodity.enUU + '/info')
          .then(response => {
            let obj = {}
            obj.userPhone = this.user.data.userTel
            obj.userType = 'ENTERPRISE'
            this.user.data.enterprises.forEach(function (item, index) {
              if (item.current) {
                obj.enUU = item.uu
                obj.enterprise = {enUU: item.uu, name: item.enName}
              }
            })
            obj.otherEnUU = response.data.uu
            obj.otherUserType = 'STORE'
            obj.otherEnterprise = {enUU: response.data.uu, name: response.data.enName}
            obj.type = 'CHAT'
            if (!(/^1\d{10}$/).test(response.data.enTel)) {
              this.$http.get('/basic/enterprise/' + response.data.uu + '/admin').then(response => {
                console.log(response)
                obj.toPhone = response.data.userTel
                console.log(obj)
                this.openWebChat(newTab, obj)
              }, err => {
                console.log(err)
                this.$message.error('暂无卖家管理员手机号！')
              })
            } else {
              obj.toPhone = response.data.enTel
              console.log(obj)
              this.openWebChat(newTab, obj)
            }
          }, err => {
            console.log(err)
          })
      },
      openWebChat: function (newTab, obj) {
        this.$http.post('https://im.ubtob.com/api/chat/infos?condition=chat_info', obj)
          .then(response => {
            if (response.data.success) {
              newTab.location.href = 'https://im.ubtob.com/chat/visit?gid=' + response.data.content
            } else {
              newTab.close()
              this.$message.error(response.data.message)
            }
          })
      }
    }
  }
</script>
<style lang="scss">
  .batch-publish {
    margin: 0 auto;
    width: 1190px;
    .red-text {
      color: #ff0000;
    }
    .blue-text {
      color: #3c7cf5;
    }
    .over-ell {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    > p {
      margin: 30px 0 0 0;
      font-size: 16px;
      height: 60px;
      line-height: 60px;
      background: #f7f9fd;
      padding-left: 24px;
      > img {
        width: 23px;
        height: 31px;
        margin-right: 12px;
      }
    }
    .list-wrap {
      padding: 30px 0 72px 0;
      margin: 26px 0 109px 0;
      -webkit-box-shadow: 0 0 3px #e2eae8;
      -moz-box-shadow: 0 0 3px #e2eae8;
      box-shadow: 0 0 3px #e2eae8;
      .list-content {
        width: 1150px;
        margin: 0 auto;
        table-layout: fixed;
        > thead {
          tr {
            th {
              background: #89aefa;
              color: #fff;
              font-weight: normal;
              height: 40px;
              line-height: 40px;
              text-align: center;
              .com-check-box {
                margin-right: 2px;
              }
              i {
                margin-right: 3px;
              }
            }
          }
        }
        > tbody {
          > tr {
            height: 101px;
            text-align: center;
            border : {
              bottom: 1px solid #bcd2ff;
              left: 1px solid #bcd2ff;
              right: 1px solid #bcd2ff;
            }
            &:hover {
              background: #f1f5ff;
            }
            > td {
              position: relative;
              .prod-items {
                height: 100px;
                padding-top: 17px;
                .prod-item {
                  position: relative;
                  display: inline-block;
                  height: 30px;
                  line-height: 30px;
                  float: left;
                  &:nth-child(2) {
                    margin-top: 9px;
                    margin-right: 0;
                  }
                  .pi-title {
                    display: inline-block;
                    vertical-align: middle;
                    text-align: right;
                    color: #999;
                    .red-text {
                      margin-right: 3px;
                    }
                  }
                  .pi-content {
                    display: inline-block;
                    text-align: left;
                    vertical-align: middle;
                  }
                  &.prod-item-large {
                    .pi-content {
                      width: 226px;
                    }
                    .pi-title {
                      width: 115px;
                    }
                  }
                  &.prod-item-small {
                    .pi-content {
                      width: 105px;
                    }
                    .pi-title {
                      width: 70px;
                    }
                  }
                  > ul {
                    line-height: normal;
                    position: absolute;
                    top: 31px;
                    left: 115px;
                    background: #fff;
                    border: 1px solid #b5b5b5;
                    z-index: 1;
                    max-height: 120px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    border-radius: 2px;
                    width: 226px;
                    li {
                      height: 30px;
                      line-height: 30px;
                      cursor: pointer;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      padding: 0 5px;
                      text-align: left;
                      &:hover {
                        background: #89aefa;
                        color: #fff;
                      }
                    }
                  }
                }
              }
              .similar-select {
                width: 145px;
                margin: 0 auto;
                border: 1px solid #b5b5b5;
                height: 30px;
                line-height: 30px;
                overflow-y: hidden;
                padding: 0 22px 0 5px;
                background: url('/images/all/select-icon-full.png') no-repeat;
                background-color: #fff;
                background-position: 194px 10px;
                cursor: default;
                border-radius: 2px;
                & + ul {
                  width: 145px;
                  top: 48px;
                  left: 12px;
                  &.brand-word-list {
                    left: 7px;
                  }
                }
              }
              &.operate {
                text-align: left;
                font-size: 12px;
                a {
                  color: #3c7cf5;
                  margin-left: 5px;
                  &.size-s {
                    padding: 4px 12px;
                  }
                  &.size-m {
                    padding: 4px 7px;
                  }
                  &:hover {
                    color: #fff;
                    background: #3c7cf5;
                    border-radius: 3px;
                  }
                  &.btn-ok {
                    background: #ff8522;
                    color: #fff;
                    border-radius: 3px;
                  }
                }
              }
              .remind {
                font-size: 12px;
              }
            }
            &.spot-goods {
              background: #fff;
              > td {
                .spot-goods-body {
                  .spot-goods-title {
                    height: 36px;
                    line-height: 36px;
                    background: #414140;
                    color: #fff;
                  }
                  table {
                    width: 1130px;
                    margin-left: 9px;
                    table-layout: fixed;
                    thead tr th {
                      text-align: center;
                      height: 34px;
                      line-height: 34px;
                      background: #fce8df;
                      font-weight: normal;
                    }
                  }
                  .spot-goods-list {
                    max-height: 250px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    table {
                      margin-bottom: 10px;
                      tbody tr {
                        border: 1px solid #fce8df;
                        &:nth-child(even) {
                          background: #fdf8f5;
                        }
                        td {
                          height: 48px;
                          line-height: 48px;
                          &.input-number {
                            > div {
                              position: relative;
                              width: 100px;
                              margin: 0 auto;
                              span {
                                width: 17px;
                                height: 26px;
                                background: #4290f7;
                                line-height: 26px;
                                color: #fff;
                                display: inline-block;
                                font-size: 16px;
                                vertical-align: middle;
                                position: absolute;
                                top: 12px;
                                cursor: pointer;
                                &.not-allowed {
                                  cursor: not-allowed;
                                  background: #d7d5d5;
                                }
                                &:first-child {
                                  left: -7px;
                                }
                                &:last-child {
                                  right: -7px;
                                }
                              }
                              input {
                                width: 81px;
                                height: 26px;
                                text-align: center;
                                line-height: normal;
                                vertical-align: middle;
                                outline: none;
                                border: 1px solid #d1d0d0;
                                padding: 0 5px;
                              }
                            }
                          }
                          &.operate {
                            a {
                              color: #5078cb;
                              font-size: 12px;
                            }
                            span {
                              display: inline-block;
                              width: 64px;
                              height: 24px;
                              line-height: 24px;
                              text-align: center;
                              background: #4290f7;
                              color: #fff;
                              margin-left: 13px;
                              cursor: pointer;
                              font-size: 12px;
                              border-radius: 2px;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            &.modify-row {
              td {
                input, select {
                  height: 30px;
                  border-radius: 2px;
                  border: 1px solid #dadada;
                  text-align: center;
                  padding: 0 5px;
                  display: inline-block;
                  &.error {
                    border-color: #f4645f !important;
                  }
                }
                input:focus {
                  -webkit-box-shadow: none;
                  -moz-box-shadow: none;
                  box-shadow: none;
                  border: 1px solid #3c7cf5;
                }
                .prod-item {
                  position: relative;
                  &.prod-item-large {
                    input {
                      width: 226px;
                    }
                  }
                  &.prod-item-small {
                    input {
                      width: 105px;
                    }
                  }
                  &.pi-select {
                    input {
                      width: 103px;
                      padding: 0 5px 0 30px;
                    }
                    select {
                      width: 25px;
                      padding: 0 0 0 2px;
                      background: url(/images/applyPurchase/select2.png) no-repeat right;
                      background-size: 12px 28px;
                      background-position: 12px 0;
                      position: absolute;
                      top: 1px;
                      border-bottom: none;
                      border-top: none;
                      border-left: 0;
                    }
                  }
                }
                &:nth-child(2) {
                  input {
                    width: 83px;
                  }
                }
                &:nth-child(3) {
                  input {
                    width: 90px;
                  }
                }
                &:nth-child(4) {
                  div {
                    width: 106px;
                    overflow: unset;
                    input {
                      width: 106px;
                      border-radius: 2px;
                      border: 1px solid #dadada;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .submit-area {
        margin: 51px auto 0;
        text-align: center;
        clear: both;
        a {
          display: inline-block;
          width: 126px;
          height: 34px;
          line-height: 34px;
          text-align: center;
          border-radius: 2px;
          color: #fff;
          background: #ff8522;
        }
      }
    }
  }
</style>
