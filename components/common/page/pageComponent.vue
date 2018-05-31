<template>
  <div class="page-wrap" v-if="total/1.0/pageSize>1">
    <el-pagination
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
      v-if="total/pageSize>=1">
    </el-pagination>
    <ul class="pagination" style="float:right;margin-left:20px;">
      <li>
        <input type="number" class="page-number" @keyup.13="changePage" v-model="nowPage">
      </li>
      <li>
        <a class="page-a" @click="changePage">GO</a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        nowPage: 1,
        currentPage: 1
      }
    },
    watch: {
      current: function () {
        this.nowPage = Number(this.current)
        this.currentPage = this.nowPage
      }
    },
    props: ['current', 'total', 'pageSize'],
    methods: {
      handleCurrentChange: function (changedPage) {
        if (this.nowPage !== this.currentPage) {
          this.$emit('childEvent', changedPage)
        }
      },
      changePage: function () {
        let totalPage = Math.ceil(this.total / this.pageSize)
        if (this.nowPage > totalPage) {
          this.nowPage = totalPage
        } else if (this.nowPage < 1) {
          this.nowPage = 1
        }
        this.$emit('childEvent', this.nowPage)
      }
    }
  }
</script>

<style>
  .page-wrap a {
    color: #2d8cf0;
    background: 0 0;
    text-decoration: none;
    outline: 0;
    cursor: pointer;
    transition: color .2s ease;
  }
  .el-pagination {
    padding: 0;
  }
  .el-pagination .btn-next, .el-pagination .btn-prev {
    color: #337ab7;
    width: 33px;
    height: 30px;
  }
  .el-pagination .btn-next {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .el-pagination .btn-prev {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .el-pager li{
    color: #337ab7;
    text-decoration: none;
    background-color: #fff;
    border: 1px solid #ddd;
    font-size: 10px;
    min-width: 33px;
    height: 30px;
    border-right: none;
  }
  .el-pager li:not(.active):hover, .el-pagination button:hover {
    z-index: 3;
    color: #23527c;
    background-color: #eee;
    border-color: #ddd;
  }
  .el-pager li.active {
    background: #5078cb!important;
  }
  .el-icon-arrow-left:before {
    content: "\f100";
    font-family: FontAwesome;
  }
  .el-icon-arrow-right:before {
    content: "\f101";
    font-family: FontAwesome;
  }
  .el-pagination button.disabled {
    color: #337ab7;
    background-color: #fff;
    cursor: not-allowed;
  }
  .pagination {
    display: inline-block;
    padding-left: 0;
    margin: 20px 0;
    border-radius: 4px;
  }
  .pagination>li {
    display: inline;
  }
  input.page-number {
    vertical-align: inherit;
    display: inline-block;
    width: 40px;
    height: 31px;
    padding: 6px 6px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #9B9792;
    text-align: center;
    background-color: #F6F5F4;
    background-image: none;
    border: 1px solid #ccc;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  }
  .page-a {
    background: #5078cb !important;
    color: #fff !important;
    float: right!important;
  }
  .page-a {
    color: #fff;
    border-color: #4574e8;
    padding: 6px 6px!important;
    font-size: 14px!important;
    border-top-right-radius: 4px!important;
    border-bottom-right-radius: 4px!important;
    text-decoration: none;
    height: 31px;
  }
  .page-wrap{
    float: right;
    margin: 30px 0;
  }
  .page-wrap ul, .page-wrap div {
    display: inline-block;
    margin: 0;
  }
  input.page-number {
    -moz-appearance:textfield;
  }
  input.page-number::-webkit-inner-spin-button,
  input.page-number::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
