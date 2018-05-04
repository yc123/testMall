define([ 'app/app' ], function(app) {
	// 器件审批
	app.register.controller('ComponentMaintenanceCtrl', ['$scope', 'ngTableParams', 'ComponentsSubmit', 'BaseService', '$stateParams', 'AuthenticationService', function($scope, ngTableParams, ComponentsSubmit, BaseService, $stateParams, AuthenticationService) {
		BaseService.scrollBackToTop();
		
		var loadMyComponentsSubmit = function(){
			$scope.componentTableParams = new ngTableParams({
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
					param.modifyuu = $scope.uu;
					param.keyword = $scope.keyword;
					param.status = getStatus();
					ComponentsSubmit.get.call(null, param, function(page) {
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
			$scope.componentTableParams.reload();
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
	    	loadMyComponentsSubmit();
	    });
		
		$scope.onSearch = function() {
			$scope.componentTableParams.reload();
		}
		
	}]);
});