<template>
  <div class="user_center">
    <div class="wrap">
      <div class="wid1190">
        <div class="fl">
          <nuxt-link :to="'/'"><img src="/images/help/logo.png"/></nuxt-link>
          <!--<span>我的商城<a ng-href="{{homeUrl}}">返回商城首页</a> </span>-->
        </div>
        <!--<div class="nav">
            <ul>
                <li ng-class="{'active' : active == 'home'}"><a href="#home" class="active">首页</a></li>
                <li ng-class="{'active' : active == 'message'}" ><a href="#message">消息（0）</a></li>
                <li ng-class="{'active' : active == 'browsing-history'}" s><a href="#browsing-history">浏览历史</a></li>
            </ul>
        </div>-->
        <!--<div id="mall-search" class="search-right fr" ng-controller="SearchCtrl">
            <input type="text" ng-model="keyword" ng-change="onChange()" ng-search="search()" ng-focus="onFocus()" ng-blur="onBlur()" ng-keyup="onKeyup()"placeholder="型号/类别/品牌" />
            <a class="seek" ng-click="search()">搜索</a>
            <ul class="association" ng-show="associate || associateEnter" ng-mouseenter="onAssociateEnter()" ng-mouseleave="onAssociateLeave()">
                <li ng-repeat="as in associates" ng-bind="as" ng-class="{'active': $index==selectIndex}"
                    ng-click="onAssociateClick(as)"></li>
            </ul>
        </div>-->
        <nuxt-link to="/help/home" class="help-title">帮助中心</nuxt-link>
      </div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'helpHeader'
  }
</script>
<style scoped>
  .user_center {
    width: 100%;
    margin: 0px auto;
    height: 80px;
    background: #5078cb;
  }
  .wid1190{
    width: 100%;
    display: inline-block;
  }
  .user_center .fl {
    width: 230px;
    position: relative;
  }

  .user_center .fl a img {
    float: left;
    margin-top: 15px;
  }

  .user_center .fl span {
    font-size: 18px;
    color: #fff;
    position: relative;
    top: 15px;
    left: 10px;
  }

  .user_center .fl span a {
    width: 86px;
    height: 20px;
    display: inline-block;
    text-align: center;
    color: #fff;
    font-size: 11px;
    border: #fff 1px solid;
    border-radius: 10px;
    line-height: 20px;
  }

  .user_center .fl span a:hover {
    background: #d2272d;
    color: #fff;
  }

  .user_center .nav {
    background: none;
    width: 500px;
    float: left;
    margin-left: 20px;
    line-height: 80px;
    margin-bottom: 0px;
  }

  .user_center .nav ul {
    width: 100%;
    margin: 0px auto;
  }

  .user_center .nav ul li {
    font-size: 18px;
    width: 120px;
    float: left;
    text-align: center;
    position: relative;
  }

  .user_center .nav ul li a {
    color: #fff;
    height: 30px;
    display: inline-block;
    line-height: 30px;
    font-size: 14px;
    width: 100%;
    display: inline-block;
  }
  .user_center .wrap{
    width: 1190px;
    margin: 0 auto;
  }
  .help-title{
    float: right;
    line-height: 80px;
    font-size: 24px;
    color: #fff;
    margin-right: 20px;
  }
</style>
