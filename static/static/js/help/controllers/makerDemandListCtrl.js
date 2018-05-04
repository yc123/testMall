define([ 'app/app' ], function(app) {
	'use strict';	
	app.register.controller('makerDemandListCtrl', ['$scope', 'makerDemandServices', 'toaster', 'ngTableParams', 'BaseService',function($scope, makerDemandServices, toaster, ngTableParams, BaseService) {
		
		$scope.active = 'handled';
		
		var getState = function() {
			var state = '810';
			switch($scope.active) {
			case 'tobehandle':
				state = '810'; break;
			case 'handled':
				state = '811'; break;
			}
			return state;
		}; 
		
		$scope.setActive = function(state) {
			$scope.active = state;
			$scope.makeDemandTableParams.page(1);
			$scope.makeDemandTableParams.reload();
		};
		
		$scope.makeDemandTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				createtime : "DESC"
			}
		}, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.status = getState();
				makerDemandServices.getPageMakeDemandInfoPersonal(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
	}]);
});