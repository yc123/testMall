<template>
  <div class="center-toul">
    <div class="center-toul-title active">买家中心</div>
    <ul>
      <li>购物车<span>(9)</span></li>
      <li>订单中心</li>
      <li>我的求购</li>
      <li>支付中心</li>
      <li>发票管理</li>
      <li>账户管理</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'toul'
}
</script>

<style lang="scss" scoped>
.center-toul {
  width: 146px;
  border: #ddd 1px solid;
  background: #fff;
  border-bottom: none;
  text-align: center;
  float: left;
  .center-toul-title {
    background: #ecf2fd;
    color: #666;
    height: 40px;
    line-height: 40px;
    font-weight: bold;
    &.active {
      background: #5078cb;
      color: #fff
    }
    &:hover {
      background: #67afe4;
      color: #fff;
      cursor: pointer;
    }
  }
  ul
   li {
      line-height: 50px;
      height: 50px;
      color: #333;
      border-bottom: 1px solid #ddd;
      transition: all 0.3s;
      &.active {
        background: #5078cb
      }
      &:hover {
        background: #67afe4;
        color: #fff;
        cursor: pointer;
      }
   }
}
</style>
