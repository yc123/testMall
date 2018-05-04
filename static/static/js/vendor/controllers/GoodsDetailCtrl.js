define(['app/app'], function(app) {
	'use strict';
	app.register.controller('GoodsDetailCtrl', ['$scope', 'Goods', 'toaster', '$stateParams', 'ComponentActiveAPI', 'BaseService', 'ngTableParams', function($scope, Goods, toaster, $stateParams, ComponentActiveAPI, BaseService, ngTableParams) {
		BaseService.scrollBackToTop();

		/*
		 * 获取产品详情
		 */	
		var getGoods = function(){
			Goods.findByBatchCode({batchCode: $stateParams.batchCode}, function(data){
				$scope.goods = data;
				var uuid = $scope.goods.uuid;
				ComponentActiveAPI.get({uuid: uuid}, function(data){
					$scope.comp = data;
				});
				$scope.showHistory = false;
			}, function(){
				toaster.pop("error", "未能获取产品详情");
			});
		};
		
		// 展开/关闭历史记录
		$scope.toggleHistory = function() {
			$scope.showHistory = !$scope.showHistory;
			if ($scope.showHistory) {
				document.getElementsByClassName("ng-isolate-scope")[0].style.display = '';
				getHistory();
			} else {
				document.getElementsByClassName("ng-isolate-scope")[0].style.display = 'none';
			}
		};
		
		var getHistory  = function() {
			$scope.GoodsHistoryTableParams = new ngTableParams({
				page : 1,
				count : 5,
			}, {
				total : 0,
				counts: [5, 10, 25, 50, 100],
				getData : function($defer, params) {
					var param = BaseService.parseParams(params.url());
					param.batchCode = $scope.goods.batchCode;
					Goods.findGoodsHistoryWithVendor(param, function(page) {
						if (page) {
							params.total(page.totalElements);
							$defer.resolve(page.content);
						}
					}, function(res) {
						toaster.pop('error', res.data);
					});
				}
			});
		};
		
		getGoods();
			
	}]);
	
});