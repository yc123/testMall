<template>
  <div class="display-card">
    <span @click="cardClose" v-if="cardShow" class="cardClose"><img src="/images/all/close.png"></span>
     <div class="content" v-if="cardShow">
       <div>
         <count-box></count-box>
       </div>
       <div>
         <p><span>{{all}}家</span></p>
       </div>
       <div>
         <p v-if="payMoney">
           <span>{{payMoney}}</span>
           <span v-text="isMore?'万':'元'" v-if="!isShow"></span>
           <span v-if="isShow">亿</span>
         </p>
         <p v-else><span>0元</span></p>
       </div>
       <div>
         <p v-if="inquirySheet.count">
           <span>{{inquirySheet.count}}条</span>
         </p>
         <p v-else><span>0条</span></p>
       </div>
       <a class="enter" @click="goStoreApply()">
         <img src="/images/all/enter.png">
       </a>
     </div>
  </div>
</template>
<script>
  import CountBox from '../main/count/Box.vue'
  export default {
    name: 'display-card',
    data () {
      return {
        cardShow: true,
        isShow: false,
        isMore: false
      }
    },
    components: {
      CountBox
    },
    methods: {
      cardClose () {
        this.cardShow = false
      },
      formatNumber (num) {
        if (num.toString().indexOf('E') !== -1) {
          let arr = num.toString().split('E')
          num = arr[0] * Math.pow(10, arr[1])
        }
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
        return num
      },
      goStoreApply: function () {
        if (this.user.logged) {
          if (this.enterprise && this.enterprise.isVendor === 313) {
            window.location.href = '/vendor#/index'
          } else {
            this.$router.push('/register-saler')
          }
        } else {
          this.$router.push('/auth/login')
        }
      }
    },
    computed: {
      allCount () {
        return this.$store.state.count.allCount.data
      },
      payMoney () {
        return this.formatNumber(this.allCount[0].count)
      },
      inquirySheet () {
        return this.$store.state.count.inquirySheet.data
      },
      all () {
        let count = this.$store.state.supplier.merchant.merchantAll.data
        let supplierCount = count.content ? count.totalElements + '' : '0'
        return supplierCount
      },
      enterprise () {
        return this.user.data.enterprise
      }
    }
  }
</script>
<style lang="scss" scoped>
  .display-card{
    position: fixed;
    right: 100px;
    top: 115px;
    width: 144px;
    height: 527px;
    z-index: 100;
    .cardClose{
      position: absolute;
      right: 0px;
      top: 0px;
      opacity: 0.8;
    }
    .content{
      margin-top: 10px;
      width: 143px;
      height: 517px;
      background: url('/images/all/displayCard.png') no-repeat;
      div{
        height: 110px;
        padding-top: 55px;
        &:first-child{
          height: 110px;
          padding-top: 1px;
        }
        p{
          width: 100%;
          text-align: center;
          font-size: 26px;
          color: #fff;
        }
      }
      .enter{
        width: 100%;
        display: inline-block;
        position: absolute;
        bottom: 48px;
        left: -4px;
        text-align: center;
      }
    }
  }
</style>
