<template>
  <div class="banner" v-if="isClose">
    <div class="banner-modal">
      <div class="banner-img">
        <img src="/images/zhongqiu/zq1.png" />
        <img src="/images/zhongqiu/zq2.png" />
        <img src="/images/zhongqiu/zq3.png" />
        <img src="/images/zhongqiu/zq4.png" />
        <img src="/images/zhongqiu/zq5.png" />
        <img src="/images/zhongqiu/zq6.png" />
        <img src="/images/zhongqiu/zq7.png" />
        <img src="/images/zhongqiu/zq8.png" />
        <img src="/images/zhongqiu/zq9.png" />
        <img src="/images/zhongqiu/zq10.png" />
        <img src="/images/zhongqiu/zq11.png" />
        <img src="/images/zhongqiu/zq12.png" />
        <img src="/images/zhongqiu/zq13.png" />
        <a @click="isOpendZq" href="javascript:void(0)">×</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'zhongqiu',
    data () {
      return {
        isClose: false
      }
    },
    beforeMount () {
      var self = this
      setTimeout(getTotelNumber, 10000)
      function getTotelNumber () {
        self.isOpendZq()
      }
      getTotelNumber()
    },
    mounted () {
      const endTime = window.localStorage.getItem('endTime')
      const overTime = new Date('2017/10/9 00:00:00').getTime()
      if (overTime - (new Date().getTime()) > 0) {
        if (endTime) {
          if (new Date().getTime() - endTime >= 4 * 3600000) {
            this.isClose = true
            window.localStorage.setItem('endTime', new Date().getTime())
          } else {
            this.isClose = false
          }
        } else {
          this.isClose = true
          window.localStorage.setItem('endTime', new Date().getTime())
        }
      }
    },
    methods: {
      isOpendZq () {
        this.isClose = false
      }
    }
  }
