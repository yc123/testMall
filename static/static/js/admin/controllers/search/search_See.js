define(['app/app'], function (app) {
    'use strict';
    app.register.controller('SearchSeeBrandCtrl', ['$scope', '$http', '$rootScope', 'ngTableParams', 'SessionService', 'BaseService', function($scope, $http, $rootScope, ngTableParams, SessionService, BaseService) {
        $scope.searchType = 'original';// 搜索类型
        $scope.searchType = {
            original: false,
            inaction: false,
            proffing: false,
            brand: false,
            isCmp: function() {
                var me = this;
                return me.original || me.inaction || me.proffing;
            }
        };
        if(SessionService.get('brand')) {
            $scope.searchType.brand = true;
        }

        var componentSearchType = SessionService.get('component');
        if(componentSearchType) {
            $scope.searchType = angular.fromJson(componentSearchType);
            $scope.searchType.isCmp = function() {
                var me = this;
                return me.original || me.inaction || me.proffing;
            }
        }

        // 点击搜索库存、样品、呆滞
        $scope.cmpTypeClick = function() {
            if($scope.searchType.isCmp()) {
                $scope.searchType.brand = false;
            }
        };

        // 点击搜索品牌
        $scope.brandTypeClick = function() {
            if($scope.searchType.brand) {
                $scope.searchType.original = false;
                $scope.searchType.inaction = false;
                $scope.searchType.proffing = false;
            }
        };

        // 选搜索类型
        $scope.setSearchType = function(t) {
            $scope.searchType = t;
        };

        // 搜索
        $scope.search = function() {
            if($scope.keyword) {
                if($scope.searchType.brand) {
                    SessionService.set('brand', true);
                    SessionService.unset('component');
                    window.location.href = 'search?w=' + encodeURI(encodeURIComponent($scope.keyword)) + '&type=brand';
                }else if($scope.searchType.isCmp()){
                    SessionService.set('component', angular.toJson($scope.searchType));
                    SessionService.unset('brand');
                    window.location.href = 'search?w=' + encodeURI(encodeURIComponent($scope.keyword)) + '&type=component';
                }else {
                    SessionService.unset('component');
                    SessionService.unset('brand');
                    var timestart = (new Date()).valueOf();
                    $http({
                        method:'GET',
                        url:'api/product/component/search/compGoods',
                        params:{
                            'keyword' : $scope.keyword
                     }}).then(function (data) {
                        $scope.result = data.data;
                        $scope.searchtime = (new Date()).valueOf() - timestart;
                        console.log(data);
                    },function (error) {
                    });

                    $http({
                        method:'GET',
                        url:'search/componentGoods/collect',
                        params:{
                            'keyword' : $scope.keyword,
                            'collectList' : 'goods_kind',
                            'paramJSON':{}
                        }}).then(function (data) {
                        $scope.kindtime = (new Date()).valueOf() - timestart;
                        console.log(data);
                    },function (error) {
                    });

                    $http({
                        method:'GET',
                        url:'search/componentGoods/collect',
                        params:{
                            'keyword' : $scope.keyword,
                            'collectList' : 'goods_brand',
                            'paramJSON':{}
                        }}).then(function (data) {
                        $scope.brandtime = (new Date()).valueOf() - timestart;
                        console.log(data);
                    },function (error) {
                    });



                   // window.location.href = 'search?w=' + encodeURI(encodeURIComponent($scope.keyword)) + '&type=all';
                }

            }
        };

        // 搜索框获得焦点，显示联想框
        $scope.onFocus = function() {
            $scope.associate = true;
            $scope.selectIndex = -1;
            if(!$scope.keyword) $scope.keyword = '';
        };

        //table设置
        $scope.searchLogTableParams = new ngTableParams({
            page : 1,
            count : 20
        }, {
            total : 0,
            getData : function ($defer, params) {
                $scope.paginationParams = params;
                const param = BaseService.parseParams(params.url());
                //param.status = $scope.status;
                if($scope.search !=null){
                    if($scope.search == 1){
                        param.userUu = $scope.searchContent;
                    }
                    if($scope.search == 2){
                        param.userName = $scope.searchContent;
                    }
                }

                $http({
                    method:'GET',
                    url:'search/searchHistory/page',
                    params:param
                }).then(function (data) {
                    params.total(data.totalElements);
                    $defer.resolve(data.data.content);
                    $scope.logs = data.data.content;
                    params.total(data.data.totalElements);
                    console.log(data.data.content);
                },function (error) {
                });
            }
        });


        // 搜索框失去焦点，关闭联想框
        $scope.onBlur = function() {
            $scope.associate = false;
        };

        // 搜索框通过按键选取想要的联想词
        $scope.onKeyup = function() {
            if($scope.associates && $scope.associates.length) {
                if(event.keyCode == 40) { //监听到按下键
                    $scope.selectIndex ++;
                    if($scope.selectIndex >= $scope.associates.length) $scope.selectIndex = 0;
                    $scope.keyword = $scope.associates[$scope.selectIndex];
                } else if(event.keyCode == 38) { //监听到按上键
                    $scope.selectIndex --;
                    if($scope.selectIndex < 0) $scope.selectIndex = $scope.associates.length - 1;
                    $scope.keyword = $scope.keyword = $scope.associates[$scope.selectIndex];
                } else if(event.keyCode == 13) { //确定键
                    $scope.search();
                }
            }
        };

        // 输入框内容变化，获取新的联想词
        $scope.onChange = function() {
            if ($scope.keyword) {
                var params = {
                    keyword: $scope.keyword
                };
                if($rootScope.userInfo) {
                    params.userUU = $rootScope.userInfo.userUU;
                }
                /*$http.get('search/similarKeywords', {
                    params : params
                }).success(function(data){
                    $scope.associates = data;// 联想词数组
                }).error(function(response) {

                });*/
            } else {
                $scope.associates = [];// 联想词数组
            }

        };

        // 点击联想词
        $scope.onAssociateClick = function(component) {
            $scope.keyword = component;
            $scope.search();
        };

        // 鼠标进入联想词框，不能关闭联想词框
        $scope.onAssociateEnter = function() {
            $scope.associateEnter = true;
        };

        // 鼠标离开联想词框，可以关闭联想词框
        $scope.onAssociateLeave = function() {
            $scope.associateEnter = false;
        };

        // 热词
        $scope.hotwords = [{name : 'SCT2080KEC', url :'product#/component/1100400300009990/'},
            {name : '电池组', url : 'product#/kinds/346'},
            {name : 'Vishay',url : 'product#/brand/30327265e42a871be050007f01003d96/'},
            {name : 'Panasonic Battery', url : 'product#/brand/30327265e4e7871be050007f01003d96/'}];
    }]);
});