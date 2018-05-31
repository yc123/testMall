<template>
  <div class="count-item">
    <span class="title">{{ title }}</span>
    <div class="count-content">
      <span>{{ nums }}</span>
      <span v-text="isMore?'万':'个'" v-if="!isShow"></span>
      <span v-if="isShow">亿</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'count-item',
    props: {
      value: {
        default: 0,
        type: Number
      },
      title: {
        type: String
      }
    },
    data () {
      return {
        isMore: false,
        isShow: false,
        len: 0
      }
    },
    methods: {
      formatNumber (num) {
//        let re = /(\d+)(\d{3})/
        if (num > 99999999) {
          this.isShow = true
          let str2 = num.toString()
          num = Math.floor(num / 100000000)
          if (parseInt(str2.charAt(str2.length - 8)) > 8) {
            num = num + 1
          }
        }
        if (num > 9999) {
          this.isMore = true
          let str = num.toString()
          num = Math.floor(num / 10000)
          if (parseInt(str.charAt(str.length - 4)) > 4) {
            num = num + 1
          }
        }
        let length = String(num).length
        this.len = length > 3 ? length + 1 : length
        num = (Array(7 - length).join(0) + num)
//        while (re.test(num)) {
//          num = num.replace(re, '$1，$2')
//        }
//        num = num.split('')
//        console.log(num)
        return num
      }
    },
    computed: {
      nums () {
        return this.formatNumber(this.value)
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import '~assets/scss/variables';

  .count-item {
    width: 100%;
    height: auto;
    .title {
      display: inline-block;
      width: 100%;
      text-align: center;
      line-height: 40px;
      color: #fff000;
      font-size: 21px;
      font-family: MicrosoftYaHei-Bold;
    }
    .count-content{
      width: 100%;
      height: 40px;
      margin-top: -5px;
      background: url('/images/all/count1.png') no-repeat center;
      span:first-child{
        position: relative;
        top: 11px;
        left: 14px;
        display: block;
        text-align: center;
        width: 87px;
        height: 23px;
        line-height: 23px;
        font-family: MicrosoftYaHei-Bold;
        font-size: 21px;
        color: #fff;
        background-color: #376ef3;
        border-radius: 2px;
      }
      span:last-child{
        position: relative;
        top: -17px;
        right: 15px;
        float: right;
        line-height: 30px;
        font-size: 16px;
        color: #376ef3;
        font-family: MicrosoftYaHei-Bold;
      }
    }
  }
</style>

