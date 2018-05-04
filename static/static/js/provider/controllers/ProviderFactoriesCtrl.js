define([ 'app/app', 'jquery-summernote' ], function(app) {
	'use strict';
	app.register.controller('ProviderFactoriesCtrl', ['$scope', '$rootScope', 'toaster', 'BrandActiveAPI', 'Carousel', 'StoreInfo', 'ngTableParams', 'BaseService', 'StoreCms', 'Order', 'StoreAdsInformation', function($scope, $rootScope, toaster, BrandActiveAPI, Carousel, StoreInfo, ngTableParams, BaseService, StoreCms, Order, StoreAdsInformation) {
		$rootScope.page = 'factories';
		document.title = "原厂专区" + "-优软商城";

		//------------------------------------------------- 初始化

		$scope.stores = {};

		/**
		 * 初始化
		 */
		this.initial = function() {

			/**
			 * 获取轮播
			 */
			Carousel.get({module : "Brand zone banner"}, {}, function (data) {
				$scope.carousels = data;
			}, function (res) {
			});

			/**
			 * 获取新开原厂店铺
			 */
			StoreInfo.findNewStore({ types : 'ORIGINAL_FACTORY' }, {}, function (page) {
				$scope.newStores = page.content || [];
			}, function (resp) {
			});

			/**
			 * 获取销售排行信息
			 */
			StoreInfo.findTopStoreBySales({ isOriginal: true }, {}, function (stores) {
				$scope.topSalesStores = stores || [];
				angular.forEach($scope.topSalesStores, function (store) {
					Order.countOneStoreOrder({storeUuid : store.uuid}, {}, function (data) {
						store.orderCount = data.orderCount || 0;
					}, function () {
						store.orderCount = 0;
					});
				});
			}, function (resp) {
			});

			/**
			 * 获取原厂推荐信息
			 */
			StoreAdsInformation.showExcellenceListWhenUserQuery({types: 'ORIGINAL_FACTORY'}, {}, function (data) {
				if (angular.isArray(data) && data.length > 0) {
					$scope.recommendOriginal = data;
					angular.forEach(data, function (storeAds) {
						if (storeAds.store) {
							storeAds.uuid = storeAds.store.uuid;
							storeAds.logoUrl = storeAds.store.logoUrl;
							storeAds.storeName = storeAds.store.storeName;
							storeAds.description = storeAds.store.description;
						}
					});
				} else {
					$scope.recommendOriginal = [];
				}
			}, function (error) {
				console.log(error);
				$scope.recommendOriginal = [];
			});

			/**
			 * 统计新开原厂店铺数量
			 */
			StoreInfo.countByStatusType({ types : 'ORIGINAL_FACTORY' }, {}, function (result) {
				if (result.success) {
					$scope.storeCount = result.data;
				}
			}, function (error) {
			});
			/**
			 * 分页获取原厂店铺列表
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
					param.types = 'ORIGINAL_FACTORY';
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
		};
		this.initial();

		/**
		 * 搜索
		 */
		$scope.search = function () {
			$scope.storesTableParams.page(1);
			$scope.storesTableParams.reload();
		};
	}]);

});
