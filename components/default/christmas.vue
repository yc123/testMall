<template>
  <div class="christmas" v-if="hasOpen">
    <div class="christmas-modal">
      <div class="christmas-info" v-if="!hasNewYear">
        <a href="/activity/business" target="_blank"></a>
        <a href="javascript:void(0)" @click="close"></a>
        <div class="christmas-img">
          <img src="/images/christmas/christmas1.png">
          <img src="/images/christmas/christmas2.png">
          <img src="/images/christmas/christmas4.png">
        </div>
      </div>
      <div class="festival-info" v-if="hasNewYear">
        <div class="festival-img">
          <img src="/images/christmas/festival_bg.png">
          <img src="/images/christmas/festival_deng1.png">
          <img src="/images/christmas/festival_deng2.png">
          <img src="/images/christmas/festival_deng1.png">
          <img src="/images/christmas/festival_deng2.png">
          <img src="/images/christmas/festival_yanhuaright.gif">
          <img src="/images/christmas/festival_yanhualeft.gif">
        </div>
        <a href="/activity/business" target="_blank">马上开店</a>
        <a href="https://account.ubtob.com/sso/login?returnURL=https%253A%252F%252Fwww.usoftmall.com%252F&appId=mall&baseUrl=https%3A%2F%2Fwww.usoftmall.com%2Flogin%2Fother" target="_blank">立刻购买</a>
        <a href="javascript:void(0)" @click="close"></a>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: 'christmas',
      props: ['hasNewYear'],
      data () {
        return {
          hasOpen: true
        }
      },
      methods: {
        close () {
          this.hasOpen = false
          this.$emit('listenopen')
        }
      }
    }
</script>

