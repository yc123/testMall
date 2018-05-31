<template>
  <!--最后一步-->
  <div class="section">
    <div class="step-last">
<!--      <h4 class="h4">免费开店</h4>
      <p class="title">申请开店完全免费，一个企业只能开一家店，申请到正式开通预计需1-3个工作日。了解更多请看《开店规则》</p>-->
    </div>
    <div class="radioCheck">
      <label for="1" class="radioLabel">
        <input type="radio" v-model="selectFlag" name="role" value="open" id="1"/>
        <label for="1" class="txtContact"></label>
        <span>免费开店</span>
      </label>
      <label for="2" class="radioLabel">
        <input type="radio" v-model="selectFlag" name="role" value="seller" id="2" checked/>
        <label for="2" class="txtContact"></label>
        <span>暂不开店直接寄售</span>
      </label>
    </div>
    <!--导入店铺模板-->
    <div class="container vendor_store_apply" v-show="selectFlag == 'open'">
        <div>
          <!-- Nav tabs -->
          <ul class="nav nav-tabs">
            <li><div style="height: 39px;line-height: 39px;font-size: 14px;">店铺类型：</div></li>
            <li class="custom_tab" :class="{active: tab == 'ORIGINAL_FACTORY'}" @click="toggleTab('ORIGINAL_FACTORY')">
              <a href="javascript:void(0)">原厂</a>
            </li>
            <li class="custom_tab" :class="{active: tab == 'AGENCY'}" @click="toggleTab('AGENCY')">
              <a href="javascript:void(0)">代理商</a>
            </li>
            <li class="custom_tab" :class="{active: tab == 'DISTRIBUTION'}" @click="toggleTab('DISTRIBUTION')">
              <a href="javascript:void(0)">经销商</a>
            </li>
          </ul>
          <!-- Tab panes -->
          <div class="tab-content">
            <!-- 原厂 -->
            <div role="tabpanel" class="tab-pane" v-if="tab == 'ORIGINAL_FACTORY'" :class="{active: tab == 'ORIGINAL_FACTORY'}">
              <div class="row com_row">
                <div class="col-md-4 custom_col">
                  <div class="row" style="margin: 0;">
                    <div class="col-md-5 col-md-offset-1 show_image_area show_image">
                      <upload :typeData="'BUSINESS_LICENSE'" :url="businessLicenseUrl" @uploadAction="onUpload"></upload>
                    </div>
                    <div class="col-md-5" style="padding: 0;">
                      <span style="margin-top: 50%;padding-right: 20px;">营业执照<em style="color: #FF0000;">*</em></span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 custom_col">
                  <div class="row" style="margin: 0;">
                    <div class="col-md-5 col-md-offset-1 show_image_area show_image">
                      <upload  :typeData="'TAX_PAYER'" @uploadAction="onUpload"></upload>
                    </div>
                    <div class="col-md-5" style="padding: 0;">
                      <span style="margin-top: 50%;padding-right: 20px;">纳税人证明</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 custom_col">
                  <div class="row" style="margin: 0;">
                    <div class="col-md-5 col-md-offset-1 show_image_area show_image">
                      <upload :typeData="'TAX_REGISTRATION'" @uploadAction="onUpload"></upload>
                    </div>
                    <div class="col-md-5" style="padding: 0;">
                      <span style="margin-top: 50%;padding-right: 20px;">税务登记证</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-12"><em>* </em>如已上传最新版营业执照（三证合一），则其他两证无需上传 ； 仅支持JPG、PNG、GIF、PDF格式，每张大小不超过3M</div>
              </div>
              <!--增加品牌-->
              <div class="brand-type row" v-for="(brand, index) in brands">
                <div class="col-md-1">品牌{{index+1}}<em v-if="index == 0">*</em></div>
                <div class="col-md-7">
                  <input type="text" v-model="brand.name"
                         @input="onBrandInput(brand, index)"
                         @blur.stop.prevent="onBrandChanged(brand, index)"
                         class="form-control" name="brandName"  autocomplete="off" placeholder="请输入英文品牌或中文品牌，如：松下; panasonic等"/>
                  <ul class="dropdown-menu"
                      v-show="showSimilarKey.flag && showSimilarKey.index == index"
                      @mouseenter="showFlag = true"
                      @mouseleave="showFlag = false">
                    <li @mouseenter="setKeyActive"
                        @mouseleave="setKeyDefault"
                        @click.stop.prevent="changedName(brand, index, key_index)"
                        v-for="(key, key_index) in similarKeys[index]">
                      <a v-text="key.nameCn">
                        <!--<strong>C</strong>apital Advan<strong>c</strong>ed-->
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="brand-small-upload col-md-4">
                  <div class="brand-small-img">
                    <upload :typeData="index" @uploadAction="onUpload"></upload>
                  </div>
                  <div class="file-text">品牌logo/商标注册原件/授权说明书</div>
                  <div v-show="brands.length > 1" @click="deleteBrand(index)" class="delete" title="删除"><i class="fa fa-trash"></i></div>
                  <div class="col-md-12"><em v-if="index == 0">*</em>仅支持JPG、PNG、GIF、PDF格式，大小不超过3M</div>
                </div>
              </div>
              <div class="add-brand row">
                <a href="javascript:void(0)" title="增加品牌" @click="addBrand"><em><i class="fa fa-plus-circle"></i>增加品牌</em></a>
              </div>
              <div class="unpass-reason row" style="display: none">
                原因：<span style="color: #d32526;">原因</span>
              </div>
            </div>
            <!--原厂end-->
            <!--代理商 begin-->
            <div role="tabpanel" class="tab-pane" v-if="tab == 'AGENCY'" :class="{active: tab == 'AGENCY'}">
              <div class="row com_row">
                <div class="col-md-4 custom_col">
                  <div class="row" style="margin: 0;">
                    <div class="col-md-5 col-md-offset-1 show_image_area show_image">
                      <upload :typeData="'BUSINESS_LICENSE'" :url="businessLicenseUrl" @uploadAction="onUpload"></upload>
                    </div>
                    <div class="col-md-5" style="padding: 0;">
                      <span style="margin-top: 50%;padding-right: 20px;">营业执照<em style="color: #FF0000;">*</em></span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 custom_col">
                  <div class="row" style="margin: 0;">
                    <div class="col-md-5 col-md-offset-1 show_image_area show_image">
                      <upload  :typeData="'TAX_PAYER'" @uploadAction="onUpload"></upload>
                    </div>
                    <div class="col-md-5" style="padding: 0;">
                      <span style="margin-top: 50%;padding-right: 20px;">纳税人证明</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 custom_col">
                  <div class="row" style="margin: 0;">
                    <div class="col-md-5 col-md-offset-1 show_image_area show_image">
                      <upload :typeData="'TAX_REGISTRATION'" @uploadAction="onUpload"></upload>
                    </div>
                    <div class="col-md-5" style="padding: 0;">
                      <span style="margin-top: 50%;padding-right: 20px;">税务登记证</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-12"><em>* </em>如已上传最新版营业执照（三证合一），则其他两证无需上传 ； 仅支持JPG、PNG、GIF、PDF格式，每张大小不超过3M</div>
              </div>
              <!--增加品牌-->
              <div class="brand-type row" v-for="(brand, index) in brands">
                <div class="col-md-1">品牌{{index+1}}<em>*</em></div>
                <div class="col-md-7">
                  <input type="text" v-model="brand.name"
                         @input="onBrandInput(brand, index)"
                         @blur.stop.prevent="onBrandChanged(brand, index)"
                         class="form-control" name="brandName"  autocomplete="off" placeholder="请输入英文品牌或中文品牌，如：松下; panasonic等"/>
                  <ul class="dropdown-menu"
                      v-show="showSimilarKey.flag && showSimilarKey.index == index"
                      @mouseenter="showFlag = true"
                      @mouseleave="showFlag = false">
                    <li @mouseenter="setKeyActive"
                        @mouseleave="setKeyDefault"
                        v-for="(key, key_index) in similarKeys[index]">
                      <a v-text="key.nameCn"  @click.stop.prevent="changedName(brand, index, key_index)">
                        <!--<strong>C</strong>apital Advan<strong>c</strong>ed-->
                      </a>
                    </li>
                  </ul>
                </div>
                <div class="brand-small-upload col-md-4">
                  <div class="brand-small-img">
                    <upload :typeData="index" @uploadAction="onUpload"></upload>
                  </div>
                  <div class="file-text">代理资格证/代理授权书</div>
                  <div v-show="brands.length > 1" @click="deleteBrand(index)" class="delete" title="删除"><i class="fa fa-trash"></i></div>
                  <div class="col-md-12"> <em>*</em>仅支持JPG、PNG、GIF、PDF格式，大小不超过3M</div>
                </div>
              </div>
              <div class="add-brand row">
                <a href="javascript:void(0)" title="增加品牌" @click="addBrand"><em><i class="fa fa-plus-circle"></i>增加品牌</em></a>
              </div>
              <div class="unpass-reason row" style="display: none">
                原因：<span style="color: #d32526;">原因</span>
              </div>
            </div>
            <!--代理商 end-->
            <!--经销商 begin-->
            <div role="tabpanel" class="tab-pane" v-if="tab == 'DISTRIBUTION'" :class="{active: tab == 'DISTRIBUTION'}">
              <div class="row com_row">
                <div class="col-md-4 custom_col">
                  <div class="row" style="margin: 0;">
                    <div class="col-md-5 col-md-offset-1 show_image_area show_image">
                      <upload :typeData="'BUSINESS_LICENSE'" :url="businessLicenseUrl" @uploadAction="onUpload"></upload>
                    </div>
                    <div class="col-md-5" style="padding: 0;">
                      <span style="margin-top: 50%;padding-right: 20px;">营业执照<em style="color: #FF0000;">*</em></span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 custom_col">
                  <div class="row" style="margin: 0;">
                    <div class="col-md-5 col-md-offset-1 show_image_area show_image">
                      <upload  :typeData="'TAX_PAYER'" @uploadAction="onUpload"></upload>
                    </div>
                    <div class="col-md-5" style="padding: 0;">
                      <span style="margin-top: 50%;padding-right: 20px;">纳税人证明</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-4 custom_col">
                  <div class="row" style="margin: 0;">
                    <div class="col-md-5 col-md-offset-1 show_image_area show_image">
                      <upload :typeData="'TAX_REGISTRATION'" @uploadAction="onUpload"></upload>
                    </div>
                    <div class="col-md-5" style="padding: 0;">
                      <span style="margin-top: 50%;padding-right: 20px;">税务登记证</span>
                    </div>
                  </div>
                </div>
                <div class="col-md-12"><em>* </em>如已上传最新版营业执照（三证合一），则其他两证无需上传 ； 仅支持JPG、PNG、GIF、PDF格式，每张大小不超过3M</div>
              </div>
            </div>
            <!--经销商 end-->
          </div>
          <!-- Submit button -->
         <!-- <div style="padding: 28px 40px;">
            <button type="button" class="btn btn-primary" style="float: right" @click="submitApply">提交申请</button>
            <div class="clear-fix"></div>
          </div>-->
        </div>
        <!--删除上传图片-->
        <div class="com-del-box" style="display: none">
          <div class="title">
            <a><i class="fa fa-close fa-lg"></i></a>
          </div>
          <div class="content">
            <p><i class="fa fa-exclamation-circle"></i>是否删除选中信息</p>
            <div><a>取消</a><a>确认</a></div>
          </div>
        </div>
        <!--删除品牌图片-->
        <div class="com-del-box" style="display: none">
          <div class="title">
            <a><i class="fa fa-close fa-lg"></i></a>
          </div>
          <div class="content">
            <p><i class="fa fa-exclamation-circle"></i>品牌信息为重要信息，确定删除吗？</p>
            <div><a>取消</a><a>确认</a></div>
          </div>
        </div>
        <!--提示框-->
        <div class="com-del-box" v-if="showBrandNameInvalid">
          <div class="title">
            <a @click="showBrandNameInvalid = false"><i class="fa fa-close fa-lg"></i></a>
          </div>
          <div class="content">
            <p style="line-height: 20px;margin-top: 10px;padding:0 10px">非常抱歉，目前暂无此品牌！<br>若直接前往“品牌申请”，我们将为您先开通寄售功能，待申请通过后再提交开店申请。</p>
            <p style="line-height: 20px;">前往<a @click="goBrandApply()"  target="_blank" style="color: #5078CB">品牌申请&nbsp;<i class="fa fa-arrow-right"></i></a></p>
          </div>
        </div>
      </div>
    <!--<div class="step-last">
      <h4 class="h4">库存寄售</h4>
      <p class="title">无需开店，即可发布贵司仓库里的滞销产品，优软商城代为销售，匿名清仓无压力<button class="no-apply" @click="goProduct">暂不开店，直接寄售</button></p>
    </div>-->
    <div class="row btn-area">
      <span @click="sectionChange(2)">上一步</span>
      <span @click="btnDisabled?'':selectFlag == 'open'?submitApply():goProduct()" :class="btnDisabled?'btn-disabled':''">提交申请</span>
    </div>
    <div class="loading" v-show="showLoading">
      <img src="/images/all/loading.gif" alt="">
    </div>
  </div>
