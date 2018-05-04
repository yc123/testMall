<template>
  <div class="batch-publish">
    <p>共上传<b class="red-text">{{bomNumber.successImport || 0}}</b>个产品<br/>其中<span class="red-text">{{bomNumber.nullField || 0}}</span>个产品的必填项缺失，请在当前页完善信息</p>
    <table v-if="bomList.content.length">
      <thead>
        <tr>
          <!--<th width="60">-->
            <!--<label class="com-check-box">-->
              <!--<input type="checkbox" id="all" @change="onCheck()" v-model="isCheckAll">-->
              <!--<label for="all"></label>-->
            <!--</label>全选-->
          <!--</th>-->
          <th width="190"><i class="red-text">*</i>型号</th>
          <th width="162"><i class="red-text">*</i>品牌</th>
          <th width="100">采购数量</th>
          <th width="128">单价预算</th>
          <th width="76">封装</th>
          <th width="102">生产日期</th>
          <th width="144"><i class="red-text">*</i>截止时间</th>
          <th width="92">操作</th>
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
          <div v-if="item.code && (!item.codeWord || item.codeWord.length == 0)" :title="item.code">{{item.code}}</div>
          <span class="red-text" v-if="!item.code">请完善信息</span>
          <div class="similar-select" v-if="item.codeWord && item.codeWord.length > 0" @click="setShowCodeWord(index, $event)">{{item.code}}</div>
          <ul v-show="item.showCodeWord">
            <li v-for="code in item.codeWord" @click="modifyItemByWord(index, code.code, 'code')" :title="code.code">{{code.code}}</li>
          </ul>
        </td>
        <td>
          <div v-if="item.brand && (!item.brandWord || item.brandWord.length == 0)" :title="item.brand">{{item.brand}}</div>
          <span class="red-text" v-if="!item.brand">请完善信息</span>
          <div class="similar-select" v-if="item.brandWord && item.brandWord.length > 0" @click="setShowBrandWord(index, $event)">{{item.brand}}</div>
          <ul v-show="item.showBrandWord" class="brand-word-list">
            <li v-for="brand in item.brandWord" @click="modifyItemByWord(index, brand.nameEn, 'brand')" :title="brand.nameEn">{{brand.nameEn}}</li>
          </ul>
        </td>
        <td>
          <div :title="item.amount">{{item.amount || '-'}}</div>
        </td>
        <td class="blue-text">
          <div>
            <span v-if="item.unitPrice">{{(item.currency === 'RMB' ? '¥' : '$') + item.unitPrice}}</span>
            <span v-if="!item.unitPrice">-</span>
          </div>
        </td>
        <td>
          <div :title="item.encapsulation">
            {{item.encapsulation || '-'}}
          </div>
        </td>
        <td>
          <div :title="item.produceDate">
            {{item.produceDate || '-'}}
          </div>
        </td>
        <td>
          <span v-if="item.deadline">{{item.deadline | date}}</span>
          <span class="red-text" v-if="!item.deadline">请完善信息</span>
          <div class="red-text" v-if="!isValidTime(item.deadline)">默认≤90天</div>
        </td>
        <td class="operate">
          <a class="delete-btn" @click="modifyItem(index)">编辑</a>
          <a class="modify-btn" @click="deleteItem(index)">删除</a>
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
          <input type="text" class="form-control" v-model="modifyObj.code" :class="{'error': !validObj.code}" @blur="checkCode" @input="onCodeChange" >
          <ul v-show="showSimilarCodeList">
            <li v-for="sCode in similarCode" @click="setCode(sCode.code)">{{sCode.code}}</li>
          </ul>
        </td>
        <td>
          <input type="text" class="form-control" v-model="modifyObj.brand" :class="{'error': !validObj.brand}" @blur="checkBrand" @input="onBrandChange">
          <ul class="brand-similar-list" v-show="showSimilarBrandList">
            <li v-for="sBrand in similarBrand" @click="setBrand(sBrand.nameEn)">{{sBrand.nameEn}}</li>
          </ul>
        </td>
        <td>
          <input type="text" class="form-control" v-model="modifyObj.amount" :class="{'error': !validObj.amount}" @blur="checkAmount" @input="onAmountInput">
        </td>
        <td>
          <select class="form-control" v-model="modifyObj.currency">
            <option value="RMB">¥</option>
            <option value="USD">$</option>
          </select>
          <input class="form-control" type="number" v-model="modifyObj.unitPrice" :class="{'error': !validObj.unitPrice}" @blur="checkUnitPrice" @input="onUnitPriceInput">
        </td>
        <td>
          <input type="text" class="form-control" v-model="modifyObj.encapsulation" @input="onEncapsulationChange">
        </td>
        <td>
          <input type="text" class="form-control" v-model="modifyObj.produceDate" @input="onProduceDateChange">
        </td>
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
          <a class="submit-btn" @click="submitModify(index)">确认</a>
          <a class="cancel-btn" @click="cancelModify(index)">取消</a>
        </td>
      </tr>
      </tbody>
    </table>
    <page :total="bomList.totalElements" :page-size="pageSize"
          :current="nowPage" @childEvent="listenPage"></page>
    <div class="submit-area" v-if="bomList.content.length">
    <!--  <a class="modify-btn" @click="deleteItem()">删除</a>-->
      <a class="modify-btn delete-btn" @click="submitBOM">确认发布</a>
    </div>
    <!--提示框-->
    <!--<div class="modal-wrap" v-if="showRemindBox">
      <div class="apply-del-box">
        <div class="title">
          &lt;!&ndash;<a @click="showRemindBox = false"><i class="fa fa-close fa-lg"></i></a>&ndash;&gt;
        </div>
        <div class="content">
          &lt;!&ndash;<p style="line-height: 20px;margin-top: 10px;padding:0 10px">非常抱歉，目前暂无此品牌！<br>若直接前往“品牌申请”，我们将为您先开通寄售功能，待申请通过后再提交开店申请。</p>&ndash;&gt;
          &lt;!&ndash;<p style="line-height: 20px;">前往<a @click="goBrandApply()"  target="_blank" style="color: #5078CB">品牌申请&nbsp;<i class="fa fa-arrow-right"></i></a></p>&ndash;&gt;
          <p><img src="/images/applyPurchase/check.png" alt="">成功发布{{successResult.successAmount || 0}}个</p>
          <p v-if="successResult.goodsAmount && successResult.goodsAmount > 0 ">其中<span>{{successResult.goodsAmount || 0}}</span>个求购型号有现货在售，您可前往“<span>买家中心-我的求购</span>”查询并直接购买</p>
          <div>
            &lt;!&ndash;<a @click="showRemindBox = false">继续发布</a>&ndash;&gt;
            <a href="/user#/seekPurchase" target="_blank">前往我的求购</a>
          </div>
        </div>
      </div>
    </div>-->
  </div>
