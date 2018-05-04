<template>
  <!-- <div class="container" style="height: 300px;line-height: 300px;text-align: center;font-size: 24px;"> -->
    
    <!-- 暂未开放卖家中心SSR版 -->
  <!-- </div> -->
  <div class="container">
    <div class="vendor-index clear">
      <left-toul></left-toul>
      <div class="vendor-content">
        <div class="vendor-topinfo clear">
          <div class="vendor-user">
            <img src="/images/vendor/user_photo.png"/>
          </div>
          <div class="vendor-user-name">杨超|优软测试二123</div>
          <a href="#/accountManager/">账户设置&nbsp;》</a>
        </div>

        <div class="vendor-list-item clear">
          <span>收货信息</span>
          <a href="#"><img src="/images/vendor/edit.png"/></a>
        </div>

        <div class="vendor-list-item clear">
          <span class="nobold">云南省,丽江市,古城区123  123 123333333</span>
        </div>

        <div class="vendor-list-item clear">
          <span>开票信息</span>
          <a href="#"><img src="/images/vendor/edit.png"/></a>
        </div>

        <div class="vendor-list-item clear">
          <span class="nobold">目前暂无发票信息</span>
        </div>


         <div class="vendor_main">
          <ul class="clear">
            <li>
              <img src="/images/vendor/menu01.png"/>
              <p>产品收藏</p>
            </li>

            <li>
              <img src="/images/vendor/menu02.png"/>
              <p>店铺关注</p>
            </li>

            <li>
              <img src="/images/vendor/menu04.png"/>
              <p>优软快讯</p>
            </li>

            <li>
              <img src="/images/vendor/menu05.png"/>
              <p>浏览历史</p>
            </li>
          </ul>
        </div>

        <div class=""></div>
      </div>     
    </div>
  </div>
</template>
<script>
import { toul } from '~components/vendor'

export default {
  layout: 'uservendor',
  middleware: 'authenticated',
  components: {
    leftToul: toul
  }
}
</script>

<style lang="scss" scoped>
.clear {
  &::after {
    content: ' ';
    clear: both;
    display: block;
    visibility: hidden;
  }
}
.vendor-index {
  margin-top: 16px;
  .vendor-content {
    margin-left: 18px;
    float: left;
    width: 734px; 
    .vendor-topinfo {
      background: #ecf2fd;
      padding: 14px;
      border: 1px solid #ddd;
      .vendor-user {
        float: left;
      }
      .vendor-user-name {
        color: #323232;
        font-size: 14px;
        float: left;
        margin-left: 24px;
        margin-top: 8px;
      }
      a {
        float: right;
        color: #666;
        margin-top: 20px;
        &:hover {
          color: #5078cb;
        }
      }
    }
    .vendor-list-item {
      padding: 15px;
      background: #fff;
      border: 1px solid #ddd;
      border-bottom: 1px dashed #ddd;
      border-top: 0px;
      span {
        font-weight: bold;
        color: #323232;
        float: left;
        &.nobold {
          font-weight: 500;
        }
      }
      a {
        float: right;
      }
      &:nth-child(3) {
        border-bottom: 1px solid #ddd;
      }
    }
    .vendor_main {
      background: #fff;
      padding: 10px;
      margin-top: 12px;
      li {
        width: 25%;
        float: left;
        text-align: center;
        p {
          margin-top: 10px;
          // &:hover {
          //   color: 
          // }
        }
      }
    }
  }
}
</style>
