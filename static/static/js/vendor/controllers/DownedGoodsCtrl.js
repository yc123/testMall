define(['app/app'], function(app) {
	'use strict';
	app.register.controller('DownedGoodsCtrl', ['$scope', 'Goods', 'toaster', '$stateParams', 'BaseService', 'ngTableParams', 'ComponentActiveAPI', '$state', function($scope, Goods, toaster, $stateParams, BaseService ,ngTableParams ,ComponentActiveAPI,$state) {
		BaseService.scrollBackToTop();
		
		$scope.activeComp = [];// 存储标准元器件信息的数组
		//分页获取产品信息
		$scope.downedGoodsTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				createdDate: 'DESC'
			}
		}, {
			total : 0,
			counts : [10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				Goods.findDownedGoods(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		// 搜索框内容转换成大写
		var t;
		var setTime = function() {
			if($scope.time > 0) {
				t = setTimeout(function() {
					$scope.$apply(function() {
						$scope.time--;
						setTime();
					});
				}, 1000);
			}else {
				$scope.keyword = angular.uppercase($scope.keyword);
			}
		};
		
		$scope.upper = function() {
			$scope.time = 1;
			clearTimeout(t);
			setTime();
		}
		
		//根据批次号搜索单据
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.downedGoodsTableParams.reload();
		}

			
	}]);
	
});