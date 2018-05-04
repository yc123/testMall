define(['app/app'], function(app) {
	'use strict'
	app.register.controller('BrandStoreCtrl', ['$rootScope', '$scope', 'ngTableParams', 'toaster', 'collectionService', 'BaseService', function($rootScope, $scope, ngTableParams, toaster, collectionService, BaseService) {
		BaseService.scrollBackToTop();
		
		$scope.storeTableParams = new ngTableParams({
			page : 1,
			count: 20
		}, {
			total : 0,
			getData :  function($defer, params) {
				var param = BaseService.parseParams(params.url());
                collectionService.getStoreByUUAndBrand.call(null, param, function(page) {
					$defer.resolve(page.content);
					params.total(page.totalElements);
				}, function(response) {
					
				});
			}
		});
		
		$scope.cancleStore = function(id) {
            collectionService.deleteStoreById({id: id}, null, function(data) {
				toaster.pop('success', '取消成功');
				$scope.storeTableParams.page(1);
				$scope.storeTableParams.reload();
                collectionService.getStoreByUU({}, function(data) {
					var store = [];
					var brandCount = 0;
					var componentCount = 0;
					for(var i = 0; i < data.length; i++) {
						if(data[i].kind == 1) {
							brandCount++;
						}else if (data[i].kind == 2){
							componentCount++;
						}
						store.push(data[i]);
					}
					$rootScope.brandCount = brandCount;
					$rootScope.componentCount = componentCount;
					SessionService.setCookie($rootScope.userInfo.userUU +"-"+ $rootScope.userInfo.enterprise.uu, angular.toJson(store));
				});
			}, function(response) {
				toaster.pop('error', '取消失败');
			});
		}
	}]);
})