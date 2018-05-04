/**
 * 供应商首页控制器
 *
 * history:
 * Created by huxz on 2017-3-24 09:42:08
 */
define(['app/app'], function(app) {

	app.register.controller('ProviderHomeCtrl', ['$scope', 'StoreCms', 'Carousel', '$rootScope', 'ngTableParams', 'BaseService', 'StoreInfo', 'Order', 'StoreAdsInformation', function ($scope, StoreCms, Carousel, $rootScope, ngTableParams, BaseService, StoreInfo, Order, StoreAdsInformation) {

		/**********************************************************************
		 * 初始化
		 **********************************************************************/
		$rootScope.page = 'agent';
		document.title = "代理经销" + "-优软商城";

		/**
		 * 获取轮播图信息
		 */
		Carousel.get({ module : 'Agent zone banner'}, function (carousels) {
			$scope.carousels = carousels || {};
		});

		/**
		 * 获取新入驻店铺信息
		 */
		StoreInfo.findNewStore({ types : 'AGENCY-DISTRIBUTION' }, {}, function (page) {
			$scope.newStores = page.content || [];
		}, function (resp) {
		});

		/**
		 * 获取销售排行信息
		 */
		StoreInfo.findTopStoreBySales({ isOriginal: false }, {}, function (stores) {
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

		/**
		 * 获取热销产品信息
		 */
		StoreCms.findGoodInventory({}, {}, function (data) {
			$scope.hotComponents = [];
			if (data) {
				console.log(data);
				angular.forEach(data, function (goods) {
					var commodity = {};
					commodity.img = goods.img;
					commodity.code = goods.code;
					commodity.batchCode = goods.batchCode;
					commodity.storeid = goods.storeid;
					$scope.hotComponents.push(commodity);
				});
			}
		}, function (error) {
			console.log(error);
		});

		/*StoreCms.getHotComponentByUseForAndPageFor({ useFor : 'HOT_COMPONENT', pageFor : 'STORE_LIST'}, function (hotComponents) {
			$scope.hotComponents = hotComponents || {};
		});*/

		/**
		 * 统计新开原厂店铺数量
		 */
		StoreInfo.countByStatusType({ types : 'AGENCY-DISTRIBUTION' }, {}, function (result) {
			if (result.success) {
				$scope.storeCount = result.data;
			}
		}, function () {
		});

		/**********************************************************************
		 * 交互操作
		 **********************************************************************/

	}]);
});
