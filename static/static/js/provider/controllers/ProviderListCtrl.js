/**
 * 供应商列表控制器
 *
 * history:
 * Created by huxz on 2017-3-24 09:42:08
 */
define(['app/app'], function(app) {

	app.register.controller('ProviderListCtrl', ['$scope', 'StoreInfo', 'ngTableParams', 'BaseService', 'StoreCms', 'StoreAdsInformation', function ($scope, StoreInfo, ngTableParams, BaseService, StoreCms, StoreAdsInformation) {

		$scope.stores = {};

		/**
		 * 获取所有入驻的代理和经商店铺
		 */
		$scope.storesTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				createTime: 'DESC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.types = 'AGENCY-DISTRIBUTION';
				param.keyword = $scope.stores.keyword;
				StoreInfo.pageStoresByTypesAndKeyword(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				}, function(){
				});
			}
		});
		/**
		 * 获取优秀供应商信息
		 */
		StoreAdsInformation.showExcellenceListWhenUserQuery({types: 'AGENCY,DISTRIBUTION'}, {}, function (data) {
			console.log(data);
			if (angular.isArray(data) && data.length > 0) {
				$scope.exStoreCms = data;
				angular.forEach(data, function (storeAds) {
					if (storeAds.store) {
						storeAds.uuid = storeAds.store.uuid;
						storeAds.logoUrl = storeAds.store.logoUrl;
						storeAds.storeName = storeAds.store.storeName;
						storeAds.description = storeAds.store.description;
					}
				});
			} else {
				$scope.exStoreCms = [];
			}
		}, function (error) {
			console.log(error);
			$scope.exStoreCms = [];
		});

		$scope.search = function () {
			$scope.storesTableParams.page(1);
			$scope.storesTableParams.reload();
		};
	}]);
});
