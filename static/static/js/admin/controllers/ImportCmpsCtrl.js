define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('ImportCmpsCtrl', ['$scope', 'ngTableParams', '$sanitize', 'BrandsSubmit', 'BaseService', '$stateParams', '$upload', 'toaster', function($scope, ngTableParams, $sanitize, BrandsSubmit, BaseService, $stateParams, $upload, toaster) {
		// 上传Excel批量发布
		$scope.upload = function() {
			var file = $scope.myFiles[0];
			$upload.upload({
				url: 'api/product/component/import/excel',
				file: file,
				method: 'POST'
			}).success(function(data) {
				$scope.result = data;
				console.log($scope.result);
			}).error(function(response) {
				console.log(response);
				toaster.pop('error', response.data || response);
			});
		};
	}]);
});