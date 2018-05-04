define(['app/app'], function(app) {
	'use strict';
	app.register.controller('openBillCtrl', ['$scope', '$stateParams' , '$state', 'Order', 'toaster', function($scope, $stateParams, $state, Order, toaster) {
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
			Order.drawBill({id: $stateParams.id}, $scope.logistic, function(data) {
				toaster.pop('success', '成功', '开发票成功');
				$state.go('trade_order');
			}, function(response) {
				toaster.pop('error', '错误', '开发票失败，请重新操作,' + response.data);
			});
			
		}
		
		$scope.goBack = function() {
			$state.go('trade_order');
		}
	}])
})