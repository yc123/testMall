<template>
  <div class="floor" :class="!isDefault ? 'normal-floor' : 'price-floor'">
    <h3><span v-if="!isDefault">F{{ floor.floorNumber }}&nbsp;{{ floor.name }}</span></h3>
    <ul class="list-unstyled clearfix" :style="{borderColor: floor.items[1].backGroundColor || '#d8d8d8'}">
      <li v-for="(item, index) in floor.items" :key="index" class="floor-item" :class="item.size + (isDefault ? ' default-floor' : '')"
          :style="{backgroundColor: item.backGroundColor || '#fff', borderColor: item.borderColor || floor.items[1].backGroundColor || '#d8d8d8'}">
        <img v-if="item.size != 'large' && isDefault" src="/images/floor/specificPrice-home.png" alt="">
        <a :href="item.hrefUrl" target="_blank">
          <img :src="item.pictureUrl" class="floor-item-img"/>
          <div class="floor-content">
            <p v-if="item.name" class="floor-item-name" :title="item.name">{{ item.name }}</p>
            <p v-if="item.body" v-html="item.body" class="floor-item-body"></p>
            <p class="floor-item-price" v-if="item.size != 'large' && isDefault">{{item.currency == 'RMB' ? '¥' : '$'}}&nbsp;{{item.price}}</p>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'floor',
    props: ['floor', 'isDefault']
  }
</script>
<style lang="scss" scoped>
  .floor h3 {
    width: 100%;
    height: 70px;
    font-size: 24px;
    padding-top: 0;
    margin: 0;
    line-height: 100px;
    color: #333;
  }
  .floor {

    &.price-floor {
      margin-top: -35px;
    }

    ul {
      border-bottom: 1px solid #d8d8d8;
    }

    .floor-item {
      float: left;
      position: relative;
      overflow: hidden;

      a {
        display: block;
        text-align: center;
      }

      .floor-item-img:hover {
        transform: scale(1.1);
      }

      .floor-content {
        position: absolute;
        text-align: center;

        .floor-item-price {
          color: #ff4040;
          font-size: 16px;
          font-weight: bold;
        }

      }

      &.medium,&.small {
        border-top: 1px solid #d8d8d8;
        border-right: 1px solid #d8d8d8;
      }

      &.large {
        width: 360px;
        height: 400px;

        a {
          img {
            width: 226px;
            height: 226px;
            margin-top: 40px;
          }
        }

        &.default-floor {
          a {
            img {
              width: 360px;
              height: 400px;
              margin-top: 0;
              &:hover {
                transform: none;
              }
            }
          }
        }
      }
      &.medium {
        width: 390px;
        height: 200px;

        a {
          img {
            position: absolute;
            bottom: 50px;
            right: 52px;
            width: 100px;
            height: 90px;
          }
        }

        .floor-content {
          top: 0;
          left: 0;
          right: 0;
          padding: 30px;
        }

        .floor-item-name {
          color: #575757;
          font-size: 20px;
          margin-bottom: 30px;
          text-align: left;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          /*display: -webkit-box;*/
          /*-webkit-box-orient: vertical;*/
          /*-webkit-line-clamp: 2;*/
          width: 300px;
          word-wrap: break-word;
          white-space: nowrap;
        }

        .floor-item-body {
          margin-right: 150px;
          color: #575757;
          font-size: 14px;
          line-height: 20px;
          text-align: left;
        }

        &.default-floor {
          .floor-content {
            .floor-item-body {
              color: #666;
            }
            .floor-item-price {
              text-align: left;
            }
          }
          > img {
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      }
      &.small {
        width: 220px;
        height: 200px;

        a {
          img {
            margin-top: 15px;
            width: 70px;
            height: 70px;
          }
        }

        .floor-content {
          top: 100px;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 15px;
        }

        .floor-item-name {
          color: #575757;
          font-size: 16px;
          font-weight: 600;
          text-overflow: ellipsis;
          overflow: hidden;
         /* display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;*/
          word-break: break-all;
          display: inherit;
          white-space: nowrap;
        }

        .floor-item-body {
          color: #575757;
          font-size: 14px;
          line-height: 18px;
        }

        &.default-floor {
          > img {
            position: absolute;
            top: 0;
            left: 0;
          }
          .floor-content {
            top: 85px;
            .floor-item-body {
              color: #666;
            }
          }
        }

      }
      &.tiny {
        display: none;
      }
    }
  }
</style>
