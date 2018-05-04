/**
 * 店铺首页主页面控制器
 *
 * history:
 * Created by huxz on 2017-3-22 15:51:06
 */
define(['app/app'], function(app) {
	app.register.controller('StoreHomeCtrl', ['$scope', '$location', 'BaseService', 'ngTableParams', 'Commodity', 'StoreCms', '$rootScope', 'RecommendProductService', function($scope, $location, BaseService, ngTableParams, Commodity, StoreCms, $rootScope, RecommendProductService) {
		// 优势库存
		$scope.commodities = [];
		// 关联类目信息
		$scope.kinds = [];
		// 分页参数
		$scope.goodsListTableParams = {};
		// 待筛选的类目ID
		$scope.kindUuid = null;

		// 待筛选的原厂型号
		$scope.code = null;

		// 上一次待筛选的原厂型号
		$scope.lastCode = null;

		// 选中第二层类目
		$scope.selectedFirst = null;
		// 选中第一层类目
		$scope.selectedRootKind = null;
		$scope.showSecondList = showSecondList;

		// 选中第三层类目
		$scope.selectedSecond = null;
		$scope.showLeafList = showLeafList;

		// 选中叶子类目
		$scope.selectedLeaf = null;
		$scope.showLeaf = showLeaf;

		$scope.goodsChange = goodsChange;

		$scope.goodsSearch = goodsSearch;

		activate();

		////////////

		/**
		 * 启动逻辑
		 */
		function activate () {
			findStoreInfoByUuid().then(function (storeInfo) {
				// console.log(storeInfo);
				findAdvantageInventoryOfStore(storeInfo);
				findKindsInfoOfStore(storeInfo);
				$scope.goodsListTableParams = createTableParams();
			})
		}

		/**
		 * 获取店铺信息
		 */
		function findStoreInfoByUuid() {
			return $rootScope.storeInfoPromise.then(function (storeInfo) {
				return storeInfo;
			}, function (error) {
				console.log(error);
				toaster.pop('获取店铺信息失败');
			});
		}

		/**
		 * 获取当前店铺的优势库存信息
		 *
		 * @param storeInfo		店铺信息
		 */
		function findAdvantageInventoryOfStore(storeInfo) {
			if (!storeInfo || !storeInfo.uuid) {
				$scope.commodities = [];
				return ;
			}
			RecommendProductService.findProductsWhenUserVisitStore(storeInfo.uuid).then(function (products) {
				$scope.commodities = products;
				angular.forEach($scope.commodities, function (commodity) {
					commodity.uuid = commodity.comUuid;
				});
			}, function (error) {
				console.log(error);
				$scope.commodities = [];
			})
		}

		/**
		 * 获取当前店铺的所有类目信息
		 *
		 * @param storeInfo		店铺信息
		 */
		function findKindsInfoOfStore(storeInfo) {
			if (!storeInfo || !storeInfo.uuid) {
				$scope.kinds = [];
				return ;
			}
			Commodity.getAllKindsInfoByStoreUuid({ StoreUuid : $scope.storeInfo.uuid }, function (kinds) {
				$scope.kinds = [];
				if (kinds){
					var others = {
						id : -10,
						nameCn : '其他',
						children : [],
						isLeaf : 1,
						parentid : 0,
						level : 1
					};
					kinds.push(others);
					$scope.kinds = kinds;
				}
			}, function () {
				$scope.kinds = [];
			});
		}

		/**
		 * 分页获取当前店铺的商品信息
		 *
		 * @param param			参数信息
		 */
		function pageCommoditiesOfStore(param) {
			return Commodity.pageStoreCommoditiesByEnInfos(param, function (page) {
				return page;
			}).$promise;
		}

		/**
		 * 创建一个分页参数信息
		 */
		function createTableParams() {
			return new ngTableParams({
				page : 1,
				count : 6
			}, {
				total : 0,
				getData : function($defer, params) {
					var param = BaseService.parseParams(params.url());
					param.storeid = $scope.storeInfo.uuid;
					param.kindUuid = $scope.kindUuid;
					param.code = $scope.code;
					pageCommoditiesOfStore(param).then(function (page) {
						if (!page.content) {
							page.content = [];
						}
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}, function (error) {
						console.log(error);
						params.total(0);
						$defer.resolve([]);
					});
				}
			});
		}

		/**
		 * 重新加载商品列表
		 */
		function reloadGoodsList () {
			if ($scope.goodsListTableParams.page() != 1) {
				$scope.goodsListTableParams.page(1);
			}
			$scope.goodsListTableParams.reload();
		}

		/**
		 * 展开第二层类目
		 */
		function showSecondList(kind) {
			$scope.searchCode = null;
			$scope.selectedSecond = null;
			$scope.selectedLeaf = null;
			if ($scope.selectedFirst != kind.id) {
				$scope.selectedFirst = kind.id;
				$scope.selectedRootKind = kind;
				refreshGoodsListByKind(kind);
			} else {
				$scope.selectedFirst = null;
				$scope.selectedRootKind = null;
				refreshGoodsListByKind(null);
			}
		}

		/**
		 * 展开第三层类目信息
		 */
		function showLeafList(kind) {
			$scope.searchCode = null;
			$scope.selectedLeaf = null;
			if ($scope.selectedSecond != kind.id) {
				$scope.selectedSecond = kind.id;
				refreshGoodsListByKind(kind);
			} else {
				$scope.selectedSecond = null;
				refreshGoodsListByKind($scope.selectedRootKind);
			}
		}

		/**
		 * 选中叶子类目
		 *
		 * @param kind	类目信息
		 */

		function showLeaf(kind) {
			$scope.searchCode = null;
			if (kind.isLeaf == 0) {
				return ;
			}
			if ($scope.selectedLeaf != kind.id) {
				$scope.selectedLeaf = kind.id;
			}
			refreshGoodsListByKind(kind);
		}

		/**
		 * 根据类目ID刷新商品列表
		 */
		function refreshGoodsListByKind(kind) {
			$scope.code = null;
			if (kind) {
				if (kind.nameCn == '其他'){
					$scope.kindUuid = '其他';
				}else {
					$scope.kindUuid = getAllLeafKindId(kind);
				}
				// 获取所有叶子节点信息
				reloadGoodsList();
			} else if ($scope.kindUuid && !kind) {
				$scope.kindUuid = null;
				reloadGoodsList();
			} else {
			}
		}

		/**
		 * 获取根据当前类目的信息获取所有叶子节点的类目信息
		 *
		 * @param kind
		 */
		function getAllLeafKindId(kind) {
			if (!kind) {
				return null;
			}
			if (kind.isLeaf == 1) {
				return kind.id;
			}
			if (kind.isLeaf == 0) {
				// 获取第一级类目的所有叶子类目ID
				if (kind.level == 1) {
					var leafKindIds = [];
					angular.forEach(kind.children, function (kind) {
						// 获取第一级类目的直接子类目的所有叶子类目ID
						var childrenIds = getAllLeafKindId(kind);
						if (Array.isArray(childrenIds)) {
							angular.forEach(childrenIds, function (child) {
								leafKindIds.push(child);
							})
						} else {
							leafKindIds.push(childrenIds);
						}
					});
					return leafKindIds;
				} else if (kind.level == 2) {
					// 获取第二级类目的所有叶子类目ID
					var kindIds = [];
					angular.forEach(kind.children, function (kind) {
						kindIds.push(kind.id);
					});
					return kindIds;
				}
			}
		}

		/**
		 * 根据原厂型号刷新列表
		 */
		function goodsChange(code) {
			$scope.code = code ? code : null;
		}

		/**
		 * 根据原厂型号进行搜索
		 */
		function goodsSearch(code) {
			$scope.code = code ? code : null;
			$scope.kindUuid = null;
			$scope.selectedFirst = null;
			$scope.selectedSecond = null;
			$scope.selectedLeaf = null;
			reloadGoodsList();
		}

	}]);
});
