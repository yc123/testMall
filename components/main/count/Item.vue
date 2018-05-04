<template>
  <div class="count-item">
    <span class="title">{{ title }}</span>
    <div class="count-content">
      <span v-for="(num, index) in nums" :class="num == '，' ? 'separator' : nums.length - len > index ? 'zero num' : 'num'">{{ num }}</span>
      <!-- <span v-if="nums.length < 7">个</span>
       <span v-if="nums.length > 7">万</span>-->
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
        let re = /(\d+)(\d{3})/
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
        while (re.test(num)) {
          num = num.replace(re, '$1，$2')
        }
        num = num.split('')
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
    text-align: center;
    line-height: 20px;

  .title {
    display: inline-block;
    width: 55px;
    float: left;
    font-weight: bold;
    line-height: 40px;
    color: #fff;
    font-size: 14px;
  }
  .separator, .num {
    display: inline-block;
  }
  .separator {
    font-size: 12px;
    color: #7299E8;
    line-height: 38px !important;
    margin: 0 5px 0 -5px;
    width: 3px;
  }
  .count-content{
    width: 150px;
    /*background: #fff;*/
    float: right;
    height: 30px;
    margin-top: 5px;
    padding-left: 3px;
    margin-right: 5px;
  span{
    float: left;
    line-height: 24px;
    font-weight: bold;
  }
  span.zero{
    color: #9EBCF7;
  }
  span:first-child{
    margin-left: 3px;
  }
  span:last-child{
    line-height: 30px;
    color: #7299E8;
    margin-left: 2px;
  }
  }
  .num {
    background: #7299E8;
    width: 18px;
    height: 24px;
    margin-right: 2px;
    line-height: 24px;
    text-align: center;
    color: $white;
    font-weight: bold;
    border-radius: 2px;
    margin-top: 3px;
  }
  }
</style>
