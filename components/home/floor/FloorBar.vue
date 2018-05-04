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
        activeFloor: -1,
        floor_scrollTop: 777
      }
    },
    methods: {
      onScroll () {
        if (window.location.pathname === '/') {
          let scrolled = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
          let floors = document.querySelectorAll('.normal-floor')
          let barOffset = document.querySelector('.floor-bar').offsetTop
          if (floors[0].offsetTop === 0) {
            this.visible = scrolled >= floors[0].offsetTop + this.floor_scrollTop - barOffset && scrolled <= floors[floors.length - 1].offsetTop + floors[floors.length - 1].offsetHeight - barOffset - document.querySelector('.floor-bar').offsetHeight + this.floor_scrollTop
            if (this.visible) {
              for (let i = 0; i < floors.length; i++) {
                if (barOffset >= floors[i].offsetTop + this.floor_scrollTop - scrolled + 20) {
                  this.activeFloor = i
                }
              }
            }
          } else {
            this.visible = scrolled >= floors[0].offsetTop - barOffset + 40 && scrolled <= floors[floors.length - 1].offsetTop + floors[floors.length - 1].offsetHeight - barOffset - document.querySelector('.floor-bar').offsetHeight
            if (this.visible) {
              for (let i = 0; i < floors.length; i++) {
                if (barOffset >= floors[i].offsetTop - scrolled + 20) {
                  this.activeFloor = i
                }
              }
            }
          }
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
