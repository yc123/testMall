define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('ProductListByKindCtrl', ['$scope', '$rootScope', 'KindAPI', '$stateParams', '$modal', 'ComponentActiveAPI', 'ComponentActive' ,'BaseService', 'ngTableParams', 'toaster', 'Compare', '$location', 'AuthenticationService', 'SessionService', 'collectionService', 'Search', '$filter', '$window', 'Goods', 'Cart', '$interval', 'Order', function($scope, $rootScope, KindAPI, $stateParams, $modal, ComponentActiveAPI, ComponentActive , BaseService, ngTableParams, toaster, Compare, $location, AuthenticationService, SessionService, collectionService, Search, $filter, $window, Goods, Cart, $interval, Order) {
		var enIdFilter = $filter('EncryptionFilter');
		$scope.kindId = $stateParams.id;
		$scope.kindPropertyFilter = {};
		$scope.filters = {};// 筛选器, {brandId: 11, pv_001: xxx, pv_002: yyy}
		
		$scope.kind = {};
		
		$scope.carts = [];
		$scope.flag = {};
		// 选择属性筛选条件
		$scope.propertySelect = function(key, value) {
			$scope.kindPropertyFilter[key] = value;
		};
		
		$scope.noReserveZero = false;
		
		//筛选库存量是否大于0
		$scope.filterNoReserveZero = function() {
			$scope.productTableParams.reload();
		};
		
		$scope.toggle = function(compGoods) {
			if(compGoods.toggle || compGoods.prices.length < 2) {
				compGoods.toggle = 0;
			}else {
				compGoods.toggle = 1;
			}
		};
		
		$scope.otherConstraints = {};
		
		// 获取当前类目的类目路径
		if($stateParams.id) {
			$scope.active = {id: $stateParams.id};
			KindAPI.getParentsWithBothers({childId: $stateParams.id}, function(data) {
				$scope.actives = data;
				if($scope.actives) {
					$scope.kind = $scope.actives[$scope.actives.length-1];
					// 获取类目的产品的品牌汇总
					KindAPI.getBrands({kindId: $scope.kind.id}, function(data) {
						$scope.kind.brands = data;
					});
					if(!$scope.kind.leaf) {
						// 非叶子类目获取其子类目
						KindAPI.getChildren({parentId: $scope.kind.id}, function(data){
							$scope.kind.children = data;
						});
					}
					if($scope.kind.leaf) {
						// 叶子类目获取类目属性
						KindAPI.getPropertiesValues({kindId: $scope.kind.id}, function(data) {
							$scope.kind.properties = data;
						});
					}
				}
			}, function(response) {
				toaster.pop('error', '错误', '获取类目信息失败', response);
			});
		}
		
		// 筛选品牌
		$scope.selectBrand = function(b) {
			if(b) {
				$scope.kind.selectedBrand = b;
				$scope.filters.brandid = b.id;
			} else {
				delete $scope.kind.selectedBrand;
				delete $scope.filters.brandid;
			}
			getData();
		};

		// 是否已选择筛选属性
		$scope.hasProperties = false;

		// 筛选属性
		$scope.selectProperty = function(p, v) {
			if(!$scope.filters.properties) $scope.filters.properties = {};
			if(v) {
				p.selected = v;
				$scope.filters.properties[p.property.id] = v.value;
			} else {
				delete p.selected;
				delete $scope.filters.properties[p.property.id];
			}

            // 判断筛选属性是否为空
            $scope.hasProperties = !(!$scope.filters.properties || $scope.filters.properties == {} || Object.keys($scope.filters.properties).length == 0);

			getData();
		};

		$scope.moreBrands = false;
		//展开或收起更多品牌
		$scope.moreBrand = function() {
			$scope.moreBrands = !$scope.moreBrands;
		};
		
		// 展开或收起更多属性筛选
		$scope.moreProperty = function() {
			$scope.kind.morePro = !$scope.kind.morePro;
		};
		
		// 更多属性值
		$scope.moreValue = function(p) {
			p.more = !p.more;
		};
		// 获取商品是否加入购物车状态信息
		var getCarts = function() {
			$scope.flag = {};
			if($rootScope.userInfo) {
				Cart.getCarts({}, function(data) {
					angular.forEach(data,function(cart){
						$scope.flag[cart.batchCode] = true;
					});
				});
			}

		};

		// 获取初始数据
		var getData = function() {
			$scope.productTableParams = new ngTableParams({
				page : 1,
				count : 10,
				sorting: {
					/*cmpReserve : 'ASC',
					reserve : 'DESC'*/
				}
			}, {
				total : 0,
				getData : function($defer, params) {
					$scope.paginationParams = params;
					var pageParams = params.url();
					pageParams.filter = {};
					getCarts();
					pageParams.filter.kindid = $scope.kindId;
					if($scope.filters.brandid) {// 品牌筛选
						pageParams.filter.brandid = $scope.filters.brandid;
					}
					// 属性值筛选
					if($scope.filters.properties && Object.keys($scope.filters.properties).length) {
						pageParams.filter.properties = angular.toJson($scope.filters.properties);
					}
					KindAPI.getCompGoodsByKindid(BaseService.parseParams(pageParams), function(data) {
						init(data.content);
						$defer.resolve(data.content);
						params.total(data.totalElements);
						// 初始化一下是否有送样
						$scope.hasSample = [];
						angular.forEach(data.content, function(compGoods) {
							if(compGoods.sampleQty > 0) {
								$scope.hasSample.push(false);
							}
						});
					}, function(res) {
						toaster.pop('error', '获取信息失败 ', res.data);
					});
				}
			});	
		};
		
		getData();
		
		// 检测是否给定产品只有一种类型，同时标记同种类型的批次，便于在HTML中年使之具备相同的背景色。约定：content的数据是按型号已经分组好的。
		var init = function(content) {
			$scope.onlyOneType = false;
			if(content.length > 0) {
				$scope.onlyOneType = true;
				var obj0 = content[0];
				obj0.isOdd = true;
				var previousObj = obj0;
				var currentObj;
				for(var i = 0; i < content.length; i++) {
					currentObj = content[i];
					if(currentObj.code !== obj0.code) {
						$scope.onlyOneType = false;
					}
					if(currentObj.code !== previousObj.code) {
						//console.log('curr.code'+content[i].code);
						currentObj.isOdd = !previousObj.isOdd;
						//console.log('prev.code'+content[i].code);
					}else {
						currentObj.isOdd = previousObj.isOdd;
					}
					previousObj = currentObj;
				}
			}
			
			if($scope.onlyOneType) {
				$scope.orderType = 'reserve';
				$scope.dir = '-';
			}
		};
		
		// 改变排序顺序
		$scope.changeOrder = function(type){
			$scope.orderType = type;
			if(!$scope.dir || $scope.dir === '') {
				$scope.dir = '-';
			}else {
				$scope.dir = '';
			}
		};
		
		//免费申请样品
		$scope.applysample = function(compGoods) {
			if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return;
			}
        	//首先判断是否已送样
        	Goods.isSample({id: compGoods.goId}, {}, function(data){
        		if(data.id) {
        			window.open("product#/proofings/" + enIdFilter(compGoods.batchCode));
        		}else {
        			toaster.pop('info', '该批次已申请样品', '请勿重复申请');
        		}
			}, function(res){
				toaster.pop('error', '系统异常', '产品现货批次数据加载失败');
			});
        };
		
		// 展开或隐藏分段价格
		$scope.showPrices = function(detail, currency) {
			if(currency === 'RMB') {
				detail.$pricesShowRmb = !detail.$pricesShowRmb;
			}else if(currency === 'USD') {
				detail.$pricesShowUsd = !detail.$pricesShowUsd;
			}
			
		};
		
		// 直接购买或加入购物车
		$scope.addToCart = function(goods, isBuy, value){
            if(!goods) {
                return ;
            }
            if(goods.reserve < goods.minBuyQty) {
                toaster.pop('warning', '库存量已经不能不满足最小起订量！');
                return ;
            }
			if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return;
			}
			var a = {
				uuid: goods.uuid,
				batchCode: goods.batchCode,
				number: goods.minBuyQty,
				taxes: goods.taxes,
				storeid : goods.storeId
			};

			var goodsList = [];
			goodsList.push(a);
			SessionService.set("buyNow", false);
			if(isBuy){// 1、如果是立即购买，跳转订单确认页面
				if(a.number > 0) {
					var newWidow = window.open('product#/cart');
					// 1、生成订单
					Order.buyNow({}, goodsList, function(data){
						// 控制订单确认页，直接购买不显示进度条
						SessionService.set("buyNow", true);
						// 2、跳转到订单确认页面，进行付款操作
						newWidow.location.href ='user#/order/pay/'+ enIdFilter(data.data.orderid);
					}, function(res){
						newWidow.close();
						toaster.pop('error', '警告', res.data);
					});
				}else {
					toaster.pop('warning', '提示', '该商品库存为0，请等待上货或咨询客服');
				}
			} else {// 2、如果是加入购物车，组装cart对象，提交
				if (a.number > 0) {
					a.storeUuid = goods.storeId;
					Cart.addOneCartRecord({}, a, function (resp) {
						if (resp.success) {
							toaster.pop('success', '保存成功', '添加购物车成功');
							Cart.getCount({}, function(data){
								$rootScope.countCart = data.count;
							}, function(res){
							});
							getCarts();
						} else {
							toaster.pop("info", resp.message);
						}
					});
				} else {
					toaster.pop('warning', '提示', '该商品库存为0，请等待上货或咨询客服');
				}
			}
		};
		
		$scope.downloadpdf = function(attach) {
			if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return;
			}else {
				window.open(attach);
			}
		}
		
		// 删除购物车对应商品
		$scope.deleteFromCart = function(batchCode) {
			var arr = [];
			arr.push(batchCode);
			var batchCodes = angular.toJson(arr);
			Cart.deleteByBatchCode(batchCodes,function(data){
				toaster.pop('info', '取消成功', '撤销商品成功');
				Cart.getCount({}, function(data){
					$rootScope.countCart = data.count;
				}, function(res){
				});
				
				// 每次修改购物车信息之后，都获取当前状态
				getCarts();
			}, function(){
				toaster.pop('error', '取消失败', '商品已从购物车删除，请重新选择');
				getCarts();
			});
		};
		
	}]);
});