</template>
<script>
  import Upload from '~components/common/upload/upload.vue'
  export default {
    data () {
      return {
        tab: 'ORIGINAL_FACTORY',
        brands: [{
          type: 'BRAND',
          name: '',
          url: '',
          isPdf: false,
          brandUuid: ''
        }],
        businessLicenseUrl: '',
        taxPayerUrl: '',
        taxRegistrationUrl: '',
//        defaultBusinessUrl: '',
        showBrandNameInvalid: false,
        similarKeys: [[]],
        showSimilarKey: {
          flag: false,
          index: 0
        },
        showFlag: false,
        isSelfRegisterSuccess: true,
        selectFlag: 'open',
        showLoading: false,
        btnDisabled: false
      }
    },
    props: [
      'checkData',
      'registerData',
      'loginData',
      'enterpriseData',
      'businessImgUrl'
    ],
    watch: {
      enterpriseData: function (val, oldVal) {
        if (val !== {}) {
          this.businessLicenseUrl = val.url || val.businessCodeImage || ''
//          this.defaultBusinessUrl = val.enBussinessCodeImage || ''
        }
      },
      businessImgUrl: function (val, oldVal) {
        this.businessLicenseUrl = val
      }
    },
    components: {
      Upload
    },
    computed: {
      user () {
        return this.$store.state.option.user
      }
    },
    methods: {
      sectionChange: function (type) {
        this.$emit('sectionEvent', type)
      },
      toggleTab (t) {
        this.tab = t
        this.brands = [{
          type: 'BRAND',
          name: '',
          url: '',
          isPdf: false,
          brandUuid: ''
        }]
      },
      onUpload: function (obj) {
        if (obj.type === 'BUSINESS_LICENSE') {
    //      this.businessLicenseUrl = obj.url
          this.businessLicenseUrl = obj.url
          if (obj.url !== '') {
            this.$emit('businessImgUrlAction', this.businessLicenseUrl)
          }
        } else if (obj.type === 'TAX_PAYER') {
          this.taxPayerUrl = obj.url
        } else if (obj.type === 'TAX_REGISTRATION') {
          this.taxRegistrationUrl = obj.url
        } else if (typeof obj.type === 'number') {
          this.brands[obj.type].url = obj.url
        }
      },
      onBrandChanged: function (item, index) {
        this.showSimilarKey.flag = this.showFlag
        if (!this.showFlag) {
          this.onCheck(item)
        }
      },
      onCheck: function (item, index) {
        if (item.name && item.name !== '') {
          this.$http.get('/api/product/brand', {params: {name: item.name, op: 'by_name'}})
            .then(response => {
              item.brandUuid = response.data.uuid
              item.isPdf = item.url.substring(item.url.length - 4, item.url.length) === '.pdf'
            }, err => {
              console.log(err)
              this.showBrandNameInvalid = true
            })
        }
      },
      onBrandInput: function (brand, index) {
        this.showSimilarKey.flag = false
        this.$http.get('/search/similarBrands?keyword=' + brand.name)
          .then(response => {
            this.similarKeys[index] = response.data
            if (response.data.length > 0) {
              this.showSimilarKey.flag = true
              this.showSimilarKey.index = index
            }
          })
      },
      changedName: function (brand, index, keyIndex) {
        brand.name = this.similarKeys[index][keyIndex].nameCn
        this.showSimilarKey.flag = false
        this.onCheck(brand)
      },
      setKeyActive: function (e) {
        e.target.setAttribute('class', 'active')
      },
      setKeyDefault: function (e) {
        e.target.setAttribute('class', '')
      },
      submitApply: function () {
        if (this.loginData.isSelf) {
          if (!this.registerData.isValidRegister) {
            this.$message.error('请输入正确的注册信息')
          } else if (!this.checkData.checked) {
            this.$message.error('您还没有勾选相关条款')
          } else {
            this.registerSelf()
          }
        } else {
          if (!this.checkData.checked) {
            this.$message.error('您还没有勾选相关条款')
          } else {
            this.storeApply(this.loginData.enterprise.uu)
          }
        }
      },
      registerSelf: function () {
        this.showLoading = true
        this.$http.post('/basic/enterprise/register?filePath=' + this.registerData.url, this.registerData.enterprise)
          .then(response => {
            if (response.data.success) {
              this.isSelfRegisterSuccess = true
              this.$http.delete('basic/user/userCacheEnterprise')
              this.$http.get('/user/authentication/reflash')
                .then(() => {
                  this.$http.get(`/user/authentication/` + response.data.data.enuu).then(() => {
                    this.$store.dispatch('loadUserInfo')
                    this.loginData.isSelf = false
                    this.loginData.enterprise.uu = response.data.data.enuu
                    this.storeApply(response.data.data.enuu)
//                    window.location.reload()
                    this.showLoading = false
                  })
                }
              )
            } else {
              this.isSelfRegisterSuccess = false
              this.showLoading = false
              this.$message.error(response.data.message || '企业注册失败，请重新填写信息')
            }
          }, err => {
            console.log(err)
            this.isSelfRegisterSuccess = false
            this.showLoading = false
            this.$message.error('企业注册失败，请重新填写信息')
          })
      },
      storeApply: function (enuu) {
        this.showLoading = true
        let validCode = 0
        if (this.businessLicenseUrl === '') {
          this.$message.error('请上传营业执照')
          this.showLoading = false
        } else {
          if (this.brands[0].name === '') {
            validCode = 1
          } else if (this.brands[0].url === '') {
            validCode = 2
          }
          if (validCode === 0 || this.tab === 'DISTRIBUTION') {
            let qualifications = []
            qualifications.push({
              type: 'BUSINESS_LICENSE',
              resourceUrl: this.businessLicenseUrl,
              isPdf: this.isPdf(this.businessLicenseUrl)
            })
            if (this.taxPayerUrl !== '') {
              qualifications.push({
                type: 'TAX_PAYER',
                resourceUrl: this.taxPayerUrl,
                isPdf: this.isPdf(this.taxPayerUrl)
              })
            }
            if (this.taxPayerUrl !== '') {
              qualifications.push({
                type: 'TAX_REGISTRATION',
                resourceUrl: this.taxRegistrationUrl,
                isPdf: this.isPdf(this.taxRegistrationUrl)
              })
            }
//            console.log(qualifications)
            let tmpBrands = []
            this.brands.forEach(function (item) {
              if (item.name !== '' && item.url !== '') {
                tmpBrands.push(item)
              }
            })
            this.$http.post('/store-service/applications', {
              brands: tmpBrands,
              qualifications: qualifications,
              type: this.tab
            }).then(response => {
              this.showLoading = false
              if (response.data.success) {
                this.btnDisabled = true
                this.$message.success('感谢您对优软商城的支持，我们会尽快对您提交的信息进行审核，预计审核时间为3个工作日，审核结果将以站内消息及邮件形式通知您！')
              } else {
                this.btnDisabled = true
                this.$message.error('开通店铺异常，请前往我的店铺查看店铺开通进度')
              }
              this.$http.post('/basic/enterprise/openVendor/' + enuu)
                .then(() => {
                  this.$http.get('/user/authentication/reflash')
                    .then(() => {
                      this.$http.get(`/user/authentication/` + enuu).then(() => {
                        this.$store.dispatch('loadUserInfo')
                      })
                    })
                })
              window.setTimeout(function () {
                window.location.href = '/vendor#/store-apply/wait'
              }, 3000)
            }, err => {
              console.log(err)
              this.$http.post('/basic/enterprise/openVendorSetRead/' + enuu)
              this.$message.error('开通店铺失败')
              this.showLoading = false
            })
          } else {
            if (validCode === 1) {
              this.$message.error('请添加品牌信息')
              this.showLoading = false
            } else if (validCode === 2) {
              this.$message.error('请上传品牌图片')
              this.showLoading = false
            }
          }
        }
      },
      addBrand: function () {
        this.brands.push({
          type: 'BRAND',
          name: '',
          url: '',
          isPdf: false,
          brandUuid: ''
        })
        this.similarKeys.push([])
      },
      deleteBrand: function (index) {
        this.brands.splice(index, 1)
        this.similarKeys.splice(index, 1)
      },
      isPdf: function (url) {
        return url.substring(url.length - 4, url.length) === '.pdf'
      },
      reflashEnterprise: function (enuu, url) {
        this.$http.post('/basic/enterprise/openVendor/' + enuu)
          .then(() => {
            this.$http.get('/user/authentication/reflash')
              .then(() => {
                this.$http.get(`/user/authentication/` + enuu).then(() => {
                  this.$store.dispatch('loadUserInfo')
                  window.location.href = url
                })
              }
              )
          })
      },
      goProduct: function (baseUrl) {
        if (this.loginData.isSelf) {
          if (!this.registerData.isValidRegister) {
            this.$message.error('请输入正确的注册信息')
          } else if (!this.checkData.checked) {
            this.$message.error('您还没有勾选相关条款')
          } else {
            this.showLoading = true
            this.$http.post('/basic/enterprise/register?filePath=' + this.registerData.url, this.registerData.enterprise)
              .then(response => {
                if (response.data.success) {
                  this.isSelfRegisterSuccess = true
                  this.$http.delete('basic/user/userCacheEnterprise')
                  this.reflashEnterprise(response.data.data.enuu, baseUrl || '/vendor#/vendor_upload')
                } else {
                  this.isSelfRegisterSuccess = false
                  this.$message.error(response.data.message || '企业注册失败，请重新填写信息')
                }
                this.showLoading = false
              }, err => {
                console.log(err)
                this.isSelfRegisterSuccess = false
                this.showLoading = false
                this.$message.error('企业注册失败，请重新填写信息')
              })
          }
        } else {
          if (!this.checkData.checked) {
            this.$message.error('您还没有勾选相关条款')
          } else {
            this.reflashEnterprise(this.loginData.enterprise.uu, baseUrl || '/vendor#/vendor_upload')
          }
        }
      },
      goBrandApply: function () {
        this.showBrandNameInvalid = false
        this.goProduct('/vendor#/brand/apply/')
      }
    }
  }
