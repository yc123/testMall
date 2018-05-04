define([ 'app/app'], function(app) {
	'use strict';
	app.register.controller('FaBillCtrl', ['$scope', 'toaster', 'BaseService', 'ngTableParams', 'Bill', function($scope, toaster, BaseService, ngTableParams, Bill) {
		BaseService.scrollBackToTop();
		
		$scope.faBillTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				createTime: 'DESC'
			}
		}, {
			total : 0,
			counts: [10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				Bill.findBills(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						console.log(page.content);
					}
				});
			}
		});
		
		//根据订单号搜索单据
		$scope.onSearch = function() {
			$scope.faBillTableParams.reload();
		}

	}]);
});