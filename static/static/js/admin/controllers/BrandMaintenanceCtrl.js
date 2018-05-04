define([ 'app/app' ], function(app) {
	// 品牌维护
	app.register.controller('BrandMaintenanceCtrl', ['$scope', 'ngTableParams', 'BrandActive', 'BaseService', function($scope, ngTableParams, BrandActive, BaseService) {
		
		BaseService.scrollBackToTop();
		
		$scope.brandTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				nameEn : 'ASC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				BrandActive.getSimpleInfoPage.call(null, param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		
		$scope.onSearch = function() {
			$scope.brandTableParams.page(1);
			$scope.brandTableParams.reload();
		}
		
	}]);
});