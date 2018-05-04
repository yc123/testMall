define(['app/app'], function(app) {
	app.register.controller('EditAccountCtrl',['$scope', 'Enterprise', 'toaster', '$rootScope', function($scope, Enterprise, toaster, $rootScope) {
		console.log($rootScope);
		$scope.userInfo = $rootScope.userInfo;
		Enterprise.getEnterpriseInfo({enuu : $scope.userInfo.enterprise.uu}, function(data) {
			$scope.enterprise = data;
		},function(response) {
			toaster.pop('error', '');
		});
	}]);
});