</script>
<style scoped>
  .com-input{
    width: 100%;
    height: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    opacity: 0;
    display: inline-block !important;
  }
  .el-upload-list--picture-card .el-upload-list__item{
    width: 160px;
    height: 120px;
    top: 69px;
  }
  div.vendor_store_apply {
    margin: 0 auto;
    width: 1026px;
    background-color: #FFFFFF;
    margin-bottom: 20px;
    margin-top: 25px;
  }

  div.vendor_store_apply .com_row {
    padding: 0 40px;
    min-height: 40px;
  }

  div.vendor_store_apply .title_row {
    margin-bottom: 20px;
    border-bottom: #e8e8e8 1px solid;
  }

  div.vendor_store_apply .custom_col {
    margin: 0;
    padding: 0;
  }

  div.vendor_store_apply .custom_col img.previewImage {
    max-width: 160px;
    max-height: 120px;
    cursor: pointer;
    /*padding: 0 30px;*/
  }

  div.vendor_store_apply .row h2 {
    padding: 10px 0;
    font-size: 16px;
    font-weight: 500;
    color: #000000;
  }

  div.vendor_store_apply .row span {
    display: block;
    padding: 10px 0;
    font-size: 14px;
    color: #000000;
  }

  div.vendor_store_apply #file_upload {
    width: 100px;
    height: 100px;
    border:1px solid #CDCDCD;
    /*background: url("static/img/vendor/images/upload.png");*/
  }

  div.vendor_store_apply #upload_qualification {
    width: 100px;
    height: 100px;
    opacity: 0;
  }

  div.vendor_store_apply .custom_tab {
    margin: 0 15px;
    width: 90px;
    text-align: center;
  }

  div.vendor_store_apply .nav li.custom_tab.active>a,
  div.vendor_store_apply .nav li.custom_tab.active>a:focus,
  div.vendor_store_apply .nav li.custom_tab.active>a:hover {
    border: 1px solid #5078CB;
    border-bottom-color: transparent;
    color: #5078cb;
  }

  div.vendor_store_apply .uploadify-button {
    display: block;
  }

  div.vendor_store_apply .custom_col .show_image_area {
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .nav-tabs{
    height: 41px;
    background: none;
    padding: 0 40px;
  }
  .nav-tabs>li>a{
    border-radius: 0;
    color: #333;
  }
  div.vendor_store_apply .btn-primary{
    background: #5078cb;
    border-radius: 0;
  }
  div.vendor_store_apply .btn-primary:hover{
    background: #3f7ae3;
  }
  div.vendor_store_apply .com_row .col-md-2{
    width: 120px;
  }
  div.vendor_store_apply .com_row .col-md-10 span{
    color: #666;
  }

  /*修改的样式*/
  div.vendor_store_apply .custom_col .show_image_area{
    position: relative;
    overflow: hidden;
  }
  .hover-show{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 120px;
    left: 0;
    background: rgba(0,0,0,.5);
  }
  div.vendor_store_apply .custom_col .show_image_area .hover-show{
    top: 0;
  }
  .hover-show .delete{
    padding: 0;
    width: 30px;
    height: 30px;
    float: right;
    text-align: center;
  }
  .hover-show .delete:hover{
    cursor: pointer;
  }
  .hover-show .delete i{
    color: #fff;
    font-size: 18px;
  }
  .hover-show a{
    display: inline-block;
    width: 100%;
    height: 60px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 60px;
  }
  .hover-show a i{
    margin-right: 5px;
    font-size: 16px;
  }
  .brand-type{
    line-height: 34px;
    font-size: 14px;
    margin: 20px 20px 5px 20px;
  }
  .brand-type .brand-small-img{
    position: relative;
    width: 84px;
    height: 84px;
    overflow: hidden;
    text-align: center;
    border: #e8e8e8 1px solid;
  }
  .brand-type .brand-small-img .preview img{
    max-width: 84px;
    max-height: 84px;
  }
  .brand-type em{
    color: #ff0000;
  }
  .brand-type .col-md-7,.brand-type .col-md-1{
    margin-top: 25px;
  }
  .brand-small-upload .file-text,.brand-type .brand-small-img{
    float: left;
  }
  .brand-small-upload .file-text{
    width: 120px;
    margin-left: 10px;
    line-height: 20px;
    margin-top: 6%;
  }
  .brand-small-upload .delete{
    float: right;
    text-align: center;
    line-height: 84px;
  }
  .brand-small-upload .delete i{
    font-size: 18px;
    color: #5078cb;
  }
  .brand-small-upload .delete:hover{
    cursor: pointer;
  }
  .brand-small-upload .delete:hover i{
    color: #f00;
  }
  .brand-small-upload .brand-small-img .hover-show{
    top: 0;
  }
  .brand-small-upload .brand-small-img .hover-show{
  }
  .brand-small-upload .brand-small-img .hover-show span i{
    color: #fff;
  }
  .brand-small-upload .brand-small-img .hover-show span.delete{
    line-height: 30px;
    padding: 0;
  }
  .brand-small-upload .brand-small-img .hover-show a{
    line-height: 30px;
    height: 30px;
  }
  .tab-content {
    border: 1px #5078CB solid;
    padding-bottom: 30px;
  }
  .tab-content .com_row{
    margin:40px 0 0;
    border-bottom: #ccc 1px dashed;
    padding-bottom: 40px !important;
  }
  .tab-content .com_row .col-md-12{
    color: #999;
    margin-top: 20px;
    font-size: 12px;
    padding-left: 50px;
  }
  .brand-small-upload .col-md-12{
    color: #999;
    font-size: 12px;
    padding-left: 0;
  }
  .tab-content .com_row .col-md-12 em,.brand-small-upload .col-md-12 em{
    color: #f00;
  }
  .add-brand{
    text-align: center;
    border-bottom: #ccc 1px dashed;
    margin: 0 0 20px 0;
    height: 34px;
  }
  .add-brand a{
    font-size: 14px;
    color: #5078cb;
    width: 200px;
    height: 15px;
    display: inline-block;
    border: #ccc 1px dashed;
    border-top: 0;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    margin-top: 31px;
    background: #fff;
    line-height: 15px;
    text-decoration: none;
  }
  .add-brand a i{
    margin-right: 5px;
    font-size: 20px;
    vertical-align: middle;
  }
  .add-brand a em{
    position: relative;
    top: -10px;
    font-weight: bold;
    font-style: inherit;
  }
  .add-brand a:hover em{
    color: #d32526;
    text-decoration: none;
  }
  .unpass-reason {
    margin: 0 40px;
    line-height: 34px;
  }

  /* 预览框 end */

  .brand-type .dropdown-menu {
    width: 95%;
  }
  .brand-type .dropdown-menu li {
    font-size: 14px;
  }
  .com-del-box{
    position: fixed;
    z-index: 1000;
    height: auto;
    opacity: 1;
    background-color: white;
    width: 310px;
    -webkit-box-shadow: 0 5px 15px rgba(0,0,0,.5);
    -moz-box-shadow: 0 5px 15px rgba(0,0,0,.5);
    -o-box-shadow: 0 5px 15px rgba(0,0,0,.5);
    box-shadow: 0 5px 15px rgba(0,0,0,.5);
    margin: -155px 0 0 -75px;
    top: 55%;
    left: 43%;
  }
  .com-del-box .title{
    height: 30px;
    background-color: #5078cb;
    text-align: right;
    padding-right: 15px;
    line-height: 30px;
  }
  .com-del-box .title a{
    color: white;
    font-size: 16px;
  }
  .com-del-box .content{
    width: 100%;
    text-align: center;
    margin: 0 auto;
  }
  .com-del-box .content p{
    line-height: 50px;
    font-size: 14px;
    padding-top: 10px;
  }
  .com-del-box .content p i{
    color: #5078cb;
    font-size: 16px;
    margin-right: 10px;
  }
  .com-del-box .content div{
    width: 100%;
    text-align: center;
    margin: 0 auto;
  }
  .com-del-box .content div a{
    width: 55px;
    height: 26px;
    line-height: 26px;
    display: inline-block;
    text-align: center;
    font-size: 14px;
  }
  .com-del-box .content div a:first-child{
    background: #b4b5b9;
    color: #333;
    margin-right: 10px;
  }
  .com-del-box .content div a:last-child{
    background: #5078cb;
    color: #fff;
  }
  .com-del-box .content div a:hover{
    background: #3f7ae3;
    color: #fff;
  }
  div.vendor_store_apply .custom_col .show_image_area{
    width: 160px;
    border: #dcdcdc 1px solid;
    margin: 0 10px 0 0;
    padding: 0;
  }
  div.vendor_store_apply .tab-content .custom_col{
    width: 280px;
  }
  div.vendor_store_apply .tab-content .custom_col:first-child{
    margin-left: 50px;
  }
  div.vendor_store_apply .custom_col .row .col-md-5:last-child{
    width: 110px;
  }
  div.vendor_store_apply .custom_col .row .col-md-5:last-child span{
    margin-top: 85% !important;
    padding-bottom: 0 !important;
  }
  .hoverShow{
    position: absolute;
    width: 30px;
    height: 30px;
    top: 0px;
    right: 0;
    background: rgba(0,0,0,.4);
    display: none;
  }

  div.vendor_store_apply .custom_col .show_image_area:hover .hoverShow{
    display: block;
  }
  div.vendor_store_apply .custom_col .show_image_area .deleteImg{
    position: absolute;
    right: 7px;
    top: 0;
    display: inline-block;
    padding: 0;
    margin-top: 6px;
    font-size: 18px;
    color: #fff;
  }
  .hover-show a{
    color: #fff;
    text-decoration: none;
  }
  .hover-show a:hover, .hover-show a:active, .hover-show a:focus{
    color: #fff;
    text-decoration: none;
  }
 /* .dropdown-menu>.active>a, .dropdown-menu>.active>a:focus, .dropdown-menu>.active>a:hover {
    color: #fff;
  }*/
  .dropdown-menu {
    display: block;
    left: 14px;
  }
  /*
  radio
  */
  .radioLabel {
    line-height: 20px;
    cursor: pointer;
  }
  .radioLabel label{
    width: 16px;
    height: 16px;
    background: url("/images/messageBoard/radio.png");
    background-position: 0 -1px;
    vertical-align: middle;
    margin-bottom: 0 !important;
    margin-right: 0 !important;
    cursor: pointer;
  }
  .radioLabel input[type="radio"]:checked + label {
    background-position: -19px -1px;
  }
  .radioLabel input[type="radio"] + label + span {
    margin-left: 5px;
  }
  .radioLabel input[type="radio"]:checked + label{
    color: #5078cb;
  }
  .radioLabel input[type="radio"]{
    display: none;
  }
  .radioLabel span {
    font-weight: bold;
    font-size: 18px;
    color: #5e5e5e;
  }
  .radioCheck {
    padding-top: 35px;
    padding-left: 30px;
    padding-bottom: 35px;
  }
  .radioCheck .radioLabel:first-child {
    margin-right: 10px;
  }
  .btn-area {
    margin-top: 20px;
    text-align: center;
  }
  .btn-area span {
    height: 35px;
    line-height: 35px;
    border: 1px solid #5078cb;
    padding: 0 62px;
    font-size: 16px;
    display: inline-block;
    color: #5078cb;
    cursor: pointer;
    background: #fff;
  }
  .btn-area span:first-child{
    margin-right: 16px;
  }
  .btn-area span:last-child{
    background: #5078cb;
    color: #fff;
  }
/*  .btn-area span:hover {

  }*/
  .loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width:  100%;
    height: 100%;
    z-index: 1000;
    text-align: center;
  }
  .loading img {
    position: relative;
    top: 40%;
  }
  .btn-area .btn-disabled {
    cursor: not-allowed;
    opacity: .5;
  }
</style>
