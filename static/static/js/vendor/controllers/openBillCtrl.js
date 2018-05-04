define(['app/app'], function(app) {
	'use strict';
	app.register.controller('openBillCtrl', ['$scope', '$state', '$stateParams', 'Purchase', 'toaster', function($scope, $state, $stateParams, Purchase, toaster) {
		console.log($stateParams.id);
		$scope.logistic = {};
		
		$scope.commit = function() {
			if(!$scope.logistic.companyName || $scope.logistic.companyName.trim() == '') {
				toaster.pop('info', '提示', '快递公司信息为空');
				return ;
			}
			if(!$scope.logistic.number || $scope.logistic.number.trim() == '') {
				toaster.pop('info', '提示', '快递公司信息为空');
				return ;
			}
			Purchase.drawBill({id: $stateParams.id}, $scope.logistic, function(data) {
				toaster.pop('success', '成功', '开发票成功');
				$state.go('cusPurchase');
			}, function(response) {
				toaster.pop('error', '错误', '开发票失败，请重新操作,' + response.data);
			});
			
		}
		
		$scope.goBack = function() {
			$state.go('cusPurchase');
		}
	}])
})