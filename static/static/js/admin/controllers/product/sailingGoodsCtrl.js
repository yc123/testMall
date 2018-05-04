define(['app/app'], function(app) {
	'use strict'
	app.register.controller('sailingGoodsCtrl', ['$scope', 'BaseService', 'toaster', '$modal', '$state', 'ngTableParams', 'Goods', function($scope, BaseService, toaster, $modal, $state, ngTableParams, Goods) {
		BaseService.scrollBackToTop();
		
		$scope.active = 'available';
		
		var getState = function() {
			var state = '';
			switch($scope.active) {
				case 'available' :
					state = 'AVAILABLE'; break;
				case 'unavailable' : 
					state = 'UNAVAILABLE'; break;
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			$scope.active = state;
			$scope.salingGoodsTableParams.page(1);
			$scope.salingGoodsTableParams.reload();
		};
		
		$scope.salingGoodsTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				createdDate: 'DESC'
			}
		}, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.status = getState();
				param.keyword = $scope.keyword;
				Goods.findSalingGoodsAdmin(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		$scope.onSearch = function() {
			if ($scope.salingGoodsTableParams.page() == 1) {
				$scope.salingGoodsTableParams.reload();
			}
			$scope.salingGoodsTableParams.page(1);
		}
		
	}]);
})