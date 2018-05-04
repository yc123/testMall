define(['app/app'], function(app) {
	'use strict'
	app.register.controller('makeDemandListCtrl', ['$scope','BaseService', 'toaster', '$modal', '$state', 'makerDemandServices', 'ngTableParams', function($scope, BaseService, toaster, $modal, $state, makerDemandServices, ngTableParams) {
		BaseService.scrollBackToTop();
		
		$scope.active = 'tobehandle';
		
		var getState = function() {
			var state = '810';
			switch($scope.active) {
				case 'tobehandle' : //已付款
					state = '810'; break;
				case 'handled' ://待出货
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
				createtime: 'DESC'
			}
		}, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.status = getState();
				makerDemandServices.getPageMakeDemandInfoAdmin(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
	}]);
})