<style scoped>
  .christmas{
    position:fixed;
    top:0;
    left:0;
    z-index:10000;
    width:100%;
    height:100%;
  }
  .christmas-modal{
    background:rgba(0,0,0,.6);
    width:100%;
    height:100%;
  }
  .christmas-info{
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    width:985px;
    height:740px;
  }
  .festival-info{
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
    width:683px;
    height:613px;
  }
  .christmas-info a, .festival-info a{
    position:relative;
    z-index:100000;
    display:block;
    width:190px;
    height:52px;
    line-height: 52px;
    text-align: center;
  }
  .festival-info a:nth-child(2){
    top:566px;
    left:123px;
    font-size: 28px;
    font-weight: bold;
    animation: newYearBtn .2s infinite;
    -moz-animation: newYearBtn .2s infinite;
    -o-animation: newYearBtn .2s infinite;
    -webkit-animation: newYearBtn .2s infinite;
  }
  .festival-info a:nth-child(3){
    top:514px;
    left:369px;
    font-size: 28px;
    font-weight: bold;
    animation: newYearBtn .2s .1s infinite;
    -moz-animation: newYearBtn .2s .1s infinite;
    -o-animation: newYearBtn .2s .1s infinite;
    -webkit-animation: newYearBtn .2s .1s infinite;
  }
  .festival-info a:nth-child(4){
    top:447px;
    left:630px;
    width: 45px;
    height: 45px;
    background: url('/images/christmas/close.png')no-repeat center center;
  }
  .christmas-info a:first-child{
    top:72%;
    left:39%;
    width:200px;
    height:50px;
    background: url('/images/christmas/btn.png')no-repeat center center;
    animation: christmas1 1s linear infinite;
    -o-animation: christmas1 1s linear infinite;
    -webkit-animation: christmas1 1s linear infinite;
    -moz-animation: christmas1 1s linear infinite;
  }
  .christmas-info a:first-child:hover{
    animation: none;
    cursor:pointer;
   }
  .christmas-info a:nth-child(2){
    top:8%;
    left:85%;
    width: 45px;
    height: 45px;
    background: url('/images/christmas/close.png')no-repeat center center;
  }
  .christmas-info .christmas-img img{
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
  }
  .festival-info .festival-img{
    position:relative;
  }
  .festival-info .festival-img img{
    position:absolute;
  }
  .festival-info .festival-img img:nth-child(2){
    top:219px;
    left:-35px;
    -webkit-transform-origin: top center;
    -moz-transform-origin: top center;
    -ms-transform-origin: top center;
    -o-transform-origin: top center;
    transform-origin: top center;
    animation:newYearImg 7s linear 3.5s infinite;
    -o-animation:newYearImg 7s linear 3.5s infinite;
    -webkit-animation:newYearImg 7s linear 3.5s infinite;
    -moz-animation:newYearImg 7s linear 3.5s infinite;
  }
  .festival-info .festival-img img:nth-child(3){
    top:80px;
    left:17px;
    -webkit-transform-origin: top center;
    -moz-transform-origin: top center;
    -ms-transform-origin: top center;
    -o-transform-origin: top center;
    transform-origin: top center;
    animation:newYearImg 5s linear 2.5s infinite;
    -o-animation:newYearImg 5s linear 2.5s infinite;
    -webkit-animation:newYearImg 5s linear 2.5s infinite;
    -moz-animation:newYearImg 5s linear 2.5s infinite;
  }
  .festival-info .festival-img img:nth-child(4){
    top:219px;
    left:641px;
    -webkit-transform-origin: top center;
    -moz-transform-origin: top center;
    -ms-transform-origin: top center;
    -o-transform-origin: top center;
    transform-origin: top center;
    animation:newYearImg 7s linear infinite;
    -o-animation:newYearImg 7s linear infinite;
    -moz-animation:newYearImg 7s linear infinite;
    -webkit-animation:newYearImg 7s linear infinite;
  }
  .festival-info .festival-img img:nth-child(5){
    top:80px;
    left:613px;
    -webkit-transform-origin: top center;
    -moz-transform-origin: top center;
    -ms-transform-origin: top center;
    -o-transform-origin: top center;
    transform-origin: top center;
    animation:newYearImg 5s linear infinite;
    -o-animation:newYearImg 5s linear infinite;
    -moz-animation:newYearImg 5s linear infinite;
    -webkit-animation:newYearImg 5s linear infinite;
  }
  .festival-info .festival-img img:nth-child(6){
    top:-165px;
    left:615px;
    opacity:.75;
    /*animation: newYearYanHua 5s infinite;*/
  }
  .festival-info .festival-img img:nth-child(7){
    top:420px;
    left:-105px;
    opacity:.75;
    /*animation: newYearYanHua 5s 1s infinite;*/
  }
  .christmas-info .christmas-img img:nth-child(2){
    animation: christmas2 25s infinite;
    -moz-animation: christmas2 25s infinite;
    -o-animation: christmas2 25s infinite;
    -webkit-animation: christmas2 25s infinite;
  }
  .christmas-info .christmas-img img:nth-child(3){
    animation: christmas3 30s infinite;
    -o-animation: christmas3 30s infinite;
    -webkit-animation: christmas3 30s infinite;
    -moz-animation: christmas3 30s infinite;
  }
  @keyframes christmas1 {
    0%{top:72%}
    25%{top:71.9%}
    50%{top:72.9%}
    75%{top:71.9%}
    100%{top:72%}
  }
  @keyframes christmas2 {
    0%{top:40%;left:50%;opacity: 0}
    25%{left:48%;opacity: 1}
    50%{left:53%}
    75%{left:48%; opacity: 1}
    100%{top:45%;left:50%;opacity: 0}
  }
  @keyframes christmas3 {
    0%{top:20%;left:50%;opacity: 0}
    25%{left:48%;opacity: 1}
    50%{left:53%}
    75%{left:48%; opacity: 1}
    100%{top:30%;left:50%;opacity: 0}
  }
  @-moz-keyframes christmas1 {
    0%{top:72%}
    25%{top:71.9%}
    50%{top:72.9%}
    75%{top:71.9%}
    100%{top:72%}
  }
  @-moz-keyframes christmas2 {
    0%{top:40%;left:50%;opacity: 0}
    25%{left:48%;opacity: 1}
    50%{left:53%}
    75%{left:48%; opacity: 1}
    100%{top:45%;left:50%;opacity: 0}
  }
  @-moz-keyframes christmas3 {
    0%{top:20%;left:50%;opacity: 0}
    25%{left:48%;opacity: 1}
    50%{left:53%}
    75%{left:48%; opacity: 1}
    100%{top:30%;left:50%;opacity: 0}
  }
  @-webkit-keyframes christmas1 {
    0%{top:72%}
    25%{top:71.9%}
    50%{top:72.9%}
    75%{top:71.9%}
    100%{top:72%}
  }
  @-webkit-keyframes christmas2 {
    0%{top:40%;left:50%;opacity: 0}
    25%{left:48%;opacity: 1}
    50%{left:53%}
    75%{left:48%; opacity: 1}
    100%{top:45%;left:50%;opacity: 0}
  }
  @-webkit-keyframes christmas3 {
    0%{top:20%;left:50%;opacity: 0}
    25%{left:48%;opacity: 1}
    50%{left:53%}
    75%{left:48%; opacity: 1}
    100%{top:30%;left:50%;opacity: 0}
  }
  @-o-keyframes christmas1 {
    0%{top:72%}
    25%{top:71.9%}
    50%{top:72.9%}
    75%{top:71.9%}
    100%{top:72%}
  }
  @-o-keyframes christmas2 {
    0%{top:40%;left:50%;opacity: 0}
    25%{left:48%;opacity: 1}
    50%{left:53%}
    75%{left:48%; opacity: 1}
    100%{top:45%;left:50%;opacity: 0}
  }
  @-o-keyframes christmas3 {
    0%{top:20%;left:50%;opacity: 0}
    25%{left:48%;opacity: 1}
    50%{left:53%}
    75%{left:48%; opacity: 1}
    100%{top:30%;left:50%;opacity: 0}
  }
  @keyframes newYearBtn {
    0%{color:#000}
    50%{color:#fe0000;}
    100%{color:#000}
  }
  @-o-keyframes newYearBtn {
    0%{color:#000}
    50%{color:#fe0000;}
    100%{color:#000}
  }
  @-moz-keyframes newYearBtn {
    0%{color:#000}
    50%{color:#fe0000;}
    100%{color:#000}
  }
  @-webkit-keyframes newYearBtn {
    0%{color:#000;}
    50%{color:#fe0000;}
    100%{color:#000;}
  }
  @keyframes newYearImg {
    0%{transform: rotate(0deg);}
    25%{transform: rotate(-15deg);}
    50%{transform: rotate(0deg);}
    75%{transform: rotate(15deg);}
    100%{transform: rotate(0deg);}
  }
  @-o-keyframes newYearImg {
    0%{transform: rotate(0deg);}
    25%{transform: rotate(-15deg);}
    50%{transform: rotate(0deg);}
    75%{transform: rotate(15deg);}
    100%{transform: rotate(0deg);}
  }
  @-webkit-keyframes newYearImg {
    0%{transform: rotate(0deg);}
    25%{transform: rotate(-15deg);}
    50%{transform: rotate(0deg);}
    75%{transform: rotate(15deg);}
    100%{transform: rotate(0deg);}
  }
  @-moz-keyframes newYearImg {
    0%{transform: rotate(0deg);}
    25%{transform: rotate(-15deg);}
    50%{transform: rotate(0deg);}
    75%{transform: rotate(15deg);}
    100%{transform: rotate(0deg);}
  }
  @keyframes newYearYanHua {
    0%{opacity:1;transform:scale(0);}
    26%{opacity:1;transform:scale(.7);}
    100%{transform:scale(1);opacity:0;}
  }
</style>
