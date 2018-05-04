define([ 'app/app', 'jquery-summernote' ], function(app) {
	'use strict';
	app.register.controller('BrandCtrl', ['$scope', 'toaster', '$modal', '$http', '$location', '$stateParams', '$templateCache', 'BrandActive', 'BrandVersion', 'ArrayUtil', function($scope, toaster, $modal, $http, $location, $stateParams, $templateCache, BrandActive, BrandVersion, ArrayUtil) {
		
		$scope.uuid = $stateParams.uuid;
		$scope.version = $stateParams.version;
		
		$scope.isVersionListShow = false;
		$scope.showVersionList = function(){
			$scope.isVersionListShow = !$scope.isVersionListShow;
		};
		
		//将各种数据加载到$scope上
		var loadData = function(data){
			$scope.brand = data;
			if(data.version == -1){
				//没有uuid对应数据，跳转回品牌首页
				toaster.pop('info', '未查到对应品牌信息', '已跳转至品牌列表页面');
				$location.url("brandList");
			}
			else if(data.version == 0){
				//没有对应的version版本号
				toaster.pop('info', '未查到品牌对应版本信息', '已跳转至当前品牌最新版本');
				//需要先清除掉地址栏后面的参数
				$location.url("brand/" + $scope.uuid + "/");
			}
			else {
				if(data.versionCount){
					$scope.brand.versionCount = data.versionCount;
				}
				else{
					$scope.brand.versionCount = $scope.brand.version;
				}
				$scope.arr = ArrayUtil.buildArr($scope.brand.versionCount);
				$scope.applications = (data.application || '').split(',');
				document.title = data.name + "-UAS电子市场";
			}
		};
		
		//检查有没有版本号
		if($scope.version){
			//查询对应版本号
			BrandVersion.get({uuid : $scope.uuid, version : $scope.version}, {}, function(data){
				loadData(data);
			}, function(data){
				toaster.pop('error', '系统异常', '获取品牌版本信息异常');
			});
		}
		else{
			BrandActive.get({uuid : $stateParams.uuid}, {}, function(data){
				loadData(data);
			}, function(data){
				toaster.pop('error', '系统异常', '获取品牌有效版本信息异常');
			});
		}
	}]);
	
});