</template>
<script>
  let getRealLen = function (str) {
    let len = 0
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
        len += 2
      } else {
        len++
      }
    }
    return len
  }
  let cutOutString = function (str, length) {
    for (let i = 1; i <= str.length; i++) {
      if (getRealLen(str.substr(0, i)) > length) {
        str = str.substr(0, i - 1)
        break
      }
    }
    return str
  }
  let formatDate = function (date, fmt) {
    if (!date) {
      return null
    }
    if (typeof date === 'string') {
      date = new Date(Date.parse(date.replace(/-/g, '/')))
    }
    let o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': 23, // 小时
      'm+': 59, // 分
      's+': 59, // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
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
          deadline: ''
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
          deadline: true
        },
//        successResult: 0,
        showSimilarCodeList: false,
        showSimilarBrandList: false
      }
    },
    components: {
      Page
    },
    computed: {
      bomList () {
        let _this = this
        let list = this.$store.state.applyPurchase.bomMaterial.bomList.data
        for (let i = 0; i < list.content.length; i++) {
          _this.$set(list.content[i], 'checked', false)
          _this.$set(list.content[i], 'active', false)
          _this.$set(list.content[i], 'showCodeWord', false)
          _this.$set(list.content[i], 'showBrandWord', false)
//          list.content[i].checked = false
//          list.content[i].active = false
//          if (!list.content[i].code || list.content[i].brand || !list.content[i].deadline || !this.isValidDate(list.content[i].deadline)) {
//            _this.validList = false
//          }
        }
        return list
      },
      bomNumber () {
        return this.$store.state.applyPurchase.bomMaterial.bomNumber.data
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
      }
    },
    methods: {
      getDate1: function () {
        this.modifyObj.deadline = formatDate(this.modifyObj.deadline, 'yyyy-MM-dd hh:mm:ss')
      },
      initModifyObj: function () {
        this.modifyObj = {
          code: '',
          brand: '',
          unitPrice: '',
          currency: 'RMB',
          encapsulation: '',
          produceDate: '',
          amount: '',
          deadline: ''
        }
      },
      initValidObj: function () {
        this.validObj = {
          code: true,
          brand: true,
          unitPrice: true,
          amount: true,
          deadline: true
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
        let str = ''
//        let _this = this
        for (let i = 0; i < this.bomList.content.length; i++) {
          if (this.bomList.content[i].checked) {
            if (!this.getSingleValidInfo(this.bomList.content[i])) {
              this.$message.error('请选择信息完善的产品发布求购')
              return
            }
            str += this.bomList.content[i].id + ','
          }
        }
        let param = {'bomId': Number(this.$route.params.id)}
        if (str.length) {
          str = str.substring(0, str.length - 1)
          param.spIds = str
        }
        this.$http.post('/seek/confirmBom?bomId=' + Number(this.$route.params.id))
          .then(response => {
            if (response.data.success) {
//              this.showRemindBox = true
//              this.successResult = response.data.data
//              this.listenPage(1)
//              this.$store.dispatch('applyPurchase/loadBOMNumber', {bomId: this.$route.params.id})
              if (response.data.data.successAmount) {
                this.$router.push('/applyPurchase/result?status=success&count=' + response.data.data.successAmount)
              } else {
                this.$message.error('发布失败，请完善信息')
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
      modifyItem: function (index) {
        for (let i = 0; i < this.bomList.content.length; i++) {
          if (this.bomList.content[i].active) {
            this.$message.error('抱歉，您尚有未保存的信息')
            return
          }
          this.bomList.content[i].active = false
        }
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
            if (!this.validObj.code) {
              this.$message.error('型号不能为空')
            } else if (!this.validObj.brand) {
              this.$message.error('品牌不能为空')
            } else if (!this.validObj.deadline) {
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
        this.$http.get('/search/similarComponents', {params: {keyword: this.modifyObj.code}})
          .then(response => {
            this.similarCode = response.data
            if (response.data.length) {
              this.showSimilarCodeList = true
            } else {
              this.showSimilarCodeList = false
            }
          })
      },
      getSimilarBrand: function () {
        this.$http.get('/search/similarBrands', {params: {keyword: this.modifyObj.brand}})
          .then(response => {
            this.similarBrand = response.data
            if (response.data.length) {
              this.showSimilarBrandList = true
            } else {
              this.showSimilarBrandList = false
            }
          })
      },
      getSingleValidInfo: function (item) {
        return item.code && item.brand && item.deadline && this.isValidDate(item.deadline)
      },
      checkCode: function () {
        this.validObj.code = this.modifyObj.code && this.modifyObj.code !== ''
        return this.validObj.code
      },
      checkBrand: function () {
        this.validObj.brand = this.modifyObj.brand && this.modifyObj.brand !== ''
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
      checkAll: function () {
        return this.checkCode() && this.checkBrand() && this.checkDeadline() && this.checkUnitPrice() && this.checkAmount()
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
        this.modifyObj.code = this.modifyObj.code.trim()
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
            if ((/[^\x00-\xff]/g).test(this.modifyObj.brand.charAt(i))) {
              chineseIndex = i
              break
            }
          }
          this.modifyObj.brand = cutOutString(this.modifyObj.brand, chineseIndex)
        } else if (this.modifyObj.brand && getRealLen(this.modifyObj.brand) > 50) {
          this.modifyObj.brand = cutOutString(this.modifyObj.brand, 50)
        } else {
          this.getSimilarBrand()
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
            this.reloadData()
          })
      }
    }
  }
</script>
<style lang="scss">
  .batch-publish {
    margin: 0 auto;
    width: 998px;
    .red-text {
      color: #ff0000;
    }
    .blue-text {
      color: #3c7cf5;
    }
    > p {
      margin: 59px 0 42px;
      font-size: 16px;
    }
    table {
      width: 100%;
      table-layout: fixed;
      thead {
        tr {
          th {
            background: #b8b8b8;
            color: #fff;
            font-weight: normal;
            height: 50px;
            line-height: 50px;
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
      tbody {
        tr {
          height: 85px;
          line-height: 85px;
          text-align: center;
          border : {
            bottom: 1px solid #d9d9d9;
            left: 1px solid #d9d9d9;
            right: 1px solid #d9d9d9;
          }
          &:hover {
            background: #f3f3f3;
          }
          td {
            position: relative;
            font-size: 12px;
            > ul {
              line-height: normal;
              position: absolute;
              top: 52px;
              left: 38px;
              background: #fff;
              border: 1px solid #b5b5b5;
              z-index: 1;
              max-height: 120px;
              overflow-y: auto;
              overflow-x: hidden;
              border-radius: 3px;
              width: 114px;
              li {
                height: 24px;
                line-height: 24px;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 0 5px;
                &:hover {
                  background: #ddd;
                }
              }
              &.brand-similar-list {
                left: 34px;
                width: 94px;
              }
            }
            > div {
              overflow: hidden;
              overflow-y: unset;
              text-overflow: ellipsis;
              white-space: nowrap;
              &.similar-select {
                width: 109px;
                margin: 0 auto;
                border: 1px solid #b5b5b5;
                height: 18px;
                line-height: 18px;
                overflow-y: hidden;
                padding: 0 22px 0 5px;
                background: url('/images/applyPurchase/select.png') no-repeat;
                background-position: 91px 0;
                cursor: default;
                border-radius: 3px;
                & + ul {
                  width: 110px;
                  top: 52px;
                  left: 40px;
                  &.brand-word-list {
                    left: 27px;
                  }
                }
              }
            }
            div.red-text {
              line-height: normal;
              position: absolute;
              left: 42px;
              top: 49px;
            }
            &.operate {
              a {
                display: block;
                width: 64px;
                height: 24px;
                line-height: 22px;
                text-align: center;
                border-radius: 3px;
                margin: 0 auto 4px;
                font-size: 14px;
                &.submit-btn {
                  border: 1px solid #f64900;
                  color: #fff;
                  background: #f64900;
                }
                &.cancel-btn {
                  border: 1px solid #bbb;
                  color: #fff;
                  background: #bbb;
                }
              }
            }
          }
          &.modify-row {
            td {
              position: relative;
              input, select {
                height: 20px;
                border-radius: 3px;
                background: #f4f4f4;
                border: 1px solid #b5b5b5;
                text-align: center;
                padding: 0 5px;
                &.error {
                  border-color: #f4645f !important;
                }
              }
              &:nth-child(1) {
                input {
                  width: 113px;
                }
              }
              &:nth-child(2) {
                input {
                  width: 93px;
                }
              }
              &:nth-child(3) {
                input {
                  width: 71px;
                }
               }
              &:nth-child(4) {
                input {
                  width: 65px;
                  padding: 0 5px 0 30px;
                }
                select {
                  width: 25px;
                  padding: 0 0 0 2px;
                  background: url(/images/applyPurchase/select.png) no-repeat right;
                  background-size: 12px 19px;
                  background-position: 13px 0;
                  position: absolute;
                  top: 33px;
                  border-bottom: none;
                  border-top: none;
                  border-left: 0;
                }
              }
              &:nth-child(5) {
                input {
                  width: 54px;
                }
              }
              &:nth-child(6) {
                input {
                  width: 72px;
                }
              }
              &:nth-child(7) {
                div {
                  width: 101px;
                  overflow: unset;
                  input {
                    width: 101px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .modify-btn {
      border: 1px solid #3c7cf5;
      color: #3c7cf5;
      background: #fff;
    }
    .delete-btn {
      border: 1px solid #3c7cf5;
      color: #fff;
      background: #3c7cf5;
    }
    .submit-area {
      margin: 51px auto 60px;
      text-align: center;
      clear: both;
      a {
        display: inline-block;
        width: 64px;
        height: 24px;
        line-height: 22px;
        text-align: center;
        border-radius: 3px;
        &.modify-btn {
          width: 90px;
          margin-left: 14px;
        }
      }
    }
    .apply-del-box{
      position: fixed;
      z-index: 1000;
      height: auto;
      opacity: 1;
      background-color: white;
      width: 310px;
      /*-webkit-box-shadow: 0 5px 15px rgba(0,0,0,.5);*/
      /*-moz-box-shadow: 0 5px 15px rgba(0,0,0,.5);*/
      /*-o-box-shadow: 0 5px 15px rgba(0,0,0,.5);*/
      /*box-shadow: 0 5px 15px rgba(0,0,0,.5);*/
      margin: -155px 0 0 -75px;
      top: 55%;
      left: 43%;
      .title{
        height: 24px;
        background-color: #007aff;
        text-align: right;
        padding-right: 15px;
        line-height: 24px;
        a{
          color: white;
          font-size: 12px;
        }
      }
      .content{
        width: 100%;
        text-align: center;
        margin: 0 auto;
        p{
          padding: 12px 31px;
          margin: 0;
          &:nth-child(2) {
            font-size: 12px;
            padding-top: 0;
          }
          i{
            color: #5078cb;
            font-size: 16px;
            margin-right: 10px;
          }
          span {
            color: #007aff;
          }
          &:last-child {
            font-size: 12px;
          }
        }
        div{
          width: 100%;
          text-align: center;
          margin: 0 auto 20px;
          a{
            padding: 0 19px;
            height: 26px;
            line-height: 26px;
            display: inline-block;
            text-align: center;
            font-size: 14px;
            color: #fff;
            &:first-child{
              background: #c8c6c6;
              margin-right: 10px;
            }
            &:last-child{
              background: #007aff;
            }
          }
        }
      }
    }
  }
</style>
