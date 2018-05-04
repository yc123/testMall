define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('KindAdviceCtrl', ['$scope', 'KindAdvice', 'toaster', function($scope, KindAdvice, toaster) {
		$scope.advice = {};
		document.title =  '类目建议-优软商城';
		$scope.submit = function() {
			if($scope.advice.schema && $scope.advice.schema.length >= 15) {
			} else {
				toaster.pop('error', '建议方案不能少于15字符');
				return;
			}
			
			if($scope.advice.reason && $scope.advice.reason.length >= 15) {
			} else {
				toaster.pop('error', '建议理由不能少于15字符');
				return;
			}
			
			// 保存
			KindAdvice.save({}, $scope.advice, function(data) {
				toaster.pop('success', '提交成功');
				$scope.advice = {};// 重置输入
			}, function(response) {
				toatser.pop('error', '提交失败 ' + response);
			});
			
		};
	}]);
	
});