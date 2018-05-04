define(['app/app'], function(app) {
	'use strict'
	app.register.controller('makeDemandInputCtrl', ['$scope','BaseService', 'toaster', '$modal', '$state', 'makerDemandServices', 'ngTableParams', '$stateParams', function($scope, BaseService, toaster, $modal, $state, makerDemandServices, ngTableParams, $stateParams) {
		$scope.input =  $stateParams.input;
		
		makerDemandServices.getMakeDemandById({id: $stateParams.id}, function(data) {
			$scope.makerDemand = data;
		}, function(response) {
			toaster.pop("error", "获取信息失败" +  response.data);
		});
		
		$scope.confirm = function() {
			if($scope.makerDemand.remark.length > 800) {
				toaster.pop('info', '您提交的需求描述必须小于800个字符。');
				return ;
			}
			makerDemandServices.handleMakeDemand({id: $scope.makerDemand.id, remark: $scope.makerDemand.remark}, {}, function(data) {
				toaster.pop('success', '处理成功');
				$state.go('makeDemand');
			}, function(response) {
				toaster.pop('error', '处理失败: ' + response.data);
			});
		}
		
		$scope.cancle = function() {
			$state.go('makeDemand');
		}
		
	}]);
})