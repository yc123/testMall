<template>
  <div class="componentMenu container">
    <div class="menu-com row">
      <div class="menu-title col-md-12">
        <nuxt-link to="/product/kind/home">器件选型</nuxt-link> >
        <span v-for="(item, key) in list">
					<nuxt-link :to="`/product/kind/${item.id}`" :key="key"><span>{{item.nameCn}}</span></nuxt-link>
          <span> > </span>
				  </span>
        <span>器件详情</span>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'ComponentMenu',
    computed: {
      lists () {
        return this.$store.state.componentMenu.menu
      },
      list () {
        return this.lists.data
      }
    }
  }
</script>
<style scoped>
  .componentMenu{
    width: 1190px;
    margin: 0 auto;
  }
  .menu-com{
    margin: 0;
  }
  .menu-title{
    line-height: 40px;
    font-size: 14px;
  }
  .menu-title a{
    color: #5078cb;
    font-size: 14px;
  }
  i{
    margin-right: 5px;
  }
  .menu-title{
    padding-left: 0;
  }
</style>
