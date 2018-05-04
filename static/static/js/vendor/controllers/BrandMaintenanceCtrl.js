define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('BrandMaintenanceCtrl', ['$scope', 'ngTableParams', 'BrandsSubmit', 'BaseService', '$stateParams', 'AuthenticationService', function($scope, ngTableParams, BrandsSubmit, BaseService, $stateParams, AuthenticationService) {
		BaseService.scrollBackToTop();
		
		var loadMyBrandsSubmit = function(){
			$scope.brandTableParams = new ngTableParams({
				page : 1,
				count : 10,
				sorting : {
					lastModifyDate: 'DESC'
				}
			}, {
				total : 0,
				counts: [10, 25, 50, 100],
				getData : function($defer, params) {
					$scope.paginationParams = params;
					var param = BaseService.parseParams(params.url());
					param.keyword = $scope.keyword;
					param.modifyuu = $scope.uu;
					param.status = getStatus();
					BrandsSubmit.get.call(null, param, function(page) {
						if (page) {
							params.total(page.totalElements);
							$defer.resolve(page.content);
						}
					}, function(){
						
					});
				}
			});
		};
		
		$scope.active = 'tobeAudit';
		
		$scope.setActive = function(result) {
			$scope.active = result;
			$scope.brandTableParams.reload();
		}
		
		var getStatus = function() {
			var result;
			switch($scope.active) {
			case 'tobeAudit':
				result = 311; break;
			case 'pass':
				result = 104; break;
			case 'forbidden':
				result = 103; break;
				default :
					result = 103;
			}
			return result;
		}
		
		AuthenticationService.getAuthentication().success(function(data){
	    	$scope.uu = data.userUU;
	    	
	    	loadMyBrandsSubmit();
	    });
		
		$scope.onSearch = function() {
//			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.brandTableParams.reload();
		}
		
		
	}]);
});