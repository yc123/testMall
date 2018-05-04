define(['app/app'], function(app) {
	app.register.controller('ComponentBatchSubmitDtCtrl', ['$scope', '$stateParams', 'ComponentSubmit', 'toaster', 'BaseService', function($scope, $stateParams, ComponentSubmit, toaster, BaseService) {
		BaseService.scrollBackToTop();
		
		ComponentSubmit.getBatchDetails({submitId : $stateParams.submitId}, {}, function(data) {
			console.log(data);
			$scope.submit = data;
		}, function(res) {
			toaster.pop('error', '提示', res.data);
		})
	}]);
});