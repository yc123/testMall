<template>
  <div class="christmas" v-if="isOpen">
    <div class="christmas-modal">
      <div class="newYear-info">
        <a href="javascript:void(0)" @click="isOpen = false"></a>
        <div class="newYear-img">
          <img src="/images/newYear/chinese-knot.png" :class="{'active': timer > 3}">
          <img src="/images/newYear/happy-new-year.png" :class="{'occur': timer > 3}">
          <img src="/images/newYear/snow.png"  :class="{'snow': timer > 8}">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'NewYear',
    data () {
      return {
        isOpen: false,
        timer: 0
      }
    },
    created () {
      setInterval(() => {
        this.timer += 0.5
      }, 500)
    },
    mounted () {
      const endTime = window.localStorage.getItem('newYearEndTime2018')
      const overTime = new Date('2018/02/24 23:59:59').getTime()
      const now = new Date().getTime()
      if (now <= overTime) {
        if (endTime) {
          if (now - endTime >= 1000 * 60 * 60 * 2) {
            this.isOpen = true
            window.localStorage.setItem('newYearEndTime2018', now)
          } else {
            this.isOpen = false
          }
        } else {
          this.isOpen = true
          window.localStorage.setItem('newYearEndTime2018', now)
        }
      } else {
        this.isOpen = false
      }
    }
  }
</script>

