define(['app/app'], function(app) {
	'use strict';
	app.register.controller('exchangeRateCtrl', ['$scope', 'exchangeRateService', 'toaster', function($scope, exchangeRateService, toaster) {
		$scope.edit = false;
		exchangeRateService.getUSD(null, function(date) {
			$scope.usdExchangeRate = date;
		}, function(response) {
			toaster.pop('error', '获取信息失败:' + response.data);
		});
		
		$scope.save = function() {
			$scope.usdExchangeRate.fromCurrency = 'USD';
			$scope.usdExchangeRate.toCurrency = 'CNY';
			$scope.usdExchangeRate.type = 'USD';
			exchangeRateService.save(null, $scope.usdExchangeRate, function(data) {
				$scope.usdExchangeRate = data;
				$scope.edit = false;
				toaster.pop('success', '保存成功');
			}, function(response) {
				toaster.pop('error', '保存信息失败:' + response.data);
			});
		};
		
		$scope.modify = function() {
			$scope.edit = true;
		};
		
		$scope.cancle = function() {
			$scope.edit = false;
		}
	}]);
});