<template>
  <ul class="floor-bar list-unstyled" :style="!visible?'opacity: 0;':'opacity: 1;'">
    <li v-for="(floor, index) in floors.data" :key="index" class="floor-bar-item">
      <a @click="jumpFloor(index)"
         :style="{backgroundColor: index==activeFloor?floor.items[1].backGroundColor:'#b7dfff'}">
        <span>F{{ floor.floorNumber }}</span><br/>
        <span class="floor-item-name">{{ floor.name }}</span>
      </a>
    </li>
  </ul>
</template>
<script>
  import { scrollTo } from '~utils/scroll'

  export default {
    name: 'floor-bar',
    props: {
      floors: {
        type: Object
      }
    },
    data () {
      return {
        visible: false,
        activeFloor: 0,
        floor_scrollTop: 777
      }
    },
    methods: {
      _calcaulateHeight() {
        let _heis0 = document.querySelectorAll('header')[0].clientHeight
        let _heis1 = document.querySelectorAll('.header.clearfix')[0].clientHeight
        let _heis2 = document.querySelectorAll('.nav-list')[0].clientHeight
        let _heis3 = document.querySelectorAll('.carousel')[0].clientHeight
        let _heis4 = document.querySelectorAll('.advert-slide')[0].clientHeight
        let _heis5 = document.querySelectorAll('.banner')[0].clientHeight
        let _heis6 = document.querySelectorAll('.floor.price-floor')[0].clientHeight
        let _heis7 = document.querySelectorAll('.floor.price-floor')[1].clientHeight
        this.bannerHeight = _heis0 + _heis1 + _heis2 + _heis3 + _heis4 + _heis5 + _heis6 + _heis7
        this.listHeight = []
        this.list = document.querySelectorAll('.normal-floor')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < this.list.length; i++) {
          const item = this.list[i]
          if (i === 0) {
            height += this.bannerHeight + item.clientHeight / 2
          } else {
            height += item.clientHeight
          }
          this.listHeight.push(height)
        }
      },
      onScroll () {
        if (window.location.pathname === '/') {
          let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
          // console.log(this.bannerHeight)
          this.visible = scrolled >= this.bannerHeight - window.innerHeight / 2 + 200
          // console.log(this.bannerHeight, window.innerHeight)
          let _scrollHeight = scrolled
          const listHeight = this.listHeight
          for (let i = 0; i < listHeight.length; i++) {
            let height1 = listHeight[i]
            let height2 = listHeight[i + 1]
            // console.log(height1, _scrollHeight)
            // if (_scrollHeight >= height1) this.activeFloor = i
            if (_scrollHeight >= height1 && _scrollHeight < height2) {
              this.activeFloor = i
            }
          }
          if (_scrollHeight > listHeight[listHeight.length - 1]) {
            this.visible = false
          }
          // let floors = document.querySelectorAll('.normal-floor')
          // let barOffset = document.querySelector('.floor-bar').offsetTop
          // if (floors[0].offsetTop === 0) {
          // this.visible = scrolled >= floors[0].offsetTop + this.floor_scrollTop - barOffset && scrolled <= floors[floors.length - 1].offsetTop + floors[floors.length - 1].offsetHeight - barOffset - document.querySelector('.floor-bar').offsetHeight + this.floor_scrollTop
          // if (this.visible) {
          //   for (let i = 0; i < floors.length; i++) {
          //     if (barOffset >= floors[i].offsetTop + this.floor_scrollTop - scrolled + 20) {
          //       this.activeFloor = i
          //     }
          //   }
          // }
          // } else {
          //   this.visible = scrolled >= floors[0].offsetTop - barOffset + 40 && scrolled <= floors[floors.length - 1].offsetTop + floors[floors.length - 1].offsetHeight - barOffset - document.querySelector('.floor-bar').offsetHeight
          //   if (this.visible) {
          //     for (let i = 0; i < floors.length; i++) {
          //       if (barOffset >= floors[i].offsetTop - scrolled + 20) {
          //         this.activeFloor = i
          //       }
          //     }
          //   }
          // }
        }
      },
      jumpFloor (index) {
        if (this.visible) {
          scrollTo(document.querySelectorAll('.normal-floor').item(index), 300, { offset: -60 })
        }
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this._calcaulateHeight()
        window.addEventListener('scroll', this.onScroll)
      })
    }
  }
</script>
<style lang="scss" scoped>
  .floor-bar {
    position: fixed;
    margin-left: -70px;
    width: 60px;
    bottom: 20%;

    .floor-bar-item {
      margin-bottom: 1px;
      text-align: center;

      a {
        display: block;
        width: 60px;
        height: 45px;
        padding-top: 5px;
        background-color: #b7dfff;
        color: #fff;
        overflow: hidden;

        .floor-item-name {
          font-size: 12px;
          display: inline-block;
        }
      }
    }
  }
</style>
