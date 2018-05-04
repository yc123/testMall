define(['app/app'], function(app) {
	'use strict';
	app.register.controller('validtimeCtrl',['$scope', 'Validtime', 'toaster', function($scope, Validtime, toaster){
		$scope.isChange = false; 
		$scope.isUpdate = false;
		Validtime.get({}, {}, function(data){
			$scope.validtime = data;
		}, function(res) {
			toaster.pop('error', '错误', '获取批次有效期规则失败');
		});
		
		// 修改
		$scope.change = function() {
			$scope.isChange = true; 
		}
		
		// 取消
		$scope.back = function() {
			location.reload();
		}
		
		// 是否立即更新
		$scope.update = function() {
			$scope.isUpdate = !$scope.isUpdate
		}
		
		// 保存
		$scope.save = function(valid) {
			Validtime.save({isUpdate : $scope.isUpdate}, valid, function(data) {
				toaster.pop('success', '', '保存成功');
				location.reload();
			}, function(res) {
				toaster.pop('error', '错误', res.data);
			})
		}
	}]);
})