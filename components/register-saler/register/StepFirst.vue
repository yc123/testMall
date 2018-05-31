<template>
  <!--填写注册信息-->
  <div class="section" @click="onHideBox">
    <div class="register">
      <div class="x-form-set-header">
        <h4>企业基本信息</h4>
      </div>
      <div class="row">
        <label class="col-sm-2 x-required">企业名称：</label>
        <div class="col-sm-5">
          <input :class="!validName.isValidTypeName || !validName.isValidName?'form-control error-box-border':'form-control'" type="text" @change="nameCheck(3)" @input="nameTypeCheck()" :disabled="!loginData.isSelf" v-model="data.name" name="name" required="" placeholder="填写营业执照上的企业名称">
        </div>
        <div class="x-text-help" v-show="validName.isValidTypeName && validName.isValidName && !validName.init">
          <i class="glyphicon glyphicon-ok x-icon-left"></i>
        </div>
        <div class="col-sm-5" v-show="!validName.isValidTypeName && !validName.init">
          <p>
            <i class="fa fa-info-circle"></i>请填写正确的企业名称，2~99个字符
          </p>
        </div>
        <div class="col-sm-5" v-show="!validName.isValidName && !validName.init">
          <p>
            <i class="fa fa-info-circle"></i>注册的企业名称已存在，请联系管理员
          </p>
        </div>
      </div>
      <div class="row">
        <label class="col-sm-2 x-required">营业执照号：</label>
        <div class="col-sm-5">
          <input type="text" :class="!validLicence.isValidLicence?'form-control error-box-border':'form-control x-input'" :disabled="!loginData.isSelf" @input="validLicence.init=false" @change="licenceCheck(3)" v-model="data.licenceId" name="name" required="" placeholder="请填写营业执照上的注册号">
        </div>
        <div class="x-text-help" v-show="validLicence.isValidLicence && !validLicence.init">
          <i class="glyphicon glyphicon-ok x-icon-left"></i>
        </div>
        <div class="col-sm-5" v-show="!validLicence.isValidLicence && !validLicence.init"><p><i class="fa fa-info-circle"></i>请填写营业执照上的注册号</p></div>
      </div>
      <!--<div class="row">
        <label class="col-sm-2 x-required">营业执照：</label>
        <div class="col-sm-5">
          <a class="x-btn-blank" v-if="loginData.isSelf" title="请上传营业执照扫描件（≤5M的图片或PDF）">
            <i class="fa fa-picture-o"></i>
            请上传营业执照扫描件（≤5M的图片或PDF）
            <input type="file" @change="upload" class="form-control file-input" name="name" required="" placeholder="请上传营业执照扫描件（≤5M的图片或PDF）" accept="image/jpeg,image/jpg,image/gif,image/bmp,image/png,.pdf">
          </a>
          <img class="previewImg" v-if="data.url != ''" :src="isPdf?'/images/all/timg.png':data.url" alt="">
        </div>
        <div class="x-text-help" v-show="validUpload.isValidUpload && !validUpload.init">
          <i class="glyphicon glyphicon-ok x-icon-left"></i>
        </div>
        <div class="col-sm-5" v-show="!validUpload.isValidUpload && !validUpload.init"><p><i class="fa fa-info-circle"></i>请上传营业执照扫描件（≤5M的图片或PDF）</p></div>
      </div>
      <div class="row">
        <label class="col-sm-2 x-required">法定代表人：</label>
        <div class="col-sm-5">
          <input type="text" :disabled="!loginData.isSelf" :class="!validLawPerson.isValidLawPerson?'form-control error-box-border':'form-control'" @input="lawPersonCheck()" v-model="data.lawPerson" name="name" required="" placeholder="请填写营业执照上的法定代表人">
        </div>
        <div class="x-text-help" v-show="validLawPerson.isValidLawPerson && !validLawPerson.init">
          <i class="glyphicon glyphicon-ok x-icon-left"></i>
        </div>
        <div class="col-sm-5" v-show="!validLawPerson.isValidLawPerson && !validLawPerson.init"><p><i class="fa fa-info-circle"></i>请填写营业执照上的法定代表人</p></div>
      </div>-->
      <div class="row">
        <label class="col-sm-2 x-required">注册地址：</label>
        <div class="col-sm-5">
          <input type="text" readonly aria-haspopup="true" aria-expanded="false" @click="onShowAddress" v-model="data.address" class="form-control" name="name" required="" placeholder="填写总部所在地详细地址" style="padding-left:20px;background-color: transparent;">
          <span class="fa fa-map-marker"></span>
          <div v-show="showAddressBox"
               @mouseenter="isInAddressBox = true"
               @mouseleave="isInAddressBox = false"
               style="display: block; left: 14px;" class="dropdown-menu x-union-menu" aria-labelledby="address">
            <div class="x-union-header">
              <div>省份</div>
              <div>城市</div>
              <div>县区</div>
              <div class="x-item-ext">详细地址</div>
            </div>
            <div class="x-union-list">
              <ul class="list-unstyled">
                <li v-for="province in cityData.province"
                    :class="province == address.currentProvince ? 'active' : ''"
                    v-text="province"
                    @click="getCity(province)"></li>
              </ul>
              <ul class="list-unstyled">
                <li v-for="city in cityData.city"
                    :class="city == address.currentCity ? 'active' : ''"
                    v-text="city"
                    @click="getDistrict(city)"></li>
              </ul>
              <ul class="list-unstyled">
                <li v-for="district in cityData.district"
                    v-text="district"
                    :class="district == address.currentDistrict ? 'active' : ''"
                    @click="chooseDistrict(district)"></li>
              </ul>
              <div class="x-item-ext">
                <div class="form-group">
                  <div class="col-sm-12">
                    <textarea id="street" name="street" rows="4" v-model="address.detail" @input="onDetailAddressInput" class="form-control x-input" placeholder="xx路xx大厦xx栋xx楼xx室"></textarea>
                  </div>
                </div>
                <div class="text-right">
                  <a class="register-btn btn-submit" @click="submitAddress">确定</a> <a @click="showAddressBox = false" class="register-btn btn-console">取消</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="x-text-help" v-show="validAddress.isValidAddress && !validAddress.init">
          <i class="glyphicon glyphicon-ok x-icon-left"></i>
        </div>
        <div class="col-sm-5" v-show="!validAddress.isValidAddress && !validAddress.init"><p><i class="fa fa-info-circle"></i>填写总部所在地详细地址</p></div>
      </div>
      <!--<div class="row">
        <label class="col-sm-2">联系人：</label>
        <div class="col-sm-5">
          <input type="text" :disabled="!loginData.isSelf" class="form-control" title="请填写企业对外的联系人，为空则默认为管理员" v-model="data.linkman" name="name" required="" placeholder="请填写企业对外的联系人，为空则默认为管理员">
        </div>
        <div class="col-sm-5"></div>
      </div>
      <div class="row">
        <label class="col-sm-2">联系电话：</label>
        <div class="col-sm-5">
          <input :disabled="!loginData.isSelf" :class="!validPhone.isValidPhone?'form-control error-box-border':'form-control'" type="text" v-model="data.phone" @input="phoneCheck()" name="name" required="" placeholder="例如：13838883888">
        </div>
        <div class="col-sm-5"></div>
      </div>
      <div class="row">
        <label class="col-sm-2">邮箱：</label>
        <div class="col-sm-5">
          <input type="text" :disabled="!loginData.isSelf" :class="!validEmail.isValidEmail?'form-control error-box-border':'form-control'" v-model="data.email" @input="emailCheck()" required="" placeholder="例如：123123@usoft.com">
        </div>
        <div class="col-sm-5"></div>
      </div>
      <div class="row">
        <label class="col-sm-2">企业传真：</label>
        <div class="col-sm-5">
          <input type="text" :disabled="!loginData.isSelf" :class="!validFax.isValidFax?'form-control error-box-border':'form-control'" v-model="data.fax" @input="faxCheck()" required="" placeholder="例如：0755-268XXXXX">
        </div>
        <div class="col-sm-5"></div>
      </div>
      <div class="row">
        <label class="col-sm-2">企业官网：</label>
        <div class="col-sm-5">
          <input type="text" :disabled="!loginData.isSelf" class="form-control" v-model="data.website" name="name" required="" placeholder="www.usoftchina.com" style="padding-left:55px;">
          <span class="web">http://</span>
        </div>
        <div class="col-sm-5"></div>
      </div>
      <div class="row">
        <label class="col-sm-2">行业：</label>
        <div class="col-sm-5 select-dot">
          <input type="text" readonly aria-haspopup="true" aria-expanded="false" @click="onShowProfession()" :style="!loginData.isSelf?'background-color: #eee;':''" :disabled="!loginData.isSelf" v-model="data.profession" class="form-control" name="name" required="" placeholder="请选择所在行业">
          <div v-show="showProfessionBox"
               @mouseenter="isInProfessionBox = true"
               @mouseleave="isInProfessionBox = false"
               style="display: block; left: 14px; width: 473px" class="dropdown-menu x-union-menu">
            <div class="x-union-list">
              <ul class="list-unstyled auto-width">
                <li v-for="profession in professionData.profession"
                    :class="profession == currentProfession.profession ? 'active' : ''"
                    v-text="profession"
                    @click="getProfessionDetail(profession)"></li>
              </ul>
              <ul class="list-unstyled auto-width">
                <li v-for="detail in professionData.detail"
                    :class="detail == currentProfession.detail ? 'active' : ''"
                    v-text="detail"
                    @click="chooseProfessionDetail(detail)"></li>
              </ul>
              <ul class="list-unstyled auto-width">
                <li v-for="detail in professionData.thirdDetail"
                    :class="detail == currentProfession.thirdDetail ? 'active' : ''"
                    v-text="detail"
                    @click="chooseProfessionThirdDetail(detail)"></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-sm-5"></div>
      </div>-->
      <!--<div class="row"  >
        <label class="col-sm-2">企业LOGO：</label>
        <div class="col-sm-5">
          <input type="file" v-if="loginData.isSelf" @change="uploadLogo" class="form-control file-input upload-area" required="" accept="image/jpeg,image/jpg,image/gif,image/bmp,image/png">
          <div class="logo-img-area">
            <img class="preview-logo-img" :src="data.logoUrl && data.logoUrl != ''?data.logoUrl:'/images/all/upload-bg.png'" alt="">
          </div>
        </div>
        <div class="col-sm-5"><p v-show="!validLogo.isValidLogo"><i class="fa fa-info-circle"></i>logo大小不能超过100K</p></div>
        <div class="logo-text">个性化展示您的企业形象，图片不超过100Kb，建议宽x高=100x60</div>
     &lt;!&ndash;   <div class="x-text-help" v-show="validUpload.isValidUpload && !validUpload.init">
          <i class="glyphicon glyphicon-ok x-icon-left"></i>
        </div>
        <div class="col-sm-5" v-show="!validUpload.isValidUpload && !validUpload.init"><p><i class="fa fa-info-circle"></i>请上传营业执照扫描件（≤5M的图片或PDF）</p></div>&ndash;&gt;
      </div>-->
     <!-- <div class="row">
        <label class="col-sm-2">经营范围标签：</label>
        <div class="col-sm-8">
          <div class="no-tags" v-if="!data.tagsData || data.tagsData.length == 0">暂无标签</div>
          <div class="tags-list">
            <ul>
              <li v-for="(tag, index) in data.tagsData"><span v-text="tag"></span><i v-if="loginData.isSelf" class="glyphicon glyphicon-remove" @click="removeTag(index)"></i></li>
            </ul>
          </div>
        </div>
        <div class="col-sm-5 tags-box" v-if="loginData.isSelf">
          <input type="text" @input="tagCheck()" class="form-control" v-model="tag" name="name" required="">
          <span class="add-tag-btn" @click="addTags()" >+添加标签</span>
        </div>
        <div class="col-sm-5" v-if="loginData.isSelf">
          <div class="x-text-tip">
            <i class="glyphicon glyphicon-info-sign x-icon-left"></i>标签长度不超过10个字
          </div>
        </div>
        <div class="col-sm-12 tags-lists" v-if="loginData.isSelf"><em class="pull-left">例如：</em><span>企业管理咨询</span><span>电子产品开发</span><span>货运代理</span></div>
      </div>-->
      <div class="row next-btn"><button class="btn" :style="loginData.isSelf && !isValid ? 'opacity: .65;':''" @click="sectionChange(2)">下一步</button></div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        data: {
          name: '',
//          lawPerson: '',
//          url: '',
          licenceId: '',
          address: ''
//          linkman: '',
//          phone: '',
//          email: '',
//          fax: '',
//          website: '',
//          profession: '',
//          logoUrl: '',
//          tagsData: []
        },
        validName: {
          isValidTypeName: true,
          isValidName: true,
          init: true
        },
