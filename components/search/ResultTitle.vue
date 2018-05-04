<template>
  <div class="result-title text-muted">
    搜索"<span class="text-inverse" >{{keyword}}</span>"<span v-if="status != 1">暂无此型号</span>
    <span v-if="status != 3">，为您找到
    <span class="text-num" v-text="good_list.total"></span> 个<span v-if="status == 2">相关</span>产品</span>：
  </div>
</template>
<script>
  export default{
    props: ['keyword', 'page'],
    data () {
      return {
        status: 1
      }
    },
    computed: {
      good_lists () {
        return this.$store.state.searchData.searchList.lists
      },
      good_list () {
        if (this.page === 1) {
          if (this.good_lists.data.components && this.good_lists.data.components.length > 0) {
            if (this.keyword.toUpperCase() === this.good_lists.data.components[0].code.toUpperCase()) {
              this.status = 1
            } else {
              this.status = 2
            }
          } else {
            this.status = 3
          }
        }
        return this.good_lists.data
      }
    }
  }
</script>
<style scoped>
  #searchResult .result-title {
    margin-top: 5px;
    padding: 10px 5px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
  .text-inverse {
    color: #f40!important;
  }
  .text-num {
    font-style: normal;
    font-family: verdana;
  }
</style>
