define([ 'app/app' ], function(app) {
	// 器件批量建档详情
	app.register.controller('AuditComponentSubmitBatchDtCtrl', ['$scope', 'ComponentSubmit', '$stateParams', 'toaster', '$window', function($scope, ComponentSubmit, $stateParams, toaster, $window) {
		ComponentSubmit.getBatchDetails({submitId : $stateParams.submitId}, {}, function(data) {
			$scope.submit = data;
		}, function(res) {
			toaster.pop('error', '提示', res.data);
		});
		
		// 审核通过
		$scope.audit = function() {
			ComponentSubmit.auditBatch({}, $scope.submit, function(data) {
				toaster.pop('success', '提示', '审核通过');
				$window.location.reload();
			}, function(res) {
				toaster.pop('error', '提示', res.data);
			})
		};
		
		// 审核不通过
		$scope.unAduidt = function() {
			ComponentSubmit.unAuditBatch({}, $scope.submit, function(data) {
				toaster.pop('success', '提示', '审核不通过');
				$window.location.reload();
			}, function(res) {
				toaster.pop('error', '提示', res.data);
			})
		};
	}]);
});