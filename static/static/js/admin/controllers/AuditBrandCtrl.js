define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('AuditBrandCtrl', ['$scope', 'ngTableParams', 'BrandsSubmit', 'BaseService', function($scope, ngTableParams, BrandsSubmit, BaseService) {
		BaseService.scrollBackToTop();
		
		$scope.active = 'unAudited';
		
		$scope.keyword = "";
		$scope.setActive = function(state) {
			if($scope.active != state) {
				$scope.active = state;
				if($scope.brandTableParams.page() == 1)
					$scope.brandTableParams.reload();
				else
					$scope.brandTableParams.page(1);
			}
		};
		
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'all' : 
					break;
				case 'unAudited' :
					state = 'getUnAudited'; break;
				case 'allow' :
					state = 'getAllow'; break;
				case 'notAllow' :
					state = 'getNotAllow'; break;
			}
			return  state;
		};
		
		$scope.brandTableParams = new ngTableParams({
			page : 1,
			count : 50,
			sorting : {
				lastModifyDate: 'DESC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				BrandsSubmit[getState()].call(null, param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);					}
				});
			}
		});
		
		$scope.onSearch = function() {
			$scope.brandTableParams.reload();
		}
		
	}]);
});