<style scoped>
  .christmas{
    position:fixed;
    top:0px;
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
  .newYear-info{
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
  }
  .newYear-info .newYear-img{
    position:relative;
  }
  .newYear-info .newYear-img img{
    position:absolute;
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
  }
  .newYear-info .newYear-img img:nth-child(1){
    animation: newYear1 3s linear;
    -o-animation: newYear1 3s linear;
    -webkit-animation: newYear1 3s linear;
    -moz-animation: newYear1 3s linear;
  }
  /*.newYear-info .newYear-img img.active {
    animation: newYear1-active 3s linear infinite;
    -o-animation: newYear1-active 3s linear infinite;
    -webkit-animation: newYear1-active 3s linear infinite;
    -moz-animation: newYear1-active 3s linear infinite;
  }*/

  .newYear-info .newYear-img img:nth-child(2){
    top: -159px;
    left: 10px;
    animation: newYear2 3s linear;
    -moz-animation: newYear2 3s linear;
    -o-animation: newYear2 3s linear;
    -webkit-animation: newYear2 3s linear;
  }
 /* .newYear-info .newYear-img img.occur{
    top: -224px;
    left: -130px;
    animation: newYear2-occur 3s linear infinite;
    -moz-animation: newYear2-occur 3s linear infinite;
    -o-animation: newYear2-occur 3s linear infinite;
    -webkit-animation: newYear2-occur 3s linear infinite;
  }*/

  .newYear-info .newYear-img img:nth-child(3){
    /*left: -15px;
    top: -5px;*/
   /* height: 700px;*/
    opacity: 0.6;
    animation: newYear3 8s linear;
    -moz-animation: newYear3 8s linear;
    -o-animation: newYear3 8s linear;
    -webkit-animation: newYear3 8s linear;
  }
   .newYear-info .newYear-img img.snow{
    animation: newYear3-snow 8s linear infinite;
    -moz-animation: newYear3-snow 8s linear infinite;
    -o-animation: newYear3-snow 8s linear infinite;
    -webkit-animation: newYear3-snow 8s linear infinite;
  }

  .newYear-info a {
    position:relative;
    z-index:100000;
    display:block;
    top:-200px;
    left:295px;
    width: 45px;
    height: 45px;
    background: url('/images/christmas/close.png')no-repeat center center;
    animation: newYear4 3s linear;
    -moz-animation: newYear4 3s linear;
    -o-animation: newYear4 3s linear;
    -webkit-animation: newYear4 3s linear;
  }

  @keyframes newYear1 {
    0%{top: -317px;left: -295px;transform:scale(0);opacity:0;}
    25%{top: -317px;left: -295px;transform:scale(0.9);}
    75%{top: -317px;left: -295px;transform:scale(0.8);}
    100%{top: -317px;left: -295px;transform:scale( 1);opacity:1;}
  }
  @keyframes newYear1-active {
    /*0%{top: -317px;left: -295px;transform:scale(1);}*/
    0%{top: -317px;left: -295px;transform:scale(0.8);}
    100%{top: -317px;left: -295px;transform:scale(0.9);}
  }
  @-webkit-keyframes newYear1 {
    0%{top: -317px;left: -295px;transform:scale(0);opacity:0;}
    25%{top: -317px;left: -295px;transform:scale(0.9);}
    75%{top: -317px;left: -295px;transform:scale(0.8);}
    100%{top: -317px;left: -295px;transform:scale( 1);opacity:1;}
  }
  @-moz-keyframes newYear1 {
    0%{top: -317px;left: -295px;transform:scale(0);opacity:0;}
    25%{top: -317px;left: -295px;transform:scale(0.9);}
    75%{top: -317px;left: -295px;transform:scale(0.8);}
    100%{top: -317px;left: -295px;transform:scale( 1);opacity:1;}
  }
  @-o-keyframes newYear1 {
    0%{top: -317px;left: -295px;transform:scale(0);opacity:0;}
    25%{top: -317px;left: -295px;transform:scale(0.9);}
    75%{top: -317px;left: -295px;transform:scale(0.8);}
    100%{top: -317px;left: -295px;transform:scale( 1);opacity:1;}
  }

  @keyframes newYear2 {
    /*0%{ opacity:0;}*/
    /*100%{transform:scale( 1);opacity:0.6;}*/
    0%{ opacity: 0 }
    25%{opacity: 0}
    50%{opacity: 0}
    75%{opacity: 0}
    80%{opacity: 0}
    90%{opacity: 0}
    100%{opacity: 1}
  }
  @keyframes newYear2-occur {
    0%{transform:scale(0.8);opacity:0.8;}
    100%{transform:scale( 1);opacity:1;}
  }
  @-webkit-keyframes newYear2 {
    0%{ opacity: 0 }
    25%{opacity: 0}
    50%{opacity: 0}
    75%{opacity: 0}
    80%{opacity: 0}
    90%{opacity: 0}
    100%{opacity: 1}
  }
  @-moz-keyframes newYear2 {
    0%{ opacity: 0 }
    25%{opacity: 0}
    50%{opacity: 0}
    75%{opacity: 0}
    80%{opacity: 0}
    90%{opacity: 0}
    100%{opacity: 1}
  }
  @-o-keyframes newYear2 {
    0%{opacity: 0 }
    25%{opacity: 0}
    50%{opacity: 0}
    75%{opacity: 0}
    80%{opacity: 0}
    90%{opacity: 0}
    100%{opacity: 1}
  }

  @keyframes newYear3 {
    0%{ top: -280px;opacity: 0}
    100%{top: -5px;opacity: 0.6}
  }
  @keyframes newYear3-snow {
    0%{ top: -280px;opacity: 0.6}
    100%{top: -5px;opacity: 0.6}
  }
  @-webkit-keyframes newYear3 {
    0%{ top: -280px;opacity: 0}
    100%{top: -5px;opacity: 0.6}
  }
  @-moz-keyframes newYear3{
    0%{ top: -280px;opacity: 0}
    100%{top: -5px;opacity: 0.6}
  }
  @-o-keyframes newYear3 {
    0%{ top: -280px;opacity: 0}
    100%{top: -5px;opacity: 0.6}
  }

  @keyframes newYear4 {
    0%{ opacity: 0}
    100%{ opacity: 1}
  }
  @-webkit-keyframes newYear4 {
    0%{ opacity: 0}
    100%{ opacity: 1}
  }
  @-moz-keyframes newYear4 {
    0%{ opacity: 0}
    100%{ opacity: 1}
  }
  @-o-keyframes newYear4 {
    0%{ opacity: 0}
    100%{ opacity: 1}
  }
</style>
