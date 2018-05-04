
define([ 'ngResource', 'common/query/commodity' ], function() {
	'use strict';
	var module = angular.module('StoreCmsModule', ['ngResource', 'commodityServices']);

	module.factory('RecommendProduct', ['$resource', function ($resource) {
		var address = 'http://api.ubtob.com/';

		return $resource('', {}, {
			/**
			 * 当卖家修改产品推荐时，根据卖家企业UU获取产品推荐信息
			 *
			 * @param enuu
			 */
			findProductsWhenSellerUpdate: {
				url: address + 'api/recommend/products',
				method: 'GET',
				params: {
					condition: 'enuu'
				},
				isArray: true
			},
			/**
			 * 当用户访问店铺首页时，根据店铺的UUID获取产品推荐信息
			 *
			 * @param uuid
			 */
			findProductsWhenUserVisitStore: {
				url: 'api/store/recommend/products',
				method: 'GET',
				params: {
					condition: 'store_uuid'
				},
				isArray: true
			},
			/**
			 * 当卖家新增或修改产品推荐时，创建或更新产品推荐信息
			 *
			 * @param uuid
			 */
			saveProductsWhenSellerUpdate: {
				url: 'api/store/recommend/products//update_batch',
				method: 'POST',
				isArray: true
			},
			/**
			 * 分页获取店铺的商品信息
			 */
			pageStoreCommoditiesWhenRecommendProduct: {
				url: 'api/commodity/commodities',
				method: 'GET',
				params: {
					condition: 'recommend_product'
				}
			}
		})
	}]);

	module.filter('indexToString', function () {
		return function (index) {
			var indexStr = index.toString();
			if (indexStr.length == 1) {
				return '00' + indexStr;
			} else if (indexStr.length == 2) {
				return '0' + indexStr;
			} else {
				return indexStr;
			}
		}
	});

	/**
	 * 产品上传控制器
	 */
	module.controller('RecommendProductController', ['$modalInstance', '$scope', '$rootScope', 'isBatch', 'product', 'products', 'RecommendProduct', 'ngTableParams', 'BaseService', 'toaster', 'Commodity', function ($modalInstance, $scope, $rootScope, isBatch, product, products, RecommendProduct, ngTableParams, BaseService, toaster, Commodity) {

		console.log(product);

		$scope.isBatch = false;
		$scope.product = null;
		$scope.commodity = {};
		$scope.countOfProduct = 0;
		var recommendProducts = [];

		$scope.existProducts = [];
		var notExistProducts = [];
		var enUU = 0;
		var uuid = '';
		var orders = [];

		//------------------------------------------------- 取消保存操作

		$scope.formatPrice =  formatPrice;

		$scope.cancelOperation = cancelOperation;
		$scope.saveOperation = saveOperation;

		$scope.chooseProduct = chooseProduct;
		$scope.deleteProduct = deleteProduct;
		$scope.deleteOneProduct = deleteOneProduct;

		$scope.searchProduct = searchProduct;

		$scope.topSelectedProduct = topSelectedProduct;

		$scope.showMinPriceMessage = false;
		$scope.showMaxPriceMessage = false;
		$scope.checkPrice = checkPrice;

		active();

		function active() {
			uuid = $rootScope.store ? $rootScope.store.uuid : '';
			//enUU = $rootScope.userInfo ? ($rootScope.userInfo.enterprise ? $rootScope.userInfo.enterprise.uu : 0) : 0;
			$scope.isBatch = isBatch;
			loadCommodity();
			if (!isBatch) {
				$scope.product = product;
				if (product.exist) {
					getCommodity($scope.product.batchCode, $scope.product.order);
					$scope.productTableParams.count(4);
					$scope.productTableParams.reload();
					recommendProducts.push($scope.product);
				}
			} else {
				handlerProducts(products);
			}
		}

		function parseProductToCommodity(product) {
			var commodity = {};
			commodity.id = 1;
			commodity.img = product.comImg || 'http://dfs.ubtob.com/group1/M00/4E/7C/CgpkyFmVUK6AJfuHAAAVUSwA8go043.png';
			commodity.kindNameCn = product.kindNameCn;
			commodity.brandNameEn = product.brandNameCn;
			commodity.code = product.comCode;
			commodity.reserve = product.reserve;
			commodity.minBuyQty = product.minBuyQty;
			commodity.currencyName = product.currency;
			commodity.prices = [{ start: product.minBuyQty, end: product.reserve, rMBPrice: product.minPriceRMB, uSDPrice: product.minPriceUSD }];

			return commodity;
		}

		function getCommodity(batchCode, order) {
			Commodity.findByBatchCode({ batchCode: batchCode }, {}, function (goods) {
				$scope.commodity = goods || {};
				$scope.commodity.order = order;

				if (!$scope.commodity || !$scope.commodity.id) {
					$scope.commodity = parseProductToCommodity($scope.product);
				}
				$scope.productTableParams.count(4);
				$scope.productTableParams.page(1);
				$scope.productTableParams.reload();
			}, function (error) {
				console.log(error);
			});
		}

		function getAllRecommendedProducts() {
			var codes = [];
			products.filter(function (product) {
				return product.exist;
			}).forEach(function (product) {
				codes.push(product.batchCode);
			});

			return codes.join('-');
		}

		function loadCommodity() {
			$scope.productTableParams = new ngTableParams({
				page : 1,
				count : 5
			}, {
				total : 0,
				getData : function($defer, params) {
					$scope.loading = true;
					$scope.paginationParams = params;
					var param = BaseService.parseParams(params.url());
					//param.enUU = enUU;
					param.uuid = uuid;
					param.keyword = $scope.keyword;
					param.minPrice = $scope.minPrice;
					param.maxPrice = $scope.maxPrice;
					param.batchCode = getAllRecommendedProducts();
					RecommendProduct.pageStoreCommoditiesWhenRecommendProduct(param, function(page) {
						$scope.pageParams = page;
						if (page) {
							params.total(page.totalElements);
							$defer.resolve(page.content);
						}
					});
				}
			});
		}

		function handlerProducts(products) {
			if (!products || products.length == 1) {
				$scope.existProducts = [];
				notExistProducts = [];
			}

			// 已选中的产品
			$scope.existProducts = products.filter(function (product) {
				return product.exist;
			}).sort(function (pre, next) {
				return pre.order - next.order;
			});
			recommendProducts = $scope.existProducts;

			// 统计已选的推荐产品数量
			$scope.countOfProduct = 0;
			angular.forEach(recommendProducts, function () {
				$scope.countOfProduct ++;
			});

			// 未选中的产品
			notExistProducts = products.filter(function (product) {
				return !product.exist;
			}).sort(function (pre, next) {
				return pre.order - next.order;
			});

			// 获取未推荐的排序位序号
			orders = [];
			angular.forEach(notExistProducts, function (product) {
				orders.push(product.order);
			});
		}

		function cancelOperation() {
			$modalInstance.dismiss();
		}

		function saveOperation() {
			if(!isBatch) {
				products.push($scope.product);
			}
			$modalInstance.close(products);
		}

		function createProductFromGoods(goods, p) {
			var product = { exist: true, order: p.order };
			product.batchCode = goods.batchCode;
			product.comUuid = goods.uuid;
			product.comCode = goods.code;
			product.comImg = goods.img || 'http://dfs.ubtob.com/group1/M00/4E/7C/CgpkyFmVUK6AJfuHAAAVUSwA8go043.png';
			product.kindUuid = goods.kindUuid;
			product.kindNameCn = goods.kindNameCn;
			product.brandNameCn = goods.brandNameEn;
			product.minPriceRMB = goods.minPriceRMB;
			product.minPriceUSD = goods.minPriceUSD;
			product.storeEnUU = goods.enUU;
			product.reserve = goods.reserve;
			product.minBuyQty = goods.minBuyQty;
			product.currency = goods.currencyName;
			product.storeId = goods.storeid;
			return product;
		}

		function productIsChosen(goods) {
			var recommendedProducts = products.filter(function (product) {
				return product.exist;
			}).sort(function (pre, next) {
				return pre.order - next.order;
			});

			for (var i = 0; i < recommendedProducts.length; i++) {
				if (goods.batchCode == recommendedProducts[i].batchCode) {
					return true;
				}
			}
			return false;
		}

		function chooseProduct(goods) {
			// 判断该产品是否已经选择
			if (productIsChosen(goods)) {
				toaster.pop('warning', '该产品已经推荐！');
				return -1;
			}

			var recommendProd = {};
			if ($scope.isBatch) {
				if (recommendProducts.length < 10) {
					recommendProd = createProductFromGoods(goods, { order: orders[0]});
					recommendProducts.push(recommendProd);

					products[recommendProd.order - 1] = recommendProd;
					handlerProducts(products);

					// 去除之前的已展示状态
					var shownProducts = $scope.existProducts.filter(function (product) {
						return product.isShow;
					});
					angular.forEach(shownProducts, function (product) {
						delete product.isShow;
					});

					recommendProd.isShow = true;
					getCommodity(recommendProd.batchCode, recommendProd.order);
				} else {
					toaster.pop('error', '最多选择10个产品');
				}
			} else {
				if (recommendProducts.length < 1) {
					recommendProd = createProductFromGoods(goods, product);
					$scope.product = recommendProd;
					recommendProducts.push(recommendProd);

					products[recommendProd.order - 1] = recommendProd;
					getCommodity(recommendProd.batchCode, recommendProd.order);
					if (recommendProd.exist) {
						$scope.productTableParams.page(1);
						$scope.productTableParams.count(4);
						$scope.productTableParams.reload();
					}
				} else {
					toaster.pop('error', '请先删除已选中的产品');
				}
			}
		}

		function deleteProduct(goods) {
			if (isBatch) {
				// 获取正在展示的产品信息
				var showProduct = null;
				for (var i = 0; i < $scope.existProducts.length; i++) {
					if (goods.batchCode == $scope.existProducts[i].batchCode) {
						showProduct = $scope.existProducts[i];
						break;
					}
				}

				if (showProduct) {
					products[showProduct.order - 1] = { exist: false, order: showProduct.order };
					handlerProducts(products);

					delete $scope.commodity;

					$scope.productTableParams.count(5);
					$scope.productTableParams.page(1);
					$scope.productTableParams.reload();

				}
			} else {
				$scope.product = { exist:false, order: recommendProducts[0].order };
				recommendProducts.splice(0, 1);
				$scope.commodity = {};

				products[$scope.product.order - 1] = $scope.product;
				$scope.productTableParams.count(5);
				$scope.productTableParams.page(1);
				$scope.productTableParams.reload();
			}
		}

		function deleteOneProduct(product) {
			products[product.order - 1] = { exist: false, order: product.order };
			handlerProducts(products);

			delete $scope.commodity;

			// 去除之前的已展示状态
			var shownProducts = $scope.existProducts.filter(function (product) {
				return product.isShow;
			});
			angular.forEach(shownProducts, function (product) {
				delete product.isShow;
			});

			$scope.productTableParams.count(5);
			$scope.productTableParams.page(1);
			$scope.productTableParams.reload();
		}

		function searchProduct() {
			if (!$scope.isBatch && $scope.commodity && $scope.commodity.id) {
				$scope.productTableParams.count(4);
				$scope.productTableParams.page(1);
				$scope.productTableParams.reload();
			} else {
				$scope.productTableParams.count(5);
				$scope.productTableParams.page(1);
				$scope.productTableParams.reload();
			}
		}

		function topSelectedProduct(product) {
			if (product.isShow) {
				delete $scope.product;
				delete $scope.commodity;

				$scope.productTableParams.count(5);
				$scope.productTableParams.page(1);
				$scope.productTableParams.reload();
			} else {
				$scope.product = product;
				// 去除之前的已展示状态
				var handlerProducts = $scope.existProducts.filter(function (product) {
					return product.isShow;
				});
				angular.forEach(handlerProducts, function (product) {
					delete product.isShow;
				});

				getCommodity(product.batchCode, product.order);
			}
			product.isShow = !product.isShow;
		}

		function checkPrice(type) {
			if ('MIN_PRICE' == type) {
				if ($scope.minPrice == null) {
					$scope.showMinPriceMessage = false;
					return 1;
				}
				if ($scope.minPrice < 0) {
					$scope.showMinPriceMessage = true;
					return 1;
				}
				if ($scope.maxPrice == null || $scope.maxPrice < 0) {
					$scope.showMinPriceMessage = false;
					return -1;
				}
				if ($scope.minPrice > $scope.maxPrice) {
					$scope.showMinPriceMessage = true;
					$scope.showMaxPriceMessage = false;
					return -1;
				}
				$scope.showMinPriceMessage = false;
				$scope.showMaxPriceMessage = false;
				return 1;
			}
			if ('MAX_PRICE' == type) {
				if ($scope.maxPrice == null) {
					$scope.showMaxPriceMessage = false;
					return 1;
				}
				if ($scope.maxPrice <= 0) {
					$scope.showMaxPriceMessage = true;
					return 1;
				}
				if ($scope.minPrice == null || $scope.minPrice <= 0) {
					$scope.showMaxPriceMessage = false;
					return -1;
				}
				if ($scope.minPrice > $scope.maxPrice) {
					$scope.showMinPriceMessage = false;
					$scope.showMaxPriceMessage = true;
					return -1;
				}
				$scope.showMinPriceMessage = false;
				$scope.showMaxPriceMessage = false;
				return 1;
			}
			return -1;
		}

		/**
		 * 格式化价格信息
		 *
		 * @deprecated
		 * @param price		价格
		 * @param type		价格类型
		 */
		function formatPrice(price, type) {
			if ('MIN_PRICE' == type) {
				$scope.minPrice = price.toFixed(6);
			}
			if ('MAX_PRICE' == type) {
				$scope.maxPrice = price.toFixed(6);
			}
		}
	}]);

	module.service('RecommendProductService', ['$q', 'RecommendProduct', function ($q, RecommendProduct) {

		this.findProductsWhenSellerUpdate = findProductsWhenSellerUpdate;
		this.findProductsWhenUserVisitStore = findProductsWhenUserVisitStore;
		this.saveProductsWhenSellerUpdate = saveProductsWhenSellerUpdate;

		function CreatePromise() {
			return $q.defer().promise;
		}
		
		function productExist(products) {
			angular.forEach(products, function (product) {
				product.exist = true;
			});
		}

		function findProductsWhenSellerUpdate(storeEnUU) {
			if (!storeEnUU) {
				return CreatePromise().then(function () {
					return [];
				});
			}

			return RecommendProduct.findProductsWhenSellerUpdate({ enuu: storeEnUU }, {}).$promise.then(function (products) {
				if (!products) {
					return [];
				}
				productExist(products);
				return products;
			}, function (error) {
				console.log('ERROR', error);
				return [];
			});
		}

		function findProductsWhenUserVisitStore(storeUuid) {
			if (!storeUuid || storeUuid === '') {
				return CreatePromise().then(function () {
					return [];
				});
			}

			return RecommendProduct.findProductsWhenUserVisitStore({ uuid: storeUuid }, {}).$promise.then(function (products) {
				if (!products) {
					return [];
				}
				productExist(products);
				return products;
			}, function (error) {
				console.log(error);
				return [];
			});
		}

		function saveProductsWhenSellerUpdate(uuid, products) {
			if (!uuid || uuid === '' || !products) {
				return CreatePromise().then(function () {
					return [];
				});
			}

			products = products.filter(function (product) {
				return product;
			}).sort(function (pre, next) {
				return pre.order - next.order;
			});
			console.log(products);

			for (var i = 0; i < products.length; i++) {
				products[i].order = i + 1;
			}
			console.log(products);

			return RecommendProduct.saveProductsWhenSellerUpdate({ uuid: uuid }, products).$promise.then(function (products) {
				if (!products) {
					return [];
				}
				productExist(products);
				return products;
			}, function (error) {
				console.log(error);
				return [];
			});
		}

	}]);

});
