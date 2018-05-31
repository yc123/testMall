<template>
  <div>
    <div class="preview">
      <img :src="qualifications.url==''?'/images/all/upload-apply.png': isPdf?'/images/all/timg.png':qualifications.url" class="previewImage"/>
      <input type="file" v-if="!qualifications.url" class="com-input" @change="update" accept="image/jpeg,image/jpg,image/gif,image/bmp,image/png,.pdf" />
    </div>
    <div class="hover-show" v-if="qualifications.url">
      <span class="delete" title="删除" @click="deleteImg(qualifications.url)"><i class="fa fa-trash"></i></span>
      <a @click="showImg(qualifications.url)"><i class="fa fa-search"></i>查看</a>
    </div>
    <div id="image-box" v-if="isShow">
      <div class="x-floating-wrap"></div>
      <div class="x-floating">
        <div id="item-content">
          <div class="x-close-wrap" @click="isShow = false"><a href="javascript:void(0);">&times;</a></div>
          <div class="img"><img :src="qualifications.url"/></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['typeData', 'url'],
    data () {
      return {
        qualifications: {
          url: '',
          type: ''
        },
        isShow: false,
        isPdf: false
      }
    },
    watch: {
      url: function (val, oldVal) {
        if (val && val !== '') {
          this.qualifications.url = val
        }
      }
    },
    methods: {
      update (e) {
        let file = e.target.files[0]
        let param = new FormData()
        param.append('file', file, file.name)
        param.append('chunk', '0')
        if (file.type !== 'application/pdf') {
          let config = {
            headers: {'Content-Type': 'multipart/form-data'}
          }
          this.$http.post('/api/images', param, config)
            .then(response => {
              this.isPdf = false
              this.qualifications.url = response.data[0].path
              this.qualifications.type = typeof this.typeData === 'undefined' ? '' : this.typeData
              this.$emit('uploadAction', this.qualifications)
            })
        } else {
          let config = {
            headers: {'Content-Type': file.type}
          }
          this.$http.post('/file', param, config)
            .then(response => {
              this.isPdf = true
              this.qualifications.url = response.data[0].path
              this.qualifications.type = typeof this.typeData === 'undefined' ? '' : this.typeData
              this.$emit('uploadAction', this.qualifications)
            }, err => {
              console.log(err)
            })
        }
      },
      showImg (imgUrl) {
        if (!this.isPdf) {
          this.qualifications.url = imgUrl
          this.isShow = true
        } else {
          window.open(imgUrl)
        }
      },
      deleteImg () {
        this.qualifications.url = ''
        this.qualifications.type = this.typeData
        this.$emit('uploadAction', this.qualifications)
      }
    }
  }
</script>
