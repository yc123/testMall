define(['app/app'], function(app) {
	'use strict';
	app.register.controller('downedGoodsCtrl', ['$scope', 'Goods', 'toaster', '$stateParams', 'BaseService', 'ngTableParams', 'ComponentActiveAPI', '$state', function($scope, Goods, toaster, $stateParams, BaseService ,ngTableParams ,ComponentActiveAPI,$state) {
		$scope.activeComp = [];// 存储标准元器件信息的数组
		//分页获取产品信息
		$scope.downedGoodsTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				createdDate: 'DESC'
			}
		}, {
			total : 0,
			counts : [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				Goods.findDownedGoodsAdmin(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		//根据批次号搜索单据
		$scope.onSearch = function() {
			$scope.downedGoodsTableParams.reload();
		}	
	}]);
	
});