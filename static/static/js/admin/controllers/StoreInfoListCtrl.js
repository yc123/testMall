define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('StoreInfoListCtrl', ['$scope', '$anchorScroll', '$location', '$modal', 'BaseService', 'SessionService', 'toaster', 'ngTableParams', 'StoreInfo', 'StoreCms', '$state', function ($scope, $anchorScroll, $location, $modal, BaseService, SessionService, toaster, ngTableParams, StoreInfo, StoreCms, $state) {

		$scope.storeType = 'ALL';
		$scope.isShow = 'ALL';

		$scope.storeTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				updateTime : 'DESC'
			}
		}, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());

				// 过滤店铺类型
				if ($scope.storeType && $scope.storeType !== '' && $scope.storeType !== 'ALL') {
					param.type = $scope.storeType;
				}

				// 过滤店铺状态信息
				if ($scope.storeStatus && $scope.storeStatus !== '') {
					param.status = $scope.storeStatus;
				}

				// 根据关键字进行搜索
				if ($scope.keyword && $scope.keyword !== '') {
					param.keyword = $scope.keyword;
				}

				StoreInfo.pageStoreInfoWhenAdminQuery(param, function (data) {
					if (!data.content || !Array.isArray(data.content)) {
						data.content = [];
					}
					angular.forEach(data.content, function (store) {
						var tags = JSON.parse(store.tags || '[]');
						store.tagsObject = {};
						for (var i = 0; i < tags.length; i++) {
							store.tagsObject[tags[i]] = true;
						}
					});
					$defer.resolve(data.content);
					params.total(data.totalElements);
					console.log(data);
				});
			}
		});

		$scope.newStoreMap = {};

		/**
		 * 获取新开原厂店铺
		 */
		StoreInfo.findNewStore({ types : 'ORIGINAL_FACTORY' }, {}, function (page) {
			if (page && page.content && page.content.length > 0) {
				angular.forEach(page.content, function (store) {
					$scope.newStoreMap[store.uuid] = true;
				});
			}
		}, function (resp) {
		});

		/**
		 * 获取新入驻经销代理店铺信息
		 */
		StoreInfo.findNewStore({ types : 'AGENCY-DISTRIBUTION' }, {}, function (page) {
			if (page && page.content && page.content.length > 0) {
				angular.forEach(page.content, function (store) {
					$scope.newStoreMap[store.uuid] = true;
				});
			}
		}, function (resp) {
		});

		$scope.hotSalesMap = {};

		/**
		 * 获取原厂销售排行信息
		 */
		StoreInfo.findTopStoreBySales({ isOriginal: true }, {}, function (stores) {
			if (stores && stores.length > 0) {
				angular.forEach(stores, function (store) {
					$scope.hotSalesMap[store.uuid] = true;
				});
			}
		}, function (resp) {
		});

		/**
		 * 获取经销代理销售排行信息
		 */
		StoreInfo.findTopStoreBySales({ isOriginal: false }, {}, function (stores) {
			if (stores && stores.length > 0) {
				angular.forEach(stores, function (store) {
					$scope.hotSalesMap[store.uuid] = true;
				});
			}
		}, function (resp) {
		});

		/**
		 * 添加到店铺相关内容管理系统
		 *
		 * @param store		店铺信息
		 * @param useFor	用途
		 * @param cmsType	类型
		 */
		$scope.addToCms = function (store, useFor, cmsType) {
			var param = {
				useFor : useFor,
				cmsType : cmsType
			};
			StoreCms.addOneTypeStoreCms(param, store, function (result) {
				if (result.success) {
					toaster.pop('info', "添加成功");
				} else {
					toaster.pop('error', result.message + '，可能已经添加');
				}
			})
		};

		/**
		 * 跳转店铺详情页面
		 *
		 * @param store		店铺信息
		 */
		$scope.goStoreDetail = function (store) {
			if (store && store.uuid) {
				$state.go('store_info_detail', { uuid : store.uuid, type: store.type });
			} else {
				toaster.pop('error', '店铺信息不能为空');
			}
		};

		/**
		 * 改变创建时间排序
		 */
		$scope.changeShorting = function () {
			if ($scope.isShow === 'ALL') {
				$scope.isShow = 'DOWN';

				$scope.storeTableParams.sorting({createTime: 'desc'});
			} else if ($scope.isShow === 'DOWN') {
				$scope.isShow = 'UP';

				$scope.storeTableParams.sorting({createTime: 'asc'});
			} else if ($scope.isShow === 'UP') {
				$scope.isShow = 'ALL';

				$scope.storeTableParams.sorting({updateTime : 'DESC'});
			}
			$scope.storeTableParams.page(1);
			$scope.storeTableParams.reload();
		};

		/**
		 * 根据店铺状态进行过滤
		 *
		 * @param status	店铺状态
		 */
		$scope.filterStoreStatus = function (status) {
			$scope.storeStatus = status;
			console.log(status);

			$scope.storeTableParams.page(1);
			$scope.storeTableParams.reload();
		};

		/**
		 * 选择店铺类型
		 *
		 * @param type	店铺类型
		 */
		$scope.chooseStoreType = function (type) {
			if (!type || type === '') return 0;
			$scope.storeType = type;
			$scope.storeStatus = '';

			$scope.storeTableParams.page(1);
			$scope.storeTableParams.reload();
		};

		/**
		 * 根据关键字进行搜索
		 */
		$scope.refreshTableData = function () {
			$scope.storeTableParams.page(1);
			$scope.storeTableParams.reload();
		};

	}]);
});
