define(['app/app'], function(app) {
	'use strict';
	app.register.controller('overtimeBatchCtrl',['$scope', 'Goods', 'toaster', function($scope, Goods, toaster){
		Goods.getOvertime({}, {}, function(data) {
			$scope.overtimeBatches = data;
		}, function(res) {
			toaster.pop('error', '错误', '加载失败');
		})
	}]);
})