//        validUpload: {
//          isValidUpload: true,
//          init: true
//        },
        validLicence: {
          isValidLicence: true,
          init: true
        },
        validAddress: {
          isValidAddress: true,
          init: true
        },
//        validLawPerson: {
//          isValidLawPerson: true,
//          init: true
//        },
//        validPhone: {
//          isValidPhone: true,
//          init: true
//        },
//        validEmail: {
//          isValidEmail: true,
//          init: true
//        },
//        validFax: {
//          isValidFax: true,
//          init: true
//        },
//        validLogo: {
//          isValidLogo: true,
//          init: true
//        },
        isValid: false,
//        isPdf: false,
        showAddressBox: false,
        isInAddressBox: false,
//        showProfessionBox: false,
//        isInProfessionBox: false,
        temCityData: {},
        cityData: {
          province: [],
          city: [],
          district: []
        },
        address: {
          currentProvince: '',
          currentCity: '',
          currentDistrict: '',
          detail: ''
        }
//        tempProfession: {},
//        professionData: {
//          profession: [],
//          detail: [],
//          thirdDetail: []
//        },
//        currentProfession: {
//          profession: '',
//          detail: '',
//          thirdDetail: ''
//        },
//        tag: ''
      }
    },
    props: ['loginData', 'enterpriseData', 'businessImgUrl'],
    watch: {
      enterpriseData: function (val, oldVal) {
        if (val.name) {  // 个人
          this.initData(val)
          this.nameCheck(3)
          this.nameTypeCheck()
          this.licenceCheck(3)
          this.addressCheck()
//            this.imgUrlCheck()
//            this.lawPersonCheck()
//            this.phoneCheck()
//            this.emailCheck()
//            this.faxCheck()
          this.checkFullData()
          this.submitRegisterData()
        }
        if (val.uu) {  // 企业
          this.initData(val)
//          this.nameCheck(3)
//          this.nameTypeCheck()
//          this.licenceCheck(3)
          this.enAddressCheck()
//            this.imgUrlCheck()
//            this.lawPersonCheck()
//            this.phoneCheck()
//            this.emailCheck()
//            this.faxCheck()
//          this.checkFullData()
          this.submitRegisterData()
        }
      }
//      businessImgUrl: function (val, oldVal) {
//        this.data.url = val
//        this.checkFullData()
//        this.submitRegisterData()
//      }
    },
    mounted () {
      this.$http.get('/data/city.json').then(response => {
        this.temCityData = response.data
        for (let province in response.data) {
          this.cityData.province.push(province)
        }
      })
//      this.$http.get('/data/profession.json').then(response => {
//        this.tempProfession = response.data
//        for (let profession in response.data) {
//          this.professionData.profession.push(profession)
//        }
//      })
    },
    methods: {
      initData: function (val) {
        this.data.name = val.spaceName || val.enName || val.name || ''
        this.data.licenceId = val.businessCode || val.licenceId || val.enBussinessCode || ''
        this.data.address = val.address || val.enAddress || ''
      },
      sectionChange: function (type) {
        if (!this.isValid) {
          this.$message.error('请填写正确的注册信息')
        } else {
          if (this.enterpriseData.uu) {
            this.enCheckFullData()
          } else {
            this.checkFullData()
          }
          let enterprise = this.data
//          enterprise.tagsData = enterprise.tagsData.toString()
//          if (typeof this.data.tagsData === 'string') {
//            this.data.tagsData = this.data.tagsData.split(',')
//          }
          let data = {}
          data.enterprise = enterprise
          data.isValidRegister = this.isValid
//          data.url = this.data.url
          enterprise.enIsRead = false
//          enterprise.enBussinessCodeImage = this.data.url
          // 个人用户，提交保存缓存企业信息
          if (this.loginData.isSelf) {
            this.$http.post('/basic/user/userCacheEnterprise', enterprise)
            this.$emit('isSelfCacheDataAction', enterprise)
          } else { // 企业用户，更新当前企业信息，主要是更新企业地址
            this.enterpriseData.enAddress = this.data.address
            this.$http.post('/basic/enterprise/' + this.enterpriseData.uu + '/updateInfo', this.enterpriseData)
          }
          this.$emit('registerAction', data)
          this.$emit('sectionEvent', type)
//          this.$emit('businessImgUrlAction', this.data.url)
        }
      },
//      upload: function (e) {
//        let file = e.target.files[0]
//        this.validUpload.init = false
//        if (file.size > 5 * 1024 * 1024) {
//          this.validUpload.isValidUpload = false
//        } else {
//          this.validUpload.isValidUpload = true
//          if (file.type !== 'application/pdf') {
//            this.isPdf = false
//            let param = new FormData()
//            param.append('file', file, file.name)
//            param.append('chunk', '0')
//            let config = {
//              headers: {'Content-Type': 'multipart/form-data'}
//            }
//            this.$http.post('/api/images', param, config)
//              .then(response => {
//                this.data.url = response.data[0].path
//                this.$emit('businessImgUrlAction', this.data.url)
//              }, err => {
//                console.log(err)
//                this.validUpload.isValidUpload = false
//              })
//          } else {
//            let param = new FormData()
//            param.append('file', file, file.name)
//            let config = {
//              headers: {'Content-Type': file.type}
//            }
//            this.$http.post('/file', param, config)
//              .then(response => {
//                this.isPdf = true
//                this.data.url = response.data[0].path
//                this.$emit('businessImgUrlAction', this.data.url)
//              }, err => {
//                console.log(err)
//                this.validUpload.isValidUpload = false
//              })
//          }
//        }
//        this.validCheck()
//      },
//      uploadLogo: function (e) {
//        this.validLogo.init = false
//        let file = e.target.files[0]
//        if (file.size > 100 * 1024) {
//          this.validLogo.isValidLogo = false
// //          this.$message.error('图片请勿超过100Kb')
//        } else {
//          let param = new FormData()
//          param.append('file', file, file.name)
//          let config = {
//            headers: {'Content-Type': file.type}
//          }
//          this.$http.post('/api/images', param, config)
//            .then(response => {
//              this.validLogo.isValidLogo = true
//              this.data.logoUrl = response.data[0].path
//            }, err => {
//              console.log(err)
//              this.$message.error('图片上传失败')
//            })
//        }
//      },
      validCheck: function () {
        this.isValid =
//          this.validUpload.isValidUpload && !this.validUpload.init &&
          this.validName.isValidTypeName && !this.validName.init && this.validName.isValidName &&
          this.validLicence.isValidLicence && !this.validLicence.init &&
          this.validAddress.isValidAddress && !this.validAddress.init
//          this.validLawPerson.isValidLawPerson && !this.validLawPerson.init &&
//          (this.validPhone.init || this.validPhone.isValidPhone) &&
//          (this.validEmail.init || this.validEmail.isValidEmail) &&
//          (this.validFax.init || this.validFax.isValidFax)
      },
      enValidCheck: function () {
        this.isValid = this.validAddress.isValidAddress && !this.validAddress.init
      },
      checkFullData: function () {
        this.isValid =
//          this.validUpload.isValidUpload &&
          this.validName.isValidTypeName && this.validName.isValidName &&
          this.validLicence.isValidLicence &&
          this.validAddress.isValidAddress
//          this.validLawPerson.isValidLawPerson
      },
      enCheckFullData: function () {
        this.isValid = this.validAddress.isValidAddress
      },
      // 企业名称字符验证
      nameTypeCheck: function () {
        this.validName.isValidTypeName = this.data.name !== '' && this.data.name.length >= 2 && this.data.name.length <= 99 && this.commonValid(this.data.name)
        this.validName.init = false
      },
      // 企业名称是否已存在验证
      nameCheck: function (num) {
        if (num > 0) {
          this.$http.post('/basic/enterprise/register/valid/name?name=' + this.data.name)
            .then(response => {
              if (response.data.code !== 12) {
                this.validName.init = false
                this.validName.isValidName = response.data.success
                this.validCheck()
              } else {
                this.nameCheck(num - 1)
              }
            })
        }
      },
//      imgUrlCheck: function () {
//        this.validUpload.init = false
//        this.validUpload.isValidUpload = this.data.url !== ''
//      },
      licenceCheck: function (num) {
        if ((/^[\S-]{1,255}$/).test(this.data.licenceId)) {
          if (num > 0) {
            this.$http.post('/basic/enterprise/register/valid/businessCode?businessCode=' + this.data.licenceId)
              .then(response => {
                if (response.data.code !== 12) {
                  this.validLicence.init = false
                  this.validLicence.isValidLicence = response.data.success && this.data.licenceId
                  this.validCheck()
                } else {
                  //      this.validLicence.init = tmpInit
                  this.licenceCheck(num - 1)
                }
              })
          }
        } else {
          this.validLicence.init = false
          this.validLicence.isValidLicence = false
          this.validCheck()
        }
      },
      // 个人地址校验
      addressCheck: function () {
        this.validAddress.init = false
        this.validAddress.isValidAddress = this.data.address !== ''
        this.validCheck()
      },
      // 企业地址校验
      enAddressCheck: function () {
        this.validAddress.init = false
        this.validAddress.isValidAddress = this.data.address !== ''
        this.enValidCheck()
      },
//      lawPersonCheck: function () {
//        this.validLawPerson.init = false
//        this.validLawPerson.isValidLawPerson = (/^\S{1,255}$/).test(this.data.lawPerson)
//        this.validCheck()
//      },
//      phoneCheck: function () {
//        this.validPhone.init = false
//        this.validPhone.isValidPhone = (/^[\d-]{8,}$/).test(this.data.phone) || this.data.phone === ''
//        this.validCheck()
//      },
//      emailCheck: function () {
//        this.validEmail.init = false
//        this.validEmail.isValidEmail = (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(this.data.email) || this.data.email === ''
//        this.validCheck()
//      },
//      faxCheck: function () {
//        this.validFax.init = false
//        this.validFax.isValidFax = (/^(([\0]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/).test(this.data.fax) || this.data.fax === ''
//        this.validCheck()
//      },
      commonValid: function (str) {
        return str.indexOf(' ') === -1
      },
      submitRegisterData: function () {
        let enterprise = this.data
        let data = {}
        data.enterprise = enterprise
        data.isValidRegister = this.isValid
//        data.url = this.data.url
        this.$emit('registerAction', data)
      },
      onHideBox: function () {
        this.onHideAddress()
//        this.onHideProfession()
      },
      onShowAddress: function () {
        if (this.showAddressBox) {
          this.onHideAddress()
        } else {
          this.showAddressBox = true
          this.isClickInputAddress = true
        }
      },
      onHideAddress: function () {
        if (!this.isInAddressBox && !this.isClickInputAddress) {
          this.showAddressBox = false
        }
        this.isClickInputAddress = false
      },
//      onShowProfession: function () {
//        if (this.showProfessionBox) {
//          this.onHideProfession()
//        } else {
//          this.showProfessionBox = true
//          this.isClickInputProfession = true
//        }
//      },
//      onHideProfession: function () {
//        if (!this.isInProfessionBox && !this.isClickInputProfession) {
//          this.showProfessionBox = false
//        }
//        this.isClickInputProfession = false
//      },
      getCity: function (province) {
        this.cityData.city = []
        this.address.currentCity = ''
        this.cityData.district = []
        this.address.currentDistrict = ''
        this.address.currentProvince = province
        for (let item in this.temCityData[province]) {
          this.cityData.city.push(item)
        }
      },
      getDistrict: function (city) {
        this.address.currentCity = city
        this.address.currentDistrict = ''
        this.cityData.district = this.temCityData[this.address.currentProvince][city]
      },
      chooseDistrict: function (district) {
        this.address.currentDistrict = district
      },
      submitAddress: function () {
        if (this.address.currentDistrict !== '' && this.address.currentCity !== '' && this.address.currentProvince !== '') {
          if (this.address.detail !== '') {
            this.data.address = this.address.currentProvince + this.address.currentCity + this.address.currentDistrict + this.address.detail
            this.showAddressBox = false
            if (this.enterpriseData.uu) {
              this.enAddressCheck()
            } else {
              this.addressCheck()
            }
          } else {
            this.$message.error('请输入详细地址')
          }
        } else {
          this.$message.error('请输入省、市、区')
        }
      },
//      getProfessionDetail: function (profession) {
//        this.currentProfession.profession = profession
//        this.currentProfession.detail = ''
//        this.professionData.detail = []
//        this.currentProfession.thirdDetail = ''
//        this.professionData.thirdDetail = []
//        let _this = this
//        _this.professionData.detail = []
//        for (let item in this.tempProfession[profession]) {
//          if (typeof this.tempProfession[profession][item] !== 'object') {
//            _this.professionData.detail.push(this.tempProfession[profession][item])
//          } else {
//            _this.professionData.detail.push(item)
//          }
//        }
//      },
//      chooseProfessionDetail: function (detail) {
//        this.currentProfession.detail = detail
//        this.currentProfession.thirdDetail = ''
//        this.professionData.thirdDetail = []
//        if (typeof this.tempProfession[this.currentProfession.profession][detail] !== 'object') {
//          this.data.profession = detail
//          this.showProfessionBox = false
//        } else {
//          this.professionData.thirdDetail = this.tempProfession[this.currentProfession.profession][detail]
//        }
//      },
//      chooseProfessionThirdDetail: function (thirdDetail) {
//        this.currentProfession.thirdDetail = thirdDetail
//        this.data.profession = thirdDetail
//        this.showProfessionBox = false
//      },
//      tagCheck: function () {
//        if (this.tag.length > 10) {
//          this.tag = this.tag.substring(0, 10)
//        }
//      },
//      addTags: function () {
//        let flag = true
//        let _this = this
//        if (!this.tag || this.tag === '') {
//          flag = false
//        } else {
//          this.data.tagsData.forEach(function (item) {
//            if (item === _this.tag) {
//              flag = false
//            }
//          })
//        }
//        if (flag) {
//          this.data.tagsData.push(this.tag)
//          this.tag = ''
//        } else {
//          this.tag = ''
//        }
//      },
//      removeTag: function (index) {
//        this.data.tagsData.splice(index, 1)
//      },
      onDetailAddressInput: function () {
        this.address.detail = this.address.detail.trim()
      }
    }
  }