</script>
<style scoped>
  .banner{
    width:100%;
    height:100%;
    top: 0;
    left: 0;
    position:fixed;
    z-index:3000;
  }
  .banner-modal{
    background: rgba(0,0,0,.6);
    width:2000px;
    height:1100px;
  }
  .banner-img{
    position:absolute;
    top:10%;
    left:50%;
    width:900px;
    margin-left:-450px;
  }
  .banner-img img{
    display:block;
    width:900px;
    position:absolute;
    top:0;
    left:0;
  }
  .banner-img a{
    display:block;
    width:30px;
    height:30px;
    line-height:30px;
    font-size:20px;
    background: #ffffff;
    border-radius:50%;
    text-align: center;
    color:#d8d4d4;
    position:absolute;
    top:0;
    right:0;
    z-index:5000;
  }
  .banner-img a:hover{
    cursor:pointer;
  }
  img:nth-child(1){
    z-index:120;
    -webkit-transform-origin: 200px 100px;
    -moz--transform-origin: 200px 100px;
    -ms--transform-origin: 200px 100px;
    -o--transform-origin: 200px 100px;
    transform-origin:130px 150px;
    -webkit-animation: animation1 8s linear;
    -moz-animation: animation1 8s linear;
    -ms-animation: animation1 8s linear;
    -o-animation: animation1 8s linear;
    animation: animation1 8s linear;
  }
  img:nth-child(2){
    z-index:110;
    -webkit-animation: animation2 8s linear;
    -moz-animation: animation2 8s linear;
    -ms-animation: animation2 8s linear;
    -o-animation: animation2 8s linear;
    animation: animation2 8s linear;
  }
  img:nth-child(3){z-index:20;
    -webkit-animation: animation3 8s linear;
    -moz-animation: animation3 8s linear;
    -ms-animation: animation3 8s linear;
    -o-animation: animation3 8s linear;
    animation: animation3 8s linear;
  }
  img:nth-child(4){z-index:30;
    -webkit-animation: animation4 8s linear;
    -moz-animation: animation4 8s linear;
    -ms-animation: animation4 8s linear;
    -o-animation: animation4 8s linear;
    animation: animation4 8s linear;
  }
  img:nth-child(5){
    z-index:100;
    -webkit-animation: animation5 8s linear;
    -moz-animation: animation5 8s linear;
    -ms-animation: animation5 8s linear;
    -o-animation: animation5 8s linear;
    animation: animation5 8s linear;
  }
  img:nth-child(6){z-index:90;
    -webkit-animation: animation6 8s linear;
    -moz-animation: animation6 8s linear;
    -ms-animation: animation6 8s linear;
    -o-animation: animation6 8s linear;
    animation: animation6 8s linear;
  }
  img:nth-child(7){z-index:10;
    -webkit-transform-origin: 270px 450px;
    -moz--transform-origin: 270px 450px;
    -ms--transform-origin: 270px 450px;
    -o--transform-origin: 270px 450px;
    transform-origin:270px 500px;
    -webkit-animation: animation7 8s linear;
    -moz-animation: animation7 8s linear;
    -ms-animation: animation7 8s linear;
    -o-animation: animation7 8s linear;
    animation: animation7 8s linear;
  }
  img:nth-child(8){z-index:130;
    -webkit-animation: animation8 8s linear;
    -moz-animation: animation8 8s linear;
    -ms-animation: animation8 8s linear;
    -o-animation: animation8 8s linear;
    animation: animation8 8s linear;
  }
  img:nth-child(9){z-index:40;
    -webkit-transform-origin: 200px 500px;
    -moz--transform-origin: 200px 500px;
    -ms--transform-origin: 200px 500px;
    -o--transform-origin: 200px 500px;
    transform-origin:200px 500px;
    -webkit-animation: animation9 8s linear;
    -moz-animation: animation9 8s linear;''
  -ms-animation: animation9 8s linear;
    -o-animation: animation9 8s linear;
    animation: animation9 8s linear;
  }
  img:nth-child(10){z-index:50;
    -webkit-transform-origin: 240px 500px;
    -moz--transform-origin: 240px 500px;
    -ms--transform-origin: 240px 500px;
    -o--transform-origin: 240px 500px;
    transform-origin:240px 500px;
    -webkit-animation: animation10 8s linear;
    -moz-animation: animation10 8s linear;
    -ms-animation: animation10 8s linear;
    -o-animation: animation10 8s linear;
    animation: animation10 8s linear;
  }
  img:nth-child(11){z-index:60;
    -webkit-transform-origin: 300px 500px;
    -moz--transform-origin: 300px 500px;
    -ms--transform-origin: 300px 500px;
    -o--transform-origin: 300px 500px;
    transform-origin:300px 500px;
    -webkit-animation: animation11 8s linear;
    -moz-animation: animation11 8s linear;
    -ms-animation: animation11 8s linear;
    -o-animation: animation11 8s linear;
    animation: animation11 8s linear;
  }
  img:nth-child(12){z-index:70;
    -webkit-transform-origin: 650px 500px;
    -moz--transform-origin: 650px 500px;
    -ms--transform-origin: 650px 500px;
    -o--transform-origin: 650px 500px;
    transform-origin:650px 500px;
    -webkit-animation: animation12 8s linear;
    -moz-animation: animation12 8s linear;
    -ms-animation: animation12 8s linear;
    -o-animation: animation12 8s linear;
    animation: animation12 8s linear;
  }
  img:nth-child(13){z-index:80;
    -webkit-transform-origin: 700px 500px;
    -moz--transform-origin: 700px 500px;
    -ms--transform-origin: 700px 500px;
    -o--transform-origin: 700px 500px;
    transform-origin:700px 500px;
    -webkit-animation: animation13 8s linear;
    -moz-animation: animation13 8s linear;
    -ms-animation: animation13 8s linear;
    -o-animation: animation13 8s linear;
    animation: animation13 8s linear;
  }
  @keyframes animation1{
    0%{ opacity:0 ;
      -webkit-transform: rotate(60deg);
      -moz-transform: rotate(60deg);
      -ms-transform: rotate(60deg);
      -o-transform: rotate(60deg);
      transform: rotate(60deg)
    }
    5%{ opacity:1;
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg)
    }
    100%{ opacity:1;  }
  }
  @keyframes animation2{
    0%{ opacity:0 ;
    }
    5%{ opacity:0 ;
    }
    10%{ opacity:1 ;
    }
    100%{ opacity:1;
    }
  }
  @keyframes animation3{
    0%{ opacity:0 ;
    }
    5%{ opacity:0 ;
      -webkit-transform: scale(.5);
      -moz-transform: scale(.5);
      -ms-transform: scale(.5);
      -o-transform: scale(.5);
      transform: scale(.5)
    }
    50%{ opacity:1 ;
      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      -ms-transform: scale(1);
      -o-transform: scale(1);
      transform: scale(1);
      -webkit-transform: rotate(45deg);
      -moz-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      -o-transform: rotate(45deg);
      transform: rotate(45deg)
    }
    100%{ opacity:1;
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg)
    }
  }
  @keyframes animation4{
    0%{ opacity:0 ;
    }
    5%{ opacity:0 ;
      -webkit-transform: scale(.5);
      -moz-transform: scale(.5);
      -ms-transform: scale(.5);
      -o-transform: scale(.5);
      transform: scale(.5)
    }
    50%{ opacity:1 ;
      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      -ms-transform: scale(1);
      -o-transform: scale(1);
      transform: scale(1);
      -webkit-transform: rotate(-60deg);
      -moz-transform: rotate(-60deg);
      -ms-transform: rotate(-60deg);
      -o-transform: rotate(-60deg);
      transform: rotate(-60deg)
    }
    100%{ opacity:1;
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg)
    }
  }
  @keyframes animation5{
    0%{ opacity:0 ;
    }
    7%{ opacity:0 ;
    }
    13%{ opacity:1 ;
    }
    100%{ opacity:1;
    }
  }
  @keyframes animation6{
    0%{ opacity:0 ;
    }
    10%{ opacity:0 ;
      -webkit-transform: scale(.5);
      -moz-transform: scale(.5);
      -ms-transform: scale(.5);
      -o-transform: scale(.5);
      transform: scale(.5)
    }
    40%{ opacity:1 ;
      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      -ms-transform: scale(1);
      -o-transform: scale(1);
      transform: scale(1);
      -webkit-transform: rotate(60deg);
      -moz-transform: rotate(60deg);
      -ms-transform: rotate(60deg);
      -o-transform: rotate(60deg);
      transform: rotate(60deg)
    }
    100%{ opacity:1;
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg)
    }
  }
  @keyframes animation7{
    0%{ opacity:0 ;
    }
    30%{ opacity:0 ;
    }
    45%{ opacity:1 ;
      -webkit-transform: rotate(-20deg);
      -moz-transform: rotate(-20deg);
      -ms-transform: rotate(-20deg);
      -o-transform: rotate(-20deg);
      transform: rotate(-20deg)
    }
    60%{ opacity:1 ;
      -webkit-transform: rotate(20deg);
      -moz-transform: rotate(20deg);
      -ms-transform: rotate(20deg);
      -o-transform: rotate(20deg);
      transform: rotate(20deg)
    }
    70%{ opacity:1 ;
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg)
    }
    100%{ opacity:1;
    }
  }
  @keyframes animation8{
    0%{
      opacity:0;
    }
    13%{ opacity:0 ;
      -webkit-transform:translateY(300px);
      -moz-transform:translateY(300px);
      -ms-transform:translateY(300px);
      -o-transform:translateY(300px);
      transform:translateY(300px);
    }
    35%{ opacity:1 ;
      -webkit-transform:translateY(0px);
      -moz-transform:translateY(0px);
      -ms-transform:translateY(0px);
      -o-transform:translateY(0px);
      transform:translateY(0px);
    }
    100%{ opacity:1;
    }
  }
  @keyframes animation9{
    0%{ opacity:0 ;

    }
    30%{ opacity:0 ;
      -webkit-transform: scale(0);
      -moz-transform: scale(0);
      -ms-transform: scale(0);
      -o-transform: scale(0);
      transform: scale(0);
    }
    55%{ opacity:1 ;
      -webkit-transform: scale(.9);
      -moz-transform: scale(.9);
      -ms-transform: scale(.9);
      -o-transform: scale(.9);
      transform: scale(.9);
    }
    60%{ opacity:1 ;
      -webkit-transform: scale(.7);
      -moz-transform: scale(.7);
      -ms-transform: scale(.7);
      -o-transform: scale(.7);
      transform: scale(.7);
    }
    80%{ opacity:1 ;
      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      -ms-transform: scale(1);
      -o-transform: scale(1);
      transform: scale(1);
    }
    100%{ opacity:1;
    }
  }
  @keyframes animation10{
    0%{ opacity:0 ;

    }
    30%{ opacity:0 ;
      -webkit-transform: scale(0);
      -moz-transform: scale(0);
      -ms-transform: scale(0);
      -o-transform: scale(0);
      transform: scale(0);
    }
    55%{ opacity:1 ;
      -webkit-transform: scale(.9);
      -moz-transform: scale(.9);
      -ms-transform: scale(.9);
      -o-transform: scale(.9);
      transform: scale(.9);
    }
    60%{ opacity:1 ;
      -webkit-transform: scale(.7);
      -moz-transform: scale(.7);
      -ms-transform: scale(.7);
      -o-transform: scale(.7);
      transform: scale(.7);
    }
    80%{ opacity:1 ;
      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      -ms-transform: scale(1);
      -o-transform: scale(1);
      transform: scale(1);
    }
    100%{ opacity:1;
    }
  }
  @keyframes animation11{
    0%{ opacity:0 ;

    }
    30%{ opacity:0 ;
      -webkit-transform: scale(0);
      -moz-transform: scale(0);
      -ms-transform: scale(0);
      -o-transform: scale(0);
      transform: scale(0);
    }
    55%{ opacity:1 ;
      -webkit-transform: scale(.9);
      -moz-transform: scale(.9);
      -ms-transform: scale(.9);
      -o-transform: scale(.9);
      transform: scale(.9);
    }
    60%{ opacity:1 ;
      -webkit-transform: scale(.7);
      -moz-transform: scale(.7);
      -ms-transform: scale(.7);
      -o-transform: scale(.7);
      transform: scale(.7);
    }
    80%{ opacity:1 ;
      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      -ms-transform: scale(1);
      -o-transform: scale(1);
      transform: scale(1);
    }
    100%{ opacity:1;
    }
  }
  @keyframes animation12{
    0%{ opacity:0 ;

    }
    30%{ opacity:0 ;
      -webkit-transform: scale(0);
      -moz-transform: scale(0);
      -ms-transform: scale(0);
      -o-transform: scale(0);
      transform: scale(0);
    }
    55%{ opacity:1 ;
      -webkit-transform: scale(.9);
      -moz-transform: scale(.9);
      -ms-transform: scale(.9);
      -o-transform: scale(.9);
      transform: scale(.9);
    }
    60%{ opacity:1 ;
      -webkit-transform: scale(.7);
      -moz-transform: scale(.7);
      -ms-transform: scale(.7);
      -o-transform: scale(.7);
      transform: scale(.7);
    }
    80%{ opacity:1 ;
      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      -ms-transform: scale(1);
      -o-transform: scale(1);
      transform: scale(1);
    }
    100%{ opacity:1;
    }
  }
  @keyframes animation13{
    0%{ opacity:0 ;

    }
    30%{ opacity:0 ;
      -webkit-transform: scale(0);
      -moz-transform: scale(0);
      -ms-transform: scale(0);
      -o-transform: scale(0);
      transform: scale(0);
    }
    55%{ opacity:1 ;
      -webkit-transform: scale(.9);
      -moz-transform: scale(.9);
      -ms-transform: scale(.9);
      -o-transform: scale(.9);
      transform: scale(.9);
    }
    60%{ opacity:1 ;
      -webkit-transform: scale(.7);
      -moz-transform: scale(.7);
      -ms-transform: scale(.7);
      -o-transform: scale(.7);
      transform: scale(.7);
    }
    80%{ opacity:1 ;
      -webkit-transform: scale(1);
      -moz-transform: scale(1);
      -ms-transform: scale(1);
      -o-transform: scale(1);
      transform: scale(1);
    }
    100%{ opacity:1;
    }
  }
</style>
