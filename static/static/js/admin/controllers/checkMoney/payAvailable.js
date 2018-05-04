define(['app/app'], function(app) {
	'use strict';
	app.register.controller('payAvailableCtrl', ['$scope', 'tradeBasicProperties', 'toaster', function($scope, tradeBasicProperties, toaster) {
		tradeBasicProperties.getB2CPayTime(null, function(date) {
			$scope.property = date;
		}, function(response) {
			console.log(date);
		});
		
		$scope.modify = function() {
			$scope.edit = true;
		};
		$scope.save = function() {
			$scope.property.type=1500;
			tradeBasicProperties.save(null, $scope.property, function(date) {
				toaster.pop('success', '保存成功');
				$scope.edit = false;
			}, function(response) {
				toaster.pop('error', '保存失败 ' + response.text);
			});
		};
		
		$scope.cancle = function() {
			$scope.edit = false;
		}
	}]);
});