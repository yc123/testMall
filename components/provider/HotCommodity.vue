<template>
  <div class="container marketing hot-commodity">
    <div class="title">热销器件</div>
    <ul class="list-unstyled list-inline">
      <li class="hot-commodity-box" v-for="(component, index) in hotComponents" :class="{ 'border-right' : index % 5 == 4 }">
        <a :href="'/store/productDetail/' + component.batchCode" target="_blank">
          <img :src="component.img || '/images/store/common/default.png'"/>
          <span>{{component.code}}</span>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>

export default {
  name: 'hot-commodity',
  computed: {
    hotComponents () {
      return this.$store.state.provider.storeCms.hotComponents.data
    }
  }
}
</script>
<style scoped>
  .hot-commodity {
    margin-bottom: 40px;
  }

  .marketing .title {
    font-size: 24px;
    font-family: "Microsoft Yahei", "微软雅黑";
    line-height: 60px;
    height: 60px;
    font-weight: inherit;
  }

  .hot-commodity .hot-commodity-box {
    width: 238px;
    height: 239px;
    border-top: 1px solid #D6D3CE;
    border-left: 1px solid #D6D3CE;
    overflow: hidden;
  }

  .hot-commodity > ul > li {
    /*float: left;*/
  }
  .hot-commodity > ul > li:hover{
    border: #5078cb 1px solid;
  }
  .hot-commodity > ul > li:hover span{
    color: #5078cb;
    font-weight: bold;
  }
  .hot-commodity > ul > li:hover img{
    transform: scale(1.1);
  }
  .hot-commodity ul {
    border-bottom: 1px solid #D6D3CE;
    font-size: 0px;
  }

  .hot-commodity-box img {
    width: 226px;
    height: 180px;
    margin-top: 10px;
  }

  .hot-commodity-box span {
    font-size: 14px;
    color: #333434;
    text-align: center;
    display: inline-block;
    width: 100%;
    height: 30px;
    line-height: 30px;
    margin-top: 12px;
  }

  .hot-commodity .border-right {
    border-right: 1px solid #D6D3CE;
  }
</style>