</script>

<style scoped>
  .register{
    height: 700px;
  }
  .register input[type="file"] {
    display: block;
  }
  .previewImg {
    max-height: 200px;
    max-width: 200px;
    margin-top: 5px;
  }
  .x-union-menu {
    width: 600px
  }
  .x-union-header{
    margin-top: -40px;
  }
  .x-union-header>div{
    background: #f5f8fa;
    font-weight: 700;
    border-bottom: 1px solid #e4ecf3;
  }
  .x-union-header>div,.x-union-list>ul {
    float: left;
    width: 121px;
    border-right: 1px solid #e4ecf3;
  }
  .x-union-list>ul {
    height: 200px;
    margin: 0;
    overflow-y: auto;
  }
  .x-union-menu .x-item-ext {
    float: left;
    width: 235px;
  }
  .x-union-list .x-item-ext {
    padding: 10px
  }
  .x-union-header>div:last-child {
    border-right-width: 0
  }
  .x-union-header>div,.x-union-list>ul>li {
    padding: 2px 10px;
    cursor: pointer;
  }
  .x-union-list>ul>li:hover,.x-union-list>ul>li.active {
    background: #fee9c7;
  }
  .x-input {
    border-color: #ccc;
    border-radius: 0;
    box-shadow: none;
  }
  textarea.form-control {
    height: auto;
  }
  .text-right {
    text-align: right;
  }
  .register-btn {
    padding: 5px 10px;
    font-size: 12px;
    line-height: 1.5;
  }
  .btn-submit {
    background: #5078cb;
    color: #fff;
  }
  .btn-console {
    border: 1px solid #ccc;
    background: #fff;
    color: #888;
    margin-left: 5px;
    transition: all .2s ease-in-out;
  }
  .btn-console:hover {
    border: 1px solid #adadad;
    background: #e6e6e6;
    color: #333;
  }
  .x-text-help {
    color: green;
  }
  .register .row .upload-area   {
    width: 130px;
    height: 130px;
    left: 15px;
    padding: 0;
    z-index: 100;
  }
  .error-box-border {
    border-color: #f4645f!important;
  }
  .x-btn-blank:hover, .x-btn-blank[disabled] {
    border: 1px solid #adadad;
    background: #e6e6e6;
    color: #333;
  }
  .register .row .auto-width {
    width: auto!important;
  }
  .select-dot input {
    background: url("../../../static/images/all/dot.png") no-repeat;
    background-position-x: 353px;
    background-position-y: 10px;
  }
  .register .row .logo-text {
    font-size: 12px;
    width: 180px;
    position: relative;
    top: 5px;
    left: 175px;
    text-align: center;
    color: #999;
    line-height: 20px;
  }
  .logo-img-area {
    width: 130px;
    height: 130px;
  }
  .logo-img-area .preview-logo-img {
    max-width: 130px;
    max-height: 130px;
  }
  .no-tags {
    float: left;
    padding: 2px 14px;
    line-height: 20px;
    border: #5078cb 1px solid;
    border-radius: 5px;
    font-size: 12px;
    margin: 0 3px;
    background: #5078cb;
    color: #fff;
    margin-top: 5px;
  }
  .register .row .add-tag-btn {
    position: absolute;
    right: 24px;
    color: #5078cb;
    font-size: 12px;
    cursor: pointer;
  }
  .register .row .tags-box {
    margin-top: 15px;
  }
  .register .row p {
    color: red;
  }
  .register .row .form-control:focus{
    border-color: #5078cb;
    box-shadow: none;
  }
  .x-input:focus, .x-input-blank:focus {
    border-color: #5078cb;
    box-shadow: none;
  }

  .register .row .fa-map-marker{
    position: relative;
    top: -34px;
    left: -5px;

  }

  .register .row .tags-list ul{
    list-style: none;
  }
  .register .row .tags-list ul li {
    display: inline-block;
    padding: 2px 14px;
    line-height: 20px;
    border: #5078cb 1px solid;
    border-radius: 5px;
    font-size: 12px;
    color: #5078cb;
    margin: 0 3px;
  }
  .register .row .tags-list ul li i{
    font-size: 12px;
    color: red;
    position: relative;
    top: -3px;
    right: -12px;
  }
  .register .row .tags-lists {
    margin-top: 10px;
  }
  .register .row .tags-lists em {
    font-style: inherit;
    margin-left: 163px;
    font-size: 12px;
    color: #999;
  }
  .register .row .tags-lists span {
    float: left;
    padding: 2px 14px;
    line-height: 20px;
    border: #5078cb 1px solid;
    border-radius: 5px;
    font-size: 12px;
    color: #5078cb;
    margin: 0 3px;
  }
  .register .row .x-text-tip {
    color: #777;
    margin-top: 15px;
  }
  .register .row .x-text-tip i {
    margin-right: 5px;
  }
</style>
