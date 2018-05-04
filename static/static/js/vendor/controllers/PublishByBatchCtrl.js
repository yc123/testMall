define([ 'app/app'], function(app) {
	'use strict';
	app.register.controller('PublishByBatchCtrl', ['$scope', 'ngTableParams', 'ComponentActiveAPI', 'BaseService', 'toaster', 'Goods', '$upload', '$rootScope', '$http', 'Search', function($scope, ngTableParams, ComponentActiveAPI, BaseService, toaster, Goods, $upload, $rootScope, $http, Search) {
		BaseService.scrollBackToTop();
		
		// 展开、收拢第一步或第二步
		$scope.closeBox = function(b) {
			$scope[b] = ! $scope[b];
		};
		
		$scope.searchTableParams = new ngTableParams({
			page : 1,
			count : 5
		}, {
			total: 0,
			counts: [],
			getData: function($defer, params) {
				if($scope.keyword) {
					var pageParams = params.url();
					pageParams.w = $scope.keyword;
					Search.componentSearch(BaseService.parseParams(pageParams), function(data) {
						$defer.resolve(data.components);
						params.total(data.total);
					}, function(response) {
						
					});
				}
			}
		});
		
		// 关键词查询事件
		$scope.onSearch = function() {
			$scope.searchTableParams.reload();
		};
		
		// 搜索框获得焦点，显示联想框
		$scope.onFocus = function() {
			$scope.associate = true;
			$scope.selectIndex = -1;
			if(!$scope.keyword) $scope.keyword = '';
		};
		
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
					$scope.onSearch();
				}
			}
		};
		
		// 输入框内容变化，获取新的联想词
		$scope.onChange = function() {
			var params = {
				keyword: $scope.keyword
			};
			if($rootScope.userInfo) {
				params.userUU = $rootScope.userInfo.userUU;
			}
			$http.get('search/similarComponents', {
				params : params
			}).success(function(data){
				$scope.associates = data;// 联想词数组
				console.log(data);
			}).error(function(response) {
					
			});
		};
		
		// 点击联想词
		$scope.onAssociateClick = function(component) {
			$scope.keyword = component;
			$scope.onSearch();
		};
		
		// 鼠标进入联想词框，不能关闭联想词框
		$scope.onAssociateEnter = function() {
			$scope.associateEnter = true;
		};
		
		// 鼠标离开联想词框，可以关闭联想词框
		$scope.onAssociateLeave = function() {
			$scope.associateEnter = false;
		};
		
		// 加入批量发布
		$scope.addTemplate = function(c) {
			$scope.template = $scope.template || [];
			$scope.template.push(c);
		};
		
		// 移除批量发布
		$scope.removeTemplate = function(index) {
			$scope.template.splice(index, 1);
		}
		
		// 判断是否已经加入批量发布
		$scope.added = function(c) {
			var r = false;
			if($scope.template) {
				angular.forEach($scope.template, function(v, k) {
					if(v.uuid == c.uuid) r = true;
					return r;
				});
			}
			return r;
		};
		
		// 下载模板
		$scope.download = function() {
			if($scope.template) {
				var s = '';
				angular.forEach($scope.template, function(v, k) {
					if(s) s += ',';
					s += v.uuid;
				});
				window.location.href = 'trade/goods/publish/template?uuids=' + s;
			}
		};
		
		// 上传Excel批量发布
		$scope.upload = function() {
			var file = $scope.myFiles[0];
			$upload.upload({
				url: 'trade/goods/publish/excel',
				file: file,
				method: 'POST'
			}).success(function(data) {
				$scope.result = data;
				$scope.batch = $scope.result.goods;
				console.log($scope.batch);
			}).error(function(response) {
				console.log(response);
				toaster.pop('error', response.data || response);
			});
		};
	}]);
});